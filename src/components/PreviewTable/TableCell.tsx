import styled from "styled-components";
import {css} from "@emotion/react";
import {flexRender} from "@tanstack/react-table";
import DeleteIcon from "../../assets/icons/trash-can.png";
import {useState, useRef} from "react";
import {useOnClickOutside} from "usehooks-ts";
import {useResponsiveTable} from "../../hooks/previewTable/useResponsiveTable";
import {useInteractionStore} from "../../store/interaction/InteractionStore";
import {useGlobalStore} from "../../store/global/GlobalStore";
import {useValidateTable} from "../../hooks/previewTable/useValidateTable";
import type {GENERIC_FIELDS_IDS} from "../../config/consts";
import {REQUIRED_TABLE_FIELDS_IDS} from "../../config/consts";
import type {PreviewTableRow} from "../../types/previewTableTypes";
import type {Cell} from "@tanstack/react-table";

interface TableCellProps {
  row: PreviewTableRow;
  cell: Cell<Record<string, string | number>, unknown>;
}

export const TableCell: React.FC<TableCellProps> = ({cell, row}) => {
  const [currentDisplay, setCurrentDisplay] = useState<"cell" | "input">("cell");
  const [newText, setNewText] = useState("");
  const isDeletingColumns = useInteractionStore((s) => s.isDeletingColumns);
  const {getFlexAndWidth} = useResponsiveTable();
  const {validateCell} = useValidateTable();

  const cellSize = cell.column.getSize();
  const isRequiredField = Object.values(REQUIRED_TABLE_FIELDS_IDS).includes(cell.column.id as REQUIRED_TABLE_FIELDS_IDS);
  const cellValue = cell.getValue() as string;
  const cellId = cell.column.id as GENERIC_FIELDS_IDS;
  const valueToValidate = newText ? newText : cellValue;
  const validateCellResult = row.original.index === 0 ? true : validateCell(valueToValidate, cellId);
  const cellContainerRef = useRef<HTMLDivElement | null>(null);

  const patchCsvData = () => {
    if (newText && newText !== cellValue && validateCell(newText, cellId)) {
      useGlobalStore.setState((s) => {
        const newData = [...s.csvData];

        if (newData[row.index]) {
          newData[row.index] = {...newData[row.index], [cell.column.id]: newText};
        }

        return {...s, csvData: newData, csvDataToDisplay: newData};
      });
    } else {
      useGlobalStore.setState((s) => ({
        ...s,
      }));
    }
  };

  useOnClickOutside(cellContainerRef as React.RefObject<HTMLDivElement>, () => {
    setCurrentDisplay("cell");
    patchCsvData();
    setNewText("");
  });

  return (
    <CellContainer
      key={cell.id}
      css={css`
        font-weight: ${row.index === 0 ? "bold" : "normal"};
        text-decoration: ${row.index === 0 ? "underline" : "none"};
        height: ${CELL_HEIGHT}px;
        border: 2px solid ${getCellBorderColor(validateCellResult, newText)};
        cursor: ${!validateCellResult ? "pointer" : ""};

        ${getFlexAndWidth(cellSize)};
      `}
      onClick={() => {
        if (!validateCellResult) {
          setCurrentDisplay("input");
        }
      }}
      ref={cellContainerRef}
    >
      {currentDisplay === "cell" && (
        <>
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
        </>
      )}
      {currentDisplay === "input" && (
        <StyledInput
          type="text"
          name={cell.column.id}
          onChange={(e) => setNewText(e.target.value)}
          autoFocus
          value={newText}
        />
      )}
    </CellContainer>
  );
};

const CELL_HEIGHT = 50;

const CellContainer = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: auto;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  border-radius: 10px;
  box-sizing: border-box;
`;

const StyledInput = styled.input`
  width: 90%;
`;

const DeleteColumnButton = styled.button`
  width: 15px;
  height: 15px;
  border-radius: 5px;
  border: none;
  background-color: transparent;
  padding: 0;

  &:hover {
    background: transparent;
  }
`;

const getCellBorderColor = (validateCellResult: boolean, newText: undefined | string) => {
  if (validateCellResult && !newText) return "transparent";
  if (validateCellResult && newText) return "limegreen";
  if (!validateCellResult) return "#ba2525";
};
