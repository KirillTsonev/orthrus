import {GENERIC_FIELDS_IDS, PIPELINE_STAGES} from "../../config/consts";
import {capitalizeWords} from "../../utils/previewUtils";

export const useValidateTable = () => {
  const pipeLineStages = Object.values(PIPELINE_STAGES);

  const validateCell = (cellContent: string, cellId: GENERIC_FIELDS_IDS): boolean => {
    if (cellId === GENERIC_FIELDS_IDS.FirstName || cellId === GENERIC_FIELDS_IDS.LastName) {
      if (cellContent.trim() === "") return false;
    }

    if (cellId === GENERIC_FIELDS_IDS.Email) {
      if (cellContent.trim() === "") return false;
    }

    if (cellId === GENERIC_FIELDS_IDS.PipelineStage) {
      if (!pipeLineStages.includes(capitalizeWords(cellContent) as PIPELINE_STAGES)) return false;
    }

    if (cellId === GENERIC_FIELDS_IDS.PhoneNumber) {
      const phoneRegex = /^\+?[1-9]\d{1,14}$/;

      if (!phoneRegex.test(cellContent.trim())) return false;
    }

    return true;
  };

  return {validateCell};
};
