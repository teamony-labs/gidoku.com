import type { Context, Next } from "hono";
import { getCookie } from "hono/cookie";
import type { Env, HonoContext } from "../../types/env";
import type { User } from "../../types/database";
import { userRepo } from "../db/repositories";
import { validateSession } from "./session";
import { UnauthorizedError } from "./errors";

type KVNamespace = Env["KV"];

// ユーザーキャッシュのTTL（秒）
const USER_CACHE_TTL = 300; // 5分

/**
 * キャッシュからユーザー情報を取得
 */
async function getCachedUser(kv: KVNamespace, userId: string): Promise<User | null> {
  try {
    const cached = await kv.get(`user_cache:${userId}`);
    if (cached) {
      return JSON.parse(cached) as User;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * ユーザー情報をキャッシュに保存
 */
async function setCachedUser(kv: KVNamespace, user: User): Promise<void> {
  try {
    await kv.put(`user_cache:${user.id}`, JSON.stringify(user), {
      expirationTtl: USER_CACHE_TTL,
    });
  } catch {
    // キャッシュ失敗は無視
  }
}

/**
 * ユーザーキャッシュを無効化
 */
export async function invalidateUserCache(kv: KVNamespace, userId: string): Promise<void> {
  try {
    await kv.delete(`user_cache:${userId}`);
  } catch {
    // 削除失敗は無視
  }
}

/**
 * 認証ミドルウェア（キャッシュ対応）
 */
export async function authMiddleware(
  c: Context<HonoContext>,
  next: Next,
): Promise<Response | void> {
  try {
    // レート制限ミドルウェアが同一セッションを検証済みならそれを再利用し、
    // KVへの重複読み込みを避ける
    let userId = c.get("userId");

    if (!userId) {
      const sessionId = getCookie(c, "session_id");

      if (!sessionId) {
        throw new UnauthorizedError("No session found");
      }

      // セッションからユーザーIDを取得
      userId = await validateSession(c.env.KV, sessionId);
      c.set("userId", userId);
    }

    // キャッシュからユーザー情報を取得
    let user = await getCachedUser(c.env.KV, userId);

    if (!user) {
      // キャッシュミス: DBから取得してキャッシュ
      user = await userRepo.findById(c.env.DB, userId);
      await setCachedUser(c.env.KV, user);
    }

    // コンテキストにユーザー情報を設定
    c.set("user", user);

    await next();
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return c.json(
        {
          success: false,
          error: {
            message: error.message,
            code: "UNAUTHORIZED",
          },
        },
        401,
      );
    }

    throw error;
  }
}

/**
 * オプショナル認証ミドルウェア（キャッシュ対応）
 */
export async function optionalAuthMiddleware<P extends string>(
  c: Context<HonoContext, P>,
  next: Next,
): Promise<void> {
  try {
    // レート制限ミドルウェアが同一セッションを検証済みならそれを再利用し、
    // KVへの重複読み込みを避ける
    let userId = c.get("userId");

    if (!userId) {
      const sessionId = getCookie(c, "session_id");
      if (sessionId) {
        userId = await validateSession(c.env.KV, sessionId);
        c.set("userId", userId);
      }
    }

    if (userId) {
      // キャッシュからユーザー情報を取得
      let user = await getCachedUser(c.env.KV, userId);

      if (!user) {
        user = await userRepo.findById(c.env.DB, userId);
        await setCachedUser(c.env.KV, user);
      }

      c.set("user", user);
    }
  } catch (error) {
    // エラーが発生してもスルー
    console.warn("Optional auth failed:", error);
  }

  await next();
}

/**
 * 管理者ミドルウェア
 */
export async function adminMiddleware(
  _c: Context<HonoContext>,
  next: Next,
): Promise<Response | void> {
  // 将来的に管理者フラグを追加する場合
  // if (!user.isAdmin) {
  //   return c.json({ error: "Forbidden" }, 403);
  // }

  await next();
}

/**
 * リソース所有権チェック
 */
export function checkOwnership(userId: string, resourceUserId: string): void {
  if (userId !== resourceUserId) {
    throw new UnauthorizedError("You don't have permission to access this resource");
  }
}
