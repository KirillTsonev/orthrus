import styled from "styled-components";
import {useInteractionStore} from "../store/interaction/InteractionStore";
import {useGlobalStore} from "../store/global/GlobalStore";

export const TableControls = () => {
  const isSelectingHeaderRow = useInteractionStore((s) => s.isSelectingHeaderRow);
  const headerRowIndex = useGlobalStore((s) => s.headerRowIndex);

  return (
    <TableControlsContainer>
      {headerRowIndex === undefined && (
        <>
          {!isSelectingHeaderRow && (
            <button
              onClick={() => {
                useInteractionStore.setState((s) => ({
                  ...s,
                  isSelectingHeaderRow: true,
                }));
              }}
            >
              Select header row
            </button>
          )}
          {isSelectingHeaderRow && <div>Click on the row you want to use as header.</div>}
        </>
      )}
      <button
        onClick={() => {
          useInteractionStore.setState((s) => ({
            ...s,
            isDeletingColumns: true,
          }));
        }}
      >
        Delete columns?
      </button>
      <button>Reset</button>
    </TableControlsContainer>
  );
};

const TableControlsContainer = styled.div`
  display: flex;
  gap: 10px;
  padding: 10px;
`;
