import {
  Button,
  CardBody,
  CardFooter,
  CardHeader,
  Checkbox,
  EvaIcon,
  InputGroup,
  Row,
  Select,
} from "@paljs/ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { toast } from "react-toastify";
import {
  CardNoShadow,
  DateTime,
  DeleteConfirmation,
  Fetch,
  LabelIcon,
  Modal,
  SelectMachineEnterprise,
  SelectMaintenancePlan,
  SelectUsers,
  TextSpan,
} from "../../../../components";
import InputDateTime from "../../../../components/Inputs/InputDateTime";
import SelectQLP from "../../../../components/Select/SelectQLP";
import { Notification } from "./Notification";
import { RepeatEvent } from "./RepeatEvent";
import { ColFlex, ContainerRow, RowFlexCenter, SpinnerStyled } from "./styles";

const ModalEditEventSchedule = ({ onClose, event, idEnterprise }) => {
  const [isLoading, setIsLoading] = React.useState();
  const [eventSchedule, setEventSchedule] = React.useState({});
  const [update, setUpdate] = React.useState("none");

  const buttonRemoveRef = React.useRef();

  const intl = useIntl();

  const optionsDescription = [
    {
      value: "maintenance",
      label: intl.formatMessage({ id: "event.maintenance" }),
    },
    {
      value: "teamChange",
      label: intl.formatMessage({ id: "event.team.change" }),
    },
    {
      value: "event",
      label: intl.formatMessage({ id: "event" }),
    },
  ];

  React.useLayoutEffect(() => {
    setEventSchedule(event);
  }, [event]);

  const onChange = (prop, value) => {
    setEventSchedule({
      ...eventSchedule,
      [prop]: value,
    });
  };

  const save = () => {
    setIsLoading(true);
    let eventToSave = {
      ...eventSchedule,
      id: event?.id,
      eventType: eventSchedule.eventType.value,
      idMachine:
        event?.id !== 0
          ? eventSchedule.idMachine
          : eventSchedule.machine?.value,
      idEnterprise: event?.id !== 0 ? eventSchedule.idEnterprise : idEnterprise,
    };

    if (eventToSave.eventType === "maintenance") {
      eventToSave = {
        ...eventToSave,
        idMaintenancePlan:
          event?.id !== 0
            ? eventSchedule.idMaintenancePlan
            : eventSchedule.maintenancePlan.value,
      };
    } else {
      eventToSave = {
        ...eventToSave,
        qlp: eventSchedule.qlp?.value,
      };
    }

    Fetch.post(`/event-schedule?applyTo=${update}`, eventToSave)
      .then((response) => {
        setIsLoading(false);
        onClose(true);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const getTitle = () => {
    if (eventSchedule?.title) return `${eventSchedule?.title}`;
    else return `${intl.formatMessage({ id: "new.event" })}`;
  };

  const isDisabled = () => {
    let disabled = true;

    if (eventSchedule?.id !== 0) disabled = false;

    if (eventSchedule?.eventType?.value === "maintenance")
      disabled =
        !eventSchedule?.maintenancePlan?.value ||
        !eventSchedule?.machine?.value;
    else if (eventSchedule?.eventType?.value === "teamChange")
      disabled =
        (!eventSchedule?.machine?.value && !eventSchedule?.machine?.id) ||
        !eventSchedule?.date;
    else if (eventSchedule?.eventType?.value === "event")
      disabled = !eventSchedule?.date || !eventSchedule?.users?.length;

    return disabled;
  };

  const handleRepeatEvent = () => {
    if (!!eventSchedule?.repeat) {
      setEventSchedule({ ...eventSchedule, repeat: null });

      return;
    }

    if (!!event.repeat) {
      setEventSchedule({
        ...eventSchedule,
        repeat: event.repeat,
      });

      return;
    }

    setEventSchedule({
      ...eventSchedule,
      repeat: {
        value: 1,
        period: "",
        endAt: new Date(),
      },
    });
  };

  const handleRemove = () => {
    buttonRemoveRef.current.click();
    setIsLoading(true);

    Fetch.delete(`/event-schedule/${eventSchedule?.id}?applyTo=${update}`)
      .then((response) => {
        if (response.status === 204) {
          toast.success(intl.formatMessage({ id: "success.remove" }));
        }

        setIsLoading(false);
        onClose();
      })
      .catch(() => {
        setIsLoading(false);
        onClose();
      });
  };
  const handleNotificationEvent = () => {
    if (!!eventSchedule?.notifications) {
      setEventSchedule({ ...eventSchedule, notifications: null });

      return;
    }

    if (!!event.notifications) {
      setEventSchedule({
        ...eventSchedule,
        notifications: event.notifications,
      });

      return;
    }

    setEventSchedule({
      ...eventSchedule,
      notifications: [
        {
          value: 10,
          period: "minutes",
        },
      ],
    });
  };

  const handleAddNotification = () => {
    setEventSchedule((prevData) => ({
      ...prevData,
      notifications: prevData.notifications?.concat({
        value: 10,
        period: "minutes",
      }),
    }));
  };

  const handleChangeNotification = (prop, index, value) => {
    setEventSchedule((prevData) => {
      return {
        ...prevData,
        notifications: prevData.notifications?.map((data, indexData) => {
          if (index === indexData) {
            return {
              ...data,
              [prop]: value,
            };
          }

          return data;
        }),
      };
    });
  };

  const handleRemoveNotification = (notification) => {
    setEventSchedule((prevData) => ({
      ...prevData,
      notifications: prevData.notifications?.filter(
        (_, index) => index !== notification
      ),
    }));
  };

  const renderEventTypeMaintenance = () => {
    return (
      <>
        <ColFlex breakPoint={{ md: 6 }} className="mb-4">
          <LabelIcon title={<FormattedMessage id="machine" />} />
          {eventSchedule?.id !== 0 ? (
            <TextSpan apparence="s2">
              {eventSchedule?.machine?.name ?? ""}
            </TextSpan>
          ) : (
            <SelectMachineEnterprise
              className="mr-1"
              idEnterprise={idEnterprise}
              onChange={(value) => onChange("machine", value)}
              placeholder="vessel"
              value={eventSchedule.machine}
            />
          )}
        </ColFlex>
        <ColFlex breakPoint={{ md: 6 }} className="mb-4">
          <LabelIcon title={`${intl.formatMessage({ id: "maintenance" })}`} />
          {eventSchedule?.id !== 0 ? (
            <TextSpan apparence="s2">{`${eventSchedule?.desc}`}</TextSpan>
          ) : (
            <SelectMaintenancePlan
              onChange={(value) => onChange("maintenancePlan", value)}
              value={eventSchedule?.maintenancePlan}
              placeholder={intl.formatMessage({ id: "maintenance.plan" })}
              idEnterprise={idEnterprise}
            />
          )}
        </ColFlex>
        <ColFlex breakPoint={{ md: 6 }} className="mb-4">
          <LabelIcon title={<FormattedMessage id="date.window.start" />} />
          <DateTime
            onChangeDate={(value) => onChange("dateWindowInit", value)}
            date={eventSchedule?.dateWindowInit}
            max={eventSchedule?.dateWindowEnd}
            onlyDate
          />
        </ColFlex>
        <ColFlex breakPoint={{ md: 6 }} className="mb-4">
          <LabelIcon title={<FormattedMessage id="date.window.end" />} />
          <DateTime
            onChangeDate={(value) => onChange("dateWindowEnd", value)}
            date={eventSchedule?.dateWindowEnd}
            min={eventSchedule?.dateWindowInit}
            onlyDate
          />
        </ColFlex>
        <ColFlex breakPoint={{ md: 6 }} className="mb-4">
          <LabelIcon title={<FormattedMessage id="date.plan.start" />} />
          <DateTime
            onChangeDate={(value) => onChange("datePlanInit", value)}
            date={eventSchedule?.datePlanInit}
            max={eventSchedule?.datePlanEnd}
            onlyDate
          />
        </ColFlex>
        <ColFlex breakPoint={{ md: 6 }} className="mb-4">
          <LabelIcon title={<FormattedMessage id="date.plan.end" />} />
          <DateTime
            onChangeDate={(value) => onChange("datePlanEnd", value)}
            date={eventSchedule?.datePlanEnd}
            min={eventSchedule?.datePlanInit}
            onlyDate
          />
        </ColFlex>
        <ColFlex breakPoint={{ md: 6 }} className="mb-4">
          <LabelIcon title={<FormattedMessage id="date.done.start" />} />
          <DateTime
            onChangeDate={(value) => onChange("dateDoneInit", value)}
            date={eventSchedule?.dateDoneInit}
            max={eventSchedule?.dateDoneEnd}
            onlyDate
          />
        </ColFlex>
        <ColFlex breakPoint={{ md: 6 }} className="mb-4">
          <LabelIcon title={<FormattedMessage id="date.done.end" />} />
          <DateTime
            onChangeDate={(value) => onChange("dateDoneEnd", value)}
            date={eventSchedule?.dateDoneEnd}
            min={eventSchedule?.dateDoneInit}
            onlyDate
          />
        </ColFlex>
        <ColFlex breakPoint={{ md: 12 }}>
          <LabelIcon title={<FormattedMessage id="observation" />} />
          <InputGroup fullWidth>
            <textarea
              type="text"
              placeholder={intl.formatMessage({
                id: "observation",
              })}
              rows={2}
              onChange={(e) => onChange("observation", e.target.value)}
              value={eventSchedule?.observation}
              maxLength={150}
            />
          </InputGroup>
        </ColFlex>
      </>
    );
  };

  const renderEventTypeTeam = () => {
    return (
      <>
        <ColFlex breakPoint={{ md: 6 }} className="mb-4">
          <LabelIcon title={<FormattedMessage id="machine" />} />
          {eventSchedule?.id !== 0 ? (
            <TextSpan apparence="s2">
              {eventSchedule?.machine?.name ?? ""}
            </TextSpan>
          ) : (
            <SelectMachineEnterprise
              className="mr-1"
              idEnterprise={idEnterprise}
              onChange={(value) => onChange("machine", value)}
              placeholder="vessel"
              value={eventSchedule.machine}
            />
          )}
        </ColFlex>
        <ColFlex breakPoint={{ md: 6 }} className="mb-4">
          <LabelIcon title={<FormattedMessage id="event.qlp" />} />
          <SelectQLP
            onChange={(value) => onChange("qlp", value)}
            value={eventSchedule?.qlp}
            idEnterprise={idEnterprise}
          />
        </ColFlex>
        <ColFlex breakPoint={{ md: 6 }} className="mb-4">
          <LabelIcon title={<FormattedMessage id="date" />} />
          <InputDateTime
            onChange={(value) => onChange("date", value)}
            value={eventSchedule?.date}
            onlyDate
          />
        </ColFlex>
        <ColFlex breakPoint={{ md: 6 }} className="mb-4">
          <LabelIcon title={<FormattedMessage id="local" />} />
          <InputGroup fullWidth>
            <input
              type="text"
              placeholder={intl.formatMessage({
                id: "local",
              })}
              onChange={(e) => onChange("local", e.target.value)}
              value={eventSchedule?.local}
              maxLength={150}
            />
          </InputGroup>
        </ColFlex>
        <ColFlex breakPoint={{ md: 12 }} className="mb-4">
          <CardNoShadow
            className="mb-0"
          >
            <CardHeader>
              <TextSpan
                apparence="s2"
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Checkbox
                  className="mr-1"
                  onChange={handleNotificationEvent}
                  checked={!!eventSchedule?.notifications}
                />
                <TextSpan hint apparence="s2">
                  <FormattedMessage id="notify" />
                </TextSpan>
              </TextSpan>
            </CardHeader>
            {!!eventSchedule?.notifications &&
              <>
                <CardBody>
                  <ColFlex className="mb-4">
                    <LabelIcon title={intl.formatMessage({ id: "users" })} />
                    <SelectUsers
                      idEnterprise={idEnterprise}
                      onChange={(e) => onChange("users", e)}
                      value={eventSchedule?.users}
                      isMulti
                    />
                  </ColFlex>
                  <ColFlex>
                    <Notification
                      notifications={eventSchedule?.notifications}
                      handleRemove={handleRemoveNotification}
                      handleAdd={handleAddNotification}
                      handleChange={handleChangeNotification}
                    />
                  </ColFlex>
                </CardBody>
              </>}
          </CardNoShadow>
        </ColFlex>
        <ColFlex breakPoint={{ md: 12 }} className="mb-4">
          <CardNoShadow
            className="mb-0"
          >
            <CardHeader>
              <TextSpan
                apparence="s2"
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Checkbox
                  className="mr-1"
                  onChange={handleRepeatEvent}
                  checked={!!eventSchedule?.repeat}
                />
                <TextSpan hint apparence="s2">
                  <FormattedMessage id="repeat" />
                </TextSpan>
              </TextSpan>
            </CardHeader>
            {!!eventSchedule?.repeat && (
              <>
                <CardBody>
                  <RepeatEvent
                    data={eventSchedule}
                    onChange={onChangeRepeat}
                    onChangeUpdate={onChangeUpdate}
                  />
                </CardBody>
              </>
            )}
          </CardNoShadow>
        </ColFlex>

      </>
    );
  };

  const renderEventType = () => {
    return (
      <>
        <ColFlex className="mb-4">
          <LabelIcon title={intl.formatMessage({ id: "datetime" })} />
          <InputDateTime
            onChange={(e) => onChange("date", e)}
            value={eventSchedule?.date}
          />
        </ColFlex>
        <ColFlex className="mb-4">
          <LabelIcon title={intl.formatMessage({ id: "observation" })} />
          <InputGroup fullWidth>
            <textarea
              name="description"
              id="description"
              onChange={(e) => onChange("observation", e.target.value)}
              value={eventSchedule?.observation}
            ></textarea>
          </InputGroup>
        </ColFlex>
        <ColFlex className="mb-4">
          <LabelIcon title={intl.formatMessage({ id: "users" })} />
          <SelectUsers
            idEnterprise={idEnterprise}
            onChange={(e) => onChange("users", e)}
            value={eventSchedule?.users}
            isMulti
          />
        </ColFlex>
        <ColFlex breakPoint={{ md: 12 }} className="mb-4">
          <CardNoShadow
            className="mb-0"
          >
            <CardHeader>
              <TextSpan
                apparence="s2"
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Checkbox
                  className="mr-1"
                  onChange={handleNotificationEvent}
                  checked={!!eventSchedule?.notifications}
                />
                <TextSpan hint apparence="s2">
                  <FormattedMessage id="notify" />
                </TextSpan>
              </TextSpan>
            </CardHeader>
            {!!eventSchedule?.notifications && <><CardBody>
              <ColFlex>
                <Notification
                  notifications={eventSchedule?.notifications}
                  handleRemove={handleRemoveNotification}
                  handleAdd={handleAddNotification}
                  handleChange={handleChangeNotification}
                />
              </ColFlex>
            </CardBody>
            </>}
          </CardNoShadow>
        </ColFlex>

        <ColFlex breakPoint={{ md: 12 }} className="mb-4">
          <CardNoShadow
            className="mb-0"
          >
            <CardHeader>
              <TextSpan
                apparence="s2"
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Checkbox
                  className="mr-1"
                  onChange={handleRepeatEvent}
                  checked={!!eventSchedule?.repeat}
                />
                <TextSpan hint apparence="s2">
                  <FormattedMessage id="repeat" />
                </TextSpan>
              </TextSpan>
            </CardHeader>
            {eventSchedule?.repeat && (
              <>
                <CardBody>
                  <RepeatEvent
                    data={eventSchedule}
                    onChange={onChangeRepeat}
                    onChangeUpdate={onChangeUpdate}
                  />
                </CardBody>
              </>
            )}
          </CardNoShadow>
        </ColFlex>

      </>
    );
  };

  const onChangeRepeat = (prop, value) => {
    setEventSchedule({
      ...eventSchedule,
      repeat: {
        ...eventSchedule?.repeat,
        [prop]: value,
      },
    });
  };

  const onChangeUpdate = (value) => {
    setUpdate(value);
  };

  return (
    <>
      <Modal
        show={!!event}
        styleModal={{ zIndex: 1030 }}
        onClose={() => onClose()}
        title={getTitle()}
        size="Large"
        styleContent={{ maxHeight: "calc(100vh - 290px)" }}
        renderFooter={() => (
          <CardFooter>
            <Row between={eventSchedule?.id ? "xs" : ""} end={!eventSchedule?.id ? "xs" : ""} className="m-0">
              {eventSchedule?.id ? (
                <DeleteConfirmation
                  onConfirmation={handleRemove}
                  onCancel={() => buttonRemoveRef.current.click()}
                  message={intl.formatMessage({ id: "delete.confirmation" })}
                >
                  <Button
                    size="Tiny"
                    ref={buttonRemoveRef}
                    appearance="ghost"
                    disabled={isLoading}
                    status="Danger"
                    className="flex-between mr-4"
                  >
                    <EvaIcon name="trash-2-outline" className="mr-1" />
                    <FormattedMessage id="delete" />
                  </Button>
                </DeleteConfirmation>
              ) : null}
              <Button
                size="Tiny"
                className="flex-between mr-4"
                disabled={isLoading || isDisabled()}
                onClick={() => save()}
              >
                <EvaIcon name="save-outline" className="mr-1" />
                <FormattedMessage id="save" />
              </Button>
            </Row>
          </CardFooter>
        )}

      >
        {isLoading ? (
          <RowFlexCenter>
            <SpinnerStyled status="Primary" />
          </RowFlexCenter>
        ) : (
          <ContainerRow
            style={{
              overflowX: "hidden",
            }}
          >
            <ColFlex breakPoint={{ md: 12 }} className="mb-4">
              <LabelIcon title={intl.formatMessage({ id: "type.event" })} />
              {eventSchedule?.id !== 0 ? (
                <TextSpan apparence="s2">{`${eventSchedule?.desc}`}</TextSpan>
              ) : (
                <Select
                  options={optionsDescription}
                  menuPosition="fixed"
                  placeholder={intl.formatMessage({ id: "type.event" })}
                  onChange={(value) => onChange("eventType", value)}
                  value={eventSchedule?.eventType}
                />
              )}
            </ColFlex>
            {eventSchedule?.eventType && (
              <>
                {eventSchedule?.eventType?.value === "teamChange"
                  ? renderEventTypeTeam()
                  : eventSchedule?.eventType?.value === "event"
                    ? renderEventType()
                    : renderEventTypeMaintenance()}
              </>
            )}
          </ContainerRow>
        )}
      </Modal>
    </>
  );
};

export default ModalEditEventSchedule;
