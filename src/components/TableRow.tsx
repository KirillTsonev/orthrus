import {css} from "@emotion/react";
import {flexRender} from "@tanstack/react-table";
import styled from "styled-components";
import {useResponsiveTable} from "../hooks/previewTable/useResponsiveTable";
import {ROW_HEIGHT} from "./CsvPreviewTable";

interface TableRowProps {}

export const TableRow = ({row}) => {
  const {getFlexAndWidth} = useResponsiveTable();

  return (
    <TableRowContainer>
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
  border: solid 1px green;
`;
