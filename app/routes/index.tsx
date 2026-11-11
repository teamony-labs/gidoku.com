import { createRoute } from "honox/factory";
import { getPageUser, getSidebarExpanded } from "../lib/page-auth";
import { Layout } from "../components/layout/Layout";
import ReadingBooksCarousel from "../islands/ReadingBooksCarousel";
import { HeroVisual } from "../components/landing/HeroVisual";
import { Card, CardBody } from "../components/ui/Card";
import { bookRepo } from "../server/db/repositories";
import { BookCover } from "../components/book/BookCover";
import type { Book } from "../types/database";

const formatBooks = (bookList: Book[]) =>
  bookList.map((book) => ({
    id: book.id,
    title: book.title,
    authors: JSON.parse(book.authors),
    publisher: book.publisher,
    thumbnailUrl: book.thumbnail_url,
    status: book.status,
    currentPage: book.current_page,
    pageCount: book.page_count,
  }));

export default createRoute(async (c) => {
  const user = await getPageUser(c);
  const sidebarExpanded = getSidebarExpanded(c);

  // 未ログインの場合はランディングページ
  if (!user) {
    const techIcons = [
      "https://cdn.simpleicons.org/typescript/3178C6",
      "https://cdn.simpleicons.org/javascript/F7DF1E",
      "https://cdn.simpleicons.org/react/61DAFB",
      "https://cdn.simpleicons.org/python/3776AB",
      "https://cdn.simpleicons.org/go/00ADD8",
      "https://cdn.simpleicons.org/rust/000000",
      "https://cdn.simpleicons.org/docker/2496ED",
      "https://cdn.simpleicons.org/kubernetes/326CE5",
      "https://cdn.simpleicons.org/git/F05032",
      "https://cdn.simpleicons.org/github/181717",
      "https://cdn.simpleicons.org/googlecloud/4285F4",
      "https://cdn.simpleicons.org/postgresql/4169E1",
      "https://cdn.simpleicons.org/redis/DC382D",
      "https://cdn.simpleicons.org/graphql/E10098",
      "https://cdn.simpleicons.org/nextdotjs/000000",
      "https://cdn.simpleicons.org/vuedotjs/4FC08D",
      "https://cdn.simpleicons.org/svelte/FF3E00",
      "https://cdn.simpleicons.org/tailwindcss/06B6D4",
      "https://cdn.simpleicons.org/nodedotjs/339933",
      "https://cdn.simpleicons.org/deno/000000",
      "https://cdn.simpleicons.org/swift/F05138",
      "https://cdn.simpleicons.org/kotlin/7F52FF",
      "https://cdn.simpleicons.org/c++/00599C",
      "https://cdn.simpleicons.org/ruby/CC342D",
      "https://cdn.simpleicons.org/php/777BB4",
      "https://cdn.simpleicons.org/linux/FCC624",
      "https://cdn.simpleicons.org/nginx/009639",
      "https://cdn.simpleicons.org/terraform/844FBA",
    ];

    return c.render(
      <div class="relative min-h-screen w-full overflow-hidden bg-white text-zinc-900 selection:bg-zinc-900 selection:text-white font-sans">
        {/* 背景装飾 */}
        <div class="absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[16px_16px] mask-[radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>

        {/* ヘッダー */}
        <header class="fixed top-0 left-0 right-0 z-50 flex items-center justify-center w-full py-4 px-4 sm:py-6 sm:px-6">
          <nav class="flex items-center justify-between w-full max-w-6xl mx-auto bg-white/80 backdrop-blur-xl border border-zinc-200/60 rounded-full px-4 sm:px-6 py-3 sm:py-3.5 shadow-lg shadow-zinc-900/5">
            {/* Logo */}
            <div class="flex items-center gap-2.5">
              <img src="/favicon128.ico" alt="gidoku" class="w-8 h-8 rounded-lg" />
              <span class="text-xl font-bold tracking-tight text-zinc-900">gidoku</span>
            </div>

            {/* Navigation */}
            <div class="flex items-center gap-2">
              <a
                href="/login"
                class="px-4 py-2 sm:px-6 sm:py-2.5 text-sm font-medium text-white bg-zinc-900 rounded-full hover:bg-zinc-800 transition-all shadow-sm hover:shadow-md"
              >
                ログイン
              </a>
            </div>
          </nav>
        </header>

        {/* ヒーローセクション */}
        <main class="flex flex-col items-center justify-center min-h-svh sm:min-h-screen w-full px-4 sm:px-6 pt-16 sm:pt-20">
          <div class="max-w-6xl mx-auto w-full grid lg:grid-cols-2 gap-0 sm:gap-12 lg:gap-20 items-start lg:items-center h-full">
            <div class="space-y-4 sm:space-y-8 text-center lg:text-left order-2 lg:order-1 z-10 pointer-events-none mt-4 sm:mt-0 px-1">
              <div class="space-y-4 pointer-events-auto">
                <style>{`
                  @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(16px); }
                    to { opacity: 1; transform: translateY(0); }
                  }
                  .animate-hero {
                    opacity: 0;
                    animation: fadeUp 0.8s ease-out 0.3s forwards;
                  }
                `}</style>
                <h1 class="animate-hero text-[clamp(1.75rem,0.9rem+4.1vw,3.75rem)] font-bold tracking-tight leading-[1.3] text-zinc-900">
                  技術書と
                  <br />
                  ともに成長しよう。
                </h1>
              </div>

              <p class="text-[clamp(0.813rem,0.5rem+1.56vw,1.125rem)] text-zinc-500 max-w-lg mx-auto lg:mx-0 leading-relaxed font-light pointer-events-auto">
                読んだ技術書を記録して、自分だけの本棚をつくろう。
                <br />
                読書の記録は公開プロフィールとしてシェアもできます。
              </p>

              <div class="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start pointer-events-auto">
                <a
                  href="/login"
                  class="group inline-flex items-center justify-center gap-2 px-6 py-3 sm:px-8 sm:py-4 text-sm sm:text-base font-medium text-white bg-zinc-900 rounded-full hover:bg-zinc-800 hover:scale-105 transition-all shadow-xl shadow-zinc-900/10"
                >
                  <span>無料で始める</span>
                  <svg
                    class="w-4 h-4 transition-transform group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </a>
              </div>
            </div>

            <div class="order-1 lg:order-2 min-w-0">
              <HeroVisual
                techIcons={techIcons}
                gradientIdPrefix="hero"
                className="w-[min(100%,48svh)] lg:w-[min(100%,65svh)] lg:-translate-y-[6%]"
                bookWidthClass="w-[85%] lg:w-[75%]"
              />
            </div>
          </div>
        </main>
      </div>,
    );
  }

  // ログイン済みの場合はダッシュボード
  const stats = await bookRepo.getStats(c.env.DB, user.id);

  const { books: readingBooks } = await bookRepo.findByUserId(c.env.DB, user.id, {
    status: "reading",
    limit: 6,
    offset: 0,
  });

  const { books: recentBooks } = await bookRepo.findByUserId(c.env.DB, user.id, {
    sortBy: "updated",
    limit: 6,
    offset: 0,
  });

  const formattedReadingBooks = formatBooks(readingBooks);

  return c.render(
    <Layout user={user} title="ホーム" sidebarExpanded={sidebarExpanded}>
      <div class="space-y-8 sm:space-y-12">
        {/* ヘッダーセクション */}
        <div class="pb-2">
          <h1 class="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight mb-2">
            こんにちは、{user.name}さん
          </h1>
          <p class="text-zinc-500 font-medium text-sm sm:text-base">
            現在、<span class="text-zinc-900">{stats?.reading ?? 0}</span>
            冊の本を読んでいます。
          </p>
        </div>

        {/* 読んでいる本のリスト */}
        {formattedReadingBooks.length > 0 && (
          <section>
            <div class="flex items-center justify-between mb-4 sm:mb-6">
              <h2 class="text-lg sm:text-xl font-bold text-zinc-900">読んでいる本</h2>
              <a
                href="/books?status=reading"
                class="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
              >
                すべて見る
              </a>
            </div>

            <ReadingBooksCarousel books={formattedReadingBooks} />
          </section>
        )}

        <section>
          <div class="flex items-center justify-between mb-4 sm:mb-6">
            <h2 class="text-lg sm:text-xl font-bold text-zinc-900">最近の読書</h2>
            <a
              href="/books"
              class="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              すべて見る
            </a>
          </div>
          {recentBooks.length > 0 ? (
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-4 gap-y-6 sm:gap-x-6 sm:gap-y-10">
              {formatBooks(recentBooks).map((book) => (
                <a href={`/books/${book.id}`} class="group flex flex-col gap-3">
                  <div class="aspect-2/3 w-full bg-zinc-100 rounded-xl overflow-hidden shadow-sm group-hover:shadow-md transition-all duration-300 ring-1 ring-black/5">
                    <BookCover
                      src={book.thumbnailUrl}
                      alt={book.title}
                      size="md"
                      class="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 class="text-sm font-semibold text-zinc-900 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
                      {book.title}
                    </h3>
                    <p class="text-xs text-zinc-500 mt-1.5 line-clamp-1">
                      {book.authors.join(", ")}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <Card>
              <CardBody class="text-center py-10 sm:py-16">
                <div class="w-12 h-12 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-4 text-zinc-400">
                  <svg
                    class="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <p class="text-zinc-500 mb-6 font-medium">読書記録をはじめましょう</p>
                <a
                  href="/books/new"
                  class="inline-flex items-center justify-center px-6 py-2.5 text-sm font-bold text-white bg-zinc-900 hover:bg-zinc-800 transition-colors shadow-sm rounded-full"
                >
                  本を追加する
                </a>
              </CardBody>
            </Card>
          )}
        </section>
      </div>
    </Layout>,
  );
});
