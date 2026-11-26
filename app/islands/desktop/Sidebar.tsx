import { useState } from "hono/jsx/dom";

const SIDEBAR_STORAGE_KEY = "sidebar-expanded";
const SIDEBAR_COOKIE_NAME = "sidebar_expanded";

interface SidebarProps {
  initialExpanded?: boolean;
  showLogout?: boolean;
}

export default function Sidebar({ initialExpanded = true, showLogout = true }: SidebarProps) {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);

  const navItems = [
    {
      href: "/",
      label: "ホーム",
      iconSrc: "/icons/home-white-icon.json",
      targetClass: "nav-home",
    },
    {
      href: "/books",
      label: "自分の本棚",
      iconSrc: "/icons/book-white-icon.json",
      targetClass: "nav-books",
    },
    {
      href: "/settings",
      label: "設定",
      iconSrc: "/icons/settings-white-icon.json",
      targetClass: "nav-settings",
    },
  ];

  const toggleSidebar = () => {
    const newState = !isExpanded;
    setIsExpanded(newState);
    localStorage.setItem(SIDEBAR_STORAGE_KEY, JSON.stringify(newState));
    cookieStore.set({
      name: SIDEBAR_COOKIE_NAME,
      value: String(newState),
      path: "/",
      expires: Date.now() + 31536000 * 1000,
    });
  };

  const handleLogout = () => {
    if (confirm("ログアウトしますか？")) {
      fetch("/api/auth/logout", {
        method: "POST",
      }).then((r) => {
        if (r.ok) {
          window.location.href = "/login";
        } else {
          alert("ログアウトに失敗しました");
        }
      });
    }
  };

  return (
    <aside
      class={`h-screen sticky top-0 bg-zinc-950 transition-all duration-300 ease-in-out flex flex-col overflow-hidden border-r border-white/5 ${
        isExpanded ? "w-64" : "w-20"
      }`}
    >
      <div class="h-16 flex items-center justify-between px-4 shrink-0 mt-3 ml-2">
        {isExpanded ? (
          <>
            <a href="/" class="flex items-center min-w-0 overflow-hidden">
              <span
                class={`text-2xl font-bold tracking-tight text-white whitespace-nowrap transition-opacity duration-300 ${
                  isExpanded ? "opacity-100 delay-150" : "opacity-0"
                }`}
              >
                gidoku
              </span>
            </a>
            <button
              type="button"
              onClick={toggleSidebar}
              class="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400 hover:text-white transition-colors shrink-0"
              title="サイドバーを閉じる"
              aria-label="サイドバーを閉じる"
            >
              <svg
                aria-hidden="true"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M11 19l-7-7 7-7" />
                <path d="M18 5v14" />
              </svg>
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={toggleSidebar}
            class="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400 hover:text-white transition-colors mx-auto"
            title="サイドバーを開く"
            aria-label="サイドバーを開く"
          >
            <svg
              aria-hidden="true"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M13 5l7 7-7 7" />
              <path d="M6 5v14" />
            </svg>
          </button>
        )}
      </div>

      {/* ナビゲーション */}
      <nav class="flex-1 py-4 px-3 overflow-hidden">
        <div class="flex flex-col gap-1">
          {navItems.map((item) => (
            <a
              href={item.href}
              class={`${
                item.targetClass
              } flex items-center gap-3 px-3 py-2.5 hover:bg-white/10 rounded-lg transition-all group ${
                isExpanded ? "justify-start" : "justify-center"
              }`}
            >
              <span class="min-w-[20px] flex items-center justify-center shrink-0">
                <lord-icon
                  src={item.iconSrc}
                  trigger="hover"
                  target={`.${item.targetClass}`}
                  colors="primary:#f4f4f5"
                  style="width:20px;height:20px"
                />
              </span>
              {isExpanded && (
                <span
                  class={`text-sm font-medium text-zinc-300 group-hover:text-white whitespace-nowrap transition-opacity duration-300 ${
                    isExpanded ? "opacity-100 delay-150" : "opacity-0"
                  }`}
                >
                  {item.label}
                </span>
              )}
            </a>
          ))}
        </div>
      </nav>

      {/* ログアウトボタン */}
      {showLogout && (
        <div class="p-3 shrink-0">
          <button
            type="button"
            onClick={handleLogout}
            class={`flex items-center gap-3 w-full px-3 py-2.5 text-zinc-400 hover:text-red-400 hover:bg-white/5 rounded-lg transition-all ${
              isExpanded ? "justify-start" : "justify-center"
            }`}
            title="ログアウト"
            aria-label="ログアウト"
          >
            <svg
              aria-hidden="true"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="min-w-[18px] shrink-0"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            {isExpanded && (
              <span
                class={`text-sm font-medium whitespace-nowrap transition-opacity duration-300 ${
                  isExpanded ? "opacity-100 delay-150" : "opacity-0"
                }`}
              >
                ログアウト
              </span>
            )}
          </button>
        </div>
      )}
    </aside>
  );
}
