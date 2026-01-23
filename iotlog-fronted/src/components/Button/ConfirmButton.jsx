import React from "react";
import { Card, CardBody, CardHeader } from "@paljs/ui/Card";
import { TextSpan } from "../../components";
import { Button } from "@paljs/ui/Button";
import { FormattedMessage } from "react-intl";

import Popover from "@paljs/ui/Popover";
import Row from "@paljs/ui/Row";

export function ConfirmButton(props) {
  const callback = props.callback;
  const style = props.style || {};
  const buttonStatus = props.status || "Primary";
  const buttonContent = props.children;
  const buttonSize = props.size || "Small";
  const buttonOutRef = React.useRef();

  return (
    <>
      <button ref={buttonOutRef} style={{ display: "none" }}></button>
      <Popover
        className="inline-block"
        trigger="click"
        placement="top"
        overlay={
          <>
            <Card style={{ marginBottom: 0, maxWidth: 280 }}>
              <CardHeader>
                <TextSpan apparence="s1">
                  {`${props.title} ${props.message}`}
                </TextSpan>
              </CardHeader>
              <CardBody>
                <Row between="xs" middle="xs">
                  <Button
                    status="Danger"
                    size="Small"
                    appearance="ghost"
                    // Chama o callback e o click para ocultar o modal
                    onClick={() => callback() || buttonOutRef.current?.click()}
                  >
                    <FormattedMessage id="confirm" />
                  </Button>
                  <Button
                    status="Basic"
                    size="Small"
                    className="ml-4"
                    onClick={() => buttonOutRef.current?.click()}
                  >
                    <FormattedMessage id="cancel" />
                  </Button>
                </Row>
              </CardBody>
            </Card>
          </>
        }
      >
        <Button
          status={buttonStatus}
          appearance={'ghost'}
          size={buttonSize}
          style={style}
          className={props.className}
        >
          {buttonContent}
        </Button>
      </Popover>
    </>
  );
}
