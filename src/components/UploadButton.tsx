import {useGlobalStore} from "../store/global/GlobalStore";
import {useCSVReader} from "react-papaparse";

type ParseResults = {
  data: Array<Array<string>>;
};

type CSVReaderRenderProps = {
  getRootProps: (props?: object) => object;
  acceptedFile?: File;
};

export const UploadButton = () => {
  const {CSVReader} = useCSVReader();

  return (
    <CSVReader
      onUploadAccepted={(results: ParseResults) => {
        const csvObjects = csvArrayToObjects(results.data);
        const columnVisibility = Object.keys(csvObjects[0] || {}).reduce<Record<string, boolean>>((acc, key) => {
          acc[key] = true;
          return acc;
        }, {});

        useGlobalStore.setState((s) => ({
          ...s,
          csvData: csvObjects,
          columnVisibility: columnVisibility,
        }));
      }}
    >
      {({getRootProps, acceptedFile}: CSVReaderRenderProps) => (
        <>
          <div style={{display: "flex", gap: "10px", justifyContent: "center", padding: "20px"}}>
            <button
              type="button"
              {...getRootProps()}
            >
              Browse file
            </button>
            <div>{acceptedFile && acceptedFile.name}</div>
          </div>
        </>
      )}
    </CSVReader>
  );
};

function csvArrayToObjects(data: string[][], headerRowIndex = 0): Record<string, string>[] {
  if (!data.length || data.length <= headerRowIndex) return [];

  const headers = data[headerRowIndex].map((h) => h.trim());

  return data.map((row) => {
    const obj: Record<string, string> = {};

    headers.forEach((header, i) => {
      obj[header] = (row[i] ?? "").trim();
    });

    return obj;
  });
}
