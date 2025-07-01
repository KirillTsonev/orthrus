import {useGlobalStore} from "../store/global/GlobalStore";
import {getCoreRowModel, useReactTable} from "@tanstack/react-table";
import {useMemo, useRef} from "react";
import styled from "styled-components";
import {usePreviewColumnDefinitions} from "../hooks/previewTable/usePreviewColumnDefinitions";
import {isEmpty} from "lodash-es";
import {TableControls} from "./TableControls";
import {PreviewTable} from "./PreviewTable";
import {useInteractionStore} from "../store/interaction/InteractionStore";
import {MapColumns} from "./MapColumns";

export const CsvPreview = () => {
  const csvData = useGlobalStore((s) => s.csvData);
  const headerRowIndex = useGlobalStore((s) => s.headerRowIndex);
  const columnVisibility = useGlobalStore((s) => s.columnVisibility);
  const isMappingColumns = useInteractionStore((s) => s.isMappingColumns);

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

  if (isEmpty(csvData[0])) return null;

  return (
    <TableContainer ref={parentRef}>
      <TableControls />
      {!isMappingColumns && (
        <PreviewTable
          rows={rows}
          parentRef={parentRef}
        />
      )}
      {isMappingColumns && <MapColumns rows={rows} />}
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
