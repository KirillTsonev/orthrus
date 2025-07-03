import {useGlobalStore} from "../../store/global/GlobalStore";
import {GENERIC_FIELDS_IDS, ORTHRUS_FIELDS_IDS} from "../../config/consts";
import type {PreviewTableRow} from "../../types/previewTableTypes";
import {useState, useEffect} from "react";
import {useInteractionStore} from "../../store/interaction/InteractionStore";
import {MapColumnsMobile} from "./MapColumnsMobile";
import {MapColumnsDesktop} from "./MapColumnsDesktop";

export interface MapColumnsProps {
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
    <>
      <MapColumnsDesktop
        rows={rows}
        fieldMapping={fieldMapping}
        handleMappingChange={handleMappingChange}
      />
      <MapColumnsMobile
        rows={rows}
        fieldMapping={fieldMapping}
        handleMappingChange={handleMappingChange}
      />
    </>
  );
};
