import type {DataRowType} from "types/duplicateTableTypes";

export const useGroupDuplicates = () => {
  const groupDuplicates = (rows: DataRowType): Array<DataRowType> => {
    const groups: Record<string, DataRowType> = {};
    let headerRow: Record<string, string> | null = null;

    rows.forEach((row) => {
      const isHeader = Object.entries(row).every(([key, value]) => key.trim().toLowerCase() === String(value).trim().toLowerCase());
      if (isHeader) {
        headerRow = row;
        return;
      }

      const email = (row["Email"] || "").toLowerCase().trim();
      const firstName = (row["First Name"] || "").toLowerCase().trim();
      const lastName = (row["last Name"] || "").toLowerCase().trim();
      const company = (row["Company"] || "").toLowerCase().trim();

      let key = "";
      if (email) key = `email:${email}`;
      if (firstName && lastName && company) key = `trio:${firstName}|${lastName}|${company}`;

      if (!groups[key]) groups[key] = [];

      groups[key].push(row);
    });

    const duplicateGroups = Object.values(groups).filter((group) => group.length > 1);

    if (headerRow) duplicateGroups.unshift([headerRow]);

    return duplicateGroups;
  };

  return {groupDuplicates};
};
