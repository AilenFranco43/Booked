import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

import { createFilterSlice } from './filters/filter.slice'
import { createAuthSlice } from './auth/auth.slice'

export const useBoundStore = create(
  // persist(
    devtools((set, get) => ({
      ...createFilterSlice(set, get),
      ...createAuthSlice(set, get),
    })),
  // {
  //   name: 'my-store',
  //   getStorage: () => localStorage
  // }
  // )
);