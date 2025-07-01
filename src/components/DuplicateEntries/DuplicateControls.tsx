import {useGlobalStore} from "../../store/global/GlobalStore";
import type {PreviewTableRow} from "types/previewTableTypes";

interface DuplicateControlsProps {
  group: Array<PreviewTableRow>;
  setIsMergingManually: () => void;
}

export const DuplicateControls: React.FC<DuplicateControlsProps> = ({group, setIsMergingManually}) => {
  const csvData = useGlobalStore((s) => s.csvData);

  return (
    <div style={{height: "20px", display: "flex", gap: "10px", justifyContent: "center"}}>
      <button
        style={{padding: "0 10px"}}
        onClick={() => {
          const notFirstRows = group.slice(1).map((row) => row.original.index);
          const filteredCsv = csvData.filter((data) => !notFirstRows.includes(data["index"]));

          useGlobalStore.setState((s) => ({
            ...s,
            csvData: filteredCsv,
            csvDataToDisplay: filteredCsv,
          }));
        }}
      >
        Keep first row
      </button>
      <button
        style={{padding: "0 10px"}}
        onClick={() => {
          const notLastRows = group.slice(0, -1).map((row) => row.original.index);
          const filteredCsv = csvData.filter((data) => !notLastRows.includes(data["index"]));

          useGlobalStore.setState((s) => ({
            ...s,
            csvData: filteredCsv,
            csvDataToDisplay: filteredCsv,
          }));
        }}
      >
        Keep last row
      </button>
      <button
        style={{padding: "0 10px"}}
        onClick={setIsMergingManually}
      >
        Merge manually
      </button>
      <button
        style={{padding: "0 10px"}}
        onClick={() => {
          const duplicatedRows = group.map((row) => row.original.index);
          const filteredCsv = csvData.filter((data) => !duplicatedRows.includes(data["index"]));

          useGlobalStore.setState((s) => ({
            ...s,
            csvData: filteredCsv,
            csvDataToDisplay: filteredCsv,
          }));
        }}
      >
        Delete duplicates
      </button>
    </div>
  );
};
