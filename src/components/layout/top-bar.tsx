"use client";

import { LogOut, Plus, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { Input } from "@/components/ui/input";
import { useLogout } from "@/features/auth/hooks/use-logout";
import { BugFilterMenu } from "@/features/bugs/components/bug-filter-menu";
import { BugLinkCardControl } from "@/features/bugs/components/bug-link-card-control";
import { NewBugForm } from "@/features/bugs/components/new-bug-form";
import { setSearchQuery } from "@/features/bugs/slices/bug-slice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export function TopBar() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { logout, isSubmitting } = useLogout();
  const [isNewBugFormOpen, setIsNewBugFormOpen] = useState(false);

  const searchQuery = useAppSelector((state) => state.bugs.searchQuery);
  const [searchValue, setSearchValue] = useState(searchQuery);
  const debouncedSearchValue = useDebouncedValue(searchValue, 250);

  useEffect(() => {
    if (debouncedSearchValue !== searchQuery) {
      dispatch(setSearchQuery(debouncedSearchValue));
    }
  }, [debouncedSearchValue, dispatch, searchQuery]);

  async function handleLogout() {
    try {
      await logout();
      router.replace("/auth/login");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not sign out.",
      );
    }
  }

  return (
    <>
      <header className="flex min-h-16 shrink-0 flex-col gap-3 border-b border-slate-200 bg-white px-4 py-3 sm:px-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
          <div className="relative min-w-0 flex-1 lg:max-w-xl">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <Input
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Search bugs, responses, solutions..."
              className="pl-9"
            />
          </div>

          <BugFilterMenu />
          <BugLinkCardControl />
        </div>

        <Button
          className="w-full sm:w-auto"
          onClick={() => setIsNewBugFormOpen(true)}
        >
          <Plus className="h-4 w-4" />
          New Bug
        </Button>

        <Button
          variant="secondary"
          size="icon"
          aria-label="Sign out"
          onClick={handleLogout}
          disabled={isSubmitting}
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </header>

      {isNewBugFormOpen ? (
        <NewBugForm onClose={() => setIsNewBugFormOpen(false)} />
      ) : null}
    </>
  );
}
