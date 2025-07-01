import styled from "styled-components";
import {useGlobalStore} from "../store/global/GlobalStore";
import {ORTHRUS_FIELDS_IDS} from "../config/consts";
import {capitalizeWords} from "../utils/previewUtils";
import type {PreviewTableRow} from "../types/previewTableTypes";

interface MapColumnsProps {
  rows: Array<PreviewTableRow>;
}

export const MapColumns: React.FC<MapColumnsProps> = ({rows}) => {
  const columnVisibility = useGlobalStore((s) => s.columnVisibility);
  const genericFields = Object.entries(columnVisibility).filter(([, value]) => !!value);
  const orthrusFields = Object.values(ORTHRUS_FIELDS_IDS);

  return (
    <MapColumnsContainer>
      <div style={{display: "flex", gap: "10px"}}>
        <div style={{minWidth: "120px", textAlign: "left"}}>Original header</div>
        <div style={{minWidth: "125px"}}>Orthrus field</div>
        <div style={{minWidth: "500px", textAlign: "left"}}>Sample value</div>
      </div>
      {genericFields.map(([key]) => {
        const fieldId = key.toLowerCase().replace(" ", "_");
        const isOrthrusField = orthrusFields.includes(fieldId as ORTHRUS_FIELDS_IDS);

        return (
          <MappingRow key={key}>
            <div style={{minWidth: "120px", textAlign: "left"}}>{capitalizeWords(key)}</div>
            <select
              name="orthrus-column-mapping"
              id="orthrus-column-mapping"
              style={{
                minWidth: "125px",
                pointerEvents: isOrthrusField ? "auto" : "none",
                filter: isOrthrusField ? undefined : "brightness(0.7)",
              }}
              defaultValue={isOrthrusField ? fieldId : "Ignore"}
            >
              {isOrthrusField &&
                genericFields.map(([field]) => <option key={field}>{capitalizeWords(field.replace("_", " "))}</option>)}
              <option>Ignore</option>
            </select>
            <div style={{minWidth: "500px", textAlign: "left"}}>{rows[rows.length - 1]?.original[key]}</div>
          </MappingRow>
        );
      })}
    </MapColumnsContainer>
  );
};

const MapColumnsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 20px 0;
`;

const MappingRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`;
