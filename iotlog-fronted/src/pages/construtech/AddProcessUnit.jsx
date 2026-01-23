import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  InputGroup,
  Row,
} from "@paljs/ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { toast } from "react-toastify";
import {
  DateTime,
  FetchSupport,
  SpinnerFull,
  TextSpan,
} from "../../components";
import SelectUnit from "./SelectUnit";
import { useNavigate } from "react-router-dom";

const AddProcessUnit = (props) => {
  const [data, setData] = React.useState();
  const [unit, setUnit] = React.useState();
  const [isLoading, setIsLoading] = React.useState(false);
  const searchparams = new URL(window.location.href).searchParams;
  const id = searchparams.get("id");

  const intl = useIntl();
  const navigate = useNavigate();

  React.useLayoutEffect(() => {
    if (id) {
      onSearch();
    }
  }, []);

  const onSearch = () => {
    setIsLoading(true);
    FetchSupport.get(`/processunit?id=${id}`)
      .then((response) => {
        setData({
          ...response.data,
          dateInput: response.data?.dateInput?.slice(0,10)
        });
        setUnit({
          value: response.data.idUnit,
          label: response.data.units?.name,
          ...response.data?.units
        });
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

  const onSave = () => {
    if (!unit?.value) {
      toast.warn(intl.formatMessage({ id: "unit.required" }));
      return;
    }

    if (!data?.dateInput) {
      toast.warn(intl.formatMessage({ id: "date.required" }));
      return;
    }

    if (!data?.status) {
      toast.warn(intl.formatMessage({ id: "status.required" }));
      return;
    }

    if (!data?.type) {
      toast.warn(intl.formatMessage({ id: "type.required" }));
      return;
    }

    setIsLoading(true);
    const dataToSave = {
      id,
      idUnit: unit?.value,
      dateInput: data?.dateInput,
      status: data?.status,
      type: data?.type,
      observation: data?.observation,
    };
    FetchSupport.post(`/processunit`, dataToSave)
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
      <Card>
        <CardHeader>
          <FormattedMessage id={!!id ? "edit.process" : "add.process"} />
        </CardHeader>
        <CardBody>
          <Row>
            <Col breakPoint={{ md: 12 }} className="mb-4">
              <TextSpan apparence="s2">
                <FormattedMessage id="unit" /> *
              </TextSpan>
              <div className="mt-1"></div>
              <SelectUnit
                onChange={(value) => setUnit(value)}
                value={unit}
                oneBlocked
              />
            </Col>

            <Col breakPoint={{ md: 6 }}>
              <Row>
                <Col breakPoint={{ md: 12 }} className="mb-4">
                  <TextSpan apparence="s2">
                    <FormattedMessage id="name" />
                  </TextSpan>
                  <InputGroup fullWidth className="mt-1">
                    <input
                      type="text"
                      placeholder={intl.formatMessage({
                        id: "name",
                      })}
                      value={unit?.name}
                      disabled
                    />
                  </InputGroup>
                </Col>

                <Col breakPoint={{ md: 9 }} className="mb-4">
                  <TextSpan apparence="s2">
                    <FormattedMessage id="address.label" />
                  </TextSpan>
                  <InputGroup fullWidth className="mt-1">
                    <input
                      type="text"
                      placeholder={intl.formatMessage({
                        id: "address.label",
                      })}
                      value={unit?.address}
                      disabled
                    />
                  </InputGroup>
                </Col>
                <Col breakPoint={{ md: 3 }} className="mb-4">
                  <TextSpan apparence="s2">
                    <FormattedMessage id="number.label" />
                  </TextSpan>
                  <InputGroup fullWidth className="mt-1">
                    <input
                      type="number"
                      placeholder={intl.formatMessage({
                        id: "number.label",
                      })}
                      value={unit?.number}
                      disabled
                    />
                  </InputGroup>
                </Col>
                <Col breakPoint={{ md: 8 }} className="mb-4">
                  <TextSpan apparence="s2">
                    <FormattedMessage id="district.label" />
                  </TextSpan>
                  <InputGroup fullWidth className="mt-1">
                    <input
                      type="text"
                      placeholder={intl.formatMessage({
                        id: "district.label",
                      })}
                      value={unit?.district}
                      disabled
                    />
                  </InputGroup>
                </Col>
                <Col breakPoint={{ md: 4 }} className="mb-4">
                  <TextSpan apparence="s2">
                    <FormattedMessage id="zip.label" />
                  </TextSpan>
                  <InputGroup fullWidth className="mt-1">
                    <input
                      type="text"
                      placeholder={intl.formatMessage({
                        id: "zip.label",
                      })}
                      value={unit?.zip}
                      disabled
                    />
                  </InputGroup>
                </Col>
                <Col breakPoint={{ md: 10 }} className="mb-4">
                  <TextSpan apparence="s2">
                    <FormattedMessage id="city" />
                  </TextSpan>
                  <InputGroup fullWidth className="mt-1">
                    <input
                      type="text"
                      placeholder={intl.formatMessage({
                        id: "city.label",
                      })}
                      value={unit?.city}
                      disabled
                    />
                  </InputGroup>
                </Col>
                <Col breakPoint={{ md: 2 }} className="mb-4">
                  <TextSpan apparence="s2">
                    <FormattedMessage id="state.label" />
                  </TextSpan>
                  <InputGroup fullWidth className="mt-1">
                    <input
                      type="text"
                      placeholder={intl.formatMessage({
                        id: "state.label",
                      })}
                      maxLength={2}
                      value={unit?.state}
                      disabled
                    />
                  </InputGroup>
                </Col>
              </Row>
            </Col>

            <Col breakPoint={{ md: 6 }}>
              <Row>
                <Col breakPoint={{ md: 6 }} className="mb-4">
                  <TextSpan apparence="s2">
                    <FormattedMessage id="date" /> *
                  </TextSpan>
                  <DateTime
                    onChangeDate={(value) => onChange("dateInput", value)}
                    date={data?.dateInput}
                    onlyDate
                  />
                </Col>

                <Col breakPoint={{ md: 6 }} className="mb-4">
                  <TextSpan apparence="s2">
                    <FormattedMessage id="status" /> *
                  </TextSpan>
                  <InputGroup fullWidth className="mt-1">
                    <input
                      type="text"
                      placeholder={intl.formatMessage({
                        id: "status",
                      })}
                      maxLength={60}
                      onChange={(text) => onChange("status", text.target.value)}
                      value={data?.status}
                    />
                  </InputGroup>
                </Col>

                <Col breakPoint={{ md: 12 }} className="mb-4">
                  <TextSpan apparence="s2">
                    <FormattedMessage id="type" /> *
                  </TextSpan>
                  <InputGroup fullWidth className="mt-1">
                    <input
                      type="text"
                      placeholder={intl.formatMessage({
                        id: "type",
                      })}
                      maxLength={60}
                      onChange={(text) => onChange("type", text.target.value)}
                      value={data?.type}
                    />
                  </InputGroup>
                </Col>

                <Col breakPoint={{ md: 12 }}>
                  <TextSpan apparence="s2">
                    <FormattedMessage id="observation" />
                  </TextSpan>
                  <InputGroup fullWidth className="mt-1">
                    <textarea
                      type="text"
                      placeholder={intl.formatMessage({
                        id: "observation",
                      })}
                      onChange={(text) =>
                        onChange("observation", text.target.value)
                      }
                      value={data?.observation}
                      rows={5}
                    />
                  </InputGroup>
                </Col>
              </Row>
            </Col>
          </Row>
        </CardBody>
        <CardFooter>
          <Row className="ml-1 mr-1">
            <Button size="Small" onClick={onSave}>
              <FormattedMessage id="save" />
            </Button>
          </Row>
        </CardFooter>
      </Card>
      <SpinnerFull isLoading={isLoading} />
    </>
  );
};

export default AddProcessUnit;
