import {useCallback} from "react";
import {css} from "@emotion/react";
import {DeviceWidth} from "../useGetDeviceSize";

export const useResponsiveTable = () => {
  const getFlexAndWidth = useCallback((columnSize: number) => {
    return css`
      flex: 1 1 ${columnSize}px;
      min-width: ${columnSize}px;

      @media screen and (min-width: ${DeviceWidth.Desktop}px) {
        min-width: ${columnSize}px;
      }
    `;
  }, []);

  return {getFlexAndWidth};
};
