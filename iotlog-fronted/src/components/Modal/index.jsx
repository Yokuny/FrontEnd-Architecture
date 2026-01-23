import React from "react";
import styled from "styled-components";
import Col from "@paljs/ui/Col";
import Row from "@paljs/ui/Row";
import { FormattedMessage } from "react-intl";
import { Button } from "@paljs/ui/Button";
import { Card, CardBody, CardHeader } from "@paljs/ui/Card";
import { EvaIcon } from "@paljs/ui/Icon";
import TextSpan from "../Text/TextSpan";

const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  text-align: left;
  background: rgba(0, 0, 0, 0.4);
  transition: opacity 0.25s ease;
  visibility: visible;
  z-index: 1020;

  width: 100vw;
  height: 100vh;

  padding: 10rem 0;

  display: flex;
  justify-content: center;
  align-items: center;
`;

const Content = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;

export default function Modal({
  show,
  title,
  textTitle,
  onClose,
  hideOnBlur = false, // the onClose function must exist
  accent = "Basic",
  children,
  renderFooter = undefined,
  renderHeaderButton = undefined,
  size = "Medium",
  styleContent = undefined,
  styleModal = undefined,
  subtitle = "",
}) {
  const getSize = () => {
    switch (size) {
      case "Small":
        return 4;
      case "Medium":
        return 6;
      case "Large":
        return 8;
      case "ExtraLarge":
        return 11;
      case "Tiny":
        return 2;
      default:
        return 6;
    }
  };

  return (
    <>
      {show && (
        <ModalContainer
          style={styleModal}
          onClick={() => { if (hideOnBlur && onClose) onClose(); }}>
          <Content>
            <Col
              breakPoint={{ md: getSize(), sm: 10 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Card
                style={{ marginBottom: 0, maxHeight: "90vh" }}
                accent={accent}
              >
                <CardHeader>
                  <Row
                    between="xs"
                    style={{ display: "flex", flexWrap: "nowrap" }}
                    className="ml-1 mr-1"
                  >
                    <Col
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        padding: 0,
                      }}
                    >
                      <TextSpan apparence="s1">
                        {textTitle || <FormattedMessage id={title} />}
                      </TextSpan>
                      {subtitle && (
                        <TextSpan apparence="c2" hint>
                          {subtitle}
                        </TextSpan>
                      )}
                    </Col>
                    {!!renderHeaderButton && renderHeaderButton()}

                    <Button
                      status="Danger"
                      size="Tiny"
                      appearance="ghost"
                      onClick={onClose}
                    >
                      <EvaIcon name="close-outline" />
                    </Button>
                  </Row>
                </CardHeader>
                <CardBody style={styleContent}>{children}</CardBody>
                {!!renderFooter && renderFooter()}
              </Card>
            </Col>
          </Content>
        </ModalContainer>
      )}
    </>
  );
}
