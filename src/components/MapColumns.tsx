import styled from "styled-components";
import {useGlobalStore} from "../store/global/GlobalStore";
import {GENERIC_FIELDS_IDS, ORTHRUS_FIELDS_IDS} from "../config/consts";
import {capitalizeWords} from "../utils/previewUtils";
import type {PreviewTableRow} from "../types/previewTableTypes";
import {useState, useEffect} from "react";
import {useInteractionStore} from "../store/interaction/InteractionStore";
import {useValidationMessages} from "../hooks/columnMapping/useValidationMessages";
import {css} from "@emotion/react";

interface MapColumnsProps {
  rows: Array<PreviewTableRow>;
}

const REQUIRED_FIELDS = [
  GENERIC_FIELDS_IDS.FirstName,
  GENERIC_FIELDS_IDS.LastName,
  GENERIC_FIELDS_IDS.PipelineStage,
  GENERIC_FIELDS_IDS.Email,
];

export const MapColumns: React.FC<MapColumnsProps> = ({rows}) => {
  const columnVisibility = useGlobalStore((s) => s.columnVisibility);
  const globalFieldMapping = useGlobalStore((s) => s.globalFieldMapping);
  const csvData = useGlobalStore((s) => s.csvData);
  const genericFields = Object.entries(columnVisibility).filter(([, value]) => !!value);
  const sortedOrthrus = genericFields.map(([key]) => key.toLocaleLowerCase().replace(" ", "_"));

  const {getValidationMessage} = useValidationMessages();

  const [fieldMapping, setFieldMapping] = useState<Record<string, string>>(
    globalFieldMapping && Object.keys(globalFieldMapping).length > 0
      ? globalFieldMapping
      : Object.fromEntries(genericFields.map(([key]) => [key, key]))
  );

  const handleMappingChange = (genericKey: string, selectedOrthrusKey: string) => {
    setFieldMapping((prev) => ({
      ...prev,
      [genericKey]: selectedOrthrusKey,
    }));
  };

  useEffect(() => {
    useGlobalStore.setState((s) => ({
      ...s,
      globalFieldMapping: fieldMapping,
    }));
  }, [fieldMapping]);

  const editedData = csvData.map((row) =>
    Object.fromEntries(
      Object.entries(row)
        .filter(([key]) => key !== GENERIC_FIELDS_IDS.Address && key !== GENERIC_FIELDS_IDS.JobTitle)
        .map(([key, value]) => {
          const mappedKey =
            fieldMapping[key] && fieldMapping[key] !== "Ignore"
              ? ORTHRUS_FIELDS_IDS[fieldMapping[key] as keyof typeof ORTHRUS_FIELDS_IDS] || fieldMapping[key]
              : key;
          return [mappedKey, value];
        })
    )
  );

  // unused for now
  console.log(editedData);

  const mappedValues = Object.values(fieldMapping).filter((v) => v !== "Ignore");
  const uniqueMappedValues = new Set(mappedValues);

  const allGenericKeysChanged =
    genericFields.filter(([key]) => fieldMapping[key] !== "Ignore").every(([key]) => fieldMapping[key] && fieldMapping[key] !== key) &&
    uniqueMappedValues.size === mappedValues.length;

  const allRequiredFieldsMapped = REQUIRED_FIELDS.every(
    (reqKey) => fieldMapping[reqKey] && fieldMapping[reqKey] !== reqKey && fieldMapping[reqKey] !== "Ignore"
  );

  const allKeysChanged = allGenericKeysChanged && allRequiredFieldsMapped;

  const validationMessage = getValidationMessage(fieldMapping, genericFields, REQUIRED_FIELDS);

  useEffect(() => {
    if (allKeysChanged) {
      useInteractionStore.setState((s) => ({
        ...s,
        isMappingDone: true,
      }));
    } else {
      useInteractionStore.setState((s) => ({
        ...s,
        isMappingDone: false,
      }));
    }
  }, [allKeysChanged]);

  return (
    <MapColumnsContainer>
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

const MapColumnsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 30px;
  background: rgb(121, 176, 106);
  border-radius: 15px;
`;

const MappingColumn = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex-direction: column;
`;

const OriginalRow = styled.div`
  min-width: 120px;
  text-align: left;
  display: flex;
  align-items: center;
  height: 25px;
`;

const OrthrusContainer = styled.div`
  min-width: 125px;
  height: 25px;
  display: flex;
  align-items: center;
`;

const SampleValue = styled.div`
  min-width: 430px;
  text-align: left;
  height: 25px;
  display: flex;
  align-items: center;
`;

const StyledSelect = styled.select`
  min-width: 125px;
  height: 25px;
  background: limegreen;
  border: none;
  padding: 0 10px;
  border-radius: 7px;
  cursor: pointer;
`;
