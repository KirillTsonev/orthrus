import styled from "styled-components";
import {TableFilters} from "../../components/TableFilters";
import {css} from "@emotion/react";
import {TableControls} from "./TableControls";

export const MobileActions = () => {
  return (
    <MobileActionsContainer>
      <TableFilters
        css={css`
          position: relative;
        `}
      />
      <TableControls />
    </MobileActionsContainer>
  );
};

const MobileActionsContainer = styled.div`
  position: relative;
`;
