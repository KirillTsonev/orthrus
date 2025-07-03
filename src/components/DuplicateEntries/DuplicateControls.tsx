import {useGlobalStore} from "../../store/global/GlobalStore";
import type {PreviewTableRow} from "types/previewTableTypes";
import styled from "styled-components";

interface DuplicateControlsProps {
  group: Array<PreviewTableRow>;
  setIsMergingManually: () => void;
}

export const DuplicateControls: React.FC<DuplicateControlsProps> = ({group, setIsMergingManually}) => {
  const csvData = useGlobalStore((s) => s.csvData);

  return (
    <ControlsContainer>
      <ControlsButton
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
      </ControlsButton>
      <ControlsButton
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
      </ControlsButton>
      <ControlsButton onClick={setIsMergingManually}>Merge manually</ControlsButton>
      <ControlsButton
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
      </ControlsButton>
    </ControlsContainer>
  );
};

const ControlsContainer = styled.div`
  height: 30px;
  display: flex;
  gap: 10px;
  justify-content: left;
  padding-left: 20px;
`;

const ControlsButton = styled.button`
  padding: 0 10px;
`;
