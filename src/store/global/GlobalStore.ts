import {create} from "zustand";

export const useGlobalStore = create(() => ({
  csvData: [{}],
}));
