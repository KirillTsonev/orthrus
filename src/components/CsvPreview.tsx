import {useGlobalStore} from "../store/global/GlobalStore";
import {getCoreRowModel, useReactTable} from "@tanstack/react-table";
import {useMemo, useRef} from "react";
import styled from "styled-components";
import {usePreviewColumnDefinitions} from "../hooks/previewTable/usePreviewColumnDefinitions";
import {isEmpty} from "lodash-es";
import {TableControls} from "./TableControls";
import {PreviewTable} from "./PreviewTable/PreviewTable";
import {MapColumns} from "./MapColumns";
import {TableFilters} from "./TableFilters";
import {DuplicatesTable} from "./DuplicateEntries/DuplicatesTable";

export const CsvPreview = () => {
  const csvDataToDisplay = useGlobalStore((s) => s.csvDataToDisplay);
  const headerRowIndex = useGlobalStore((s) => s.headerRowIndex);
  const columnVisibility = useGlobalStore((s) => s.columnVisibility);
  const currentTable = useGlobalStore((s) => s.currentTable);

  const parentRef = useRef<HTMLDivElement>(null);
  const {getColumnDefinitions: colDefs} = usePreviewColumnDefinitions();

  const tableData = useMemo(() => {
    if (headerRowIndex !== undefined) {
      return [
        csvDataToDisplay[headerRowIndex],
        ...csvDataToDisplay.slice(0, headerRowIndex),
        ...csvDataToDisplay.slice(headerRowIndex + 1),
      ];
    }
    return csvDataToDisplay;
  }, [csvDataToDisplay, headerRowIndex]);

  const table = useReactTable({
    data: tableData,
    columns: colDefs,
    getCoreRowModel: getCoreRowModel(),
    state: {
      columnVisibility,
    },
  });

  const {rows} = table.getRowModel();

  if (isEmpty(csvDataToDisplay[0])) return null;

  return (
    <TableContainer ref={parentRef}>
      <TableControls />
      <TableFilters />
      {currentTable === "preview" && (
        <PreviewTable
          rows={rows}
          parentRef={parentRef}
        />
      )}
      {currentTable === "mapping" && <MapColumns rows={rows} />}
      {currentTable === "duplicates" && (
        <DuplicatesTable
          rows={rows}
          parentRef={parentRef}
        />
      )}
    </TableContainer>
  );
};

const TableContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  position: relative;
  margin-bottom: 50px;
`;

export const ROW_HEIGHT = 60;
