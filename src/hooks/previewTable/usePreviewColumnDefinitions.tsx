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

      const finalWidth = maxContentWidth + 16;

      return columnHelper.accessor(col, {
        id: col,
        header: col,
        cell: (props) => props.row.original[col],
        size: finalWidth,
      });
    });
  }, [columnHelper, headerKeys, csvData]);

  return {getColumnDefinitions};
};
