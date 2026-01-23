import React from "react";
import Row from "@paljs/ui/Row";
import Col from "@paljs/ui/Col";
import { Card, CardBody } from "@paljs/ui";
import styled, { css } from "styled-components";
import { breakpointDown } from "@paljs/ui/breakpoints";
import OptionsToSendCode from "./CodeUnlock/OptionsToSendCode";
import { TextSpan } from "../../components";

const ColContent = styled(Col)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: calc(100vh);

  .copy-mobile-footer {
    @media screen and (max-width: 768px) {
      margin-top: 50px;
    }
  }
`;

const CardAuth = styled(Card)`
  margin: 50px;
  height: calc(100vh - 7rem);
  max-height: 460px;

  ${breakpointDown("sm")`
    margin: 0;
    height: 100vh;
  `}
  ${CardBody} {
    display: flex;
  }
`;

const A = styled.a`
  ${({ theme }) => css`
    color: ${theme.textHintColor};
  `}
`;

const ContentAround = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  width: 100%;
  min-width: 270px;
`;

const ContentCol = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;


const SendCodeUnlock = (props) => {

  return (
    <Row style={{ margin: 0 }} center>
      <ColContent breakPoint={{ md: 4, sm: 12, lg: 4, xs: 12 }}>
        <CardAuth>
          <CardBody>
            <ContentAround>
              <ContentCol>
                <OptionsToSendCode />
              </ContentCol>
            </ContentAround>
          </CardBody>
        </CardAuth>
        <TextSpan apparence="s2" hint className="copy-mobile-footer">
          <A
            href="https://www.bykonz.com?origin=iotlog"
            target="_blank"
            rel="noreferrer"
          >
            Bykonz
          </A>{" "}
          &copy; {new Date().getFullYear()}
        </TextSpan>

      </ColContent>
    </Row>
  );
};


export default SendCodeUnlock;
