import {useGlobalStore} from "../store/global/GlobalStore";
import {useCSVReader} from "react-papaparse";

export const UploadButton = () => {
  const {CSVReader} = useCSVReader();

  return (
    <CSVReader
      onUploadAccepted={(results: any) => {
        const csvObjects = csvArrayToObjects(results.data);

        useGlobalStore.setState((s) => ({
          ...s,
          csvData: csvObjects,
        }));
      }}
    >
      {({getRootProps, acceptedFile}: any) => (
        <>
          <div>
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
