import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  EvaIcon,
  InputGroup,
  Row,
  SidebarBody,
  Spinner,
} from "@paljs/ui";
import moment from "moment";
import React from "react";
import { CSVLink } from "react-csv";
import { FormattedMessage, useIntl } from "react-intl";
import { connect } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useTheme } from "styled-components";
import { v4 as uuidv4 } from "uuid";
import {
  CardNoShadow,
  DeleteConfirmation,
  FasSidebarStyled,
  Fetch,
  InputDecimal,
  LabelIcon,
  SelectCustomer,
  SelectMachineEnterprise,
  TextSpan,
} from "../../../components";
import { Vessel } from "../../../components/Icons";
import { getCSVData } from "../Utils";
import AddEventModal from "./AddEventModal";
import CompositionCard from "./CompositoinCard";
import CrewCard from "./CrewCard";
import GroupEventList from "./GroupEventList";
import ListItinerary from "./ListItinerary";
import StatusVoyage from "./StatusVoyage";
import Timeline from "./Timeline";

export const datesVoyage = [
  "eta",
  "ata",
  "etb",
  "atb",
  "etc",
  "atc",
  "etd",
  "atd",
  "ets",
  "ats",
];

const AddTravelForm = (props) => {
  const [modalVisibility, setModalVisibility] = React.useState(false);
  const [formData, setFormData] = React.useState({
    id: "",
    crew: [],
    events: [],
    load: [
      {
        description: "",
        amount: "",
        unit: "",
      },
    ],
    compositionAsset: [],
    from: {},
    to: {},
  });
  const [selectedEvent, setSelectedEvent] = React.useState(null);
  const [selectedEventIndex, setSelectedEventIndex] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [showTimeline, setShowTimeline] = React.useState(false);

  const intl = useIntl();
  const theme = useTheme();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const urlId = searchParams.get("id");

  const idEnterprise = props.enterprises?.length
    ? props.enterprises[0].id
    : localStorage.getItem("id_enterprise_filter");

  const hasPermissionToEditAfterClosing = props.items?.some(
    (item) => item === "/edit-trip-after-closing"
  );

  React.useEffect(() => {
    if (urlId && props.items?.length) populate();
  }, [urlId, props.items]);

  function populate() {
    setIsLoading(true);

    Fetch.get(`/travel/manual-voyage/${urlId}`)
      .then((response) => {
        const responseData = response.data;

        const itineararies = responseData.itinerary;

        let fromDates = {};
        let toDates = {};

        datesVoyage.forEach((x) => {
          if (responseData.metadata.from[x]) {
            const { date, time } = breakDateTime(responseData.metadata.from[x]);
            fromDates[`${x}Date`] = date;
            fromDates[`${x}Time`] = time;
          }
          if (responseData.metadata.to[x]) {
            const { date, time } = breakDateTime(responseData.metadata.to[x]);
            toDates[`${x}Date`] = date;
            toDates[`${x}Time`] = time;
          }
        });

        if (itineararies?.length)
          itineararies?.forEach((itinerary) => {
            datesVoyage.forEach((x) => {
              if (itinerary[x]) {
                const { date, time } = breakDateTime(itinerary[x]);
                itinerary[`${x}Date`] = date;
                itinerary[`${x}Time`] = time;
              }
            });
            if (itinerary.idFence)
              itinerary.fence = {
                value: itinerary.idFence,
                label: itinerary.where,
              };
          });

        setFormData({
          id: responseData.id,
          code: responseData.code,
          asset: {
            value: responseData.machine?.id,
            label: responseData.machine?.name,
          },
          fromWhere: responseData.metadata.fromWhere,
          toWhere: responseData.metadata.toWhere,
          compositionAsset: responseData.metadata.compositionAsset || [],
          load: responseData.metadata.load.map((item) => ({
            amount: item.amount,
            unit: item.unit,
            description: item.description,
          })) || [
              {
                description: "",
                amount: "",
                unit: "",
              },
            ],
          from: {
            where: responseData.metadata.from.where,
            ...fromDates,
          },
          to: {
            where: responseData.metadata.to.where,
            ...toDates,
          },
          crew: responseData.crew || [],
          events: responseData.events || [],
          isFinishVoyage:
            responseData.status === "finished" &&
            !hasPermissionToEditAfterClosing,
          itinerary: itineararies,
          status: responseData.status,
          customer: responseData.customer,
          listObservations: responseData.listObservations,
          activity: responseData.activity,
          goal: responseData.goal,
        });
      })
      .catch((_) => {
        toast.error(intl.formatMessage({ id: "error.get" }));
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  function breakDateTime(dateTimeString) {
    if (!dateTimeString) {
      return { date: "", time: "" };
    }
    const dateTime = moment(dateTimeString);
    const date = dateTime.format("YYYY-MM-DD");
    const time = dateTime.format("HH:mm");

    return { date, time };
  }

  function onChange(prop, value) {
    if (prop === "crew") {
      setFormData((prevData) => ({
        ...prevData,
        crew: [...prevData.crew, value],
      }));
    } else if (prop.includes("to.")) {
      setFormData((prevData) => ({
        ...prevData,
        to: {
          ...(prevData?.to || {}),
          [prop.split(".")[1]]: value,
        },
      }));
    } else if (prop.includes("from.")) {
      setFormData((prevData) => ({
        ...prevData,
        from: {
          ...(prevData?.from || {}),
          [prop.split(".")[1]]: value,
        },
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [prop]: value,
      }));
    }
  }

  function onChangeEvent(prop, value) {
    setSelectedEvent((prevEvent) => ({
      ...prevEvent,
      [prop]: value,
    }));
  }

  function editEvent(index) {
    const editedEvent = formData.events[index];

    const { date, time } = breakDateTime(editedEvent.datetime);

    setSelectedEvent({ ...editedEvent, date, time });
    setSelectedEventIndex(index);
    setModalVisibility(true);
  }

  function eventForm() {
    setModalVisibility(true);
  }

  function addCrewMember() {
    setFormData({
      ...formData,
      crew: [...formData.crew, ""],
    });
  }

  function updateCrewMemberName(index, name) {
    const updatedCrew = [...formData.crew];
    updatedCrew[index] = name;
    setFormData({
      ...formData,
      crew: updatedCrew,
    });
  }

  function removeCrewMember(index) {
    const updatedCrew = [...formData.crew];
    updatedCrew.splice(index, 1);
    setFormData({
      ...formData,
      crew: updatedCrew,
    });
  }

  function handleSaveEvent() {
    if (selectedEvent) {
      const unifiedDateTime = formatDateTime(
        selectedEvent.date,
        selectedEvent.time
      );

      const { date, time, ...eventWithoutDateAndTime } = selectedEvent;

      const eventWithUuid = {
        ...eventWithoutDateAndTime,
        id: eventWithoutDateAndTime.id || uuidv4(),
        datetime: unifiedDateTime || new Date().toISOString(),
      };

      if (selectedEventIndex !== null && selectedEventIndex !== undefined) {
        setFormData((prevData) => {
          const updatedEvents = [...prevData.events];
          updatedEvents[selectedEventIndex] = eventWithUuid;
          return {
            ...prevData,
            events: updatedEvents,
          };
        });
      } else {
        setFormData((prevData) => ({
          ...prevData,
          events: [...prevData.events, eventWithUuid],
        }));
      }

      setSelectedEvent(null);
      setSelectedEventIndex(null);
      setModalVisibility(false);
    }
  }

  function handleCancelEvent() {
    setSelectedEvent(null);
    setSelectedEventIndex(null);
    setModalVisibility(false);
  }

  function formatDateTime(date, time) {
    if (date && time) {
      return new Date(`${date}T${time}:00`);
    } else if (date) {
      return new Date(`${date}T00:00:00`);
    }
    return null;
  }

  function handleSaveTravel() {
    setIsLoading(true);

    let fromDates = {};
    let toDates = {};
    let itineraryList = [];
    datesVoyage.forEach((x) => {
      if (formData?.from?.[`${x}Date`]) {
        fromDates[x] = formatDateTime(
          formData.from[`${x}Date`],
          formData.from[`${x}Time`]
        );
      }
      if (formData?.to?.[`${x}Date`]) {
        toDates[x] = formatDateTime(
          formData.to[`${x}Date`],
          formData.to[`${x}Time`]
        );
      }
    });

    formData.itinerary?.forEach((itineraryItem) => {
      const itineraryToAdd = {
        idFence: itineraryItem?.idFence,
        where: itineraryItem?.where,
        load: itineraryItem?.load,
        listObservations: itineraryItem?.listObservations || [],
      };
      datesVoyage.forEach((dateFied) => {
        if (itineraryItem?.[`${dateFied}Date`]) {
          itineraryToAdd[dateFied] = formatDateTime(
            itineraryItem[`${dateFied}Date`],
            itineraryItem[`${dateFied}Time`]
          );
        }
        itineraryToAdd[`showBot${dateFied}`] =
          !!itineraryItem[`showBot${dateFied}`];
      });
      itineraryList.push(itineraryToAdd);
    });

    const payload = {
      id: urlId || "",
      code: formData.code,
      travelType: "manualVoyage",
      idMachine: formData?.asset?.value,
      idEnterprise: idEnterprise,
      metadata: {
        load: formData.load.map((item) => ({
          amount: item.amount,
          unit: item.unit,
          description: item.description,
        })),
        compositionAsset: formData.compositionAsset,
        from: {
          where: formData.from?.where,
          ...fromDates,
        },
        to: {
          where: formData.to?.where,
          ...toDates,
        },
        observation: formData.observation,
      },
      itinerary: itineraryList,
      crew: formData.crew || [],
      events: formData.events || [],
      customer: formData.customer,
      activity: formData.activity || null,
      goal: formData.goal || null,
    };

    if (urlId) {
      Fetch.put("/travel/edit", payload)
        .then((_) => {
          toast.success(intl.formatMessage({ id: "success.update" }));
          navigate(-1);
        })
        .catch((_) => {
          toast.error(intl.formatMessage({ id: "error.update" }));
          setIsLoading(false);
        });
    } else {
      Fetch.post("/travel/create", payload)
        .then((_) => {
          toast.success(intl.formatMessage({ id: "success.save" }));
          navigate(-1);
        })
        .catch((_) => {
          toast.error(intl.formatMessage({ id: "error.save" }));
          setIsLoading(false);
        });
    }
  }

  function removeTravel() {
    Fetch.delete(`/travel/manual-voyage/${urlId}`)
      .then(() => {
        toast.success(intl.formatMessage({ id: "success.remove" }));
        navigate(-1);
      })
      .catch(() => {
        toast.error(intl.formatMessage({ id: "error.remove" }));
      });
  }

  function validateSaveButton() {
    return !formData.code || !formData.asset ? true : false;
  }

  function handleChangeComposition(index, value) {
    const newData = [...formData.compositionAsset];

    newData[index] = value;

    setFormData((prevData) => ({
      ...prevData,
      compositionAsset: newData,
    }));
  }

  function handleRemoveComposition(index) {
    const newData = [...formData.compositionAsset];

    newData.splice(index, 1);

    setFormData((prevData) => ({
      ...prevData,
      compositionAsset: newData,
    }));
  }

  function handleAddComposition() {
    const newData = [...formData.compositionAsset];

    newData.push("");

    setFormData((prevData) => ({
      ...prevData,
      compositionAsset: newData,
    }));
  }

  const hasPermissionDelete = props.itemsByEnterprise?.some(
    (x) =>
      x.enterprise?.id === idEnterprise && x.paths?.includes("/delete-travel")
  );

  const onClose = () => {
    setSelectedEvent(null);
    setSelectedEventIndex(null);
    setModalVisibility(false);
  };

  const handleFinishTravel = () => {
    setIsLoading(true);
    Fetch.patch(`/travel/changestatus/${urlId}`, {
      status: "finished",
    })
      .then(() => {
        toast.success(intl.formatMessage({ id: "success.save" }));
        populate();
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
      <Card>
        <CardHeader>
          <Row between="xs" middle="xs" className="m-0">
            <TextSpan apparence="s1" className="ml-1">
              <FormattedMessage id="travel" />
              {" - "}
              <FormattedMessage id="form" />
            </TextSpan>
            {showTimeline && (
              <FasSidebarStyled property="right" fixed={true}>
                <SidebarBody>
                  <Button
                    className="mr-2"
                    appearance="ghost"
                    size="Tiny"
                    style={{ marginLeft: "-1.2rem" }}
                    onClick={() => setShowTimeline(false)}
                  >
                    <EvaIcon name="chevron-right-outline" />
                  </Button>
                  <Timeline travelId={formData?.id} />
                </SidebarBody>
              </FasSidebarStyled>
            )}
            <Row end="md" className="mr-2">
              <Button
                className="mr-4 flex-between"
                appearance="ghost"
                size="Tiny"
                onClick={() => setShowTimeline(!showTimeline)}
              >
                <EvaIcon name="more-vertical-outline" />
                <FormattedMessage id="timeline" />
              </Button>
              <StatusVoyage status={formData?.status} />
            </Row>
          </Row>
        </CardHeader>
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            <CardBody style={{ overflowX: `hidden` }} className="mb-0">
              <Row middle="xs">
                <Col breakPoint={{ md: 3 }} className="mb-4">
                  <LabelIcon
                    iconName="cube-outline"
                    title={<FormattedMessage id="code.voyage" />}
                    mandatory
                  />
                  <InputGroup fullWidth className="mt-1">
                    <input
                      value={formData?.code}
                      onChange={(e) => onChange("code", e.target.value)}
                      type="text"
                      readOnly={!!formData?.isFinishVoyage}
                      placeholder={intl.formatMessage({ id: "code.voyage" })}
                    />
                  </InputGroup>
                </Col>
                <Col breakPoint={{ md: 5 }} className="mb-4 pt-1">
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
                    title={<FormattedMessage id="vessel" />}
                    mandatory
                  />
                  <div className="mt-1"></div>
                  <SelectMachineEnterprise
                    onChange={(item) => onChange("asset", item)}
                    value={formData?.asset}
                    idEnterprise={idEnterprise}
                    disabled={!!formData?.isFinishVoyage}
                  />
                </Col>
                <Col breakPoint={{ md: 4 }} className="mb-4 pt-1">
                  <LabelIcon
                    iconName="person-outline"
                    title={<FormattedMessage id="customer" />}
                  />
                  <SelectCustomer
                    onChange={(item) => onChange("customer", item)}
                    value={formData?.customer || null}
                    idEnterprise={idEnterprise}
                    isDisabled={!!formData?.isFinishVoyage}
                    isClearable
                  />
                </Col>
              </Row>

              <ListItinerary
                formData={formData}
                onChange={onChange}
                idEnterprise={idEnterprise}
              />

              <Row>
                <Col breakPoint={{ md: 8 }}>
                  <CardNoShadow>
                    <CardBody>
                      <LabelIcon
                        iconName={"activity-outline"}
                        title={intl.formatMessage({ id: "activity" })}
                      />
                      <InputGroup fullWidth className="mt-1">
                        <input
                          value={formData?.activity}
                          onChange={(e) => onChange("activity", e.target.value)}
                          type="text"
                          readOnly={!!formData?.isFinishVoyage}
                          placeholder={intl.formatMessage({ id: "activity" })}
                        />
                      </InputGroup>
                    </CardBody>
                  </CardNoShadow>
                </Col>
                <Col breakPoint={{ md: 4 }}>
                  <CardNoShadow>
                    <CardBody>
                      <LabelIcon
                        iconName={"activity-outline"}
                        title={`${intl.formatMessage({
                          id: "goal",
                        })} (${intl.formatMessage({ id: "day.unity" })})`}
                      />
                      <InputGroup fullWidth className="mt-1">
                        <InputDecimal
                          value={formData?.goal}
                          onChange={(e) => onChange("goal", e)}
                          type="number"
                          readOnly={!!formData?.isFinishVoyage}
                          placeholder={intl.formatMessage({ id: "goal" })}
                        />
                      </InputGroup>
                    </CardBody>
                  </CardNoShadow>
                </Col>
              </Row>

              <CompositionCard
                formData={formData}
                handleChangeComposition={handleChangeComposition}
                handleRemoveComposition={handleRemoveComposition}
                handleAddComposition={handleAddComposition}
              />

              <CrewCard
                formData={formData}
                intl={intl}
                addCrewMember={addCrewMember}
                removeCrewMember={removeCrewMember}
                updateCrewMemberName={updateCrewMemberName}
              />

              <GroupEventList
                formData={formData}
                editEvent={editEvent}
                eventForm={eventForm}
                intl={intl}
              />
            </CardBody>

            <CardFooter>
              <Row middle="xs" between="xs" className="ml-1 mr-1">
                <Row>
                  {hasPermissionDelete && urlId ? (
                    <DeleteConfirmation
                      onConfirmation={() => removeTravel()}
                      message={intl.formatMessage({
                        id: "delete.message.default",
                      })}
                    >
                      <Button
                        size="Tiny"
                        className="flex-between"
                        status="Danger"
                        appearance="ghost"
                        disabled={!!formData?.isFinishVoyage}
                      >
                        <EvaIcon name="trash-2-outline" className="mr-1" />
                        <FormattedMessage id="delete" />
                      </Button>
                    </DeleteConfirmation>
                  ) : null}
                  {!isLoading && urlId && (
                    <>
                      <Button
                        size="Tiny"
                        className="flex-between ml-4"
                        appearance="ghost"
                        status="Basic"
                        onClick={() => window.open(`/print-voyage?id=${urlId}&idEnterprise=${idEnterprise}`, "_blank")}
                      >
                        <EvaIcon name="printer-outline" className="mr-1" />
                        <FormattedMessage id="print" />
                      </Button>
                      <CSVLink
                        data={getCSVData([
                          {
                            ...formData,
                            machine: { name: formData?.asset?.label },
                          },
                        ])}
                        filename={Date.now()}
                        style={{
                          textDecoration: "none",
                        }}
                        className="ml-3"
                      >
                        <Button
                          size="Tiny"
                          className="flex-between"
                          appearance="ghost"
                          status="Basic"
                        >
                          <EvaIcon name="download-outline" className="mr-1" />
                          <FormattedMessage id="download" />
                        </Button>
                      </CSVLink>

                    </>
                  )}
                </Row>

                <Row className="m-0">
                  {formData?.status !== "finished" && (
                    <Button
                      size="Tiny"
                      status="Basic"
                      appearance="ghost"
                      className="flex-between mr-3"
                      onClick={() => handleFinishTravel()}
                    >
                      <EvaIcon
                        name="checkmark-circle-outline"
                        className="mr-1"
                      />
                      <FormattedMessage id="send.closed" />
                    </Button>
                  )}
                  <Button
                    size="Tiny"
                    className="flex-between"
                    onClick={() => handleSaveTravel()}
                    disabled={
                      validateSaveButton() || !!formData?.isFinishVoyage
                    }
                  >
                    <EvaIcon name="save-outline" className="mr-1" />
                    <FormattedMessage id="save" />
                  </Button>
                </Row>
              </Row>
            </CardFooter>
          </>
        )}
      </Card>

      <AddEventModal
        modalVisibility={modalVisibility}
        selectedEvent={selectedEvent}
        onChangeEvent={onChangeEvent}
        handleSaveEvent={handleSaveEvent}
        handleCancelEvent={handleCancelEvent}
        intl={intl}
        formData={formData}
        theme={theme}
        selectedEventIndex={selectedEventIndex}
        handleClose={onClose}
      />
    </>
  );
};

const mapStateToProps = (state) => ({
  enterprises: state.enterpriseFilter.enterprises,
  itemsByEnterprise: state.menu.itemsByEnterprise,
  items: state.menu.items,
});

export default connect(mapStateToProps)(AddTravelForm);
