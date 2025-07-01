import styled from "styled-components";
import {useGlobalStore} from "../store/global/GlobalStore";
import {useValidateTable} from "../hooks/previewTable/useValidateTable";
import {GENERIC_FIELDS_IDS} from "../config/consts";
import {isEmpty} from "lodash-es";

const columnToFieldId: Record<string, GENERIC_FIELDS_IDS> = {
  "First Name": GENERIC_FIELDS_IDS.FirstName,
  "last Name": GENERIC_FIELDS_IDS.LastName,
  "Job  Title": GENERIC_FIELDS_IDS.JobTitle,
  Address: GENERIC_FIELDS_IDS.Address,
  Email: GENERIC_FIELDS_IDS.Email,
  Company: GENERIC_FIELDS_IDS.Company,
  "Pipeline Stage": GENERIC_FIELDS_IDS.PipelineStage,
  "Phone Number": GENERIC_FIELDS_IDS.PhoneNumber,
};

export const TableFilters = () => {
  const csvData = useGlobalStore((s) => s.csvData);
  const {validateCell, findDuplicates} = useValidateTable();
  const duplicates = findDuplicates(csvData);
  const areThereDuplicates = !isEmpty(duplicates);

  const cleanData = csvData
    .slice(1)
    .filter((row) => Object.entries(columnToFieldId).every(([col, fieldId]) => validateCell(row[col], fieldId)));
  const errorData = csvData
    .slice(1)
    .filter((row) => Object.entries(columnToFieldId).some(([col, fieldId]) => !validateCell(row[col], fieldId)));
  const duplicatedData = csvData.filter((_, index) => duplicates.includes(index));

  return (
    <FiltersContainer>
      <button
        onClick={() => {
          useGlobalStore.setState((s) => ({
            ...s,
            csvDataToDisplay: s.csvData,
            currentTable: "preview",
          }));
        }}
      >
        All rows
      </button>
      <button
        onClick={() => {
          useGlobalStore.setState((s) => ({
            ...s,
            csvDataToDisplay: csvData.slice(0, 1).concat(cleanData),
            currentTable: "preview",
          }));
        }}
      >
        Clean rows
      </button>
      <button
        onClick={() => {
          useGlobalStore.setState((s) => ({
            ...s,
            csvDataToDisplay: csvData.slice(0, 1).concat(errorData),
            currentTable: "preview",
          }));
        }}
      >
        Rows with issues
      </button>
      {areThereDuplicates && (
        <button
          onClick={() => {
            useGlobalStore.setState((s) => ({
              ...s,
              csvDataToDisplay: csvData.slice(0, 1).concat(duplicatedData),
              currentTable: "duplicates",
            }));
          }}
        >
          Duplicates
        </button>
      )}
    </FiltersContainer>
  );
};

const FiltersContainer = styled.div`
  display: flex;
  gap: 10px;
`;
