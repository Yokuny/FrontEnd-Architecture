import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { useTheme } from "styled-components";
import 'react-loading-skeleton/dist/skeleton.css'

const SkeletonThemed = (props) => {
  const theme = useTheme();
  return (
    <>
      <SkeletonTheme
        highlightColor={theme.backgroundBasicColor4}
        baseColor={theme.backgroundBasicColor2}
      >
          <Skeleton {...props} />
      </SkeletonTheme>
    </>
  );
};

export default SkeletonThemed;
