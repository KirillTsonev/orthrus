import {useGroupDuplicates} from "../../hooks/duplicateTable/useGroupDuplicates";
import styled from "styled-components";
import type {PreviewTableRow} from "types/previewTableTypes";
import {Scrollbar} from "react-scrollbars-custom";
import {DuplicatesRow} from "./DuplicatesRow";
import {useEffect} from "react";
import {useGlobalStore, CURRENT_TABLE} from "../../store/global/GlobalStore";
import {css} from "@emotion/react";
import {fadeIn} from "../../config/animations";

interface DuplicatesTableProps {
  rows: Array<PreviewTableRow>;
  parentRef: React.RefObject<HTMLDivElement | null>;
}

export const DuplicatesTable: React.FC<DuplicatesTableProps> = ({rows, parentRef}) => {
  const {groupDuplicates} = useGroupDuplicates();
  const groupedDuplicates = groupDuplicates(rows);

  useEffect(() => {
    if (groupedDuplicates.length === 0) useGlobalStore.setState((s) => ({...s, currentTable: CURRENT_TABLE.Preview}));
  }, [groupedDuplicates]);

  return (
    <DuplicatesContainer
      css={css`
        height: ${groupedDuplicates.length * DUPLICATE_ROW_HEIGHT + HEADER_ROW_HEIGHT}px;
      `}
    >
      <Scrollbar
        style={{height: "100%", width: "100%"}}
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
      >
        <div style={{display: "flex", flexDirection: "column", minWidth: "max-content"}}>
          {groupedDuplicates.map((group, i) => {
            return (
              <DuplicatesRow
                group={group}
                parentRef={parentRef}
                rows={rows}
                isFirstGroup={i === 0}
                key={group[0].original.index}
              />
            );
          })}
        </div>
      </Scrollbar>
    </DuplicatesContainer>
  );
};

const DUPLICATE_ROW_HEIGHT = 154;
const HEADER_ROW_HEIGHT = 90;

const DuplicatesContainer = styled.div`
  display: flex;
  position: relative;
  min-width: calc(100% - 30px);
  background: rgb(121, 176, 106);
  border-radius: 15px;
  border: 15px solid rgb(19, 151, 161);
`;
