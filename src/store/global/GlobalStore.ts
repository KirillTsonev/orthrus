import {create} from "zustand";

interface IGlobalStore {
  csvData: Array<Record<string, string>>;
  headerRowIndex: number | undefined;
  columnVisibility: Record<string, boolean>;
}

const INITIAL_GLOBAL_STORE = {
  csvData: [{}],
  headerRowIndex: undefined,
  columnVisibility: {},
};

export const useGlobalStore = create<IGlobalStore>(() => ({...INITIAL_GLOBAL_STORE}));
