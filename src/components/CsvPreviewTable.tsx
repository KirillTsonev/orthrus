import {useGlobalStore} from "../store/global/GlobalStore";
import {getCoreRowModel, useReactTable} from "@tanstack/react-table";

export const CsvPreviewTable = () => {
  const csvData = useGlobalStore()?.csvData;

  const headerKeys = Object.keys(Object.assign({}, ...csvData));

  const table = useReactTable({
    data: csvData,
    columns: headerKeys.map((key) => ({
      accessorKey: key,
      header: key,
    })),
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <button>Change header row</button>
      <table>
        <tbody>
          <tr>
            {headerKeys.map((key) => (
              <td>{key}</td>
            ))}
          </tr>
          {csvData.map((item) => (
            <tr key={item.id}>
              {Object.values(item).map((val) => (
                <td>{val}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};
