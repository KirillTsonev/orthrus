import styled from "styled-components";
import {useInteractionStore} from "../../store/interaction/InteractionStore";
import {FilterButton} from "../TableFilters";
import {DeviceWidth} from "../../hooks/useGetDeviceSize";

export const TableControls = () => {
  const isSelectingHeaderRow = useInteractionStore((s) => s.isSelectingHeaderRow);
  const isDeletingColumns = useInteractionStore((s) => s.isDeletingColumns);

  return (
    <TableControlsContainer>
      <FilterButton
        onClick={() => {
          useInteractionStore.setState((s) => ({
            ...s,
            isSelectingHeaderRow: !s.isSelectingHeaderRow,
          }));
        }}
      >
        {isSelectingHeaderRow ? "Click row to select" : "Change header row"}
      </FilterButton>
      <FilterButton
        onClick={() => {
          useInteractionStore.setState((s) => ({
            ...s,
            isDeletingColumns: !s.isDeletingColumns,
          }));
        }}
      >
        {isDeletingColumns ? "Confirm deletion" : "Delete columns"}
      </FilterButton>
    </TableControlsContainer>
  );
};

const TableControlsContainer = styled.div`
  display: flex;
  gap: 10px;
  padding: 10px;
  position: relative;
  justify-content: center;

  @media screen and (min-width: ${DeviceWidth.Tablet}px) {
    width: 50%;
    margin: 0 auto;
  }

  @media screen and (min-width: ${DeviceWidth.Desktop}px) {
    position: absolute;
    right: 0;
    padding-right: 20px;
    width: auto;
    margin: unset;
  }
`;
