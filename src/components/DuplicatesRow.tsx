import type {PreviewTableRow} from "types/previewTableTypes";
import {useWindowVirtualizer} from "@tanstack/react-virtual";
import {TableRow} from "./TableRow";
import styled from "styled-components";
import {css} from "@emotion/react";
import {useGlobalStore} from "../store/global/GlobalStore";

interface DuplicatesRowProps {
  group: Array<PreviewTableRow>;
  parentRef: React.RefObject<HTMLDivElement | null>;
  rows: Array<PreviewTableRow>;
  isFirstGroup: boolean;
}

export const DuplicatesRow: React.FC<DuplicatesRowProps> = ({group, parentRef, rows, isFirstGroup}) => {
  const csvData = useGlobalStore((s) => s.csvData);
  const rowVirtualizer = useWindowVirtualizer({
    count: group.length,
    estimateSize: () => DUPLICATE_ROW_HEIGHT,
    overscan: 20,
    scrollMargin: parentRef.current?.offsetTop ?? 0,
  });

  return (
    <div style={{marginTop: "20px"}}>
      {isFirstGroup && <TableRow row={rows[0]} />}
      <GroupContainer
        css={css`
          height: ${group.length * DUPLICATE_ROW_HEIGHT + 20}px;
        `}
      >
        <div style={{height: "20px", display: "flex", gap: "10px", justifyContent: "center"}}>
          <button
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
          <button>Merge manually</button>
          <button
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
        {rowVirtualizer.getVirtualItems().map((virtualRow, i) => {
          const row = group[virtualRow.index];
          const offset = DUPLICATE_ROW_HEIGHT * i + 20;

          return (
            <RowContainer
              key={virtualRow.index}
              css={css`
                height: ${DUPLICATE_ROW_HEIGHT}px;
                transform: translateY(${offset}px);
              `}
            >
              <TableRow
                key={virtualRow.index}
                row={row}
              />
            </RowContainer>
          );
        })}
      </GroupContainer>
    </div>
  );
};

const GroupContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  top: 20px;
  width: auto;
  border: solid 2px red;
  padding-top: 10px;
`;

const RowContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
`;

const DUPLICATE_ROW_HEIGHT = 50;
