import {css} from "@emotion/react";
import styled from "styled-components";
import {useInteractionStore} from "../../store/interaction/InteractionStore";
import {useGlobalStore} from "../../store/global/GlobalStore";
import type {PreviewTableRow} from "../../types/previewTableTypes";
import {TableCell} from "../PreviewTable/TableCell";

interface TableRowProps {
  row: PreviewTableRow;
}

export const TableRow: React.FC<TableRowProps> = ({row}) => {
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
          <TableCell
            row={row}
            cell={cell}
          />
        );
      })}
    </TableRowContainer>
  );
};

const TableRowContainer = styled.div`
  display: flex;
  position: relative;
`;
