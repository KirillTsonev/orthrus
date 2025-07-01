import type {PreviewTableRow} from "types/previewTableTypes";
import {useWindowVirtualizer} from "@tanstack/react-virtual";
import {TableRow} from "./TableRow";
import styled from "styled-components";
import {css} from "@emotion/react";

interface DuplicatesRowProps {
  group: Array<PreviewTableRow>;
  parentRef: React.RefObject<HTMLDivElement | null>;
  rows: Array<PreviewTableRow>;
  isFirstGroup: boolean;
}

export const DuplicatesRow: React.FC<DuplicatesRowProps> = ({group, parentRef, rows, isFirstGroup}) => {
  const rowVirtualizer = useWindowVirtualizer({
    count: group.length,
    estimateSize: () => DUPLICATE_ROW_HEIGHT,
    overscan: 20,
    scrollMargin: parentRef.current?.offsetTop ?? 0,
  });

  return (
    <div>
      {isFirstGroup && (
        <div style={{position: "relative", top: "20px"}}>
          <TableRow row={rows[0]} />
        </div>
      )}
      <GroupContainer
        css={css`
          height: ${group.length * DUPLICATE_ROW_HEIGHT + 20}px;
        `}
      >
        <div style={{height: "20px", display: "flex", gap: "10px", justifyContent: "center"}}>
          <button>Keep first row</button>
          <button>Keep last row</button>
          <button>Merge manually</button>
          <button>Delete duplicates</button>
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
`;

const RowContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
`;

const DUPLICATE_ROW_HEIGHT = 50;
