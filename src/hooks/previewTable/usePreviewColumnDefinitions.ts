import {createColumnHelper} from "@tanstack/react-table";
import {useMemo} from "react";
import {useGlobalStore} from "../../store/global/GlobalStore";
import {capitalizeWords, getTextWidth, findHeaderRowIndex} from "../../utils/previewUtils";

export const usePreviewColumnDefinitions = () => {
  const csvData = useGlobalStore((s) => s.csvData);
  const headerRowIndex = useMemo(() => findHeaderRowIndex(csvData), [csvData]);
  const headerRow = csvData[headerRowIndex] || {};
  const headerKeys = Object.values(headerRow).map(String);
  const columnHelper = createColumnHelper<Record<string, string | number>>();

  const getColumnDefinitions = useMemo(() => {
    return headerKeys.map((col) => {
      const allValues = [col, ...csvData.map((row) => row[col] ?? "")];

      const maxContentWidth = allValues.reduce<number>((max, val) => {
        const w = getTextWidth(String(val).trim());
        return Math.max(max, w);
      }, 0);

      const finalWidth = maxContentWidth + 40;

      return columnHelper.accessor(col, {
        id: capitalizeWords(col).replace(/\s+/g, " "),
        header: capitalizeWords(col).replace(/\s+/g, " "),
        cell: (props) => (col.match(/email/gi) ? props.row.original[col] : capitalizeWords(String(props.row.original[col] ?? ""))),
        size: col === "0" ? 0 : finalWidth,
      });
    });
  }, [columnHelper, headerKeys, csvData]);

  return {getColumnDefinitions};
};
