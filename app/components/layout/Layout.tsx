import type { FC, PropsWithChildren } from "hono/jsx";
import type { User } from "../../types/database";
import { Header } from "./Header";
import { Container } from "./Container";
import Sidebar from "../../islands/desktop/Sidebar";
import MobileSidebar from "../../islands/mobile/Sidebar";

interface LayoutProps {
  user?: User | null;
  title?: string;
  sidebarExpanded?: boolean;
  appShell?: boolean;
  showSidebar?: boolean;
  showLogout?: boolean;
}

export const Layout: FC<PropsWithChildren<LayoutProps>> = ({
  children,
  user,
  title,
  sidebarExpanded = true,
  appShell,
  showSidebar,
  showLogout,
}) => {
  const useAppShell = appShell ?? Boolean(user);
  const shouldShowSidebar = showSidebar ?? Boolean(user);
  const shouldShowLogout = showLogout ?? Boolean(user);

  return (
    <>
      {title && <title>{title} | gidoku</title>}
      {shouldShowSidebar && (
        <div class="md:hidden">
          <MobileSidebar showLogout={shouldShowLogout} />
        </div>
      )}
      <div class="min-h-screen flex bg-zinc-950 text-zinc-900 selection:bg-blue-500/20">
        {shouldShowSidebar && (
          <div class="hidden md:block">
            <Sidebar initialExpanded={sidebarExpanded} showLogout={shouldShowLogout} />
          </div>
        )}

        <div
          id="main-layout"
          class="flex-1 flex flex-col h-screen overflow-hidden transition-all duration-300 ease-in-out"
        >
          {useAppShell ? (
            <div class="flex-1 pt-2 px-2 pb-2 sm:p-3 overflow-hidden">
              <div class="bg-white rounded-[20px] shadow-2xl border border-white/10 h-full flex flex-col overflow-hidden relative isolate">
                <Header user={user} />
                <main class="flex-1 overflow-y-auto">
                  <div class="py-6 sm:py-8">
                    <Container>{children}</Container>
                  </div>
                </main>
              </div>
            </div>
          ) : (
            <div class="flex-1 flex flex-col overflow-y-auto">
              <Header user={user} />
              <main class="flex-1 py-8 sm:py-12">
                <Container>{children}</Container>
              </main>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
