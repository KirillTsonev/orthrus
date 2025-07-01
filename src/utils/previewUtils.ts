export const capitalizeWords = (str: string) => str.replace(/\b\w/g, (char) => char.toUpperCase());

export const getTextWidth = (text: string, font = "16px Labil Grotesk") => {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) return 0;
  context.font = font;
  return context.measureText(text).width;
};

export const csvArrayToObjects = (data: Array<Array<string>>, headerRowIndex = 0): Array<Record<string, string | number>> => {
  if (!data.length || data.length <= headerRowIndex) return [];

  const headers = data[headerRowIndex].map((h) => capitalizeWords(h.trim().replace(/\s+/g, " ")));

  const transformedData = data.map((row, i) => {
    const obj: Record<string, string | number> = {index: i};

    headers.forEach((header, i) => {
      const editedHeader = capitalizeWords(header.replace(/\s+/g, " "));
      obj[editedHeader] = capitalizeWords((row[i] ?? "").trim().replace(/\s+/g, " "));
    });

    return obj;
  });

  return transformedData;
};

export const findHeaderRowIndex = (data: Array<Record<string, string | number>>): number => {
  let maxUnique = 0;
  let headerIdx = 0;

  data.forEach((row, idx) => {
    const uniqueCount = new Set(Object.values(row)).size;
    if (uniqueCount > maxUnique) {
      maxUnique = uniqueCount;
      headerIdx = idx;
    }
  });

  return headerIdx;
};
