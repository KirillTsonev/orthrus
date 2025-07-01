import {create} from "zustand";

interface IInteractionStore {
  isSelectingHeaderRow: boolean;
  isDeletingColumns: boolean;
  isMappingColumns: boolean;
  isMappingDone: boolean;
}

const INITIAL_INTERACTION_STORE = {
  isSelectingHeaderRow: false,
  isDeletingColumns: false,
  isMappingColumns: false,
  isMappingDone: false,
};

export const useInteractionStore = create<IInteractionStore>(() => ({
  ...INITIAL_INTERACTION_STORE,
}));
