export const createFilterSlice = (set) => ({
  filters: {},
  isDestinationOpen: false,

  setFilters: (newFiltersValue) => set(prev => ({ ...prev, filters: { ...prev.filters, ...newFiltersValue } })),
  setDestinationState: (state) => set({ isDestinationOpen: state }),
});
