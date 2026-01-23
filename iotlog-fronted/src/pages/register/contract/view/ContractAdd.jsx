import { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  Button,
  CardFooter,
  Row,
  InputGroup,
  Col,
  Card,
  CardHeader,
  Tab,
  Tabs,
  Select,
} from "@paljs/ui";
import { FormattedMessage, useIntl } from "react-intl";
import { toast } from "react-toastify";
import {
  DeleteConfirmation,
  Fetch,
  LabelIcon,
  SelectEnterprise,
  SpinnerFull,
} from "../../../../components";
import { ContainerRow } from "../../../../components/Inputs";
import { useNavigate, useSearchParams } from "react-router-dom";
import ListOperation from "./ListOperation";
import ListEvents from "./ListEvents";
import ListGroupConsumption from "./ListGroupConsumption";

const ContractAdd = (props) => {
  const intl = useIntl();
  const navigate = useNavigate();

  const [isEdit, setIsEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({});
  const [enterprise, setEnterprise] = useState();
  const [searchParams, setSearchParams] = useSearchParams();

  const hasPermissionDelete = props.items?.some(
    (x) => x === "/contract-delete"
  );

  useEffect(() => {
    verifyEdit();
  }, []);

  const verifyEdit = () => {
    const idEdit = searchParams.get("id");


    if (!!idEdit) {
      getEditEntity(idEdit);
    }
  };

  const getEditEntity = (id) => {
    setIsLoading(true);
    Fetch.get(`/contract/find?id=${id}`)
      .then((response) => {
        if (response.data) {
          const enterpriseData = response.data.enterprise;
          setEnterprise({
            value: enterpriseData?.id,
            label: `${enterpriseData?.name} - ${enterpriseData?.city} ${enterpriseData?.state}`,
          });
          setData(response.data);
          setIsEdit(true);

          const duplicate = searchParams.get("duplicate");

          if (!!duplicate) {
            setIsEdit(false);
            setData((data) => ({
              ...data,
              description: data.description + ` (${intl.formatMessage({ id: "copy" })})`,
            }))
          }
        }
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const onChange = (prop, value) => {
    setData((prevState) => ({
      ...prevState,
      [prop]: value,
    }));
  };

  const onChangeItemEvent = (index, prop, value) => {
    setData((prevState) => {
      let operationUpdate = prevState.events[index];

      operationUpdate[prop] = value;
      return {
        ...prevState,
        events: [
          ...prevState.events.slice(0, index),
          operationUpdate,
          ...prevState.events.slice(index + 1),
        ],
      };
    });
  };

  const onSave = () => {
    const operations = data.operations.map((op) => {
      if (op?.idOperation && op?.name)
        return {
          idOperation: op?.idOperation,
          name: op?.name,
          description: op?.description,
          idGroupConsumption: op?.idGroupConsumption,
        };
    });
    const dataToSave = {
      ...data,
      idEnterprise: enterprise.value,
      description: data.description,
      customer: data.customer,
      operations: operations.filter((e) => e !== undefined),
      groupConsumption: data.groupConsumption,
      competence: data.competence,
      day: data.competence === "dayInMonth" ? data.day : null,
    };
    setIsLoading(true);
    if (isEdit)
      Fetch.put("/contract", dataToSave)
        .then(() => {
          toast.success(intl.formatMessage({ id: "save.successfull" }));
          navigate(-1);
        })
        .finally(() => setIsLoading(false));
    else
      Fetch.post("/contract", dataToSave)
        .then(() => {
          toast.success(intl.formatMessage({ id: "save.successfull" }));
          navigate(-1);
        })
        .finally(() => setIsLoading(false));
  };

  const onDelete = (id) => {
    setIsLoading(true);
    Fetch.delete(`/contract?id=${id}`)
      .then(() => {
        toast.success(intl.formatMessage({ id: "delete.successfull" }));
        setIsLoading(false);
        navigate(-1);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const options = [
    { value: "dayInMonth", label: intl.formatMessage({ id: "day.cut" }) },
    { value: "eof", label: intl.formatMessage({ id: "end.month" }) },
  ]

  return (
    <>
      <ContainerRow>
        <Col breakPoint={{ xs: 12, md: 12 }}>
          <Card className="pl-4 pr-4">
            <CardHeader>
              <FormattedMessage
                id={!!isEdit ? "view.contract.edit" : "view.contract.add"}
              />
            </CardHeader>
            <Row style={{ margin: 0 }} className="mt-2 mb-4">
              <Col breakPoint={{ md: 12 }} className="mb-4">
                <LabelIcon
                  iconName="home-outline"
                  title={
                    <>
                      <FormattedMessage id="enterprise" /> *
                    </>
                  }
                />
                <div className="mt-1"></div>
                <SelectEnterprise
                  onChange={(value) => {
                    setEnterprise(value);
                  }}
                  value={enterprise}
                  oneBlocked
                />
              </Col>
              <Col breakPoint={{ md: 12 }} className="mb-4">
                <LabelIcon
                  iconName="text-outline"
                  title={
                    <>
                      <FormattedMessage id="description.placeholder" /> *
                    </>
                  }
                />
                <InputGroup fullWidth className="mt-1">
                  <input
                    type="text"
                    placeholder={intl.formatMessage({
                      id: "description.placeholder",
                    })}
                    onChange={(e) => onChange("description", e.target.value)}
                    value={data?.description}
                    maxLength={150}
                  />
                </InputGroup>
              </Col>
              <Col breakPoint={{ md: 12 }} className="mb-4">
                <LabelIcon
                  iconName="person-outline"
                  title={
                    <>
                      <FormattedMessage id="customer" /> *
                    </>
                  }
                />
                <InputGroup fullWidth className="mt-1">
                  <input
                    type="text"
                    placeholder={intl.formatMessage({
                      id: "customer",
                    })}
                    onChange={(e) => onChange("customer", e.target.value)}
                    value={data?.customer}
                    maxLength={200}
                  />
                </InputGroup>
              </Col>
              <Col breakPoint={{ md: data?.competence === "dayInMonth" ? 6 : 12 }}>
                <LabelIcon
                  iconName="calendar-outline"
                  title={
                    <>
                      <FormattedMessage id="competence.type" /> *
                    </>
                  }
                />
                <Select
                  options={options}
                  value={options.find((x) => x.value === data?.competence)}
                  onChange={(e) => onChange("competence", e.value)}
                  placeholder={intl.formatMessage({ id: "competence.type" })}
                />
              </Col>
              {!!(data?.competence === "dayInMonth") && (
                <Col breakPoint={{ md: 6 }}>
                  <LabelIcon
                    iconName="calendar-outline"
                    title={
                      <>
                        <FormattedMessage id="day" /> *
                      </>
                    }
                  />
                  <Select
                    options={Array.from({ length: 28 }, (_, i) => ({
                      value: i + 1,
                      label: i + 1,
                    }))}
                    onChange={(e) => onChange("day", e.value)}
                    value={{ value: data?.day, label: data?.day }}
                    placeholder={intl.formatMessage({ id: "day" })}
                  />
                </Col>
              )}
            </Row>

            <Row style={{ margin: 0 }} className="mt-2 mb-4">
              <Col breakPoint={{ xs: true }}>
                <Tabs fullWidth>
                  <Tab title={intl.formatMessage({ id: "group.consumption" })}>
                    <ListGroupConsumption
                      groupConsumption={data?.groupConsumption}
                      onChange={onChange}
                    />
                  </Tab>
                  <Tab title={intl.formatMessage({ id: "operations" })}>
                    <ListOperation
                      operations={data?.operations}
                      groupConsumptions={data?.groupConsumption}
                      onChange={onChange}
                    />
                  </Tab>

                  <Tab title={intl.formatMessage({ id: "events" })}>
                    <ListEvents
                      events={data?.events}
                      onChange={onChange}
                      onChangeItem={onChangeItemEvent}
                      idEnterprise={enterprise?.value}
                    />
                  </Tab>
                </Tabs>
              </Col>
            </Row>

            <CardFooter>
              <Row between className="ml-1 mr-1">
                {!!isEdit && hasPermissionDelete ? (
                  <DeleteConfirmation
                    message={intl.formatMessage({
                      id: "delete.message.default",
                    })}
                    onConfirmation={() =>
                      onDelete(
                        new URL(window.location.href).searchParams.get("id")
                      )
                    }
                  />
                ) : (
                  <div></div>
                )}
                <Button
                  size="Small"
                  onClick={onSave}
                  disabled={!enterprise?.value || !data?.description}
                >
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

const mapStateToProps = (state) => ({
  items: state.menu.items,
});

export default connect(mapStateToProps)(ContractAdd);
