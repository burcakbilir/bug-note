import { AppShell } from "@/components/layout/app-shell";
import { BugWorkspace } from "@/features/bugs/components/bug-workspace";

export default function DashboardPage() {
  return (
    <AppShell>
      <BugWorkspace />
    </AppShell>
  );
}
