import React from "react";
import { FormattedMessage, injectIntl } from "react-intl";
import { Button } from "@paljs/ui/Button";
import Popover from "@paljs/ui/Popover";
import { Card, CardHeader, CardBody, CardFooter } from "@paljs/ui/Card";
import styled from "styled-components";
import { Checkbox, Col, EvaIcon, InputGroup, Row } from "@paljs/ui";
import { Fetch, SpinnerFull, TextSpan } from "../../../../../components";
import { toast } from "react-toastify";

const RowBetween = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const AdjustManualWear = (props) => {
  const { intl, part, action } = props;

  const buttonOutRef = React.useRef();
  const [newWear, setNewWear] = React.useState();
  const [reason, setReason] = React.useState();
  const [isRestartCounter, setIsRestartCounter] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const onCancelHandle = () => {
    if (buttonOutRef.current) buttonOutRef.current.click();
  };

  const onSave = () => {
    if (newWear === undefined || newWear < 0) {
      toast.warn(props.intl.formatMessage({ id: "wear.required" }));
      return;
    }
    if (!reason) {
      toast.warn(props.intl.formatMessage({ id: "reason.required" }));
      return;
    }

    setIsLoading(true);
    Fetch.put(`/wearstate`, {
      idMachine: props.idMachine,
      idPart: props.idPart,
      idTypeService: props.idTypeService,
      idWearConfig: props.idWearConfig,
      reason,
      wear: newWear,
      isRestartCounter
    })
      .then((response) => {
        toast.success(props.intl.formatMessage({ id: "save.successfull" }));
        buttonOutRef.current && buttonOutRef.current.click();
        setIsLoading(false);
        setNewWear(undefined);
        setReason("");
        props.onRefresh();
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  return (
    <>
      <button ref={buttonOutRef} style={{ display: "none" }}></button>
      <Popover
        className="inline-block"
        trigger="click"
        placement="top"
        overlay={
          <>
            <Card style={{ marginBottom: 0 }}>
              <CardHeader>
                <FormattedMessage id="wear.adjust.manual" />
              </CardHeader>
              <CardBody>
                <Row>
                  <Col breakPoint={{ md: 12 }} className="mb-4">
                    <TextSpan apparence="s2">
                      <FormattedMessage id="action" /> -{" "}
                      <FormattedMessage id="part" />
                    </TextSpan>
                    <div className="mt-1"></div>
                    <InputGroup fullWidth>
                      <input
                        type="text"
                        value={`${action} - ${part}`}
                        readOnly
                      />
                    </InputGroup>
                  </Col>
                  <Col breakPoint={{ md: 12 }} className="mb-4">
                    <TextSpan apparence="s2">
                      <FormattedMessage id="wear.new" />
                    </TextSpan>
                    <div className="mt-1"></div>
                    <InputGroup fullWidth>
                      <input
                        type="number"
                        placeholder={intl.formatMessage({
                          id: "wear.new",
                        })}
                        min={0}
                        value={newWear}
                        onChange={(e) => setNewWear(parseInt(e.target.value))}
                      />
                    </InputGroup>
                  </Col>

                  <Col breakPoint={{ md: 12 }} className="mb-4">
                    <TextSpan apparence="s2">
                      <FormattedMessage id="reason" />
                    </TextSpan>
                    <div className="mt-1"></div>

                    <InputGroup fullWidth>
                      <textarea
                        rows={2}
                        type="text"
                        placeholder={intl.formatMessage({
                          id: "reason",
                        })}
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                      />
                    </InputGroup>
                  </Col>
                  <Col breakPoint={{ md: 12 }}>
                    <Checkbox
                      checked={isRestartCounter}
                      onChange={() => setIsRestartCounter(!isRestartCounter)}
                    >
                      <TextSpan apparence="s2">
                        <FormattedMessage id="sensor.restart.to.zero" />
                      </TextSpan>
                    </Checkbox>
                  </Col>
                </Row>
              </CardBody>
              <CardFooter>
                <RowBetween className="popover-card">
                  <Button status="Danger" size="Small" onClick={onSave}>
                    <FormattedMessage id="confirm" />
                  </Button>
                  <Button status="Basic" size="Small" onClick={onCancelHandle}>
                    <FormattedMessage id="cancel" />
                  </Button>
                </RowBetween>
              </CardFooter>
            </Card>
          </>
        }
      >
        <Button status="Danger" size="Tiny">
          <EvaIcon name="settings-outline" />
        </Button>
      </Popover>
      <SpinnerFull isLoading={isLoading} />
    </>
  );
};

export default injectIntl(AdjustManualWear);
