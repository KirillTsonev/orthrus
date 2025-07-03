import styled from "styled-components";
import {useGlobalStore, CURRENT_TABLE, CURRENT_FILTER} from "../store/global/GlobalStore";
import {css} from "@emotion/react";
import {useFilterData} from "../hooks/previewTable/useFilterData";
import {slideUp, fadeIn} from "../config/animations";

export const TableFilters = () => {
  const currentFilter = useGlobalStore((s) => s.currentFilter);
  const csvData = useGlobalStore((s) => s.csvData);
  const {cleanData, errorData, noErrors, noDuplicates} = useFilterData();

  return (
    <FiltersContainer
      css={css`
        animation: ${fadeIn} 0.5s linear 1;
      `}
    >
      <div style={{display: "flex"}}>
        {(!noDuplicates || !noErrors) && (
          <FilterButton
            onClick={() => {
              useGlobalStore.setState((s) => ({
                ...s,
                csvDataToDisplay: s.csvData,
                currentTable: CURRENT_TABLE.Preview,
                currentFilter: CURRENT_FILTER.All,
              }));
            }}
            css={css`
              z-index: 10;
              transform: translateY(${currentFilter === CURRENT_FILTER.All ? -10 : 0}px);
            `}
          >
            All rows
          </FilterButton>
        )}
        {!noErrors && (
          <>
            <FilterButton
              css={css`
                position: relative;
                left: -10px;
                top: 2px;
                z-index: 9;
                transform: translateY(${currentFilter === CURRENT_FILTER.Clean ? -10 : 0}px);
              `}
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
            </FilterButton>
            <div style={{display: "flex", gap: "5px"}}>
              <FilterButton
                css={css`
                  position: relative;
                  left: -20px;
                  top: 4px;
                  z-index: 5;
                  transform: translateY(${currentFilter === CURRENT_FILTER.Problem ? -10 : 0}px);
                `}
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
              </FilterButton>
              {currentFilter === CURRENT_FILTER.Problem && (
                <FilterButton
                  css={css`
                    animation: ${slideUp} 0.1s linear 1;
                  `}
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
                </FilterButton>
              )}
            </div>
          </>
        )}
      </div>
    </FiltersContainer>
  );
};

const FiltersContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 10px 10px 0 40px;
  background: white;
  position: absolute;
  top: 0px;
`;

export const FilterButton = styled.div`
  padding: 10px 20px;
  border-top: 5px solid rgb(19, 151, 161);
  border-right: 5px solid rgb(19, 151, 161);
  border-left: 5px solid rgb(19, 151, 161);
  border-radius: 10px 10px 0 0;
  cursor: pointer;
  transition: all 0.3s;
  background: white;
  height: 50px;

  &:hover {
    transform: translateY(-10px);
  }
`;
