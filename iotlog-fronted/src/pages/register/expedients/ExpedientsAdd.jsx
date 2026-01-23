import React from "react";
import { Card, CardHeader, CardBody, CardFooter } from "@paljs/ui/Card";
import Col from "@paljs/ui/Col";
import Row from "@paljs/ui/Row";
import { Button } from "@paljs/ui/Button";
import { FormattedMessage, useIntl } from "react-intl";
import {
  DeleteConfirmation,
  FetchSupport,
  SpinnerFull,
  TextSpan,
} from "../../../components";
import { toast } from "react-toastify";
import { InputGroup } from "@paljs/ui/Input";
import { Checkbox } from "@paljs/ui/Checkbox";
import { SelectEnterprise } from "../../../components/Select";
import { verifyTime, convertTimeOnMinute } from "../../../utilities";
import { useNavigate } from "react-router-dom";

const ExpedientsAdd = (props) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isEdit, setIsEdit] = React.useState(false);
  const [holiday, setHoliday] = React.useState(false);
  const [workday, setWorkday] = React.useState(false);
  const [saturday, setSaturday] = React.useState(false);
  const [sunday, setSunday] = React.useState(false);
  const [description, setDescription] = React.useState("");
  const [startTime, setStartTime] = React.useState("");
  const [finalHour, setFinalHour] = React.useState("");
  const [startLunchHour, setStartLunchHour] = React.useState("");
  const [finalLunchHour, setFinalLunchHour] = React.useState("");
  const [enterprise, setEnterprise] = React.useState(undefined);
  const [expedient, setExpedient] = React.useState(0);

  const id = new URL(window.location.href).searchParams.get("id");

  const intl = useIntl();
  const navigate = useNavigate();

  React.useEffect(() => {
    getData();
  }, []);

  React.useEffect(() => {
    onChangeExpedient();
  }, [startTime, finalHour, startLunchHour, finalLunchHour, expedient]);

  const getData = async () => {
    if (id) {
      setIsEdit(true);
      setIsLoading(true);
      FetchSupport.get(`expedients?id=${id}`)
        .then((response) => {
          const {
            description,
            idEnterprise,
            nameEnterprise,
            startTime,
            finalHour,
            startLunchHour,
            finalLunchHour,
            expedient,
            holiday,
            workday,
            saturday,
            sunday,
          } = response.data;

          setDescription(description);
          setStartTime(startTime);
          setFinalHour(finalHour);
          setStartLunchHour(startLunchHour);
          setFinalLunchHour(finalLunchHour);
          setHoliday(holiday);
          setWorkday(workday);
          setSaturday(saturday);
          setSunday(sunday);
          setExpedient(expedient);
          setEnterprise({
            value: idEnterprise,
            label: nameEnterprise,
          });

          setIsLoading(false);
        })
        .catch((e) => {
          setIsLoading(false);
        });
    }
  };

  const onSave = async () => {
    if (!description) {
      toast.warn(intl.formatMessage({ id: "expedients.description.required" }));
      return;
    }

    const newData = {
      id: id,
      description: description,
      idEnterprise: enterprise.value,
      nameEnterprise: enterprise.label,
      startTime: startTime,
      finalHour: finalHour,
      startLunchHour: startLunchHour,
      finalLunchHour: finalLunchHour,
      expedient: expedient,
      holiday: holiday,
      workday: workday,
      saturday: saturday,
      sunday: sunday,
    };
    setIsLoading(true);
    try {
      if (isEdit) {
        await FetchSupport.put("/expedients", newData);
      } else {
        await FetchSupport.post("/expedients", newData);
      }
      toast.success(intl.formatMessage({ id: "save.successfull" }));
      setIsLoading(false);
      navigate("/expedients-list");
    } catch (e) {
      setIsLoading(false);
      toast.error(intl.formatMessage({ id: "error.save" }));
    }
  };

  const onDelete = () => {
    setIsLoading(true);
    const data = {
      id: id,
      description: description,
      idEnterprise: enterprise.value,
      nameEnterprise: enterprise.label,
      startTime: startTime,
      finalHour: finalHour,
      startLunchHour: startLunchHour,
      finalLunchHour: finalLunchHour,
      expedient: expedient,
      holiday: holiday,
      workday: workday,
      saturday: saturday,
      sunday: sunday,
    };

    FetchSupport.put("/expedients/remove", data)
      .then((r) => {
        toast.success(intl.formatMessage({ id: "delete.successfull" }));
        setIsLoading(false);
        navigate(-1);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const onChangeExpedient = () => {
    if (
      startTime.length == 5 &&
      finalHour.length == 5 &&
      (!startLunchHour || startLunchHour.length == 5) &&
      (!finalLunchHour || finalLunchHour.length == 5)
    ) {
      let minutesOfStartTime = convertTimeOnMinute(startTime);
      let minutesOfFinalHour = convertTimeOnMinute(finalHour);
      let minutesOfStartLunchHours = convertTimeOnMinute(startLunchHour);
      let minutesOfFinalLunchHours = convertTimeOnMinute(finalLunchHour);
      let minutesOfLunchHours =
        minutesOfFinalLunchHours - minutesOfStartLunchHours;
      let lunchHours = startLunchHour && finalLunchHour;

      let expedient =
        (minutesOfFinalHour -
          minutesOfStartTime -
          (!lunchHours ? 0 : minutesOfLunchHours)) /
        60;

      setExpedient(expedient);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <Col>
            <Row between>
              {isEdit ? (
                <FormattedMessage id="editor.expedients" />
              ) : (
                <FormattedMessage id="new.expedients" />
              )}
            </Row>
          </Col>
        </CardHeader>
        <CardBody>
          <Row>
            <Col breakPoint={{ md: 12 }} className="mb-4">
              <TextSpan apparence="s2">
                <FormattedMessage id="enterprise" />
              </TextSpan>
              <div className="mt-1"></div>
              <SelectEnterprise
                onChange={(value) => setEnterprise(value)}
                value={enterprise}
                oneBlocked
              />
            </Col>
          </Row>
          <Row>
            <Col breakPoint={{ md: 12 }} className="mb-4">
              <TextSpan apparence="s2">
                <FormattedMessage id="expedients.description" />
              </TextSpan>
              <div className="mt-1"></div>
              <InputGroup fullWidth>
                <input
                  type="text"
                  placeholder={intl.formatMessage({
                    id: "expedients.description",
                  })}
                  onChange={(text) => setDescription(text.target.value)}
                  value={description}
                  maxLength={150}
                />
              </InputGroup>
            </Col>
          </Row>
          <Row>
            <Col breakPoint={{ lg: 3, md: 3 }} className="mb-4">
              <TextSpan apparence="s2">
                <FormattedMessage id="expedients.startTime" />
              </TextSpan>
              <div className="mt-1"></div>
              <InputGroup fullWidth>
                <input
                  type="time"
                  placeholder={intl.formatMessage({
                    id: "expedients.startTime",
                  })}
                  className="mt-1"
                  onChange={(text) =>
                    setStartTime(verifyTime(text.target.value))
                  }
                  value={startTime}
                />
              </InputGroup>
            </Col>
            <Col breakPoint={{ lg: 3, md: 3 }} className="mb-4">
              <TextSpan apparence="s2">
                <FormattedMessage id="expedients.finalHour" />
              </TextSpan>
              <div className="mt-1"></div>
              <InputGroup fullWidth>
                <input
                  type="time"
                  placeholder={intl.formatMessage({
                    id: "expedients.finalHour",
                  })}
                  className="mt-1"
                  onChange={(text) =>
                    setFinalHour(verifyTime(text.target.value))
                  }
                  value={finalHour}
                  maxLength={150}
                />
              </InputGroup>
            </Col>
            <Col breakPoint={{ lg: 3, md: 3 }} className="mb-4">
              <TextSpan apparence="s2">
                <FormattedMessage id="expedients.startLunchHour" />
              </TextSpan>
              <div className="mt-1"></div>
              <InputGroup fullWidth>
                <input
                  type="time"
                  placeholder={intl.formatMessage({
                    id: "expedients.startLunchHour",
                  })}
                  className="mt-1"
                  onChange={(text) =>
                    setStartLunchHour(verifyTime(text.target.value))
                  }
                  value={startLunchHour}
                  maxLength={150}
                />
              </InputGroup>
            </Col>
            <Col breakPoint={{ lg: 3, md: 3 }} className="mb-4">
              <TextSpan apparence="s2">
                <FormattedMessage id="expedients.finalLunchHour" />
              </TextSpan>
              <div className="mt-1"></div>
              <InputGroup fullWidth>
                <input
                  type="time"
                  placeholder={intl.formatMessage({
                    id: "expedients.finalLunchHour",
                  })}
                  className="mt-1"
                  onChange={(text) =>
                    setFinalLunchHour(verifyTime(text.target.value))
                  }
                  value={finalLunchHour}
                  maxLength={150}
                />
              </InputGroup>
            </Col>
          </Row>
          <Row>
            <Col breakPoint={{ lg: 12, md: 12 }} className="mb-2">
              <TextSpan apparence="s2">
                <FormattedMessage id="total.hours.day" />
              </TextSpan>
              <div className="mt-1"></div>
              <InputGroup fullWidth>
                <input
                  type="number"
                  placeholder={intl.formatMessage({
                    id: "expedients.expedient",
                  })}
                  className="mt-1"
                  onChange={(value) => setExpedient(value)}
                  readOnly={true}
                  value={expedient}
                  maxLength={150}
                />
              </InputGroup>
            </Col>
          </Row>
          <Row>
            <Col breakPoint={{ lg: 12, md: 12 }} className="mb-2">
              <TextSpan apparence="s2">
                <FormattedMessage id="setup.work.day" />
              </TextSpan>

              <Row className="mt-1">
                <Col breakPoint={{ lg: 3, md: 3 }}>
                  <Checkbox
                    checked={workday}
                    onChange={() => setWorkday(!workday)}
                  >
                    <FormattedMessage id="expedients.workday" />
                  </Checkbox>
                </Col>
                <Col breakPoint={{ lg: 3, md: 3 }}>
                  <Checkbox
                    checked={saturday}
                    onChange={() => setSaturday(!saturday)}
                  >
                    <FormattedMessage id="expedients.saturday" />
                  </Checkbox>
                </Col>
                <Col breakPoint={{ lg: 3, md: 3 }}>
                  <Checkbox
                    checked={sunday}
                    onChange={() => setSunday(!sunday)}
                  >
                    <FormattedMessage id="expedients.sunday" />
                  </Checkbox>
                </Col>
                <Col breakPoint={{ lg: 3, md: 3 }}>
                  <Checkbox
                    checked={holiday}
                    onChange={() => setHoliday(!holiday)}
                  >
                    <FormattedMessage id="expedients.holiday" />
                  </Checkbox>
                </Col>
              </Row>
            </Col>
          </Row>
        </CardBody>
        <CardFooter>
          <Row between className="ml-1 mr-1">
            {!!id ? (
              <DeleteConfirmation
                message={intl.formatMessage({ id: "delete.message.default" })}
                onConfirmation={onDelete}
              />
            ) : (
              <div></div>
            )}
            <Button size="Small" onClick={onSave}>
              <FormattedMessage id="save" />
            </Button>
          </Row>
        </CardFooter>
        <SpinnerFull isLoading={isLoading} />
      </Card>
    </>
  );
};
export default ExpedientsAdd;
