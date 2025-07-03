import styled from "styled-components";
import {useGlobalStore, CURRENT_TABLE, CURRENT_FILTER} from "../store/global/GlobalStore";
import {css} from "@emotion/react";
import {useFilterData} from "../hooks/previewTable/useFilterData";
import {slideUp, fadeIn} from "../config/animations";
import {DeviceWidth} from "../hooks/useGetDeviceSize";

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
      <div
        css={css`
          display: flex;
          justify-content: space-between;
          padding: 10px 20px;

          @media screen and (min-width: ${DeviceWidth.Tablet}px) {
            padding: 0;
          }
        `}
      >
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
              @media screen and (min-width: ${DeviceWidth.Tablet}px) {
                z-index: 10;
                transform: translateY(${currentFilter === CURRENT_FILTER.All ? -10 : 0}px);
              }
            `}
          >
            All rows
          </FilterButton>
        )}
        {!noErrors && (
          <>
            <FilterButton
              css={css`
                @media screen and (min-width: ${DeviceWidth.Tablet}px) {
                  position: relative;
                  left: -10px;
                  top: 2px;
                  z-index: 9;
                  transform: translateY(${currentFilter === CURRENT_FILTER.Clean ? -10 : 0}px);
                }
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
            <div
              style={{display: "flex", gap: "5px"}}
              css={css`
                display: flex;
                gap: 5px;
                flex-direction: column;

                @media screen and (min-width: ${DeviceWidth.Tablet}px) {
                  flex-direction: row;
                }
              `}
            >
              <FilterButton
                css={css`
                  @media screen and (min-width: ${DeviceWidth.Tablet}px) {
                    position: relative;
                    left: -20px;
                    top: 4px;
                    z-index: 5;
                    transform: translateY(${currentFilter === CURRENT_FILTER.Problem ? -10 : 0}px);
                  }
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
  background: white;
  position: relative;

  @media screen and (min-width: ${DeviceWidth.Tablet}px) {
    position: absolute;
    top: 0px;
    padding: 10px 10px 0 40px;
  }
`;

export const FilterButton = styled.div`
  padding: 10px 20px;
  border: 5px solid rgb(19, 151, 161);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s;
  background: white;

  @media screen and (min-width: ${DeviceWidth.Tablet}px) {
    height: 50px;
    border-top: 5px solid rgb(19, 151, 161);
    border-right: 5px solid rgb(19, 151, 161);
    border-left: 5px solid rgb(19, 151, 161);
    border-radius: 10px 10px 0 0;

    &:hover {
      transform: translateY(-10px);
    }
  }
`;
