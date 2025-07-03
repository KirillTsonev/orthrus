import styled from "styled-components";
import {useInteractionStore} from "../store/interaction/InteractionStore";
import {useGlobalStore, CURRENT_TABLE} from "../store/global/GlobalStore";
import {useValidateTable} from "../hooks/previewTable/useValidateTable";
import {isEmpty} from "lodash-es";

export const TableNavigation = () => {
  const csvData = useGlobalStore((s) => s.csvData);
  const currentTable = useGlobalStore((s) => s.currentTable);
  const {findDuplicates} = useValidateTable();
  const duplicates = findDuplicates(csvData);
  const duplicatedData = csvData.filter((_, index) => duplicates.includes(index));
  const noDuplicates = isEmpty(duplicates);

  return (
    <NavigationContainer>
      <NavigationButtons
        isActive={currentTable === CURRENT_TABLE.Preview}
        onClick={() => {
          useGlobalStore.setState((s) => ({
            ...s,
            csvDataToDisplay: csvData,
            currentTable: CURRENT_TABLE.Preview,
          }));
        }}
      >
        Preview table
      </NavigationButtons>
      {!noDuplicates && (
        <NavigationButtons
          isActive={currentTable === CURRENT_TABLE.Duplicates}
          onClick={() => {
            useGlobalStore.setState((s) => ({
              ...s,
              csvDataToDisplay: csvData.slice(0, 1).concat(duplicatedData),
              currentTable: CURRENT_TABLE.Duplicates,
            }));
          }}
        >
          Duplicates
        </NavigationButtons>
      )}
      <NavigationButtons
        isActive={currentTable === CURRENT_TABLE.Mapping}
        onClick={() => {
          useInteractionStore.setState((s) => ({
            ...s,
            isMappingColumns: !s.isMappingColumns,
          }));
          useGlobalStore.setState((s) => ({
            ...s,
            currentTable: CURRENT_TABLE.Mapping,
          }));
        }}
      >
        Column mapping
      </NavigationButtons>
    </NavigationContainer>
  );
};

const NavigationContainer = styled.div`
  display: flex;
  gap: 20px;
  padding: 10px 0;
`;

const NavigationButtons = styled.button<{isActive: boolean}>`
  border: 10px solid rgb(11, 192, 205);
  background: ${({isActive}) => (isActive ? "rgb(11, 192, 205)" : "white")};
  padding: 20px;

  &:hover {
    background: rgb(11, 192, 205);
  }
`;
