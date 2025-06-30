import {useGlobalStore} from "../store/global/GlobalStore";
import {getCoreRowModel, useReactTable} from "@tanstack/react-table";
import {useWindowVirtualizer} from "@tanstack/react-virtual";
import {useRef} from "react";
import {css} from "@emotion/react";
import {TableRow} from "./TableRow";
import styled from "styled-components";
import {usePreviewColumnDefinitions} from "../hooks/previewTable/usePreviewColumnDefinitions";

export const CsvPreviewTable = () => {
  const csvData = useGlobalStore().csvData;
  const parentRef = useRef<HTMLDivElement>(null);
  // const headerKeys = Object.keys(Object.assign({}, ...csvData));

  const {getColumnDefinitions: colDefs} = usePreviewColumnDefinitions();

  const table = useReactTable({
    data: csvData,
    columns: colDefs,
    getCoreRowModel: getCoreRowModel(),
  });

  const {rows} = table.getRowModel();

  const rowVirtualizer = useWindowVirtualizer({
    count: rows.length,
    estimateSize: () => ROW_HEIGHT,
    overscan: 20,
    scrollMargin: parentRef.current?.offsetTop ?? 0,
  });

  return (
    <TableContainer ref={parentRef}>
      <button>Change header row</button>
      <div
        css={css`
          display: flex;
          flex-direction: column;
          width: 100%;
          position: relative;
          height: ${rowVirtualizer.getTotalSize()}px;
        `}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const row = rows[virtualRow.index];

          return (
            <div
              css={css`
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: ${virtualRow.size}px;
                transform: translateY(${virtualRow.start - rowVirtualizer.options.scrollMargin}px);
              `}
              data-index={virtualRow.index}
            >
              <TableRow
                row={row}
                style={{height: `${virtualRow.size}px`}}
              />
            </div>
          );
        })}
      </div>
    </TableContainer>
  );
};

const TableContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  align-self: stretch;
`;

export const ROW_HEIGHT = 80;
