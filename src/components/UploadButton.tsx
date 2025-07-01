import {useGlobalStore} from "../store/global/GlobalStore";
import {useCSVReader} from "react-papaparse";
import {csvArrayToObjects} from "../utils/previewUtils";

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
          csvDataToDisplay: csvObjects,
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
