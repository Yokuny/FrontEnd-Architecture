import { Checkbox, Col, Row, Select } from "@paljs/ui";
import { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { toast } from "react-toastify";
import { useTheme } from "styled-components";
import moment from "moment";
import {
  LabelIcon,
  SelectMachineEnterprise,
  TextSpan,
} from "../../../components";
import { Vessel } from "../../../components/Icons";
import InputDateTime from "../../../components/Inputs/InputDateTime";
import { SelectSensorByMachine } from "../../../components/Select";
import { timezoneToNumber } from "../../../components/Utils";

export default function ReportForm({ handleSave, idEnterprise }) {
  const [showStatusOperation, setShowStatusOperation] = useState(false);
  const [showStatusNavigation, setShowStatusNavigation] = useState(false);
  const [showFenceName, setShowFenceName] = useState(false);
  const [showPlatformName, setShowPlatformName] = useState(false);
  const [justHasValue, setJustHasValue] = useState(false);
  const [coordinates, setCoordinates] = useState(false);
  const [machines, setMachines] = useState([]);
  const [sensors, setSensors] = useState([]);
  const [interval, setInterval] = useState(3e5);
  const [initialDate, setInitialDate] = useState(
    new Date(
      `${moment()
        .subtract(8, "days")
        .format("YYYY-MM-DD")}T00:00:00${moment().format("Z")}`
    )
  );
  const [finalDate, setFinalDate] = useState(
    new Date(
      `${moment()
        .subtract(1, "days")
        .format("YYYY-MM-DD")}T23:59:59${moment().format("Z")}`
    )
  );

  const intl = useIntl();

  const theme = useTheme();

  function minutesToMilliseconds(minutes) {
    return minutes * 60 * 1000;
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!machines?.value) {
      return toast.warn(intl.formatMessage({ id: "select.machines" }));
    }

    if (!sensors?.length) {
      return toast.warn(
        intl.formatMessage({ id: "machine.sensors.placeholder" })
      );
    }

    if (!initialDate) {
      return toast.warn(intl.formatMessage({ id: "date.start" }));
    }

    if (!finalDate) {
      return toast.warn(intl.formatMessage({ id: "date.end" }));
    }

    if (initialDate >= finalDate) {
      return toast.warn(
        intl.formatMessage({ id: "date.end.is.before.date.start" })
      );
    }

    if (moment(finalDate).diff(initialDate, "days") > 60) {
      return toast.warn(intl.formatMessage({ id: "interval.more.60.days" }));
    }

    const data = {
      idEnterprise,
      idMachines: [machines?.value],
      idSensors: sensors.map((x) => x.value),
      dateStart: initialDate,
      dateEnd: finalDate,
      interval: interval,
      timezone: timezoneToNumber(moment().format("Z")),
      dataShow: {
        isShowStatusNavigation: showStatusNavigation,
        isShowStatusOperation: showStatusOperation,
        isShowFence: showFenceName,
        isShowPlatform: showPlatformName,
        isJustHasValue: justHasValue,
        isShowCoordinatesInDegrees: coordinates,
      },
      file: null,
      createdBy: JSON.parse(localStorage.getItem("user"))?.name,
    };

    handleSave(data);
  }

  const optionsInterval = [
    { value: null, label: intl.formatMessage({ id: "no.interval" }) },
    { value: minutesToMilliseconds(0.5), label: "30 s" },
    { value: minutesToMilliseconds(1), label: "1 min" },
    { value: minutesToMilliseconds(2), label: "2 min" },
    { value: minutesToMilliseconds(5), label: "5 min" },
    { value: minutesToMilliseconds(10), label: "10 min" },
    { value: minutesToMilliseconds(30), label: "30 min" },
    { value: minutesToMilliseconds(60), label: "60 min" },
  ];

  return (
    <form id="form" onSubmit={handleSubmit}>
      <Row>
        <Col breakPoint={{ sm: 12, md: 6 }}>
          <LabelIcon
            renderIcon={() => (
              <Vessel
                style={{
                  height: 13,
                  width: 13,
                  color: theme.textHintColor,
                  marginRight: 5,
                  marginTop: 2,
                  marginBottom: 2,
                }}
              />
            )}
            title={intl.formatMessage({ id: "select.machines" }) + "*"}
          />
          <SelectMachineEnterprise
            onChange={(value) => setMachines(value)}
            idEnterprise={idEnterprise}
            isMulti={false}
          />
        </Col>
        <Col breakPoint={{ sm: 12, md: 6 }}>
          <LabelIcon
            iconName="flash-outline"
            title={
              intl.formatMessage({ id: "machine.sensors.placeholder" }) + "*"
            }
          />
          <SelectSensorByMachine
            onChange={(value) => setSensors(value)}
            idMachine={machines?.value}
            isMulti
          />
        </Col>
        <Col breakPoint={{ md: 5 }} className="mt-3">
          <LabelIcon
            iconName="calendar-outline"
            title={intl.formatMessage({ id: "date.start" }) + "*"}
          />
          <InputDateTime
            value={initialDate}
            onChange={(value) => setInitialDate(value)}
          />
        </Col>
        <Col breakPoint={{ md: 5 }} className="mt-3">
          <LabelIcon
            iconName="calendar-outline"
            title={intl.formatMessage({ id: "date.end" }) + "*"}
          />
          <InputDateTime
            value={finalDate}
            onChange={(value) => setFinalDate(value)}
          />
        </Col>
        <Col className="mt-3" breakPoint={{ sm: 12, md: 2 }}>
          <LabelIcon
            iconName="clock-outline"
            title={intl.formatMessage({ id: "interval" }) + "*"}
          />
          <Select
            value={optionsInterval?.find((x) => x.value === interval) || null}
            options={optionsInterval}
            placeholder={intl.formatMessage({ id: "interval" })}
            onChange={(value) => setInterval(value?.value || null)}
            menuPosition="fixed"
          />
        </Col>
        <Col
          className="mt-3"
          breakPoint={{ md: 12, sm: 12, lg: 12 }}
          style={{ display: "flex", flexDirection: "column" }}
        >
          <Checkbox
            className="mt-2"
            checked={showStatusNavigation}
            onChange={(value) => setShowStatusNavigation(value)}
          >
            <TextSpan apparence="p2" hint>
              <FormattedMessage id="include.navigation.status" />
            </TextSpan>
          </Checkbox>
          <Checkbox
            className="mt-2"
            checked={showFenceName}
            onChange={(value) => setShowFenceName(value)}
          >
            <TextSpan apparence="p2" hint>
              <FormattedMessage id="include.fence.name" />
            </TextSpan>
          </Checkbox>
          <Checkbox
            className="mt-2"
            checked={showPlatformName}
            onChange={(value) => setShowPlatformName(value)}
          >
            <TextSpan apparence="p2" hint>
              <FormattedMessage id="include.plataform.name" />
            </TextSpan>
          </Checkbox>
          <Checkbox
            className="mt-2"
            checked={justHasValue}
            onChange={(value) => setJustHasValue((prev) => !prev)}
          >
            <TextSpan apparence="p2" hint>
              <FormattedMessage id="just.has.value" />
            </TextSpan>
          </Checkbox>
          {sensors?.find((sensor) => sensor.label.toLowerCase().includes("gps")) && (
            <Checkbox
              className="mt-2"
              checked={coordinates}
              onChange={(value) => setCoordinates((prev) => !prev)}
            >
              <TextSpan apparence="p2" hint>
                <FormattedMessage id="coordinates.in.degrees" />
              </TextSpan>
            </Checkbox>
          )}
        </Col>
      </Row>
    </form>
  );
}
