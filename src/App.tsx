import {UploadButton} from "./components/UploadButton";
import {CsvPreviewTable} from "./components/CsvPreviewTable";

export const App = () => {
  return (
    <div style={{minWidth: "1280px", minHeight: "100vh", marginBottom: "50px"}}>
      <UploadButton />
      <CsvPreviewTable />
    </div>
  );
};
