import React from "react";
import { FormattedMessage } from "react-intl";
import { Button } from "@paljs/ui/Button";
import Popover from "@paljs/ui/Popover";
import { Card, CardHeader, CardBody } from "@paljs/ui/Card";
import styled from "styled-components";
import TextSpan from "../Text/TextSpan";

const RowBetween = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`;

const DeleteConfirmation = ({
  message,
  onConfirmation,
  onCancel = undefined,
  buttonActionMessage = "delete",
  iconButton = undefined,
  children = undefined,
  placement = "top",
}) => {
  const buttonOutRef = React.useRef();
  const onConfirmationHandle = () => {
    buttonOutRef.current && buttonOutRef.current.click();
    onConfirmation && onConfirmation();
  };

  const onCancelHandle = () => {
    if (buttonOutRef.current) buttonOutRef.current.click();
    onCancel && onCancel();
  };

  return (
    <>
      <button ref={buttonOutRef} style={{ display: "none" }}></button>
      <Popover
        className="inline-block"
        trigger="click"
        placement={placement}
        overlay={
          <>
            <Card style={{ marginBottom: 0, zIndex: 10000 }}>
              <CardHeader>
                <TextSpan apparence="s1">{message}</TextSpan>
              </CardHeader>
              <CardBody>
                <RowBetween className="popover-card">
                  <Button
                    className="ml-4"
                    status="Danger"
                    size="Small"
                    appearance="ghost"
                    onClick={onConfirmationHandle}
                  >
                    <FormattedMessage id="confirm" />
                  </Button>
                  <Button className="ml-2" status="Basic" size="Small" onClick={onCancelHandle}>
                    <FormattedMessage id="cancel" />
                  </Button>
                </RowBetween>
              </CardBody>
            </Card>
          </>
        }
      >
        {children || (
          <Button status="Danger" size="Small" appearance="ghost" className="flex-between">
            {iconButton && iconButton()}
            <FormattedMessage id={buttonActionMessage} />
          </Button>
        )}
      </Popover>
    </>
  );
};

export default DeleteConfirmation;
