import {Scrollbar} from "react-scrollbars-custom";
import {css} from "@emotion/react";
import {TableRow} from "./TableRow";
import {useWindowVirtualizer} from "@tanstack/react-virtual";
import {ROW_HEIGHT} from "../CsvPreview";
import type {PreviewTableRow} from "types/previewTableTypes";
import styled from "styled-components";
import {TableFilters} from "../../components/TableFilters";
import {useFilterData} from "../../hooks/previewTable/useFilterData";
import {fadeIn} from "../../config/animations";

interface PreviewTableProps {
  rows: Array<PreviewTableRow>;
  parentRef: React.RefObject<HTMLDivElement | null>;
}

export const PreviewTable: React.FC<PreviewTableProps> = ({rows, parentRef}) => {
  const {noErrors} = useFilterData();

  const rowVirtualizer = useWindowVirtualizer({
    count: rows.length,
    estimateSize: () => ROW_HEIGHT,
    overscan: 20,
    scrollMargin: parentRef.current?.offsetTop ?? 0,
  });

  return (
    <MainContainer>
      {!noErrors && <TableFilters />}
      <TableContainer
        css={css`
          height: ${rowVirtualizer.getTotalSize() + rows.length * 5 + 20}px;
        `}
        noErrors={noErrors}
      >
        <Scrollbar
          style={{width: "100%", height: "100%"}}
          css={css`
            animation: ${fadeIn} 0.5s linear 1;
          `}
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
                    background: "pink",
                  }}
                />
              );
            },
          }}
          wrapperProps={{
            renderer: (props) => {
              const {elementRef, style, ...restProps} = props;

              return (
                <div
                  {...restProps}
                  ref={elementRef}
                  style={{
                    ...style,
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                  }}
                />
              );
            },
          }}
        >
          <div style={{display: "flex", flexDirection: "column", minWidth: "max-content"}}>
            {rowVirtualizer.getVirtualItems().map((virtualRow, idx) => {
              const row = rows[virtualRow.index];

              return (
                <RowContainer
                  key={virtualRow.index}
                  css={css`
                    height: ${virtualRow.size}px;
                    transform: translateY(${virtualRow.start - rowVirtualizer.options.scrollMargin + 20 + virtualRow.index * 5}px);
                  `}
                >
                  <TableRow
                    row={row}
                    idx={idx}
                  />
                </RowContainer>
              );
            })}
          </div>
        </Scrollbar>
      </TableContainer>
    </MainContainer>
  );
};

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-width: calc(100% - 30px);
  max-width: 100vw;
  position: relative;
  margin-bottom: 100px;
`;

const TableContainer = styled.div<{noErrors: boolean}>`
  position: relative;
  overflow: hidden;
  background: rgb(63, 124, 45);
  border-radius: 15px;
  border: 15px solid rgb(19, 151, 161);
  top: ${({noErrors}) => (noErrors ? "0px" : "54px")};
  z-index: 9999;
`;

const RowContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  min-width: 100%;
  transition: background 0.3s;
  border-radius: 10px;
  background: rgb(90, 181, 37);

  &:hover {
    background: limegreen;
  }
`;
