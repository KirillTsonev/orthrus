import {css} from "@emotion/react";
import {flexRender} from "@tanstack/react-table";
import styled from "styled-components";
import {useResponsiveTable} from "../hooks/previewTable/useResponsiveTable";
import {ROW_HEIGHT} from "./CsvPreviewTable";
import {useInteractionStore} from "../store/interaction/InteractionStore";
import {useGlobalStore} from "../store/global/GlobalStore";

interface TableRowProps {
  row: any;
}

export const TableRow: React.FC<TableRowProps> = ({row}) => {
  const {getFlexAndWidth} = useResponsiveTable();
  const isSelectingHeaderRow = useInteractionStore((s) => s.isSelectingHeaderRow);

  return (
    <TableRowContainer
      css={css`
        cursor: ${isSelectingHeaderRow ? "pointer" : "default"};
      `}
      onClick={() => {
        if (isSelectingHeaderRow) {
          useInteractionStore.setState((s) => ({
            ...s,
            isSelectingHeaderRow: false,
          }));
          useGlobalStore.setState((s) => ({
            ...s,
            headerRowIndex: row.index,
          }));
        }
      }}
    >
      {row.getVisibleCells().map((cell) => {
        const cellSize = cell.column.getSize();

        if (cellSize === 0) return null;

        return (
          <div
            key={cell.id}
            css={css`
              overflow: hidden;
              text-overflow: ellipsis;
              margin-bottom: auto;
              text-align: center;
              display: flex;
              align-items: center;
              justify-content: center;
              height: ${ROW_HEIGHT}px;
              font-weight: ${row.index === 0 ? "bold" : "normal"};

              ${getFlexAndWidth(cellSize)};
            `}
          >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </div>
        );
      })}
    </TableRowContainer>
  );
};

const TableRowContainer = styled.div`
  display: flex;
  position: relative;
`;
