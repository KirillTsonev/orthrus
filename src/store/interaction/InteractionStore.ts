import {create} from "zustand";

export const useInteractionStore = create(() => ({
  isSelectingHeaderRow: false,
  isDeletingColumns: false,
}));
