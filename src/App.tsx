import {UploadButton} from "./components/UploadButton";
import {CsvPreview} from "./components/CsvPreview";

export const App = () => {
  return (
    <div style={{minWidth: "1280px", minHeight: "100vh", marginBottom: "50px"}}>
      <UploadButton />
      <CsvPreview />
    </div>
  );
};
