import type {PreviewTableRow} from "types/previewTableTypes";
import {useWindowVirtualizer} from "@tanstack/react-virtual";
import {TableRow} from "../PreviewTable/TableRow";
import styled from "styled-components";
import {css} from "@emotion/react";
import {DuplicateControls} from "../DuplicateEntries/DuplicateControls";
import {useState} from "react";

interface DuplicatesRowProps {
  group: Array<PreviewTableRow>;
  parentRef: React.RefObject<HTMLDivElement | null>;
  rows: Array<PreviewTableRow>;
  isFirstGroup: boolean;
}

export const DuplicatesRow: React.FC<DuplicatesRowProps> = ({group, parentRef, rows, isFirstGroup}) => {
  const [isMergingManually, setIsMergingManually] = useState(false);
  const [newRow, setNewRow] = useState<Record<string, string | number>>(group[0].original);

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
        <DuplicateControls
          group={group}
          setIsMergingManually={() => setIsMergingManually(!isMergingManually)}
        />
        {!isMergingManually &&
          rowVirtualizer.getVirtualItems().map((virtualRow, i) => {
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
        {isMergingManually && (
          <div style={{padding: "10px 40px"}}>
            <div style={{display: "flex", justifyContent: "space-between"}}>
              {Object.keys(group[0].original)
                .slice(1)
                .map((field) => (
                  <div
                    key={field}
                    style={{marginBottom: "8px"}}
                  >
                    <select
                      value={newRow[field] ?? group[0].original[field]}
                      onChange={(e) =>
                        setNewRow((prev) => ({
                          ...prev,
                          [field]: e.target.value,
                        }))
                      }
                      style={{fontSize: "16px"}}
                    >
                      {group.map((row, idx) => (
                        <option
                          key={row.index ?? idx}
                          value={row.original[field]}
                        >
                          {row.original[field]}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
            </div>
            <button
              onClick={() => {
                console.log("%c ", "background: pink; color: black", newRow);
              }}
            >
              Confirm
            </button>
          </div>
        )}
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
