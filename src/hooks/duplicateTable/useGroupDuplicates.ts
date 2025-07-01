import type {PreviewTableRow} from "types/previewTableTypes";

export const useGroupDuplicates = () => {
  const groupDuplicates = (rows: Array<PreviewTableRow>): Array<Array<PreviewTableRow>> => {
    const groups: Record<string, Array<PreviewTableRow>> = {};

    rows.forEach((row) => {
      const original = row.original;
      const email = (original["Email"] || "").toLowerCase().trim();
      const firstName = (original["First Name"] || "").toLowerCase().trim();
      const lastName = (original["last Name"] || "").toLowerCase().trim();
      const company = (original["Company"] || "").toLowerCase().trim();

      let key = "";
      if (email) {
        key = `email:${email}`;
      }
      if (firstName && lastName && company) {
        key = `trio:${firstName}|${lastName}|${company}`;
      }

      if (!groups[key]) groups[key] = [];
      groups[key].push(row);
    });

    return Object.values(groups).filter((group) => group.length > 1);
  };

  return {groupDuplicates};
};
