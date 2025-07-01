export const useValidationMessages = () => {
  const getValidationMessage = (
    fieldMapping: Record<string, string>,
    genericFields: Array<[string, boolean]>,
    requiredFields: string[]
  ) => {
    const mappedValues = Object.values(fieldMapping).filter((v) => v !== "Ignore");
    const uniqueMappedValues = new Set(mappedValues);

    const allRequiredFieldsMapped = requiredFields.every(
      (reqKey) => fieldMapping[reqKey] && fieldMapping[reqKey] !== reqKey && fieldMapping[reqKey] !== "Ignore"
    );

    if (!allRequiredFieldsMapped) {
      return "All required fields (first name, last name, pipeline stage, email) must be mapped and cannot be ignored.";
    }
    if (uniqueMappedValues.size !== mappedValues.length) {
      return "Each Orthrus field can only be mapped once.";
    }
    if (
      genericFields.filter(([key]) => fieldMapping[key] !== "Ignore").some(([key]) => !fieldMapping[key] || fieldMapping[key] === key)
    ) {
      return "All non-ignored fields must be mapped to a different Orthrus field or ignored.";
    }
    return "";
  };

  return {getValidationMessage};
};
