"use client";

import {
  Bug,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Hash,
  Link2,
  LogOut,
  Plus,
  Settings,
  X,
} from "lucide-react";
import { type FormEvent, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  clearBugFilters,
  setLinkedOnly,
  setSeverityFilter,
  setStatusFilter,
  setTagFilter,
} from "@/features/bugs/slices/bug-slice";
import { Button } from "@/components/ui/button";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { Input } from "@/components/ui/input";
import { copy } from "@/lib/copy";
import {
  deleteCurrentUserRequest,
  getCurrentUserRequest,
  logoutRequest,
  updateCurrentUserRequest,
} from "@/features/auth/api/auth-api";
import type { AuthUser } from "@/features/auth/types/auth.types";

export function AppSidebar() {
  const dispatch = useAppDispatch();  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAddTagOpen, setIsAddTagOpen] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const bugs = useAppSelector((state) => state.bugs.bugs);
  const statusFilter = useAppSelector((state) => state.bugs.statusFilter);
  const severityFilter = useAppSelector((state) => state.bugs.severityFilter);
  const linkedOnly = useAppSelector((state) => state.bugs.linkedOnly);
  const tagFilter = useAppSelector((state) => state.bugs.tagFilter);
  const shouldShowCompact = !isMobileOpen && isCollapsed;

  useEffect(() => {
    let isMounted = true;

    async function loadUser() {
      try {
        const data = await getCurrentUserRequest();

        if (isMounted) {
          setUser(data.user);
        }
      } catch {
        if (isMounted) {
          setUser(null);
        }
      }
    }

    void loadUser();

    return () => {
      isMounted = false;
    };
  }, []);

  const navigationItems = useMemo(
    () => [
      {
        label: copy.myBugs,
        icon: Bug,
        count: bugs.length,
        isActive:
          statusFilter === "all" &&
          severityFilter === "all" &&
          !linkedOnly &&
          !tagFilter,
        onClick: () => {
          dispatch(clearBugFilters());
        },
      },
      {
        label: copy.solved,
        icon: CheckCircle2,
        count: bugs.filter((bug) => bug.status === "resolved").length,
        isActive: statusFilter === "resolved" && !linkedOnly,
        onClick: () => {
          dispatch(setStatusFilter("resolved"));
          dispatch(setSeverityFilter("all"));
          dispatch(setLinkedOnly(false));
          dispatch(setTagFilter(null));
        },
      },
      {
        label: copy.linkedCards,
        icon: Link2,
        count: bugs.filter((bug) => bug.linkedCard).length,
        isActive: linkedOnly,
        onClick: () => {
          dispatch(setLinkedOnly(true));
          dispatch(setStatusFilter("all"));
          dispatch(setSeverityFilter("all"));
          dispatch(setTagFilter(null));
        },
      },
    ],
    [bugs, dispatch, linkedOnly, severityFilter, statusFilter, tagFilter],
  );

  const tags = useMemo(() => {
    const counts = new Map<string, number>();
    const savedTags = user?.savedTags ?? [];

    bugs.forEach((bug) => {
      bug.tags.forEach((tag) => {
        counts.set(tag, (counts.get(tag) ?? 0) + 1);
      });
    });

    savedTags.forEach((tag) => {
      counts.set(tag, counts.get(tag) ?? 0);
    });

    return [...counts.entries()]
      .map(([label, count]) => ({ label, count }))
      .sort((first, second) => {
        const firstSavedIndex = savedTags.indexOf(first.label);
        const secondSavedIndex = savedTags.indexOf(second.label);
        const firstIsSaved = firstSavedIndex !== -1;
        const secondIsSaved = secondSavedIndex !== -1;

        if (firstIsSaved && secondIsSaved) {
          return firstSavedIndex - secondSavedIndex;
        }

        if (firstIsSaved) return -1;
        if (secondIsSaved) return 1;

        return second.count - first.count || first.label.localeCompare(second.label);
      });
  }, [bugs, user?.savedTags]);

  async function updateSavedTags(nextTags: string[]) {
    const data = await updateCurrentUserRequest({ savedTags: nextTags });
    setUser(data.user);
  }

  async function handleLogout() {
    await logoutRequest();
    window.location.href = "/auth/login";
  }

  function handleDeleteSidebarTag(tagLabel: string) {
    const nextSavedTags = (user?.savedTags ?? []).filter(
      (tag) => tag !== tagLabel,
    );

    void updateSavedTags(nextSavedTags)
      .then(() => toast.success("Sidebar tag removed."))
      .catch((error) =>
        toast.error(error instanceof Error ? error.message : "Tag could not be removed."),
      );

    if (tagFilter === tagLabel) {
      dispatch(setTagFilter(null));
    }
  }

  return (
    <>
      {isMobileOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-slate-950/35 backdrop-blur-[1px] lg:hidden"
          aria-label={copy.closeSidebar}
          onClick={() => setIsMobileOpen(false)}
        />
      ) : null}

    <aside
      className={cn(
        "sticky top-0 z-10 flex h-screen shrink-0 flex-col overflow-visible border-r border-slate-200 bg-white transition-[width] duration-200",
        isMobileOpen
          ? "fixed inset-y-0 left-0 z-40 w-[calc(100vw-1rem)] max-w-sm shadow-2xl shadow-slate-950/10 lg:sticky lg:z-10 lg:w-auto lg:max-w-none lg:shadow-none"
          : "w-16 sm:w-20",
        isCollapsed ? "lg:w-20" : "lg:w-72",
      )}
    >
      <button
        type="button"
        onClick={() => setIsMobileOpen((current) => !current)}
        className="absolute -right-3 top-6 z-20 flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition-colors hover:bg-orange-50 hover:text-orange-700 lg:hidden"
        aria-label={isMobileOpen ? copy.closeSidebar : copy.openSidebar}
      >
        {isMobileOpen ? (
          <ChevronLeft className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </button>

      <button
        type="button"
        onClick={() => setIsCollapsed((current) => !current)}
        className="absolute -right-3 top-6 z-20 hidden h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition-colors hover:bg-orange-50 hover:text-orange-700 lg:flex"
        aria-label={isCollapsed ? copy.openSidebar : copy.closeSidebar}
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </button>

      <div
        className={cn(
          "flex h-20 shrink-0 items-center border-b border-slate-200 px-3 sm:px-4",
          shouldShowCompact ? "lg:justify-center" : "lg:justify-start",
          isMobileOpen ? "justify-start" : "justify-center",
        )}
      >
        <div
          className={cn(
            "flex min-w-0 items-center gap-3",
            shouldShowCompact && "lg:justify-center",
          )}
        >
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f54a00]">
            <span className="absolute left-2.5 top-2.5 h-2 w-2 rounded-full bg-slate-950" />
            <span className="absolute right-2.5 bottom-2.5 h-2 w-2 rounded-full bg-slate-950" />
            <span className="h-4.5 w-1.5 -rotate-45 rounded-full bg-white" />
            <span className="ml-0.5 h-4.5 w-1.5 -rotate-45 rounded-full bg-slate-950" />
          </div>

          {!shouldShowCompact ? (
            <div className="min-w-0">
              <p className="truncate text-lg font-semibold text-slate-950">
                {copy.bugNotebook}
              </p>
              <p className="truncate text-sm text-slate-500">
                {copy.personalDebugMemory}
              </p>
            </div>
          ) : null}
        </div>
      </div>

      <nav className="shrink-0 space-y-1 px-3 py-5">
        {navigationItems.map(({ label, icon: Icon, count, isActive, onClick }) => (
          <button
            key={label}
            type="button"
            onClick={onClick}
            title={shouldShowCompact ? label : undefined}
            className={cn(
              "flex h-12 w-full items-center rounded-md text-sm font-medium transition-colors",
              shouldShowCompact
                ? "lg:justify-center lg:px-0"
                : "lg:justify-between lg:px-3",
              isMobileOpen ? "justify-between px-3" : "justify-center px-0",
              isActive
                ? "bg-orange-50 text-orange-700 shadow-[inset_3px_0_0_#f54a00]"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
            )}
          >
            <span
              className={cn(
                "flex min-w-0 items-center gap-3",
                shouldShowCompact && "lg:justify-center",
                isMobileOpen ? "justify-start" : "justify-center",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!shouldShowCompact ? (
                <span
                  className={cn(
                    "truncate",
                    isMobileOpen ? "inline" : "hidden lg:inline",
                  )}
                >
                  {label}
                </span>
              ) : null}
            </span>

            {!shouldShowCompact ? (
              <span
                className={cn(
                  "text-xs text-slate-500",
                  isMobileOpen ? "inline" : "hidden lg:inline",
                )}
              >
                {count}
              </span>
            ) : null}
          </button>
        ))}
      </nav>

      <div className="min-h-0 flex-1 overflow-y-auto border-t border-slate-200 px-4 py-5">
        <div
          className={cn(
            "mb-3 flex items-center",
            shouldShowCompact ? "lg:justify-center" : "lg:justify-between",
            isMobileOpen ? "justify-between" : "justify-center",
          )}
        >
          {!shouldShowCompact ? (
            <p
              className={cn(
                "text-xs font-semibold uppercase tracking-wide text-slate-500",
                isMobileOpen ? "block" : "hidden lg:block",
              )}
            >
              {copy.tags}
            </p>
          ) : (
            <Hash className="h-4 w-4 text-slate-400" />
          )}

          {!shouldShowCompact ? (
            <button
              type="button"
              onClick={() => setIsAddTagOpen(true)}
              className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-950"
              aria-label={copy.addTag}
              title={copy.addSidebarTag}
            >
              <Plus className="h-4 w-4" />
            </button>
          ) : null}
        </div>

        {!shouldShowCompact ? (
          <div className={cn("space-y-1", isMobileOpen ? "block" : "hidden lg:block")}>
            {tags.length > 0 ? (
              tags.map((tag) => (
                <div
                  key={tag.label}
                  className={cn(
                    "flex h-9 w-full items-center rounded-md text-sm transition-colors",
                    tagFilter === tag.label
                      ? "bg-orange-50 text-orange-700"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
                  )}
                >
                  <button
                    type="button"
                    onClick={() => {
                      if (tagFilter === tag.label) {
                        dispatch(setTagFilter(null));
                        return;
                      }

                      dispatch(setTagFilter(tag.label));
                      dispatch(setStatusFilter("all"));
                      dispatch(setSeverityFilter("all"));
                      dispatch(setLinkedOnly(false));
                    }}
                    className="flex min-w-0 flex-1 items-center gap-2 px-2 text-left"
                    aria-pressed={tagFilter === tag.label}
                  >
                    <Hash className="h-3.5 w-3.5 text-orange-500" />
                    <span className="truncate">{tag.label}</span>
                  </button>

                  <span className="px-1 text-xs text-slate-400">
                    {tag.count}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleDeleteSidebarTag(tag.label)}
                    className="mr-1 flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:bg-red-50 hover:text-red-600"
                    aria-label={`${tag.label} sidebar etiketini sil`}
                    title={copy.removeFromSidebar}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))
            ) : (
              <p className="px-2 text-sm leading-6 text-slate-500">
                {copy.noTagsYet}
              </p>
            )}
          </div>
        ) : null}

        {!isMobileOpen ? (
          <div className="space-y-1 lg:hidden">
            {tags.slice(0, 8).map((tag) => (
              <button
                key={tag.label}
                type="button"
                onClick={() => {
                  if (tagFilter === tag.label) {
                    dispatch(setTagFilter(null));
                    return;
                  }

                  dispatch(setTagFilter(tag.label));
                  dispatch(setStatusFilter("all"));
                  dispatch(setSeverityFilter("all"));
                  dispatch(setLinkedOnly(false));
                }}
                className={cn(
                  "flex h-9 w-full items-center justify-center rounded-md transition-colors",
                  tagFilter === tag.label
                    ? "bg-orange-50 text-orange-700"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-950",
                )}
                title={`#${tag.label} (${tag.count})`}
                aria-label={`Filter by ${tag.label}`}
                aria-pressed={tagFilter === tag.label}
              >
                <Hash className="h-4 w-4" />
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div className="shrink-0 border-t border-slate-200 p-4">
        <div
          className={cn(
            "flex items-center",
            shouldShowCompact
              ? "lg:justify-center"
              : "lg:justify-between lg:gap-3",
            isMobileOpen
              ? "justify-between gap-3"
              : "flex-col justify-center gap-2 lg:flex-row",
          )}
        >
          <button
            type="button"
            onClick={() => setIsSettingsOpen(true)}
            className={cn(
              "flex min-w-0 items-center gap-3 rounded-md text-left transition-colors hover:bg-slate-100",
              isMobileOpen ? "px-2 py-1.5" : "justify-center p-1 lg:justify-start",
            )}
            aria-label={copy.settings}
            title={copy.settings}
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-orange-600 text-sm font-semibold text-white">
              {user?.initials ?? "U"}
            </div>

            {!shouldShowCompact ? (
              <div
                className={cn(
                  "min-w-0",
                  isMobileOpen ? "block" : "hidden lg:block",
                )}
              >
                <p className="truncate text-sm font-semibold text-slate-950">
                  {user?.name ?? copy.userFallback}
                </p>
                <p className="truncate text-xs text-slate-500">
                  {user?.role ?? copy.developerFallback}
                </p>
              </div>
            ) : null}
          </button>

          {!shouldShowCompact ? (
            <div
              className={cn(
                "items-center gap-1",
                isMobileOpen ? "flex" : "hidden lg:flex",
              )}
            >
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-950"
                aria-label={copy.settings}
                onClick={() => setIsSettingsOpen(true)}
              >
                <Settings className="h-4 w-4" />
              </button>

              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-950"
                aria-label={copy.logout}
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : null}

          {!isMobileOpen ? (
            <div className="flex flex-col items-center gap-1 lg:hidden">
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-950"
                aria-label={copy.settings}
                onClick={() => setIsSettingsOpen(true)}
              >
                <Settings className="h-4 w-4" />
              </button>

              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-950"
                aria-label={copy.logout}
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : null}

          {shouldShowCompact ? (
            <button
              type="button"
              className="hidden h-8 w-8 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-950 lg:flex"
              aria-label={copy.logout}
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      </div>

      {isSettingsOpen ? (
        <SettingsDialog
          user={user}
          totalBugs={bugs.length}
          resolvedBugs={bugs.filter((bug) => bug.status === "resolved").length}
          onClose={() => setIsSettingsOpen(false)}
          onLogout={handleLogout}
          onUserChange={setUser}
        />
      ) : null}

      {isAddTagOpen ? (
        <AddTagDialog
          existingTags={tags.map((tag) => tag.label)}
          onClose={() => setIsAddTagOpen(false)}
          onSave={(tag) => {
            const normalizedTag = tag.trim().replace(/^#/, "");

            if (!normalizedTag) {
              setIsAddTagOpen(false);
              return;
            }

            void updateSavedTags([
              ...new Set([...(user?.savedTags ?? []), normalizedTag]),
            ])
              .then(() => {
                toast.success("Sidebar tag added.");
                dispatch(setTagFilter(null));
                setIsAddTagOpen(false);
              })
              .catch((error) =>
                toast.error(error instanceof Error ? error.message : "Tag could not be added."),
              );
          }}
        />
      ) : null}
    </aside>
    </>
  );
}

type AddTagDialogProps = {
  existingTags: string[];
  onClose: () => void;
  onSave: (tag: string) => void;
};

function AddTagDialog({
  existingTags,
  onClose,
  onSave,
}: AddTagDialogProps) {
  const [tag, setTag] = useState("");
  const normalizedTag = tag.trim().replace(/^#/, "");
  const alreadyExists = Boolean(
    normalizedTag && existingTags.includes(normalizedTag),
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!normalizedTag || alreadyExists) return;

    onSave(normalizedTag);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/30 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-md border border-slate-200 bg-white shadow-xl"
      >
        <div className="border-b border-slate-200 p-5">
          <h2 className="text-base font-semibold text-slate-950">
            {copy.addSidebarTagTitle}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {copy.addSidebarTagDescription}
          </p>
        </div>

        <div className="grid gap-4 p-5">
          <label className="grid gap-1.5">
            <span className="text-sm font-medium text-slate-700">
              {copy.tagName}
            </span>
            <Input
              value={tag}
              onChange={(event) => setTag(event.target.value)}
              placeholder="auth"
              autoFocus
            />
          </label>

          {alreadyExists ? (
            <p className="text-sm font-medium text-orange-700">
              {copy.sidebarTagAlreadyExists}
            </p>
          ) : null}
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-200 p-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            {copy.cancel}
          </Button>
          <Button type="submit" disabled={!normalizedTag || alreadyExists}>
            {copy.add}
          </Button>
        </div>
      </form>
    </div>
  );
}

type SettingsDialogProps = {
  user: AuthUser | null;
  totalBugs: number;
  resolvedBugs: number;
  onClose: () => void;
  onLogout: () => void;
  onUserChange: (user: AuthUser) => void;
};

function SettingsDialog({
  user,
  totalBugs,
  resolvedBugs,
  onClose,
  onLogout,
  onUserChange,
}: SettingsDialogProps) {  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [role, setRole] = useState(user?.role ?? "Developer");
  const [emailPassword, setEmailPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [deletePassword, setDeletePassword] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  async function patchAccount(payload: {
    name?: string;
    email?: string;
    role?: string;
    currentPassword?: string;
    newPassword?: string;
  }) {
    const data = await updateCurrentUserRequest(payload);
    onUserChange(data.user);
    return data.user;
  }

  async function handleProfileSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSavingProfile(true);

    try {
      await patchAccount({ name, role });
      toast.success(copy.profileSaved);
    } catch (requestError) {
      toast.error(
        requestError instanceof Error
          ? requestError.message
          : copy.profileSaveFailed,
      );
    } finally {
      setIsSavingProfile(false);
    }
  }

  async function handleEmailSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!emailPassword) {
      toast.error(copy.currentPasswordRequiredForEmail);
      return;
    }

    setIsSavingProfile(true);

    try {
      await patchAccount({ email, currentPassword: emailPassword });
      setEmailPassword("");
      toast.success(copy.emailSaved);
    } catch (requestError) {
      toast.error(
        requestError instanceof Error
          ? requestError.message
          : copy.emailSaveFailed,
      );
    } finally {
      setIsSavingProfile(false);
    }
  }

  async function handlePasswordSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!currentPassword || !newPassword) {
      toast.error(copy.passwordRequired);
      return;
    }

    setIsSavingPassword(true);

    try {
      await patchAccount({ currentPassword, newPassword });
      setCurrentPassword("");
      setNewPassword("");
      toast.success(copy.passwordSaved);
    } catch (requestError) {
      toast.error(
        requestError instanceof Error
          ? requestError.message
          : copy.passwordSaveFailed,
      );
    } finally {
      setIsSavingPassword(false);
    }
  }

  function handleDeleteAccountSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!deletePassword) {
      toast.error(copy.deletePasswordRequired);
      return;
    }

    setIsDeleteDialogOpen(true);
  }

  async function handleConfirmDeleteAccount() {
    setIsDeletingAccount(true);

    try {
      await deleteCurrentUserRequest({ currentPassword: deletePassword });
      window.location.href = "/auth/register";
    } catch (requestError) {
      toast.error(
        requestError instanceof Error ? requestError.message : copy.deleteFailed,
      );
      setIsDeleteDialogOpen(false);
    } finally {
      setIsDeletingAccount(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/30 p-4">
      <div className="max-h-[calc(100vh-2rem)] w-full max-w-2xl overflow-hidden rounded-md border border-slate-200 bg-white shadow-xl">
        <div className="border-b border-slate-200 p-5">
          <h2 className="text-base font-semibold text-slate-950">{copy.settings}</h2>
          <p className="mt-1 text-sm text-slate-500">
            {copy.settingsDescription}
          </p>
        </div>

        <div className="max-h-[calc(100vh-11rem)] overflow-y-auto p-5">
          <div className="grid gap-4">
            <form
              onSubmit={handleProfileSubmit}
              className="rounded-md border border-slate-200 p-4"
            >
              <div className="mb-4">
                <p className="text-xs font-semibold uppercase text-slate-500">
                  {copy.profile}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  {user?.email ?? "user@bugnote.dev"}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="grid gap-1.5">
                  <span className="text-sm font-medium text-slate-700">
                    {copy.name}
                  </span>
                  <Input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder={copy.namePlaceholder}
                  />
                </label>

                <label className="grid gap-1.5">
                  <span className="text-sm font-medium text-slate-700">
                    {copy.role}
                  </span>
                  <Input
                    value={role}
                    onChange={(event) => setRole(event.target.value)}
                    placeholder="Developer"
                  />
                </label>
              </div>

              <div className="mt-4 flex justify-end">
                <Button type="submit" disabled={isSavingProfile}>
                  {isSavingProfile ? copy.saving : copy.saveProfile}
                </Button>
              </div>
            </form>

            <form
              onSubmit={handleEmailSubmit}
              className="rounded-md border border-slate-200 p-4"
            >
              <div className="mb-4">
                <p className="text-xs font-semibold uppercase text-slate-500">
                  {copy.email}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  {copy.emailDescription}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="grid gap-1.5">
                  <span className="text-sm font-medium text-slate-700">
                    {copy.newEmail}
                  </span>
                  <Input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </label>

                <label className="grid gap-1.5">
                  <span className="text-sm font-medium text-slate-700">
                    {copy.currentPassword}
                  </span>
                  <Input
                    type="password"
                    value={emailPassword}
                    onChange={(event) => setEmailPassword(event.target.value)}
                    placeholder={copy.currentPassword}
                    autoComplete="current-password"
                  />
                </label>
              </div>

              <div className="mt-4 flex justify-end">
                <Button type="submit" disabled={isSavingProfile}>
                  {copy.updateEmail}
                </Button>
              </div>
            </form>

            <form
              onSubmit={handlePasswordSubmit}
              className="rounded-md border border-slate-200 p-4"
            >
              <div className="mb-4">
                <p className="text-xs font-semibold uppercase text-slate-500">
                  {copy.password}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  {copy.passwordDescription}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="grid gap-1.5">
                  <span className="text-sm font-medium text-slate-700">
                    {copy.currentPassword}
                  </span>
                  <Input
                    type="password"
                    value={currentPassword}
                    onChange={(event) =>
                      setCurrentPassword(event.target.value)
                    }
                    placeholder={copy.currentPassword}
                    autoComplete="current-password"
                  />
                </label>

                <label className="grid gap-1.5">
                  <span className="text-sm font-medium text-slate-700">
                    {copy.newPassword}
                  </span>
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                    placeholder={copy.passwordPlaceholder}
                    autoComplete="new-password"
                  />
                </label>
              </div>

              <div className="mt-4 flex justify-end">
                <Button type="submit" disabled={isSavingPassword}>
                  {isSavingPassword ? copy.saving : copy.changePassword}
                </Button>
              </div>
            </form>

            <div className="rounded-md border border-slate-200 p-4">
              <p className="text-xs font-semibold uppercase text-slate-500">
                {copy.workspace}
              </p>
              <p className="mt-2 text-sm text-slate-600">
                {copy.workspaceStats
                  .replace("{total}", String(totalBugs))
                  .replace("{resolved}", String(resolvedBugs))}
              </p>
            </div>

            <form
              onSubmit={handleDeleteAccountSubmit}
              className="rounded-md border border-red-200 bg-red-50 p-4"
            >
              <p className="text-xs font-semibold uppercase text-red-700">
                {copy.dangerZone}
              </p>
              <p className="mt-1 text-sm text-red-700">
                {copy.deleteAccountDescription}
              </p>

              <label className="mt-3 grid gap-1.5">
                <span className="text-sm font-medium text-red-700">
                  {copy.currentPassword}
                </span>
                <Input
                  type="password"
                  value={deletePassword}
                  onChange={(event) => setDeletePassword(event.target.value)}
                  placeholder={copy.deletePasswordPlaceholder}
                  autoComplete="current-password"
                />
              </label>

              <div className="mt-4 flex justify-end">
                <Button type="submit" className="bg-red-600 hover:bg-red-700">
                  {copy.deleteAccount}
                </Button>
              </div>
            </form>
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-200 p-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            {copy.close}
          </Button>
          <Button type="button" onClick={onLogout}>
            {copy.logout}
          </Button>
        </div>
      </div>

      {isDeleteDialogOpen ? (
        <ConfirmationDialog
          title="Delete account?"
          description={copy.deleteConfirm}
          confirmLabel={copy.deleteAccount}
          cancelLabel={copy.cancel}
          isConfirming={isDeletingAccount}
          onCancel={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleConfirmDeleteAccount}
        />
      ) : null}
    </div>
  );
}
