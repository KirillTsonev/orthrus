import {create} from "zustand";

interface IGlobalStore {
  csvDataToDisplay: Array<Record<string, string>>;
  csvData: Array<Record<string, string>>;
  headerRowIndex: number | undefined;
  columnVisibility: Record<string, boolean>;
  currentTable: string;
}

const INITIAL_GLOBAL_STORE = {
  csvDataToDisplay: [{}],
  csvData: [{}],
  headerRowIndex: undefined,
  columnVisibility: {},
  currentTable: "preview",
};

export const useGlobalStore = create<IGlobalStore>(() => ({...INITIAL_GLOBAL_STORE}));
