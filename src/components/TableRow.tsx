import {css} from "@emotion/react";
import {flexRender} from "@tanstack/react-table";
import styled from "styled-components";
import {useResponsiveTable} from "../hooks/previewTable/useResponsiveTable";
import {ROW_HEIGHT} from "./CsvPreviewTable";
import {useInteractionStore} from "../store/interaction/InteractionStore";
import {useGlobalStore} from "../store/global/GlobalStore";
import DeleteIcon from "../assets/icons/trash-can.png";
import type {Row} from "@tanstack/react-table";
import {REQUIRED_TABLE_FIELDS_IDS} from "../config/consts";

interface TableRowProps {
  row: Row<unknown>;
}

export const TableRow: React.FC<TableRowProps> = ({row}) => {
  const {getFlexAndWidth} = useResponsiveTable();
  const isSelectingHeaderRow = useInteractionStore((s) => s.isSelectingHeaderRow);
  const isDeletingColumns = useInteractionStore((s) => s.isDeletingColumns);

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
        const isRequiredField = Object.values(REQUIRED_TABLE_FIELDS_IDS).includes(cell.column.id as REQUIRED_TABLE_FIELDS_IDS);

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
              gap: 5px;

              ${getFlexAndWidth(cellSize)};
            `}
          >
            {row.index === 0 && isDeletingColumns && !isRequiredField && (
              <DeleteColumnButton>
                <img
                  src={DeleteIcon}
                  alt="Delete column"
                  css={css`
                    width: 15px;
                    height: 15px;
                    cursor: pointer;
                  `}
                  onClick={(e) => {
                    e.stopPropagation();
                    useGlobalStore.setState((s) => ({
                      ...s,
                      columnVisibility: {...s.columnVisibility, [cell.column.id]: false},
                    }));
                  }}
                />
              </DeleteColumnButton>
            )}
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

const DeleteColumnButton = styled.button`
  width: 15px;
  height: 15px;
  border-radius: 5px;
  border: none;
  background-color: transparent;
`;
