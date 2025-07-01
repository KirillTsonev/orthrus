import styled from "styled-components";
import {useInteractionStore} from "../store/interaction/InteractionStore";
import {useGlobalStore} from "../store/global/GlobalStore";

export const TableControls = () => {
  const isSelectingHeaderRow = useInteractionStore((s) => s.isSelectingHeaderRow);
  const isDeletingColumns = useInteractionStore((s) => s.isDeletingColumns);
  const headerRowIndex = useGlobalStore((s) => s.headerRowIndex);
  const isMappingColumns = useInteractionStore((s) => s.isMappingColumns);

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
              Change header row
            </button>
          )}
          {isSelectingHeaderRow && <div>Click on the row you want to use as header.</div>}
        </>
      )}
      <button
        onClick={() => {
          useInteractionStore.setState((s) => ({
            ...s,
            isDeletingColumns: !s.isDeletingColumns,
          }));
        }}
      >
        {isDeletingColumns ? "Confirm deletion" : "Delete columns"}
      </button>
      <button
        onClick={() => {
          useInteractionStore.setState((s) => ({
            ...s,
            isMappingColumns: !s.isMappingColumns,
          }));
          useGlobalStore.setState((s) => ({
            ...s,
            currentTable: !isMappingColumns ? "mapping" : "preview",
          }));
        }}
      >
        Map columns
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
