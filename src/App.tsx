import {UploadButton} from "./components/UploadButton";
import {CsvPreview} from "./components/CsvPreview";
import styled from "styled-components";

export const App = () => {
  return (
    <AppContainer>
      <UploadButton />
      <CsvPreview />
    </AppContainer>
  );
};

const AppContainer = styled.div`
  max-width: 1280px;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: start;
  margin: 0 auto;
`;
