import React, { ImgHTMLAttributes } from "react";
import getConfig from "next/config";
import { Box } from "@mui/material";
const { publicRuntimeConfig } = getConfig();
console.log("publicRuntimeConfig",publicRuntimeConfig);
export const convertAssetsPath = (
  src,
  absolutePath
) => {
  return `${absolutePath ? "" : publicRuntimeConfig.basePath}${src}`;
};
export default function Assets({ absolutePath, ...props }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      {...props}
      src={props.src}
      alt={props?.alt ? props?.alt  : "img"}
      
    />
  );
}
