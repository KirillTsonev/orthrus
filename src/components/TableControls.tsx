import styled from "styled-components";
import {useInteractionStore} from "../store/interaction/InteractionStore";
import {useGlobalStore, CURRENT_TABLE} from "../store/global/GlobalStore";

export const TableControls = () => {
  const isSelectingHeaderRow = useInteractionStore((s) => s.isSelectingHeaderRow);
  const isDeletingColumns = useInteractionStore((s) => s.isDeletingColumns);
  const isMappingColumns = useInteractionStore((s) => s.isMappingColumns);

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
      <button
        onClick={() => {
          useInteractionStore.setState((s) => ({
            ...s,
            isMappingColumns: !s.isMappingColumns,
          }));
          useGlobalStore.setState((s) => ({
            ...s,
            currentTable: !isMappingColumns ? CURRENT_TABLE.Mapping : CURRENT_TABLE.Preview,
          }));
        }}
      >
        Map columns
      </button>
    </TableControlsContainer>
  );
};

const TableControlsContainer = styled.div`
  display: flex;
  gap: 10px;
  padding: 10px;
`;
