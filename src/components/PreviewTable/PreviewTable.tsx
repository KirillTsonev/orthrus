import {Scrollbar} from "react-scrollbars-custom";
import {css} from "@emotion/react";
import {TableRow} from "./TableRow";
import {useWindowVirtualizer} from "@tanstack/react-virtual";
import {ROW_HEIGHT} from "../CsvPreview";
import type {PreviewTableRow} from "types/previewTableTypes";
import styled from "styled-components";

interface PreviewTableProps {
  rows: Array<PreviewTableRow>;
  parentRef: React.RefObject<HTMLDivElement | null>;
}

export const PreviewTable: React.FC<PreviewTableProps> = ({rows, parentRef}) => {
  const rowVirtualizer = useWindowVirtualizer({
    count: rows.length,
    estimateSize: () => ROW_HEIGHT,
    overscan: 20,
    scrollMargin: parentRef.current?.offsetTop ?? 0,
  });

  return (
    <TableContainer
      css={css`
        height: ${rowVirtualizer.getTotalSize() + rows.length * 5 + 20}px;
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
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const row = rows[virtualRow.index];

            return (
              <RowContainer
                css={css`
                  height: ${virtualRow.size}px;
                  transform: translateY(${virtualRow.start - rowVirtualizer.options.scrollMargin + 20 + virtualRow.index * 5}px);
                `}
              >
                <TableRow row={row} />
              </RowContainer>
            );
          })}
        </div>
      </Scrollbar>
    </TableContainer>
  );
};

const TableContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 100%;
  position: relative;
  overflow: hidden;
`;

const RowContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
`;
