import React from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Col from "@paljs/ui/Col";
import Row from "@paljs/ui/Row";
import { Card, CardBody, CardHeader, CardFooter } from "@paljs/ui/Card";
import { FormattedMessage, injectIntl } from "react-intl";
import { Button } from "@paljs/ui/Button";
import { InputGroup } from "@paljs/ui/Input";
import styled from "styled-components";
import Select from "@paljs/ui/Select";
import ListServicesGrouped from "./ListServicesGrouped";
import { TYPE_MAINTENANCE, TYPE_SENSOR_WEAR } from "../../../constants";
import {
  Fetch,
  SpinnerFull,
  SelectEnterprise,
  TextSpan,
  LabelIcon,
} from "../../../components";

const uuid = require("uuid").v4;

const ContainerRow = styled(Row)`
  input {
    line-height: 0.5rem;
  }
`;
const PlanMaintenanceAdd = (props) => {
  const { intl } = props;
  const navigate = useNavigate();
  const unityOptions = [
    {
      value: "day",
      label: intl.formatMessage({ id: "day.unity" }),
    },
    {
      value: "week",
      label: intl.formatMessage({ id: "week.unity" }),
    },
    {
      value: "month",
      label: intl.formatMessage({ id: "month.unity" }),
    },
  ];

  const typeMaintenanceOptions = [
    {
      value: "date",
      label: intl.formatMessage({ id: "date" }),
    },
    {
      value: "wear",
      label: intl.formatMessage({ id: "wear" }),
    },
    {
      value: "dateOrWear",
      label: intl.formatMessage({ id: "date.or.wear" }),
    },
  ];

  const typesWear = [
    {
      label: props.intl.formatMessage({ id: "horimeter" }),
      value: TYPE_SENSOR_WEAR.HORIMETER,
    },
    {
      label: props.intl.formatMessage({ id: "trigger" }),
      value: TYPE_SENSOR_WEAR.TRIGGER,
    },
    {
      label: props.intl.formatMessage({ id: "odometer" }),
      value: TYPE_SENSOR_WEAR.ODOMETER,
    },
  ];

  const [isEdit, setIsEdit] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [enterprise, setEnterprise] = React.useState(undefined);
  const [description, setDescription] = React.useState(undefined);
  const [valueCycle, setValueCycle] = React.useState(undefined);
  const [unityCycle, setUnityCycle] = React.useState();
  const [durationDays, setDurationDays] = React.useState();
  const [valueWear, setValueWear] = React.useState(undefined);
  const [typeWear, setTypeWear] = React.useState();
  const [typeMaintenance, setTypeMaintenance] = React.useState();
  const [servicesGrouped, setServicesGrouped] = React.useState([]);
  const [daysNotice, setDaysNotice] = React.useState();

  const id = new URL(window.location.href).searchParams.get("id");

  React.useLayoutEffect(() => {
    verifyEdit();
  }, []);

  const verifyEdit = () => {
    if (!!id) {
      setIsLoading(true);
      Fetch.get(`/maintenanceplan/find?id=${id}`)
        .then((response) => {
          if (response.data) {
            setDescription(response.data.description);
            setEnterprise({
              value: response.data?.enterprise?.id,
              label: response.data?.enterprise?.name,
            });
            setValueCycle(response.data.maintanceCycle?.value);
            setUnityCycle(
              unityOptions.find(
                (x) => x.value == response.data.maintanceCycle?.unity
              )
            );
            setValueWear(response.data.maintanceWear?.value);
            setTypeWear(response.data.maintanceWear?.type);
            setTypeMaintenance(response.data?.typeMaintenance);
            setServicesGrouped(response.data.servicesGrouped);
            setDaysNotice(response.data.daysNotice);
            setDurationDays(response.data.durationDays)
            setIsEdit(true);
          }
          setIsLoading(false);
        })
        .catch((e) => {
          setIsLoading(false);
        });
    }
  };

  const onSave = async () => {
    if (!enterprise) {
      toast.warn(intl.formatMessage({ id: "enterprise.required" }));
      return;
    }

    if (!description) {
      toast.warn(intl.formatMessage({ id: "description.required" }));
      return;
    }

    const data = {
      idEnterprise: enterprise.value,
      description,
      typeMaintenance,
      servicesGrouped,
      daysNotice: parseInt(daysNotice),
      durationDays: parseInt(durationDays),
    };

    if (
      typeMaintenance === TYPE_MAINTENANCE.DATE ||
      typeMaintenance === TYPE_MAINTENANCE.DATE_OR_WEAR
    ) {
      data.maintanceCycle = {
        unity: unityCycle.value,
        value: valueCycle,
      };
    }
    if (
      typeMaintenance === TYPE_MAINTENANCE.WEAR ||
      typeMaintenance === TYPE_MAINTENANCE.DATE_OR_WEAR
    ) {
      data.maintanceWear = {
        type: typeWear,
        value: valueWear,
      };
    }
    if (isEdit) {
      data.id = id;
    }

    setIsLoading(true);
    try {
      await Fetch.post("/maintenanceplan", data);
      toast.success(intl.formatMessage({ id: "save.successfull" }));
      navigate(-1);
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
    }
  };

  const onAddGroup = () => {
    setServicesGrouped([...(servicesGrouped || []), {}]);
  };

  const onAddService = (index) => {
    setServicesGrouped([
      ...servicesGrouped.slice(0, index),
      {
        ...servicesGrouped[index],
        itens: [
          ...(servicesGrouped[index]?.itens || []),
          {
            id: uuid(),
          },
        ],
      },
      ...servicesGrouped.slice(index + 1),
    ]);
  };

  const onRemoveGroup = (indexRemove) => {
    setServicesGrouped([
      ...servicesGrouped.slice(0, indexRemove),
      ...servicesGrouped.slice(indexRemove + 1),
    ]);
  };

  const onRemoveService = (indexGroup, indexRemove) => {
    setServicesGrouped([
      ...servicesGrouped.slice(0, indexGroup),
      {
        ...servicesGrouped[indexGroup],
        itens: [
          ...servicesGrouped[indexGroup].itens.slice(0, indexRemove),
          ...servicesGrouped[indexGroup].itens.slice(indexRemove + 1),
        ],
      },
      ...servicesGrouped.slice(indexGroup + 1),
    ]);
  };

  const onChangeItemGroupService = (index, propName, value) => {
    setServicesGrouped([
      ...servicesGrouped.slice(0, index),
      {
        ...servicesGrouped[index],
        [propName]: value,
      },
      ...servicesGrouped.slice(index + 1),
    ]);
  };

  const onChangeSubItemService = (indexGroup, index, propName, value) => {
    setServicesGrouped([
      ...servicesGrouped.slice(0, indexGroup),
      {
        ...servicesGrouped[indexGroup],
        itens: [
          ...servicesGrouped[indexGroup].itens.slice(0, index),
          {
            ...servicesGrouped[indexGroup].itens[index],
            [propName]: value,
          },
          ...servicesGrouped[indexGroup].itens.slice(index + 1),
        ],
      },
      ...servicesGrouped.slice(indexGroup + 1),
    ]);
  };

  return (
    <>
      <ContainerRow>
        <Col breakPoint={{ xs: 12, md: 12 }}>
          <Card>
            <CardHeader>
              <FormattedMessage
                id={isEdit ? "maintenance.plan.edit" : "maintenance.plan.new"}
              />
            </CardHeader>
            <CardBody>
              <Row>
                <Col breakPoint={{ md: 12 }} className="mb-4">
                  <LabelIcon
                    iconName="home-outline"
                    title={`${intl.formatMessage({ id: 'enterprise' })} *`}
                  />
                  <SelectEnterprise
                    onChange={(value) => setEnterprise(value)}
                    value={enterprise}
                    oneBlocked
                  />
                </Col>
                <Col breakPoint={{ md: 12 }} className="mb-4">
                  <LabelIcon
                    iconName="text-outline"
                    title={`${intl.formatMessage({ id: 'description' })} *`}
                  />
                  <InputGroup fullWidth>
                    <input
                      type="text"
                      placeholder={intl.formatMessage({
                        id: "maintenance.description.placeholder",
                      })}
                      onChange={(text) => setDescription(text.target.value)}
                      value={description}
                      maxLength={150}
                    />
                  </InputGroup>
                </Col>
                <Col breakPoint={{ md: 2 }} className="mb-4">
                  <LabelIcon
                    iconName="clock-outline"
                    title={`${intl.formatMessage({ id: 'duration' })} (${intl.formatMessage({ id: 'days' })}) *`}
                  />
                  <InputGroup fullWidth>
                    <input
                      type="number"
                      placeholder={intl.formatMessage({
                        id: "days",
                      })}
                      onChange={(e) => setDurationDays(e.target.value)}
                      value={durationDays}
                      min={0}
                    />
                  </InputGroup>
                </Col>
                <Col breakPoint={{ md: 3 }} className="mb-4 col-center">
                  <LabelIcon
                    iconName="settings-2-outline"
                    title={`${intl.formatMessage({ id: 'type.maintenance' })} *`}
                  />
                  <Select
                    options={typeMaintenanceOptions}
                    placeholder={intl.formatMessage({ id: "type.maintenance" })}
                    onChange={(value) => setTypeMaintenance(value?.value)}
                    value={typeMaintenanceOptions.find(
                      (x) => x.value === typeMaintenance
                    )}
                    noOptionsMessage={() =>
                      intl.formatMessage({ id: "nooptions.message" })
                    }
                    menuPosition="fixed"
                  />
                </Col>
                <Col breakPoint={{ md: 6 }}>
                  <Row>
                    {typeMaintenance?.toUpperCase()?.includes("DATE") && [
                      <Col breakPoint={{ md: 6 }} className="mb-4">
                        <LabelIcon
                          iconName="refresh-outline"
                          title={`${intl.formatMessage({ id: 'time.cycle' })} *`}
                        />
                        <InputGroup fullWidth>
                          <input
                            type="number"
                            placeholder={intl.formatMessage({
                              id: "time.cycle",
                            })}
                            onChange={(e) => setValueCycle(e.target.value)}
                            value={valueCycle}
                            min={0}
                          />
                        </InputGroup>
                      </Col>,
                      <Col breakPoint={{ md: 6 }} className="mb-4">
                        <LabelIcon
                          iconName="calendar-outline"
                          title={`${intl.formatMessage({ id: 'unity.cycle' })} *`}
                        />
                        <Select
                          options={unityOptions}
                          placeholder={intl.formatMessage({
                            id: "unity.cycle",
                          })}
                          onChange={(value) => setUnityCycle(value)}
                          value={unityCycle}
                          noOptionsMessage={() =>
                            intl.formatMessage({ id: "nooptions.message" })
                          }
                          menuPosition="fixed"
                        />
                      </Col>,
                    ]}
                    {typeMaintenance?.toUpperCase()?.includes("WEAR") && [
                      <Col breakPoint={{ md: 6 }} className="mb-4">
                        <LabelIcon
                          iconName="settings-outline"
                          title={`${intl.formatMessage({ id: 'wear' })} *`}
                        />
                        <InputGroup fullWidth>
                          <input
                            type="number"
                            placeholder={intl.formatMessage({
                              id: "value",
                            })}
                            onChange={(e) => setValueWear(e.target.value)}
                            value={valueWear}
                            min={0}
                          />
                        </InputGroup>
                      </Col>,
                      <Col breakPoint={{ md: 6 }} className="mb-4">
                        <LabelIcon
                          iconName="flash-outline"
                          title={`${intl.formatMessage({ id: 'type.wear.sensor' })} *`}
                        />
                        <Select
                          options={typesWear}
                          value={typesWear.find((x) => x.value === typeWear)}
                          onChange={(value) => setTypeWear(value?.value)}
                          menuPosition="fixed"
                          noOptionsMessage={() =>
                            props.intl.formatMessage({
                              id: "nooptions.message",
                            })
                          }
                          placeholder={props.intl.formatMessage({
                            id: "type.wear.sensor",
                          })}
                        />
                      </Col>,
                    ]}
                  </Row>
                </Col>
                <Col breakPoint={{ md: 12 }} style={{ padding: 0 }}>
                  <ListServicesGrouped
                    servicesGrouped={servicesGrouped}
                    onAddGroup={onAddGroup}
                    onRemoveGroup={onRemoveGroup}
                    onChangeItemGroup={onChangeItemGroupService}
                    onAddService={onAddService}
                    onRemoveService={onRemoveService}
                    onChangeSubItemService={onChangeSubItemService}
                  />
                </Col>
              </Row>
            </CardBody>
            <CardFooter>
              <Row end>
                <Button size="Small" onClick={onSave}>
                  <FormattedMessage id="save" />
                </Button>
              </Row>
            </CardFooter>
          </Card>
        </Col>
      </ContainerRow>
      <SpinnerFull isLoading={isLoading} />
    </>
  );
};

export default injectIntl(PlanMaintenanceAdd);
