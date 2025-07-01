import {create} from "zustand";

export enum CURRENT_TABLE {
  Preview = "preview",
  Mapping = "mapping",
  Duplicates = "duplicates",
}

export enum CURRENT_FILTER {
  All = "all",
  Clean = "clean",
  Problem = "problem",
}

interface IGlobalStore {
  csvDataToDisplay: Array<Record<string, string | number>>;
  csvData: Array<Record<string, string | number>>;
  headerRowIndex: number | undefined;
  columnVisibility: Record<string, boolean>;
  currentTable: CURRENT_TABLE;
  currentFilter: CURRENT_FILTER;
}

const INITIAL_GLOBAL_STORE = {
  csvDataToDisplay: [{}],
  csvData: [{}],
  headerRowIndex: undefined,
  columnVisibility: {},
  currentTable: CURRENT_TABLE.Preview,
  currentFilter: CURRENT_FILTER.All,
};

export const useGlobalStore = create<IGlobalStore>(() => ({...INITIAL_GLOBAL_STORE}));
