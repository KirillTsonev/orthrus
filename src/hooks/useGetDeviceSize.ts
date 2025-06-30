import {useCallback, useEffect, useState} from "react";

export enum DeviceType {
  Mobile = "Mobile",
  Tablet = "Tablet",
  Desktop = "Desktop",
}

export enum DeviceWidth {
  Mobile = 360,
  Tablet = 744,
  Desktop = 1280,
}

export const useDeviceType = (): DeviceType => {
  const [width, setWidth] = useState(window.innerWidth);

  const handleWindowSizeChange = useCallback(() => {
    setWidth(window.innerWidth);
  }, []);

  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, [handleWindowSizeChange]);

  if (width >= DeviceWidth.Desktop) {
    return DeviceType.Desktop;
  }

  if (width >= DeviceWidth.Tablet) {
    return DeviceType.Tablet;
  }

  return DeviceType.Mobile;
};
