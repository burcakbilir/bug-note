import { AppSidebar } from "./app-sidebar";
import { TopBar } from "./top-bar";

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <AppSidebar />

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <TopBar />

        <main className="min-h-0 min-w-0 flex-1 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
