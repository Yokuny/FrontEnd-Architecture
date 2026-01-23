import React from "react";
import Col from "@paljs/ui/Col";
import { Card, CardBody, CardFooter, CardHeader } from "@paljs/ui/Card";
import { Button } from "@paljs/ui/Button";
import { FormattedMessage, useIntl } from "react-intl";
import Row from "@paljs/ui/Row";
import {
  SpinnerFull,
  Fetch,
  MachineHeader,
  SelectAlertRule,
  TextSpan,
} from "../../../components";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function MachineAlarm(props) {
  const intl = useIntl();
  const navigate = useNavigate();
  const params = new URL(window.location.href).searchParams;
  const idMachine = params.get("id");
  const idEnterprise = params.get("source");
  const [isLoading, setIsLoading] = React.useState(false);
  const [alarms, setAlarms] = React.useState([]);

  React.useLayoutEffect(() => {
    getData();
  }, []);

  const getData = () => {
    setIsLoading(true);
    Fetch.get(`/machine/find/alertrules?id=${idMachine}`)
      .then((response) => {
        setAlarms(
          response.data?.length
            ? response.data.map((x) => ({
                value: x.id,
                label: x.rule?.then?.message,
              }))
            : []
        );
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const onSave = () => {
    setIsLoading(true);
    Fetch.patch(
      `/machine/alertrule?id=${idMachine}`,
      alarms?.map((x) => x.value) || []
    )
      .then((response) => {
        toast.success(intl.formatMessage({ id: "save.successfull" }));
        setIsLoading(false);
        navigate(-1);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  return (
    <>
      <Col>
        <Card>
          <CardHeader>
            <Col>
              <Row between="xs" middle="xs">
                <MachineHeader idMachine={idMachine} />
              </Row>
            </Col>
          </CardHeader>
          <CardBody>
            <Row>
              <Col breakPoint={{ md: 12 }}>
                <TextSpan apparence="s2">
                  <FormattedMessage id="alarms" />
                </TextSpan>
                <div className="mt-1"></div>
                <SelectAlertRule
                  idEnterprise={idEnterprise}
                  onChange={(value) => setAlarms(value)}
                  value={alarms}
                />
              </Col>
            </Row>
          </CardBody>
          <CardFooter>
            <Button size="Small" status="Primary" onClick={onSave}>
              <FormattedMessage id="save" />
            </Button>
          </CardFooter>
        </Card>
      </Col>
      <SpinnerFull isLoading={isLoading} />
    </>
  );
}
export default MachineAlarm;
