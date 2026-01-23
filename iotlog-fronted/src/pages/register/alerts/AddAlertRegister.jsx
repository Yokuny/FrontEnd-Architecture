import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Row,
  Tab,
  Tabs,
  Select,
} from "@paljs/ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { toast } from "react-toastify";
import styled from "styled-components";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  DeleteConfirmation,
  Fetch,
  LabelIcon,
  SelectEnterprise,
  SpinnerFull,
  TextSpan,
  Toggle,
} from "../../../components";
import PermissionVisible from "../../../components/Permission/PermissionVisible";
import { SkeletonThemed } from "../../../components/Skeleton";
import Events from "./Events";
import RuleAlert from "./RuleAlert";
import SendTo from "./SendTo";
import PermissionsAssets from "./PermissionsAssets";
import MinMaxTab from "./MinMaxTab";

const RowStyled = styled(Row)`
  display: flex;
  flex-direction: column;

  span {
    width: 100% !important;
  }
`;

const AddAlertRegister = (props) => {
  const [enterprise, setEnterprise] = React.useState();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isLoadingInitial, setIsLoadingInitial] = React.useState(false);
  const [alertType, setAlertType] = React.useState("conditional");
  const [data, setData] = React.useState({
    rule: {
      and: [
        {
          or: [{}],
        },
      ],
    },
  });
  const [events, setEvents] = React.useState({
    startInsideInPlatformArea: null,
    inOutGeofence: null,
    lostConnectionSensor: null,
    statusDistancePort: null,
    description: "",
  });

  const [searchParams] = useSearchParams();

  const intl = useIntl();
  const navigate = useNavigate();

  const id = searchParams.get("id");
  const duplicate = searchParams.get("duplicate");

  React.useEffect(() => {
    if (id) {
      getData(id);
    }
  }, [id]);

  const getData = (id) => {
    setIsLoadingInitial(true);
    Fetch.get(`/alertrule?id=${id}`)
      .then((response) => {
        if (response.data) {
          const enterpriseData = response.data.enterprise;
          setEnterprise({
            value: enterpriseData?.id,
            label: `${enterpriseData?.name} - ${enterpriseData?.city} ${enterpriseData?.state}`,
          });

          setAlertType(response.data.type);
          let preparedData = {
            ...response.data,
            machines: response.data?.machinesPermissions?.map((x) => ({
              value: x.id,
              label: x.name,
            }))
          };

          switch (response.data.type) {
            case "event":
              setEvents({
                ...response.data.events,
                startInsideInPlatformArea: response.data.events?.startInsideInPlatformArea
                  ? {
                    ...(response.data.events?.startInsideInPlatformArea ?? {}),
                    machines: response.data.machines?.map((x) => ({
                      value: x.id,
                      label: x.name,
                    })),
                    platforms: response.data.platforms?.map((x) => ({
                      value: x.id,
                      label: `${x.name}${x.acronym ? ` - ${x.acronym}` : ""}`,
                    })),
                  }
                  : null,
                inOutGeofence: response.data.events?.inOutGeofence
                  ? {
                    ...(response.data.events?.inOutGeofence ?? {}),
                    machines: response.data.machinesInOutGeofence?.map((x) => ({
                      value: x.id,
                      label: x.name,
                    })),
                    geofences: response.data.geofences?.map((x) => ({
                      value: x.id,
                      label: `${x.description}`,
                    })),
                  }
                  : null,
                lostConnectionSensor: response.data.events?.lostConnectionSensor
                  ? {
                    ...(response.data.events?.lostConnectionSensor ?? {}),
                    sensors: response.data.sensorsLostConnectionSensor?.map(
                      (x) => ({
                        value: x.sensorId,
                        label: x.sensor,
                      })
                    ),
                    machine: response.data.machineLostConnectionSensor
                      ? {
                        value: response.data.machineLostConnectionSensor?.id,
                        label: response.data.machineLostConnectionSensor?.name,
                      }
                      : null,
                  }
                  : null,
                statusDistancePort: response.data.events?.statusDistancePort
                  ? {
                    ...(response.data.events?.statusDistancePort ?? {}),
                    machines: response.data.machinesStatusDistancePort?.map(
                      (x) => ({
                        value: x.id,
                        label: x.name,
                      })
                    ),
                  }
                  : null,
                description: duplicate
                  ? `${response.data.events?.description} (${intl.formatMessage({
                    id: "copy",
                  })})`
                  : response.data.events?.description,
              });
              break;

            case "min-max":
              preparedData = {
                ...preparedData,
                selectedVessels: response.data.idsMinMax?.map(id => ({
                  value: id,
                  label: response.data.machinesPermissions?.find(m => m.id === id)?.name || 'Carregando...'
                })) || [],
                description: duplicate
                  ? `${response.data.description} (${intl.formatMessage({ id: "copy" })})`
                  : response.data.description
              };
              break;

            case "conditional":
              if (duplicate) {
                preparedData.rule = {
                  ...response.data.rule,
                  then: {
                    ...response.data.rule?.then,
                    message: `${response.data.rule?.then?.message} (${intl.formatMessage({
                      id: "copy",
                    })})`,
                  },
                };
              }
              break;
          }

          setData(preparedData);

          setIsLoadingInitial(false);
        } else {
          navigate("/add-alarm");
        }
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const onChange = (prop, value) => {
    if (prop.includes("then.")) {
      setData((prevState) => ({
        ...prevState,
        rule: {
          ...(prevState?.rule || {}),
          then: {
            ...(prevState?.rule?.then || {}),
            [prop.replace("then.", "")]: value,
          },
        },
      }));
      return;
    }

    if (prop.includes("inMinutes")) {
      setData((prevState) => ({
        ...prevState,
        rule: {
          ...(prevState?.rule || {}),
          inMinutes: value,
        },
      }));
      return;
    }

    setData((prevState) => ({
      ...prevState,
      [prop]: value,
    }));
  };

  const onChangeOr = (indexAnd, indexOr, prop, value) => {
    setData((prevState) => {
      const toChange = prevState?.rule?.and[indexAnd];
      const toChangeOr = toChange?.or[indexOr];
      toChangeOr[prop] = value;
      toChange.or = [
        ...toChange?.or?.slice(0, indexOr),
        toChangeOr,
        ...toChange?.or?.slice(indexOr + 1),
      ];
      return {
        ...prevState,
        rule: {
          ...prevState?.rule,
          and: [
            ...prevState?.rule?.and?.slice(0, indexAnd),
            toChange,
            ...prevState?.rule?.and?.slice(indexAnd + 1),
          ],
        },
      };
    });
  };

  const onAddAnd = () => {
    setData((prevState) => ({
      ...prevState,
      rule: {
        ...prevState?.rule,
        and: [
          ...(prevState?.rule?.and ?? []),
          {
            or: [{}],
          },
        ],
      },
    }));
  };

  const onRemoveAnd = (indexAnd) => {
    setData((prevState) => ({
      ...prevState,
      rule: {
        ...prevState?.rule,
        and: [
          ...prevState?.rule?.and?.slice(0, indexAnd),
          ...prevState?.rule?.and?.slice(indexAnd + 1),
        ],
      },
    }));
  };

  const onAddOr = (indexAnd) => {
    const toAdd = data?.rule?.and[indexAnd];
    toAdd.or = [...toAdd?.or, {}];
    setData({
      ...data,
      rule: {
        ...data?.rule,
        and: [
          ...data?.rule?.and?.slice(0, indexAnd),
          toAdd,
          ...data?.rule?.and?.slice(indexAnd + 1),
        ],
      },
    });
  };

  const onRemoveOr = (indexAnd, indexOr) => {
    setData((prevState) => {
      const toAdd = prevState?.rule?.and[indexAnd];
      toAdd.or = [
        ...toAdd?.or?.slice(0, indexOr),
        ...toAdd?.or?.slice(indexOr + 1),
      ];
      return {
        ...prevState,
        rule: {
          ...prevState?.rule,
          and: [
            ...prevState?.rule?.and?.slice(0, indexAnd),
            toAdd,
            ...prevState?.rule?.and?.slice(indexAnd + 1),
          ],
        },
      };
    });
  };

  const onSave = () => {
    if (!enterprise?.value) {
      toast.warn(intl.formatMessage({ id: "enterprise.required" }));
      return;
    }

    if (alertType === "conditional" && data?.rule?.inMinutes) {
      if (data?.rule?.inMinutes < 0 || data?.rule?.inMinutes > 1440) {
        toast.warn(intl.formatMessage({ id: "hours.outside.limit" }));
        return;
      }
    }
    if (alertType === "conditional" && !data?.rule?.then?.message) {
      toast.warn(intl.formatMessage({ id: "message.required" }));
      return;
    }
    if (alertType === "conditional" && !data?.rule?.and?.length) {
      toast.warn(intl.formatMessage({ id: "rule.less.one.required" }));
      return;
    }
    if (alertType === "min-max") {
      if (!data?.selectedVessels || !data?.selectedVessels.length) {
        toast.warn(intl.formatMessage({ id: "vessels.required.at.least.one" }));
        return;
      }
      if (!data?.description?.trim()) {
        toast.warn(intl.formatMessage({ id: "description.required" }));
        return;
      }
    }

    if (
      alertType === "event" &&
      !events?.startInsideInPlatformArea &&
      !events?.inOutGeofence &&
      !events?.lostConnectionSensor &&
      !events?.statusDistancePort
    ) {
      toast.warn(intl.formatMessage({ id: "events.required.at.least.one" }));
      return;
    }

    if (alertType === "event" && events?.startInsideInPlatformArea) {
      if (
        !events?.startInsideInPlatformArea?.allMachines &&
        !events?.startInsideInPlatformArea?.machines?.length
      ) {
        toast.warn(intl.formatMessage({ id: "vessels.required.at.least.one" }));
        return;
      }
      if (
        !events?.startInsideInPlatformArea?.allPlatforms &&
        !events?.startInsideInPlatformArea?.platforms?.length
      ) {
        toast.warn(
          intl.formatMessage({ id: "platforms.required.at.least.one" })
        );
        return;
      }
    }
    if (alertType === "event" && events?.inOutGeofence) {
      if (
        !events?.inOutGeofence?.allMachines &&
        !events?.inOutGeofence?.machines?.length
      ) {
        toast.warn(intl.formatMessage({ id: "vessels.required.at.least.one" }));
        return;
      }
      if (
        !events?.inOutGeofence?.allGeofences &&
        !events?.inOutGeofence?.geofences?.length
      ) {
        toast.warn(
          intl.formatMessage({ id: "geofence.required.at.least.one" })
        );
        return;
      }
    }

    if (alertType === "event" && events?.statusDistancePort) {
      if (
        !events?.statusDistancePort?.allMachines &&
        !events?.statusDistancePort?.machines?.length
      ) {
        toast.warn(intl.formatMessage({ id: "vessels.required.at.least.one" }));
        return;
      }
      if (!events?.statusDistancePort?.status) {
        toast.warn(intl.formatMessage({ id: "status.required" }));
        return;
      }
      if (!events?.statusDistancePort?.distance) {
        toast.warn(intl.formatMessage({ id: "distance.required" }));
        return;
      }
    }

    if (alertType === "event" && events?.lostConnectionSensor) {
      if (!events?.lostConnectionSensor?.sensors?.length) {
        toast.warn(intl.formatMessage({ id: "sensor.required" }));
        return;
      }
      if (!events?.lostConnectionSensor?.timeMinutes) {
        toast.warn(intl.formatMessage({ id: "time.min.required" }));
        return;
      }
    }

    if (alertType === "event" && !events?.description) {
      toast.warn(intl.formatMessage({ id: "description.required" }));
      return;
    }

    const dataToSave = {
      id: !duplicate ? id : null,
      idEnterprise: enterprise?.value,
      rule: alertType === "event" ? null : data?.rule,
      sendBy: data?.sendBy,
      useScale: data?.useScale,
      users: data?.users,
      scales: data?.scales,
      visibility: data?.visibility,
      edit: data?.edit,
      usersPermissionView:
        data?.visibility === "limited" ? data?.usersPermissionView : [],
      type: alertType,
      idsMinMax: alertType === "min-max" ? data?.selectedVessels?.map(vessel => vessel.value) : [],
      description: data?.description,
      idMachines: data?.machines?.map((x) => x.value),
      allMachines: !!data?.allMachines,
      events: alertType === "event"
        ? {
          startInsideInPlatformArea: events?.startInsideInPlatformArea
            ? {
              allPlatforms:
                !!events?.startInsideInPlatformArea?.allPlatforms,
              allMachines: !!events?.startInsideInPlatformArea?.allMachines,
              idMachines: events?.startInsideInPlatformArea?.machines?.map(
                (x) => x.value
              ),
              idPlatforms:
                events?.startInsideInPlatformArea?.platforms?.map(
                  (x) => x.value
                ),
            }
            : null,
          inOutGeofence: events?.inOutGeofence
            ? {
              allGeofences: !!events?.inOutGeofence?.allGeofences,
              allMachines: !!events?.inOutGeofence?.allMachines,
              passage: !!events?.inOutGeofence?.passage,
              alertEntering: !!events?.inOutGeofence?.alertEntering,
              alertLeaving: !!events?.inOutGeofence?.alertLeaving,
              idMachines: events?.inOutGeofence?.machines?.map(
                (x) => x.value
              ),
              idGeofences: events?.inOutGeofence?.geofences?.map(
                (x) => x.value
              ),
            }
            : null,
          lostConnectionSensor: events?.lostConnectionSensor
            ? {
              idMachine: events?.lostConnectionSensor?.machine?.value,
              idSensors: events?.lostConnectionSensor?.sensors?.map(
                (x) => x.value
              ),
              timeMinutes: events?.lostConnectionSensor?.timeMinutes,
            }
            : null,
          statusDistancePort: events?.statusDistancePort
            ? {
              allMachines: !!events?.statusDistancePort?.allMachines,
              idMachines: events?.statusDistancePort?.machines?.map(
                (x) => x.value
              ),
              status: events?.statusDistancePort?.status,
              distance: events?.statusDistancePort?.distance,
            }
            : null,
          description: events?.description,
        }
        : null,
    };
    setIsLoading(true);
    Fetch.post(`/alertrule`, dataToSave)
      .then((_) => {
        toast.success(intl.formatMessage({ id: "save.successfull" }));
        setIsLoading(false);
        navigate(-1);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const onActiveEvent = (eventName) => {
    setEvents((prevState) => ({
      ...prevState,
      [eventName]: !!prevState[eventName] ? null : {},
    }));
  };

  const onChangeEvent = (eventName, prop, value) => {
    if (eventName) {
      setEvents((prevState) => ({
        ...(prevState || {}),
        [eventName]: {
          ...(prevState?.[eventName] || {}),
          [prop]: value,
        },
      }));
      return;
    }
    setEvents((prevState) => ({
      ...(prevState || {}),
      [prop]: value,
    }));
  };

  const onDelete = () => {
    setIsLoading(true);
    Fetch.delete(`/alertrule?id=${id}`)
      .then((response) => {
        toast.success(intl.formatMessage({ id: "delete.successfull" }));
        setIsLoading(false);
        navigate("/view-list-alarms");
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const optionsType = [
    { value: "conditional", label: intl.formatMessage({ id: "conditional" }) },
    { value: "event", label: intl.formatMessage({ id: "event" }) },
    { value: "min-max", label: intl.formatMessage({ id: "min.max" }) }
  ];

  return (
    <>
      <Card>
        <CardHeader>
          <TextSpan apparence="s1">
            <FormattedMessage
              id={id ? "editor.register.alerts" : "add.alert"}
            />
          </TextSpan>
        </CardHeader>
        <CardBody>
          {isLoadingInitial ? (
            <RowStyled style={{ margin: 0 }}>
              <SkeletonThemed height={30} width={`100%`} />
              <div className="mt-4"></div>
              <SkeletonThemed height={30} width={`100%`} />
              <div className="mt-2"></div>
              <SkeletonThemed height={150} width={`100%`} />
            </RowStyled>
          ) : (
            <Row>
              <Col breakPoint={{ md: id ? 12 : 6, sm: 12 }}>
                <LabelIcon
                  iconName="home-outline"
                  title={`${intl.formatMessage({ id: "enterprise" })} *`}
                />
                <div className="mt-1"></div>
                <SelectEnterprise
                  onChange={(value) => setEnterprise(value)}
                  value={enterprise}
                  oneBlocked
                />
              </Col>
              {!id && (
                <Col breakPoint={{ md: 6, sm: 12 }}>
                  <LabelIcon
                    iconName="bell-outline"
                    title={`${intl.formatMessage({ id: "type" })} *`}
                  />
                  <Select
                    options={optionsType }
                    value={optionsType.find(option => option.value === alertType)}
                    onChange={(option) => setAlertType(option.value)}
                    isDisabled={!!id}
                    placeholder={intl.formatMessage({ id: "select.type" })}
                  />
                </Col>
              )}

              {!!enterprise?.value && (
                <Tabs className="mt-3" style={{ width: "100%" }} fullWidth>
                  {(() => {
                    if (alertType === "event") {
                      return (
                        <Tab
                          responsive
                          icon="flash-outline"
                          title={<FormattedMessage id="event" />}
                        >
                          <Row>
                            <Col breakPoint={{ md: 12 }}>
                              <Events
                                idEnterprise={enterprise?.value}
                                onChange={onChangeEvent}
                                event={events}
                                onActiveEvent={onActiveEvent}
                              />
                            </Col>
                          </Row>
                        </Tab>
                      );
                    }

                    if (alertType === "min-max") {
                      return [
                        <Tab
                          responsive
                          icon="thermometer-outline"
                          title={<FormattedMessage id="min.max" />}
                        >
                          <Row>
                            <Col breakPoint={{ md: 12 }} className="mb-2">
                              <MinMaxTab
                                data={data}
                                onChange={onChange}
                                idEnterprise={enterprise?.value}
                              />
                            </Col>
                          </Row>
                        </Tab>,
                        <Tab
                          responsive
                          icon="wifi-outline"
                          title={<FormattedMessage id="machine" />}
                        >
                          <PermissionsAssets
                            data={data}
                            onChange={onChange}
                            idEnterprise={enterprise?.value}
                          />
                        </Tab>
                      ];
                    }

                    return [
                      <Tab
                        responsive
                        icon="code-outline"
                        title={<FormattedMessage id="conditional" />}
                      >
                        <Row>
                          <Col breakPoint={{ md: 12 }}>
                            <RuleAlert
                              onChangeOr={onChangeOr}
                              onChange={onChange}
                              rule={data?.rule}
                              idEnterprise={enterprise?.value}
                              onAddAnd={onAddAnd}
                              onAddOr={onAddOr}
                              onRemoveAnd={onRemoveAnd}
                              onRemoveOr={onRemoveOr}
                            />
                          </Col>
                        </Row>
                      </Tab>,
                      <Tab
                        responsive
                        icon="wifi-outline"
                        title={<FormattedMessage id="machine" />}
                      >
                        <PermissionsAssets
                          data={data}
                          onChange={onChange}
                          idEnterprise={enterprise?.value}
                        />
                      </Tab>,
                    ];
                  })()}
                  <Tab
                    responsive
                    icon="people-outline"
                    title={<FormattedMessage id="who.receveid" />}
                  >
                    <Row>
                      <Col breakPoint={{ lg: 12, md: 12 }} className="mb-2">
                        <SendTo
                          onChange={onChange}
                          data={data}
                          idEnterprise={enterprise?.value}
                        />
                      </Col>
                    </Row>
                  </Tab>
                  <Tab
                    title={<FormattedMessage id="who.edit" />}
                    icon="edit-2-outline"
                    responsive
                  >
                    <Row>
                      <Col breakPoint={{ lg: 12, md: 12 }} className="mb-2">
                        <PermissionVisible
                          onChangeUsers={(value) =>
                            onChange("usersPermissionView", value)
                          }
                          users={data?.usersPermissionView}
                          visible={data?.visibility}
                          onChangeVisible={(value) =>
                            onChange("visibility", value)
                          }
                          whoEdit={data?.edit}
                          onChangeWhoEdit={(value) => onChange("edit", value)}
                        />
                      </Col>
                    </Row>
                  </Tab>
                </Tabs>
              )}
            </Row>
          )}
        </CardBody>
        {!isLoadingInitial && (
          <CardFooter>
            <Row className="ml-2 mr-2" between>
              {!!id ? (
                <DeleteConfirmation
                  onConfirmation={onDelete}
                  message={intl.formatMessage({ id: "delete.message.default" })}
                />
              ) : (
                <div></div>
              )}
              <Button size="Small" onClick={onSave}>
                <FormattedMessage id="save" />
              </Button>
            </Row>
          </CardFooter>
        )}
      </Card>
      <SpinnerFull isLoading={isLoading} />
    </>
  );
};

export default AddAlertRegister;
