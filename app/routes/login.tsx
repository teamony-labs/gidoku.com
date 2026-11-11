import { createRoute } from "honox/factory";
import { getPageUser } from "../lib/page-auth";
import { HeroVisual } from "../components/landing/HeroVisual";

// CDNでアイコンを撮ってくる
const techIcons = [
  "https://cdn.simpleicons.org/typescript/3178C6",
  "https://cdn.simpleicons.org/javascript/F7DF1E",
  "https://cdn.simpleicons.org/react/61DAFB",
  "https://cdn.simpleicons.org/python/3776AB",
  "https://cdn.simpleicons.org/go/00ADD8",
  "https://cdn.simpleicons.org/rust/ffffff",
  "https://cdn.simpleicons.org/docker/2496ED",
  "https://cdn.simpleicons.org/kubernetes/326CE5",
  "https://cdn.simpleicons.org/git/F05032",
  "https://cdn.simpleicons.org/github/ffffff",
  "https://cdn.simpleicons.org/googlecloud/4285F4",
  "https://cdn.simpleicons.org/postgresql/4169E1",
  "https://cdn.simpleicons.org/redis/DC382D",
  "https://cdn.simpleicons.org/graphql/E10098",
  "https://cdn.simpleicons.org/nextdotjs/ffffff",
  "https://cdn.simpleicons.org/vuedotjs/4FC08D",
  "https://cdn.simpleicons.org/svelte/FF3E00",
  "https://cdn.simpleicons.org/tailwindcss/06B6D4",
  "https://cdn.simpleicons.org/nodedotjs/339933",
  "https://cdn.simpleicons.org/deno/ffffff",
  "https://cdn.simpleicons.org/swift/F05138",
  "https://cdn.simpleicons.org/kotlin/7F52FF",
  "https://cdn.simpleicons.org/c++/00599C",
  "https://cdn.simpleicons.org/ruby/CC342D",
  "https://cdn.simpleicons.org/php/777BB4",
  "https://cdn.simpleicons.org/linux/FCC624",
  "https://cdn.simpleicons.org/nginx/009639",
  "https://cdn.simpleicons.org/terraform/844FBA",
];

export default createRoute(async (c) => {
  const user = await getPageUser(c);

  // すでにログイン済みの場合はダッシュボードへ
  if (user) {
    return c.redirect("/");
  }

  const error = c.req.query("error");

  return c.render(
    <>
      <title>ログイン | gidoku</title>
      <div class="flex min-h-screen w-full bg-zinc-950">
        {/* Left Side - Form */}
        <div class="flex flex-col justify-between w-full lg:w-1/2 px-8 sm:px-12 lg:px-16 xl:px-20 py-12 bg-white relative z-10">
          {/* Logo */}
          <div class="flex items-center">
            <span class="text-3xl font-bold tracking-tight text-zinc-900">gidoku</span>
          </div>

          {/* Form Content */}
          <div class="w-full max-w-md mx-auto space-y-8">
            <div class="space-y-3">
              <h1 class="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900">Welcome.</h1>
              <p class="text-lg text-zinc-500">技術書の読書記録を管理しよう！</p>
            </div>

            {error && (
              <div class="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-100 flex items-center justify-center">
                ログインに失敗しました
              </div>
            )}

            <div class="space-y-3">
              <a
                href="/api/auth/google"
                class="flex items-center justify-center gap-3 w-full px-5 py-3.5 bg-white text-zinc-900 hover:bg-zinc-50 transition-all duration-200 rounded-xl border border-zinc-200 font-medium shadow-sm hover:shadow-md"
              >
                <svg class="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span class="text-sm font-medium">Googleで続ける</span>
              </a>

              <a
                href="/api/auth/github"
                class="flex items-center justify-center gap-3 w-full px-5 py-3.5 bg-zinc-900 text-white hover:bg-zinc-800 transition-all duration-200 rounded-xl font-medium shadow-md hover:shadow-lg"
              >
                <svg class="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                <span class="text-sm font-medium">GitHubで続ける</span>
              </a>
            </div>
          </div>

          {/* Footer */}
          <div class="text-center text-xs text-zinc-400 font-medium">&copy; 2025 gidoku.com</div>
        </div>

        {/* Right Side */}
        <div class="hidden lg:flex relative w-1/2 bg-zinc-950 items-center justify-center overflow-hidden">
          {/* Grid Background */}
          <div class="absolute inset-0 bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_80%_50%_at_50%_50%,#000_40%,transparent_100%)] opacity-40" />

          <div class="relative z-10 flex items-center justify-center w-full h-full">
            <HeroVisual
              techIcons={techIcons}
              gradientIdPrefix="login-hero"
              className="w-[min(90%,800px,72svh)]"
              bookWidthClass="w-[62.5%]"
              tone="dark"
            />
          </div>
        </div>
      </div>
    </>,
  );
});
