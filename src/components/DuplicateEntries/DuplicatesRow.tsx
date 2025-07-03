import type {PreviewTableRow} from "types/previewTableTypes";
import {useWindowVirtualizer} from "@tanstack/react-virtual";
import {TableRow} from "../PreviewTable/TableRow";
import styled from "styled-components";
import {css} from "@emotion/react";
import {DuplicateControls} from "../DuplicateEntries/DuplicateControls";
import {useState} from "react";
import {useGlobalStore} from "../../store/global/GlobalStore";

interface DuplicatesRowProps {
  group: Array<PreviewTableRow>;
  parentRef: React.RefObject<HTMLDivElement | null>;
  rows: Array<PreviewTableRow>;
  isFirstGroup: boolean;
}

export const DuplicatesRow: React.FC<DuplicatesRowProps> = ({group, parentRef, rows, isFirstGroup}) => {
  const [isMergingManually, setIsMergingManually] = useState(false);
  const [newRow, setNewRow] = useState<Record<string, string | number>>(group[0].original);

  const csvData = useGlobalStore((s) => s.csvData);

  const rowVirtualizer = useWindowVirtualizer({
    count: group.length,
    estimateSize: () => DUPLICATE_ROW_HEIGHT,
    overscan: 20,
    scrollMargin: parentRef.current?.offsetTop ?? 0,
  });

  return (
    <div
      css={css`
        margin-top: ${isFirstGroup ? "20px" : "0px"};
      `}
    >
      {isFirstGroup && <TableRow row={rows[0]} />}
      <GroupContainer
        css={css`
          height: ${group.length * DUPLICATE_ROW_HEIGHT + 30}px;
          top: ${isFirstGroup ? "0" : "20px"};
        `}
      >
        <DuplicateControls
          group={group}
          setIsMergingManually={() => setIsMergingManually(!isMergingManually)}
        />
        {!isMergingManually &&
          rowVirtualizer.getVirtualItems().map((virtualRow, i) => {
            const row = group[virtualRow.index];
            const offset = DUPLICATE_ROW_HEIGHT * i + 30;

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
                    <StyledDuplicateSelect
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
                    </StyledDuplicateSelect>
                  </div>
                ))}
            </div>
            <button
              onClick={() => {
                const duplicatedRows = group.map((row) => row.original.index);
                const filteredCsv = csvData.filter((data) => !duplicatedRows.includes(data["index"])).concat(newRow);

                setIsMergingManually(false);

                useGlobalStore.setState((s) => ({
                  ...s,
                  csvData: filteredCsv,
                  csvDataToDisplay: filteredCsv,
                }));
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

const DUPLICATE_ROW_HEIGHT = 50;

const GroupContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  width: auto;
  padding-top: 10px;
  transition: background 0.3s;
  border-radius: 10px;
  background: rgb(62, 161, 5);

  &:hover {
    background: limegreen;
  }
`;

const RowContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
`;

const StyledDuplicateSelect = styled.select`
  height: 35px;
  background: rgb(11, 192, 205);
  border: none;
  padding: 5px 20px;
  border-radius: 7px;
  cursor: pointer;
`;
