import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { BugNote, BugSeverity, BugStatus } from "../types/bug.types";
import { apiDelete, apiGet, apiPatch, apiPost } from "@/lib/api";

type BugsRequestState = "idle" | "loading" | "success" | "error";

type BugsState = {
  bugs: BugNote[];
  selectedBugId: string | null;
  searchQuery: string;
  statusFilter: BugStatus | "all"; 
  severityFilter: BugSeverity | "all";
  linkedOnly: boolean;
  tagFilter: string | null;
  sortDirection: "asc" | "desc";
  requestStatus: BugsRequestState;
  errorMessage: string | null;
};

type EditableBugFields = Pick<
  BugNote,
  | "title"
  | "summary"
  | "status"
  | "severity"
  | "project"
  | "stack"
  | "tags"
  | "linkedCard"
  | "problem"
  | "observations"
  | "response"
  | "possibleCause"
  | "solution"
  | "revisitNote"
>;

export type CreateBugPayload = {
  title: string;
  summary: string;
  status: BugNote["status"];
  severity: BugNote["severity"];
  project: string;
  stack: string[];
  tags: string[];
  linkedCard?: BugNote["linkedCard"];
  problem: string;
  observations: string;
  response: string;
  possibleCause: string;
  solution: string;
  revisitNote: string;
};
export type UpdateBugPayload = {
  id: string;
  changes: Partial<Omit<EditableBugFields, "linkedCard">> & {
    linkedCard?: BugNote["linkedCard"] | null;
  };
};

export const fetchBugs = createAsyncThunk("bugs/fetchBugs", async () => {
  const data = await apiGet<{ bugs: BugNote[] }>("/bugs");
  return data.bugs;
});

export const createBugRemote = createAsyncThunk(
  "bugs/createBugRemote",
  async (payload: CreateBugPayload) => {
    const data = await apiPost<{ bug: BugNote }>("/bugs", payload);

    return data.bug;
  },
);

export const updateBugRemote = createAsyncThunk(
  "bugs/updateBugRemote",
  async ({ id, changes }: UpdateBugPayload) => {
    const data = await apiPatch<{ bug: BugNote }>(`/bugs/${id}`, changes);
    return data.bug;
  },
);

export const deleteBugRemote = createAsyncThunk(
  "bugs/deleteBugRemote",
  async (id: string) => {
    await apiDelete<{ message: string }>(`/bugs/${id}`);
    return id;
  },
);

const initialState: BugsState = {
  bugs: [],
  selectedBugId: null,
  searchQuery: "",
  statusFilter: "all",
  severityFilter: "all",
  linkedOnly: false,
  tagFilter: null,
  sortDirection: "desc",
  requestStatus: "idle",
  errorMessage: null,
};

export const bugsSlice = createSlice({
  name: "bugs",
  initialState,
  reducers: {
    selectBug: (state, action: PayloadAction<string | null>) => {
      state.selectedBugId = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setStatusFilter: (state, action: PayloadAction<BugStatus | "all">) => {
      state.statusFilter = action.payload;
    },
    setSeverityFilter: (state, action: PayloadAction<BugSeverity | "all">) => {
      state.severityFilter = action.payload;
    },
    setLinkedOnly: (state, action: PayloadAction<boolean>) => {
      state.linkedOnly = action.payload;
    },
    setTagFilter: (state, action: PayloadAction<string | null>) => {
      state.tagFilter = action.payload;
    },
    clearBugFilters: (state) => {
      state.statusFilter = "all";
      state.severityFilter = "all";
      state.linkedOnly = false;
      state.tagFilter = null;
    },
    toggleSortDirection: (state) => {
      state.sortDirection = state.sortDirection === "desc" ? "asc" : "desc";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBugs.pending, (state) => {
        state.requestStatus = "loading";
        state.errorMessage = null;
      })
      .addCase(fetchBugs.fulfilled, (state, action) => {
        state.requestStatus = "success";
        state.bugs = action.payload;
        state.selectedBugId =
          action.payload.find((bug) => bug.id === state.selectedBugId)?.id ??
          action.payload[0]?.id ??
          null;
      })
      .addCase(fetchBugs.rejected, (state, action) => {
        state.requestStatus = "error";
        state.errorMessage =
          action.error.message ?? "Bug notes could not load";
      })
      .addCase(createBugRemote.pending, (state) => {
        state.requestStatus = "loading";
        state.errorMessage = null;
      })
      .addCase(createBugRemote.fulfilled, (state, action) => {
        state.requestStatus = "success";
        state.bugs = [
          action.payload,
          ...state.bugs.filter((bug) => bug.id !== action.payload.id),
        ];
        state.selectedBugId = action.payload.id;
      })
      .addCase(createBugRemote.rejected, (state, action) => {
        state.requestStatus = "error";
        state.errorMessage =
          action.error.message ?? "Bug note could not be created";
      })
      .addCase(updateBugRemote.pending, (state) => {
        state.requestStatus = "loading";
        state.errorMessage = null;
      })
      .addCase(updateBugRemote.fulfilled, (state, action) => {
        state.requestStatus = "success";
        const bug = state.bugs.find((item) => item.id === action.payload.id);

        if (!bug) {
          state.bugs.unshift(action.payload);
          return;
        }

        Object.assign(bug, action.payload);
        bug.linkedCard = action.payload.linkedCard;
      })
      .addCase(updateBugRemote.rejected, (state, action) => {
        state.requestStatus = "error";
        state.errorMessage =
          action.error.message ?? "Bug note could not be updated";
      })
      .addCase(deleteBugRemote.pending, (state) => {
        state.requestStatus = "loading";
        state.errorMessage = null;
      })
      .addCase(deleteBugRemote.fulfilled, (state, action) => {
        state.requestStatus = "success";
        state.bugs = state.bugs.filter((bug) => bug.id !== action.payload);

        if (state.selectedBugId === action.payload) {
          state.selectedBugId = state.bugs[0]?.id ?? null;
        }
      })
      .addCase(deleteBugRemote.rejected, (state, action) => {
        state.requestStatus = "error";
        state.errorMessage =
          action.error.message ?? "Bug note could not be deleted";
      });
  },
});

export const {
  selectBug,
  setSearchQuery,
  setStatusFilter,
  setSeverityFilter,
  setLinkedOnly,
  setTagFilter,
  clearBugFilters,
  toggleSortDirection,
} = bugsSlice.actions;
export const bugsReducer = bugsSlice.reducer;
