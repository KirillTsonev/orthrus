import {GENERIC_FIELDS_IDS, PIPELINE_STAGES} from "../../config/consts";
import {capitalizeWords} from "../../utils/previewUtils";

export const useValidateTable = () => {
  const pipeLineStages = Object.values(PIPELINE_STAGES);

  const validateCell = (cellContent: string | number, cellId: GENERIC_FIELDS_IDS): boolean => {
    if (cellId === GENERIC_FIELDS_IDS.FirstName || cellId === GENERIC_FIELDS_IDS.LastName) {
      if ((cellContent as string).trim() === "") return false;
    }

    if (cellId === GENERIC_FIELDS_IDS.Email) {
      if ((cellContent as string).trim() === "") return false;
    }

    if (cellId === GENERIC_FIELDS_IDS.PipelineStage) {
      if (!pipeLineStages.includes(capitalizeWords(cellContent as string) as PIPELINE_STAGES)) return false;
    }

    if (cellId === GENERIC_FIELDS_IDS.PhoneNumber) {
      const phoneRegex = /^\+?[1-9]\d{1,14}$/;

      if (!phoneRegex.test((cellContent as string).trim())) return false;
    }

    return true;
  };

  const findDuplicates = (rows: Array<Record<string, string | number>>): Array<number> => {
    const emailMap = new Map<string, Array<number>>();
    const trioMap = new Map<string, Array<number>>();

    rows.forEach((row, idx) => {
      const email = ((row["Email"] as string) || "").toLowerCase().trim();
      const firstName = ((row["First Name"] as string) || "").toLowerCase().trim();
      const lastName = ((row["last Name"] as string) || "").toLowerCase().trim();
      const company = ((row["Company"] as string) || "").toLowerCase().trim();

      if (email) {
        if (!emailMap.has(email)) emailMap.set(email, []);
        emailMap.get(email)!.push(idx);
      }

      if (firstName && lastName && company) {
        const trioKey = `${firstName}|${lastName}|${company}`;
        if (!trioMap.has(trioKey)) trioMap.set(trioKey, []);
        trioMap.get(trioKey)!.push(idx);
      }
    });

    const duplicateIndices = new Set<number>();

    Array.from(emailMap.values()).forEach((indices) => {
      if (indices.length > 1) indices.forEach((i) => duplicateIndices.add(i));
    });

    Array.from(trioMap.values()).forEach((indices) => {
      if (indices.length > 1) indices.forEach((i) => duplicateIndices.add(i));
    });

    return Array.from(duplicateIndices);
  };

  return {validateCell, findDuplicates};
};
