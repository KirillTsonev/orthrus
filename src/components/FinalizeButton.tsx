import {useInteractionStore} from "../store/interaction/InteractionStore";
import {useFilterData} from "../hooks/previewTable/useFilterData";
import styled from "styled-components";
import {css} from "@emotion/react";

export const FinalizeButton = () => {
  const isMappingDone = useInteractionStore((s) => s.isMappingDone);
  const {noErrors, noDuplicates} = useFilterData();
  const isDisabled = !noDuplicates || !noErrors || !isMappingDone;

  return (
    <StyledFinalizeButton
      css={css`
        cursor: ${isDisabled ? "not-allowed" : "pointer"};

        &:hover {
          background: ${isDisabled ? "rgb(11, 192, 205);" : "rgb(0, 238, 255);"};
        }
      `}
      disabled={isDisabled}
      onClick={() => {
        useInteractionStore.setState((s) => ({
          ...s,
          isUploadModalOpen: true,
        }));
      }}
    >
      Finish CSV upload
    </StyledFinalizeButton>
  );
};

const StyledFinalizeButton = styled.button`
  padding: 10px;
  margin: 10px 0;
  width: 30%;
  height: 50px;
  font-size: 18px;
`;
