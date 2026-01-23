import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { toast } from "react-toastify";
import { Button } from "@paljs/ui/Button";
import Popover from "@paljs/ui/Popover";
import { Card, CardHeader, CardBody } from "@paljs/ui/Card";
import styled from "styled-components";
import { Fetch, SpinnerFull, TextSpan } from "../../components";
import { useNavigate } from "react-router-dom";

const RowBetween = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const DeleteDashboard = (props) => {
  const { id } = props;
  const buttonOutRef = React.useRef();
  const intl = useIntl();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);

  const onConfirmation = () => {
    if (buttonOutRef.current) buttonOutRef.current.click();

    setIsLoading(true);
    Fetch.delete(`/dashboard?id=${id}`)
      .then((response) => {
        setIsLoading(false);
        toast.success(intl.formatMessage({ id: "delete.success" }));
        navigate(-1)
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
            <Card style={{ marginBottom: 0, maxWidth: 250 }}>
              <CardHeader>
                <TextSpan apparence="s1">
                  {intl.formatMessage({
                    id: "delete.message.default",
                  })}
                </TextSpan>
              </CardHeader>
              <CardBody>
                <RowBetween className="popover-card">
                  <Button appearance="ghost" status="Danger" size="Small" onClick={onConfirmation}>
                    <FormattedMessage id="confirm" />
                  </Button>
                  <Button
                    className="ml-4"
                    status="Basic"
                    size="Small"
                    onClick={() => buttonOutRef.current?.click()}
                  >
                    <FormattedMessage id="cancel" />
                  </Button>
                </RowBetween>
              </CardBody>
            </Card>
          </>
        }
      >
        <Button status="Danger" size="Small" appearance="ghost">
          <FormattedMessage id="delete" />
        </Button>
      </Popover>
      <SpinnerFull isLoading={isLoading} />
    </>
  );
};

export default DeleteDashboard;
