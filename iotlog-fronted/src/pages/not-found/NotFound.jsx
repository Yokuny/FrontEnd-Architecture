import React from "react";
import { Button } from "@paljs/ui/Button";
import Row from "@paljs/ui/Row";
import styled from "styled-components";
import { FormattedMessage } from "react-intl";
import { useNavigate } from "react-router-dom";

const DivCenter = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: calc(100vh - 100px);
`;

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <>
      <Row center>
        <DivCenter>
          <h2><FormattedMessage id="not.found.page"/></h2>
          <Button onClick={() => navigate(-1)}><FormattedMessage id="back"/></Button>
        </DivCenter>
      </Row>
    </>
  );
};
export default NotFound;
