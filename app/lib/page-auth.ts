import type { Context } from "hono";
import { getCookie } from "hono/cookie";
import type { User } from "../types/database";
import { getSession } from "../server/lib/session";
import { userRepo } from "../server/db/repositories";

/**
 * ページ用の認証ヘルパー関数
 * セッションからユーザー情報を取得（失敗してもエラーにならない）
 */
export async function getPageUser(c: Context): Promise<User | null> {
  try {
    const sessionId = getCookie(c, "session_id");
    if (!sessionId) {
      return null;
    }

    const userId = await getSession(c.env.KV, sessionId);
    if (!userId) {
      return null;
    }

    const user = await userRepo.findById(c.env.DB, userId);
    return user;
  } catch {
    return null;
  }
}

/**
 * 認証必須ページ用ヘルパー関数
 * 未認証の場合はログインページにリダイレクトさせる
 */
export async function requirePageAuth(c: Context): Promise<User | Response> {
  const user = await getPageUser(c);
  if (!user) {
    return c.redirect("/login");
  }
  return user;
}

/**
 * サイドバーの展開状態を Cookie から取得する。cookie がない（一度も開閉していない）ときは開いて表示し、
 * 自分で閉じた人（cookie が "false"）だけ閉じて表示する。
 */
export function getSidebarExpanded(c: Context): boolean {
  try {
    const value = getCookie(c, "sidebar_expanded");
    return value !== "false";
  } catch {
    return true;
  }
}
