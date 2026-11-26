import { useState } from "hono/jsx";
import { getApiErrorMessage, readApiResponse } from "../lib/api-client";
import type { UserDto } from "../types/dto";

interface ProfileFormProps {
  avatarUrl: string | null;
  provider: string;
  initialUsername: string;
  initialName: string;
  initialBio: string;
}

export default function ProfileForm({
  avatarUrl,
  provider,
  initialUsername,
  initialName,
  initialBio,
}: ProfileFormProps) {
  const [username, setUsername] = useState(initialUsername);
  const [name, setName] = useState(initialName);
  const [bio, setBio] = useState(initialBio);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const hasChanges = username !== initialUsername || name !== initialName || bio !== initialBio;

  const handleSave = async () => {
    if (!hasChanges) return;

    setSaving(true);
    setSaved(false);

    try {
      const body: Record<string, string> = { username, name };
      if (bio) body.bio = bio;

      const res = await fetch("/api/users/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await readApiResponse<UserDto>(res);

      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      } else {
        alert(getApiErrorMessage(data, "保存に失敗しました"));
      }
    } catch {
      alert("通信エラーが発生しました");
    } finally {
      setSaving(false);
    }
  };

  const providerName = provider === "github" ? "GitHub" : "Google";

  return (
    <div class="bg-white rounded-2xl p-8 shadow-sm ring-1 ring-zinc-100 space-y-8">
      <div class="flex items-center gap-6 pb-6 border-b border-zinc-50">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={name}
            class="w-20 h-20 rounded-full ring-4 ring-zinc-50 object-cover"
          />
        ) : (
          <div class="w-20 h-20 rounded-full ring-4 ring-zinc-50 bg-zinc-200 flex items-center justify-center text-zinc-500 text-2xl font-bold">
            {name?.charAt(0)?.toUpperCase() || "?"}
          </div>
        )}
        <div class="flex-1">
          <p class="text-sm font-bold text-zinc-900 mb-1">プロフィール画像</p>
          <p class="text-xs text-zinc-500">{providerName}のアカウント写真を使用中</p>
        </div>
      </div>

      <div class="space-y-6">
        <div>
          <label for="username" class="mb-2 block text-sm font-bold text-zinc-700">
            ユーザーID
          </label>
          <div class="flex rounded-xl shadow-sm ring-1 ring-zinc-200 overflow-hidden">
            <span class="inline-flex shrink-0 items-center whitespace-nowrap px-4 border-r border-zinc-200 bg-zinc-50 text-zinc-500 text-sm font-medium">
              gidoku.com/user/
            </span>
            <input
              type="text"
              id="username"
              value={username}
              onInput={(e) => setUsername((e.target as HTMLInputElement).value)}
              class="w-full min-w-0 px-3 py-2 rounded-none border-0 focus:ring-0 bg-white focus:outline-none text-zinc-900"
            />
          </div>
        </div>

        <div>
          <label for="name" class="mb-2 block text-sm font-bold text-zinc-700">
            表示名
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onInput={(e) => setName((e.target as HTMLInputElement).value)}
            class="w-full px-3 py-2 border border-zinc-200 rounded-xl bg-zinc-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-colors text-zinc-900"
          />
        </div>

        <div>
          <label for="bio" class="mb-2 block text-sm font-bold text-zinc-700">
            自己紹介
          </label>
          <textarea
            id="bio"
            value={bio}
            onInput={(e) => setBio((e.target as HTMLTextAreaElement).value)}
            rows={4}
            class="w-full px-3 py-2 border border-zinc-200 rounded-xl bg-zinc-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-colors resize-vertical text-zinc-900"
          />
          <p class="mt-2 text-xs text-zinc-500 font-medium">簡単な自己紹介を書いてください。</p>
        </div>
      </div>

      <div class="flex items-center justify-end gap-3 pt-4 border-t border-zinc-50">
        {saved && <span class="text-sm text-zinc-500">保存しました</span>}
        <button
          type="button"
          onClick={handleSave}
          disabled={saving || !hasChanges}
          class="rounded-full px-6 py-2.5 font-bold shadow-sm text-white bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {saving ? "保存中..." : "変更を保存"}
        </button>
      </div>
    </div>
  );
}
