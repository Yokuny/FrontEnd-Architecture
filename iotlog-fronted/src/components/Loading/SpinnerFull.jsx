import React from "react";
import Spinner from "@paljs/ui/Spinner";
import styled from "styled-components";

const DivAbsolute = styled.div`
  z-index: 99999;
  position: fixed;
  right: 0;
  top: 0;
  left: 0;
  bottom: 0;
`;

export const SpinnerFull = ({ isLoading }) => {
  return (
    <>
      {isLoading && (
        <DivAbsolute>
          <Spinner status="Primary" size="Large" />
        </DivAbsolute>
      )}
    </>
  );
};
