import { Button } from "@paljs/ui/Button";
import React from "react";
import { FormattedMessage } from "react-intl";
import Popover from "@paljs/ui/Popover";
import { Card, CardHeader, CardBody } from "@paljs/ui/Card";
import styled from "styled-components";
import { TextSpan } from "../../../../components";

const RowBetween = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const CardStyle = styled(Card)`
  margin-bottom: 0px;
`;

export default function ConfirmationShowMessage({ showUser, onSave }) {
  const buttonOutRef = React.useRef();

  if (!showUser) {
    return (
      <>
        <Button size="Small" onClick={onSave}>
          <FormattedMessage id="save" />
        </Button>
      </>
    );
  }

  return (
    <>
      <button ref={buttonOutRef} style={{ display: "none" }}></button>
      <Popover
        className="inline-block"
        trigger="click"
        placement="top"
        overlay={
          <>
            <CardStyle style={{ marginBottom: 0 }}>
              <CardHeader>
                <TextSpan apparence="s1">
                  <FormattedMessage id="confirmation.show.user" />
                </TextSpan>
              </CardHeader>
              <CardBody>
                <RowBetween className="popover-card">
                  <Button
                    status="Basic"
                    size="Small"
                    onClick={() => buttonOutRef.current?.click()}
                  >
                    <FormattedMessage id="cancel" />
                  </Button>
                  <Button
                    status="Danger"
                    size="Small"
                    onClick={() => {
                      if (buttonOutRef.current) buttonOutRef.current.click();
                      onSave();
                    }}
                  >
                    <FormattedMessage id="confirm" />
                  </Button>
                </RowBetween>
              </CardBody>
            </CardStyle>
          </>
        }
      >
        <Button size="Small">
          <FormattedMessage id="save" />
        </Button>
      </Popover>
    </>
  );
}
