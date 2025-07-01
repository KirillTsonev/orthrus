import styled from "styled-components";
import {useGlobalStore, CURRENT_TABLE, CURRENT_FILTER} from "../store/global/GlobalStore";
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
  const currentFilter = useGlobalStore((s) => s.currentFilter);
  const {validateCell, findDuplicates} = useValidateTable();
  const duplicates = findDuplicates(csvData);

  const cleanData = csvData
    .slice(1)
    .filter((row) => Object.entries(columnToFieldId).every(([col, fieldId]) => validateCell(row[col], fieldId)));
  const errorData = csvData
    .slice(1)
    .filter((row) => Object.entries(columnToFieldId).some(([col, fieldId]) => !validateCell(row[col], fieldId)));
  const duplicatedData = csvData.filter((_, index) => duplicates.includes(index));

  const noErrors = isEmpty(errorData);
  const noDuplicates = isEmpty(duplicates);

  return (
    <FiltersContainer>
      <div style={{display: "flex", gap: "20px", justifyContent: "center"}}>
        {(!noDuplicates || !noErrors) && (
          <button
            onClick={() => {
              useGlobalStore.setState((s) => ({
                ...s,
                csvDataToDisplay: s.csvData,
                currentTable: CURRENT_TABLE.Preview,
                currentFilter: CURRENT_FILTER.All,
              }));
            }}
          >
            All rows
          </button>
        )}
        {!noErrors && (
          <>
            <button
              onClick={() => {
                useGlobalStore.setState((s) => ({
                  ...s,
                  csvDataToDisplay: csvData.slice(0, 1).concat(cleanData),
                  currentTable: CURRENT_TABLE.Preview,
                  currentFilter: CURRENT_FILTER.Clean,
                }));
              }}
            >
              Clean rows
            </button>
            <div style={{display: "flex", gap: "5px"}}>
              <button
                onClick={() => {
                  useGlobalStore.setState((s) => ({
                    ...s,
                    csvDataToDisplay: csvData.slice(0, 1).concat(errorData),
                    currentTable: CURRENT_TABLE.Preview,
                    currentFilter: CURRENT_FILTER.Problem,
                  }));
                }}
              >
                Rows with issues
              </button>
              {currentFilter === CURRENT_FILTER.Problem && (
                <button
                  onClick={() => {
                    const errorRows = errorData.map((data) => data.index);
                    const filteredData = csvData.filter((data) => !errorRows.includes(data.index));

                    useGlobalStore.setState((s) => ({
                      ...s,
                      csvData: filteredData,
                      csvDataToDisplay: filteredData,
                      currentTable: CURRENT_TABLE.Preview,
                    }));
                  }}
                >
                  Delete all rows with issues
                </button>
              )}
            </div>
          </>
        )}
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
      </div>
      <button
        disabled={!noDuplicates || !noErrors}
        style={{padding: "10px", margin: "10px 0"}}
      >
        Finish CSV upload
      </button>
    </FiltersContainer>
  );
};

const FiltersContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 10px;
`;
