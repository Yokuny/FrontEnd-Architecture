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
import Axios from "axios";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { toast } from "react-toastify";
import {
  FetchSupport,
  SelectEnterprise,
  SpinnerFull,
  TextSpan,
} from "../../components";
import { useNavigate } from "react-router-dom";

const AddUnit = (props) => {
  const [data, setData] = React.useState();
  const [enterprise, setEnterprise] = React.useState();
  const [isLoading, setIsLoading] = React.useState(false);
  const searchparams = new URL(window.location.href).searchParams;
  const id = searchparams.get("id");
  const navigate = useNavigate();
  const intl = useIntl();

  React.useLayoutEffect(() => {
    if (id) {
      onSearch();
    }
  }, [])

  const onSearch = () => {
    setIsLoading(true);
    FetchSupport.get(`/unit?id=${id}`)
    .then(response => {
      setData(response.data)
      setEnterprise({
        value: response.data.idEnterprise,
        label: response.data.nameEnterprise,
      })
      setIsLoading(false)
    })
    .catch(e => {
      setIsLoading(false)
    })
  }

  const onChange = (prop, value) => {
    setData((prevState) => ({
      ...prevState,
      [prop]: value,
    }));

    if (
      !isLoading &&
      prop === "zip" &&
      ((value?.includes("-") && value?.length >= 9) ||
        (!value?.includes("-") && value?.length >= 8))
    ) {
      getCep(value);
    }
  };

  const getCep = (cep) => {
    setIsLoading(true);
    Axios.get(`https://viacep.com.br/ws/${cep?.replace(/\D/g, "")}/json/`)
      .then((response) => {
        if (response.data && !response.data.erro) {
          setData({
            ...data,
            zip: cep,
            address: response.data.logradouro,
            state: response.data.uf,
            city: response.data.localidade,
            district: response.data.bairro,
          });
        }
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const onChangeCoordinate = (prop, value) => {
    const valueNormalized = !value
      ? ""
      : value === "-"
      ? "-"
      : value.includes(".")
      ? value.split(".")[1]
        ? parseFloat(value)
        : value
      : parseFloat(value?.match(/[+-]?([0-9]*[.])?[0-9]+/));
    onChange(prop, valueNormalized);
  };

  const onSave = () => {
    if (!enterprise?.value) {
      toast.warn(intl.formatMessage({ id: "enterprise.required" }));
      return;
    }

    if (!data?.name) {
      toast.warn(intl.formatMessage({ id: "name.required" }));
      return;
    }

    setIsLoading(true);
    const dataToSave = {
      id,
      idEnterprise: enterprise?.value,
      nameEnterprise: enterprise?.label,
      address: data?.address,
      number: data?.number,
      observation: data?.observation,
      zip: data?.zip,
      district: data.district,
      name: data?.name,
      city: data?.city,
      state: data?.state,
      latitude: !data?.latitude ? null : parseFloat(data?.latitude),
      longitude: !data?.longitude ? null : parseFloat(data?.longitude),
    };
    FetchSupport.post(`/unit`, dataToSave)
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
          <FormattedMessage id={!!id ? "edit.unit" : "add.unit"} />
        </CardHeader>
        <CardBody>
          <Row>
            <Col breakPoint={{ md: 12 }} className="mb-4">
              <TextSpan apparence="s2">
                <FormattedMessage id="enterprise" /> *
              </TextSpan>
              <div className="mt-1"></div>
              <SelectEnterprise
                onChange={(value) => setEnterprise(value)}
                value={enterprise}
                oneBlocked
              />
            </Col>
            <Col breakPoint={{ md: 12 }} className="mb-4">
              <TextSpan apparence="s2">
                <FormattedMessage id="name" /> *
              </TextSpan>
              <InputGroup fullWidth className="mt-1">
                <input
                  type="text"
                  placeholder={intl.formatMessage({
                    id: "name",
                  })}
                  onChange={(text) => onChange("name", text.target.value)}
                  value={data?.name}
                />
              </InputGroup>
            </Col>
            <Col breakPoint={{ md: 3 }} className="mb-4">
              <TextSpan apparence="s2">
                <FormattedMessage id="zip.label" />
              </TextSpan>
              <InputGroup fullWidth className="mt-1">
                <input
                  type="text"
                  placeholder={intl.formatMessage({
                    id: "zip.label",
                  })}
                  onChange={(text) => onChange("zip", text.target.value)}
                  value={data?.zip}
                  maxLength={9}
                />
              </InputGroup>
            </Col>
            <Col breakPoint={{ md: 7 }} className="mb-4">
              <TextSpan apparence="s2">
                <FormattedMessage id="address.label" />
              </TextSpan>
              <InputGroup fullWidth className="mt-1">
                <input
                  type="text"
                  placeholder={intl.formatMessage({
                    id: "address.label",
                  })}
                  onChange={(text) => onChange("address", text.target.value)}
                  value={data?.address}
                />
              </InputGroup>
            </Col>
            <Col breakPoint={{ md: 2 }} className="mb-4">
              <TextSpan apparence="s2">
                <FormattedMessage id="number.label" />
              </TextSpan>
              <InputGroup fullWidth className="mt-1">
                <input
                  type="number"
                  placeholder={intl.formatMessage({
                    id: "number.label",
                  })}
                  onChange={(text) => onChange("number", text.target.value)}
                  value={data?.number}
                />
              </InputGroup>
            </Col>
            <Col breakPoint={{ md: 5 }} className="mb-4">
              <TextSpan apparence="s2">
                <FormattedMessage id="district.label" />
              </TextSpan>
              <InputGroup fullWidth className="mt-1">
                <input
                  type="text"
                  placeholder={intl.formatMessage({
                    id: "district.label",
                  })}
                  onChange={(text) => onChange("district", text.target.value)}
                  value={data?.district}
                />
              </InputGroup>
            </Col>
            <Col breakPoint={{ md: 5 }} className="mb-4">
              <TextSpan apparence="s2">
                <FormattedMessage id="city" />
              </TextSpan>
              <InputGroup fullWidth className="mt-1">
                <input
                  type="text"
                  placeholder={intl.formatMessage({
                    id: "city.label",
                  })}
                  onChange={(text) => onChange("city", text.target.value)}
                  value={data?.city}
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
                  onChange={(text) => onChange("state", text.target.value)}
                  value={data?.state}
                />
              </InputGroup>
            </Col>
            <Col breakPoint={{ md: 6 }} className="mb-4">
              <TextSpan apparence="s2">
                <FormattedMessage id="latitude" />
              </TextSpan>
              <InputGroup fullWidth className="mt-1">
                <input
                  type="text"
                  placeholder={intl.formatMessage({
                    id: "latitude",
                  })}
                  onChange={(text) =>
                    onChangeCoordinate("latitude", text.target.value)
                  }
                  value={data?.latitude}
                  maxLength={10}
                />
              </InputGroup>
            </Col>

            <Col breakPoint={{ md: 6 }} className="mb-4">
              <TextSpan apparence="s2">
                <FormattedMessage id="longitude" />
              </TextSpan>
              <InputGroup fullWidth className="mt-1">
                <input
                  type="text"
                  placeholder={intl.formatMessage({
                    id: "longitude",
                  })}
                  onChange={(text) =>
                    onChangeCoordinate("longitude", text.target.value)
                  }
                  value={data?.longitude}
                  maxLength={10}
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
                  rows={3}
                />
              </InputGroup>
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

export default AddUnit;
