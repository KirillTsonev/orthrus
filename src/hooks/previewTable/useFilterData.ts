import {GENERIC_FIELDS_IDS} from "../../config/consts";
import {useGlobalStore} from "../../store/global/GlobalStore";
import {useValidateTable} from "../../hooks/previewTable/useValidateTable";
import {isEmpty} from "lodash-es";

export const columnToFieldId: Record<string, GENERIC_FIELDS_IDS> = {
  "First Name": GENERIC_FIELDS_IDS.FirstName,
  "last Name": GENERIC_FIELDS_IDS.LastName,
  "Job Title": GENERIC_FIELDS_IDS.JobTitle,
  Address: GENERIC_FIELDS_IDS.Address,
  Email: GENERIC_FIELDS_IDS.Email,
  Company: GENERIC_FIELDS_IDS.Company,
  "Pipeline Stage": GENERIC_FIELDS_IDS.PipelineStage,
  "Phone Number": GENERIC_FIELDS_IDS.PhoneNumber,
};

export const useFilterData = () => {
  const csvData = useGlobalStore((s) => s.csvData);
  const {validateCell, findDuplicates} = useValidateTable();
  const duplicates = findDuplicates(csvData);
  const cleanData = csvData
    .slice(1)
    .filter((row) => Object.entries(columnToFieldId).every(([col, fieldId]) => validateCell(row[col], fieldId)));
  const errorData = csvData
    .slice(1)
    .filter((row) => Object.entries(columnToFieldId).some(([col, fieldId]) => !validateCell(row[col], fieldId)));

  const noErrors = isEmpty(errorData);
  const noDuplicates = isEmpty(duplicates);

  return {cleanData, errorData, noErrors, noDuplicates};
};
