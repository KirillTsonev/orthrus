import styled from "styled-components";
import {useInteractionStore} from "../store/interaction/InteractionStore";

export const TableControls = () => {
  const isSelectingHeaderRow = useInteractionStore((s) => s.isSelectingHeaderRow);
  const isDeletingColumns = useInteractionStore((s) => s.isDeletingColumns);

  return (
    <TableControlsContainer>
      <button
        onClick={() => {
          useInteractionStore.setState((s) => ({
            ...s,
            isSelectingHeaderRow: !s.isSelectingHeaderRow,
          }));
        }}
      >
        {isSelectingHeaderRow ? "Click the row you want to use as header" : "Change header row"}
      </button>
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
    </TableControlsContainer>
  );
};

const TableControlsContainer = styled.div`
  display: flex;
  gap: 10px;
  padding: 10px;
`;
