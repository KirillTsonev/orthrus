import {createColumnHelper} from "@tanstack/react-table";
import {useMemo} from "react";
import {useGlobalStore} from "../../store/global/GlobalStore";

const getTextWidth = (text: string, font = "14px Arial") => {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) return 0;
  context.font = font;
  return context.measureText(text).width;
};

const capitalizeWords = (str: string) => str.replace(/\b\w/g, (char) => char.toUpperCase());

export const usePreviewColumnDefinitions = () => {
  const csvData = useGlobalStore().csvData;
  const headerKeys = Object.keys(Object.assign({}, ...csvData));
  const columnHelper = createColumnHelper<any>();

  const getColumnDefinitions = useMemo(() => {
    return headerKeys.map((col) => {
      const allValues = [col, ...csvData.map((row) => row[col] ?? "")];

      const maxContentWidth = allValues.reduce((max, val) => {
        const w = getTextWidth(String(val).trim());
        return Math.max(max, w);
      }, 0);

      const finalWidth = maxContentWidth + 32;

      return columnHelper.accessor(col, {
        id: col,
        header: capitalizeWords(col),
        cell: (props) => (col.match(/email/gi) ? props.row.original[col] : capitalizeWords(String(props.row.original[col] ?? ""))),
        size: finalWidth,
      });
    });
  }, [columnHelper, headerKeys, csvData]);

  return {getColumnDefinitions};
};
