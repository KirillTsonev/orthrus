import {useCallback} from "react";
import {css} from "@emotion/react";
import {DeviceWidth} from "../useGetDeviceSize";

export const useResponsiveTable = () => {
  const tabletMaxWidth = 680;
  const mobileMaxWidth = 314;

  const getFlexAndWidth = useCallback((columnSize: number) => {
    return css`
      flex: 1 1 calc(${(columnSize / mobileMaxWidth) * 100}%);
      max-width: calc(${(columnSize / mobileMaxWidth) * 100}%);

      @media screen and (min-width: ${DeviceWidth.Tablet}px) {
        flex: 1 1 calc(${(columnSize / tabletMaxWidth) * 100}%);
        max-width: calc(${(columnSize / tabletMaxWidth) * 100}%);
      }

      @media screen and (min-width: ${DeviceWidth.Desktop}px) {
        min-width: ${columnSize}px;
      }
    `;
  }, []);

  return {getFlexAndWidth};
};
