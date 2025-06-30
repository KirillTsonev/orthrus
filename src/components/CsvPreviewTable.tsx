import {useGlobalStore} from "../store/global/GlobalStore";
import {getCoreRowModel, useReactTable} from "@tanstack/react-table";
import {useWindowVirtualizer} from "@tanstack/react-virtual";
import {useMemo, useRef} from "react";
import {css} from "@emotion/react";
import {TableRow} from "./TableRow";
import styled from "styled-components";
import {usePreviewColumnDefinitions} from "../hooks/previewTable/usePreviewColumnDefinitions";
import {Scrollbar} from "react-scrollbars-custom";
import {isEmpty} from "lodash-es";
import {TableControls} from "./TableControls";

export const CsvPreviewTable = () => {
  const csvData = useGlobalStore((s) => s.csvData);
  const headerRowIndex = useGlobalStore((s) => s.headerRowIndex);
  const columnVisibility = useGlobalStore((s) => s.columnVisibility);

  const parentRef = useRef<HTMLDivElement>(null);

  const {getColumnDefinitions: colDefs} = usePreviewColumnDefinitions();

  const tableData = useMemo(() => {
    if (headerRowIndex !== undefined) {
      return [csvData[headerRowIndex], ...csvData.slice(0, headerRowIndex), ...csvData.slice(headerRowIndex + 1)];
    }
    return csvData;
  }, [csvData, headerRowIndex]);

  const table = useReactTable({
    data: tableData,
    columns: colDefs,
    getCoreRowModel: getCoreRowModel(),
    state: {
      columnVisibility,
    },
  });

  const {rows} = table.getRowModel();

  const rowVirtualizer = useWindowVirtualizer({
    count: rows.length,
    estimateSize: () => ROW_HEIGHT,
    overscan: 20,
    scrollMargin: parentRef.current?.offsetTop ?? 0,
  });

  if (isEmpty(csvData[0])) return null;

  return (
    <TableContainer ref={parentRef}>
      <TableControls />
      <div
        css={css`
          display: flex;
          flex-direction: column;
          width: 100%;
          position: relative;
          height: ${rowVirtualizer.getTotalSize() + 20}px;
          overflow: hidden;
        `}
      >
        <Scrollbar
          style={{width: "100%", height: "100%"}}
          trackXProps={{
            renderer: (props) => {
              const {elementRef, style, ...restProps} = props;

              return (
                <div
                  {...restProps}
                  ref={elementRef}
                  style={{
                    ...style,
                    top: 0,
                    bottom: "auto",
                    position: "absolute",
                    height: 15,
                    background: "#eee",
                  }}
                />
              );
            },
          }}
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
                  transform: translateY(${virtualRow.start - rowVirtualizer.options.scrollMargin + 20}px);
                `}
                data-index={virtualRow.index}
              >
                <TableRow row={row} />
              </div>
            );
          })}
        </Scrollbar>
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
  border: solid 1px green;
  position: relative;
`;

export const ROW_HEIGHT = 50;
