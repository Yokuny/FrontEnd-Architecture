import { Button, CardFooter, Col, InputGroup, Row, Select } from "@paljs/ui";
import {
  Fetch,
  LabelIcon,
  Modal,
  SpinnerFull,
  TextSpan,
  Toggle,
} from "../../../components";
import { FormattedMessage, useIntl } from "react-intl";
import InputDateTime from "../../../components/Inputs/InputDateTime";
import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export function MachineAddModal({
  handleModal,
  showModal,
  idEnterprise
 }) {
  const intl = useIntl();
  const navigate = useNavigate();

  const [data, setData] = useState({
    type: {
      value: "IMO",
      label: "IMO",
    }
  });

  const [isLoading, setIsLoading] = useState(false);

  const onChange = (prop, value) => {
    setData({
      ...data,
      [prop]: value,
    });
  };

  const minutesToMiliseconds = (minutes) => {
    return minutes * 60 * 1000;
  };

  const handleSave = () => {
    data.idEnterprise = idEnterprise;
    if (!data?.type) {
      return toast.warn(intl.formatMessage({ id: "type.required" }));
    }

    if (!data?.value) {
      return toast.warn(intl.formatMessage({ id: "value.placeholder" }));
    }

    if (!data?.interval) {
      return toast.warn(intl.formatMessage({ id: "interval.required" }));
    }

    setIsLoading(true);

    Fetch.post("/machine/include", data)
      .then((reponse) => {
        setIsLoading(false);
        toast.success(intl.formatMessage({ id: "save.successfull" }));
        navigate(-1);
      })
      .catch(() => {
        toast.error(intl.formatMessage({ id: "error.save" }));
        setIsLoading(false);
      });
  };

  return (
    <>
      <Modal
        title="add.machine"
        size="Large"
        show={showModal}
        onClose={handleModal}
        renderFooter={() => (
          <CardFooter>
            <Row end="md">
              <Button
                size="Small"
                status="Primary"
                onClick={handleSave}
                className="mr-2"
              >
                <FormattedMessage id="save" />
              </Button>
            </Row>
          </CardFooter>
        )}
      >
        <Row style={{ overflowX: "hidden" }}>
          <Col breakPoint={{ md: 6 }} className="mb-4">
            <LabelIcon iconName="link-2-outline" title="IMO/MMSI *" />
            <Select
              fullWidth
              placeholder="Selecione"
              className="mt-1"
              options={[{ value: "IMO", label: "IMO" }]}
              value={data?.type}
              onChange={(e) => onChange("type", e)}
            />
          </Col>
          <Col breakPoint={{ md: 6 }} className="mb-4">
            <LabelIcon
              iconName="hash-outline"
              title={
                data?.type
                ? data?.type?.label
                : <>
                  <FormattedMessage id="value" /> *
                </>
              }
            />
            <InputGroup fullWidth className="mt-1">
              <input
                type="text"
                placeholder={data?.type
                  ? data?.type?.label
                  : intl.formatMessage({
                  id: "value",
                })}
                onChange={(e) => onChange("value", e.target.value)}
                value={data?.value}
                disabled={!data?.type}
              />
            </InputGroup>
          </Col>
          <Col breakPoint={{ md: 4 }} className="mb-4">
            <LabelIcon
              title={
                <>
                  <FormattedMessage id="interval" /> *
                </>
              }
              iconName="clock-outline"
            />
            <Select
              className="mt-1"
              options={[
                { value: minutesToMiliseconds(1), label: "1 min" },
                { value: minutesToMiliseconds(2), label: "2 min" },
                { value: minutesToMiliseconds(5), label: "5 min" },
                { value: minutesToMiliseconds(10), label: "10 min" },
                { value: minutesToMiliseconds(15), label: "15 min" },
                { value: minutesToMiliseconds(30), label: "30 min" },
                { value: minutesToMiliseconds(60), label: "60 min" },
              ]}
              placeholder={<FormattedMessage id="interval" />}
              value={data?.interval}
              menuPosition="fixed"
              onChange={(e) => onChange("interval", e)}
            />
          </Col>
          <Col breakPoint={{ md: 4 }} className="mb-4">
            <LabelIcon
              iconName="calendar-outline"
              title={
                <>
                  <FormattedMessage id="date.start" />
                </>
              }
            />
            <InputDateTime
              value={data?.dateTimeStart}
              onChange={(e) => onChange("dateTimeStart", e)}
              className="mt-1"
            />
          </Col>
          <Col breakPoint={{ md: 4 }} className="mb-4">
            <LabelIcon
              iconName="calendar-outline"
              title={
                <>
                  <FormattedMessage id="date.end" />
                </>
              }
            />
            <InputDateTime
              value={data?.dateTimeEnd}
              onChange={(e) => onChange("dateTimeEnd", e)}
              className="mt-1"
            />
          </Col>
          <Col>
            <Col breakPoint={{ md: 4 }} className="mb-4 flex-between">
              <TextSpan apparence="s2">
                <FormattedMessage id="show.in.fleet" />
              </TextSpan>
              <Toggle
                checked={data?.showInFleet}
                onChange={() => onChange("showInFleet", !data?.showInFleet)}
              />
            </Col>
          </Col>
          <Col>
            <Col breakPoint={{ md: 4 }} className="mb-4 flex-between">
              <TextSpan apparence="s2">
                <FormattedMessage id="process.status" />
              </TextSpan>
              <Toggle
                checked={data?.processStatus}
                onChange={() => onChange("processStatus", !data?.processStatus)}
              />
            </Col>
          </Col>
          <Col>
            <Col breakPoint={{ md: 4 }} className="mb-4 flex-between">
              <TextSpan apparence="s2">
                <FormattedMessage id="process.travel" />
              </TextSpan>
              <Toggle
                checked={data?.processTravel}
                onChange={() => onChange("processTravel", !data?.processTravel)}
              />
            </Col>
          </Col>
        </Row>
      </Modal>
      <SpinnerFull isLoading={isLoading} />
    </>
  );
}
