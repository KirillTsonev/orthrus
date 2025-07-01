import {Scrollbar} from "react-scrollbars-custom";
import {css} from "@emotion/react";
import {TableRow} from "./TableRow";
import {useWindowVirtualizer} from "@tanstack/react-virtual";
import {ROW_HEIGHT} from "./CsvPreview";
import type {PreviewTableRow} from "types/previewTableTypes";

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
    <div
      css={css`
        display: flex;
        flex-direction: column;
        width: 100%;
        position: relative;
        height: ${rowVirtualizer.getTotalSize() + 20}px;
        overflow: hidden;
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
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const row = rows[virtualRow.index];

          return (
            <div
              css={css`
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: ${virtualRow.size}px;
                transform: translateY(${virtualRow.start - rowVirtualizer.options.scrollMargin + 20}px);
              `}
              data-index={virtualRow.index}
            >
              <TableRow row={row} />
            </div>
          );
        })}
      </Scrollbar>
    </div>
  );
};
