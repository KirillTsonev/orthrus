import styled from "styled-components";
import {useGlobalStore} from "../../store/global/GlobalStore";
import {GENERIC_FIELDS_IDS} from "../../config/consts";
import {capitalizeWords} from "../../utils/previewUtils";
import {useValidationMessages} from "../../hooks/columnMapping/useValidationMessages";
import {MapColumnsContainer} from "./MapColumnsDesktop";
import {css} from "@emotion/react";
import type {MapColumnsProps} from "./MapColumns";
import {DeviceWidth} from "../../hooks/useGetDeviceSize";
import {StyledSelect} from "./MapColumnsDesktop";

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

export const MapColumnsMobile: React.FC<MappingViewProps> = ({rows, fieldMapping, handleMappingChange}) => {
  const columnVisibility = useGlobalStore((s) => s.columnVisibility);
  const genericFields = Object.entries(columnVisibility).filter(([, value]) => !!value);
  const sortedOrthrus = genericFields.map(([key]) => key.toLocaleLowerCase().replace(" ", "_"));
  const {getValidationMessage} = useValidationMessages();

  const validationMessage = getValidationMessage(fieldMapping, genericFields, REQUIRED_FIELDS);

  return (
    <MapColumnsContainer
      css={css`
        gap: 30px;
        width: 330px;

        @media screen and (min-width: ${DeviceWidth.Tablet}px) {
          display: none;
        }
      `}
    >
      {validationMessage && <div style={{color: "red", marginBottom: "10px"}}>{validationMessage}</div>}
      {genericFields.map(([key]) => {
        return (
          <MappingRow key={key}>
            <MappingSubrow>
              <RowHeading>Original header</RowHeading>
              <div style={{lineHeight: "25px"}}>{capitalizeWords(key)}</div>
            </MappingSubrow>

            <MappingSubrow>
              <RowHeading>Orthrus field</RowHeading>
              <StyledSelect
                name="orthrus-column-mapping"
                id="orthrus-column-mapping"
                value={fieldMapping[key] || ""}
                onChange={(e) => handleMappingChange(key, e.target.value)}
                css={css`
                  width: 50%;
                `}
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
            </MappingSubrow>

            <MappingSubrow>
              <RowHeading>Sample value</RowHeading>
              <SampleContainer>{rows[rows.length - 1]?.original[key]}</SampleContainer>
            </MappingSubrow>
          </MappingRow>
        );
      })}
    </MapColumnsContainer>
  );
};

const MappingRow = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  flex-direction: column;
  gap: 10px;
`;

const MappingSubrow = styled.div`
  display: flex;
  justify-content: space-between;
  height: 25px;
`;

const RowHeading = styled.div`
  text-decoration: underline;
  font-weight: bold;
  line-height: 25px;
`;

const SampleContainer = styled.div`
  text-align: right;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 220px;
  white-space: nowrap;
  line-height: 25px;
`;
