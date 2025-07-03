import styled from "styled-components";
import {useInteractionStore} from "../store/interaction/InteractionStore";
import {useGlobalStore, CURRENT_TABLE} from "../store/global/GlobalStore";
import {useValidateTable} from "../hooks/previewTable/useValidateTable";
import {isEmpty} from "lodash-es";

export const TableNavigation = () => {
  const csvData = useGlobalStore((s) => s.csvData);
  const {findDuplicates} = useValidateTable();
  const duplicates = findDuplicates(csvData);
  const duplicatedData = csvData.filter((_, index) => duplicates.includes(index));
  const noDuplicates = isEmpty(duplicates);

  return (
    <NavigationContainer>
      <button
        onClick={() => {
          useGlobalStore.setState((s) => ({
            ...s,
            csvDataToDisplay: csvData,
            currentTable: CURRENT_TABLE.Preview,
          }));
        }}
      >
        Preview table
      </button>
      {!noDuplicates && (
        <button
          onClick={() => {
            useGlobalStore.setState((s) => ({
              ...s,
              csvDataToDisplay: csvData.slice(0, 1).concat(duplicatedData),
              currentTable: CURRENT_TABLE.Duplicates,
            }));
          }}
        >
          Duplicates
        </button>
      )}
      <button
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
      </button>
    </NavigationContainer>
  );
};

const NavigationContainer = styled.div`
  display: flex;
  gap: 20px;
`;
