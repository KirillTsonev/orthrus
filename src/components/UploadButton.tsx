import {useGlobalStore} from "../store/global/GlobalStore";
import {useCSVReader} from "react-papaparse";
import {csvArrayToObjects} from "../utils/previewUtils";
import styled from "styled-components";

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
          if (key === "index") acc["0"] = false;
          if (key !== "index") acc[key] = true;
          return acc;
        }, {});

        useGlobalStore.setState((s) => ({
          ...s,
          csvData: csvObjects,
          csvDataToDisplay: csvObjects,
          columnVisibility: columnVisibility,
          totalRowsNumber: csvObjects.length - 1,
        }));
      }}
    >
      {({getRootProps, acceptedFile}: CSVReaderRenderProps) => (
        <>
          <h2>Upload a CSV file</h2>
          <UploadContainer>
            <button
              type="button"
              {...getRootProps()}
            >
              Browse file
            </button>
            <div>{acceptedFile && acceptedFile.name}</div>
          </UploadContainer>
        </>
      )}
    </CSVReader>
  );
};

const UploadContainer = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  padding: 10px;
  align-items: center;
`;
