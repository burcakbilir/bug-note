

import { bugsReducer } from "@/features/bugs/slices/bug-slice";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
    reducer: {
        bugs: bugsReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
