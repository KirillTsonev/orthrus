import {UploadButton} from "./components/UploadButton";
import {CsvPreviewTable} from "./components/CsvPreviewTable";

export const App = () => {
  return (
    <div style={{minWidth: "1280px", height: "100vh"}}>
      <UploadButton />
      <CsvPreviewTable />
    </div>
  );
};
