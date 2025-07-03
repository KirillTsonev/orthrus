import {css} from "@emotion/react";
import {capitalizeWords} from "../../utils/previewUtils";
import styled from "styled-components";
import {DeviceWidth} from "../../hooks/useGetDeviceSize";
import {useValidationMessages} from "../../hooks/columnMapping/useValidationMessages";
import {GENERIC_FIELDS_IDS} from "../../config/consts";
import type {MapColumnsProps} from "./MapColumns";
import {useGlobalStore} from "../../store/global/GlobalStore";

interface MappingViewProps extends MapColumnsProps {
  fieldMapping: Record<string, string>;
  handleMappingChange: (genericKey: string, selectedOrthrusKey: string) => void;
}

const REQUIRED_FIELDS = [
  GENERIC_FIELDS_IDS.FirstName,
  GENERIC_FIELDS_IDS.LastName,
  GENERIC_FIELDS_IDS.PipelineStage,
  GENERIC_FIELDS_IDS.Email,
];

export const MapColumnsDesktop: React.FC<MappingViewProps> = ({rows, fieldMapping, handleMappingChange}) => {
  const columnVisibility = useGlobalStore((s) => s.columnVisibility);
  const genericFields = Object.entries(columnVisibility).filter(([, value]) => !!value);
  const sortedOrthrus = genericFields.map(([key]) => key.toLocaleLowerCase().replace(" ", "_"));
  const {getValidationMessage} = useValidationMessages();

  const validationMessage = getValidationMessage(fieldMapping, genericFields, REQUIRED_FIELDS);

  return (
    <MapColumnsContainer
      css={css`
        display: none;

        @media screen and (min-width: ${DeviceWidth.Tablet}px) {
          display: flex;
        }
      `}
    >
      {validationMessage && <div style={{color: "#ba2525", marginBottom: "10px"}}>{validationMessage}</div>}
      <div style={{display: "flex", gap: "20px"}}>
        <MappingColumn>
          <OriginalRow
            css={css`
              text-decoration: underline;
              font-weight: bold;
            `}
          >
            Original header
          </OriginalRow>
          {genericFields.map(([key]) => {
            return <OriginalRow>{capitalizeWords(key)}</OriginalRow>;
          })}
        </MappingColumn>
        <MappingColumn>
          <OrthrusContainer
            css={css`
              text-decoration: underline;
              font-weight: bold;
            `}
          >
            Orthrus field
          </OrthrusContainer>
          {genericFields.map(([key]) => {
            return (
              <StyledSelect
                name="orthrus-column-mapping"
                id="orthrus-column-mapping"
                value={fieldMapping[key] || ""}
                onChange={(e) => handleMappingChange(key, e.target.value)}
              >
                <option value="">-- Select --</option>
                {sortedOrthrus.map((orthKey) => (
                  <option
                    key={orthKey}
                    value={orthKey}
                  >
                    {capitalizeWords(orthKey).replace("_", " ")}
                  </option>
                ))}
                <option>Ignore</option>
              </StyledSelect>
            );
          })}
        </MappingColumn>
        <MappingColumn>
          <SampleValue
            css={css`
              text-decoration: underline;
              font-weight: bold;
            `}
          >
            Sample value
          </SampleValue>
          {genericFields.map(([key]) => {
            return <SampleValue>{rows[rows.length - 1]?.original[key]}</SampleValue>;
          })}
        </MappingColumn>
      </div>
    </MapColumnsContainer>
  );
};

export const MapColumnsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 10px;
  background: rgb(121, 176, 106);
  border-radius: 15px;
  border: 5px solid rgb(19, 151, 161);
  font-size: 14px;

  @media screen and (min-width: ${DeviceWidth.Tablet}px) {
    font-size: 16px;
    padding: 20px;
    border: 10px solid rgb(19, 151, 161);
  }

  @media screen and (min-width: ${DeviceWidth.Desktop}px) {
    padding: 30px;
    border: 15px solid rgb(19, 151, 161);
  }
`;

const MappingColumn = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex-direction: column;
`;

const OriginalRow = styled.div`
  text-align: left;
  display: flex;
  align-items: center;
  height: 25px;
  width: 105px;

  @media screen and (min-width: ${DeviceWidth.Desktop}px) {
    min-width: 120px;
  }
`;

const OrthrusContainer = styled.div`
  width: 105px;
  height: 25px;
  display: flex;
  align-items: center;

  @media screen and (min-width: ${DeviceWidth.Desktop}px) {
    min-width: 125px;
  }
`;

const SampleValue = styled.div`
  width: 130px;
  text-align: left;
  height: 25px;
  line-height: 25px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;

  @media screen and (min-width: ${DeviceWidth.Tablet}px) {
    width: 400px;
  }

  @media screen and (min-width: ${DeviceWidth.Desktop}px) {
    min-width: 430px;
  }
`;

export const StyledSelect = styled.select`
  width: 105px;
  height: 25px;
  background: rgb(11, 192, 205);
  border: none;
  padding: 0 10px;
  border-radius: 7px;
  cursor: pointer;

  @media screen and (min-width: ${DeviceWidth.Desktop}px) {
    min-width: 125px;
  }
`;
