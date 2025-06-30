import {createColumnHelper} from "@tanstack/react-table";
import {useMemo} from "react";
import {useGlobalStore} from "../../store/global/GlobalStore";

export const usePreviewColumnDefinitions = () => {
  const csvData = useGlobalStore().csvData;
  const headerKeys = Object.keys(Object.assign({}, ...csvData));
  const columnHelper = createColumnHelper();

  const getColumnDefinitions = useMemo(() => {
    return headerKeys.map((col) =>
      columnHelper.accessor(col, {
        id: col,
        header: col,
        cell: (props) => props.row.original[col],
        size: col.match(/name/gi) ? 80 : 200,
      })
    );
  }, [columnHelper, headerKeys]);

  return {getColumnDefinitions};
};
