import {create} from "zustand";

interface IInteractionStore {
  isSelectingHeaderRow: boolean;
  isDeletingColumns: boolean;
  isMappingColumns: boolean;
  isMappingDone: boolean;
  isUploadModalOpen: boolean;
}

const INITIAL_INTERACTION_STORE = {
  isSelectingHeaderRow: false,
  isDeletingColumns: false,
  isMappingColumns: false,
  isMappingDone: false,
  isUploadModalOpen: false,
};

export const useInteractionStore = create<IInteractionStore>(() => ({
  ...INITIAL_INTERACTION_STORE,
}));

export const resetInteractionStore = () => {
  useInteractionStore.setState(() => ({
    ...INITIAL_INTERACTION_STORE,
  }));
};
