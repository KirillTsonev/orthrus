import {css} from "@emotion/react";
import styled from "styled-components";
import {useInteractionStore} from "../../store/interaction/InteractionStore";
import {useGlobalStore} from "../../store/global/GlobalStore";
import type {PreviewTableRow} from "../../types/previewTableTypes";
import {TableCell} from "../PreviewTable/TableCell";
import {slideRight} from "../../config/animations";

interface TableRowProps {
  row: PreviewTableRow;
  idx: number;
}

export const TableRow: React.FC<TableRowProps> = ({row, idx}) => {
  const isSelectingHeaderRow = useInteractionStore((s) => s.isSelectingHeaderRow);

  return (
    <TableRowContainer
      css={css`
        cursor: ${isSelectingHeaderRow ? "pointer" : "default"};
        animation: ${slideRight} 0.3s linear 1;
        animation-delay: ${0.25 + idx * 0.1}s;
        animation-fill-mode: both;
      `}
      onClick={() => {
        if (isSelectingHeaderRow) {
          useInteractionStore.setState((s) => ({
            ...s,
            isSelectingHeaderRow: false,
          }));
          useGlobalStore.setState((s) => ({
            ...s,
            headerRowIndex: row.original.index as number,
          }));
        }
      }}
    >
      {row.getVisibleCells().map((cell) => {
        const cellSize = cell.column.getSize();

        if (cellSize === 0) return null;

        return (
          <div
            style={{padding: "5px"}}
            key={cell.id}
          >
            <TableCell
              row={row}
              cell={cell}
            />
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
