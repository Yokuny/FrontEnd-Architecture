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
} from "@paljs/ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { toast } from "react-toastify";
import styled from "styled-components";
import {
  Fetch,
  SelectEnterprise,
  SpinnerFull,
  TextSpan,
} from "../../../components";
import { useNavigate } from "react-router-dom";

const ContainerIcon = styled.a`
  position: absolute;
  right: 10px;
  top: 6px;
  cursor: pointer;
`;

const SetupApiExternal = (props) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const [showPass, setShowPass] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [data, setData] = React.useState();
  const [enterprise, setEnterprise] = React.useState();

  const idEnterpriseQuery = new URL(window.location.href).searchParams.get(
    "id"
  );

  React.useLayoutEffect(() => {
    if (idEnterpriseQuery) getData(idEnterpriseQuery);
  }, []);

  React.useLayoutEffect(() => {
    if (enterprise?.value) {
      getData(enterprise?.value);
    }
  }, [enterprise]);

  const getData = (id) => {
    setIsLoading(true);
    Fetch.get(`/setupenterprise/find/api?idEnterprise=${id}`)
      .then((response) => {
        if (response.data) {
          setData({
            idEnterprise: id,
            id: response.data.id,
            windyKey: response.data?.api?.windyKey,
          });
        } else {
          setData({
            idEnterprise: id,
            id: "",
            windyKey: ""
          });
        }
        setIsLoading(false);
      })
      .catch((e) => {
        setData({
          idEnterprise: id,
          id: "",
          windyKey: ""
        });
        setIsLoading(false);
      });
  };

  const onChange = (prop, value) => {
    setData({
      ...data,
      [prop]: value,
    });
  };

  const onSave = () => {
    if (!data?.idEnterprise) {
      toast.warn(intl.formatMessage({ id: "enterprise.required" }));
      return;
    }

    if (!data?.windyKey) {
      toast.warn(intl.formatMessage({ id: "api.key.required" }));
      return;
    }

    const dataToSave = {
      idEnterprise: data?.idEnterprise,
      id: data?.id,
      windyKey: data?.windyKey
    };
    setIsLoading(true);
    Fetch.put("/setupenterprise/api", dataToSave)
      .then((response) => {
        toast.success(intl.formatMessage({ id: "save.successfull" }));
        navigate(-1);
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  return (
    <>
      <Card>
        <CardHeader>
          <TextSpan apparence="s2">
            <FormattedMessage id="setup.email" />
          </TextSpan>
        </CardHeader>
        <CardBody>
          <Row>
            {!idEnterpriseQuery && (
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
            )}
            <Col breakPoint={{ md: 6 }} className="mb-4">
              <TextSpan apparence="s2">API Key Wind</TextSpan>
              <InputGroup fullWidth size="Small" className="mt-1">
                <input
                  type={showPass ? "text" : "password"}
                  value={data?.windyKey}
                  placeholder={"API KEY"}
                  onChange={(e) => onChange("windyKey", e.target.value)}
                />
                <ContainerIcon onClick={() => setShowPass(!showPass)}>
                  <EvaIcon
                    name={showPass ? "eye-outline" : "eye-off-outline"}
                    status="Basic"
                  />
                </ContainerIcon>
              </InputGroup>
            </Col>
          </Row>
        </CardBody>
        <CardFooter>
          <Button size="Small" onClick={onSave} disabled={(!data?.windyKey || data?.windyKey.includes('***'))}>
            <FormattedMessage id="save" />
          </Button>
        </CardFooter>
      </Card>
      <SpinnerFull isLoading={isLoading} />
    </>
  );
};

export default SetupApiExternal;
