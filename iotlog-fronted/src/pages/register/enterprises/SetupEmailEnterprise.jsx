import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Checkbox,
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

const SetupEmailEnterprise = (props) => {
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
    Fetch.get(`/setupenterprise/find?idEnterprise=${id}`)
      .then((response) => {
        if (response.data) {
          const email = response.data?.email;
          setData({
            idEnterprise: id,
            id: response.data.id,
            host: email?.host,
            port: email?.port,
            secure: !!email?.secure,
            email: email?.auth?.user,
            accountname: email?.accountname,
          });
        } else {
          setData({
            idEnterprise: id,
            id: "",
            host: "",
            port: "",
            secure: "",
            email: "",
            accountname: "",
          });
        }
        setIsLoading(false);
      })
      .catch((e) => {
        setData({
          idEnterprise: id,
          id: "",
          host: "",
          port: "",
          secure: "",
          email: "",
          accountname: "",
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

    if (!data?.host) {
      toast.warn(intl.formatMessage({ id: "host.required" }));
      return;
    }

    if (!data?.port) {
      toast.warn(intl.formatMessage({ id: "port.required" }));
      return;
    }

    if (!data?.email) {
      toast.warn(intl.formatMessage({ id: "email.required" }));
      return;
    }

    if (!data?.password) {
      toast.warn(intl.formatMessage({ id: "password.required" }));
      return;
    }

    const dataToSave = {
      idEnterprise: data?.idEnterprise,
      id: data?.id,
      email: {
        host: data?.host,
        port: data?.port,
        secure: !!data?.secure,
        accountname: data?.accountname,
        auth: {
          user: data?.email,
          pass: data?.password,
        },
      },
    };
    setIsLoading(true);
    Fetch.post("/setupenterprise", dataToSave)
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
              <TextSpan apparence="s2">Host</TextSpan>
              <InputGroup fullWidth size="Small" className="mt-1">
                <input
                  type="text"
                  value={data?.host}
                  onChange={(e) => onChange("host", e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col breakPoint={{ md: 3 }} className="mb-4">
              <TextSpan apparence="s2">Port</TextSpan>
              <InputGroup fullWidth size="Small" className="mt-1">
                <input
                  type="number"
                  value={data?.port}
                  onChange={(e) => onChange("port", parseInt(e.target.value))}
                />
              </InputGroup>
            </Col>
            <Col breakPoint={{ md: 3 }} className="mb-4 col-center">
              <Checkbox
                className="mt-4"
                checked={data?.secure}
                onChange={(e) => onChange("secure", !data?.secure)}
              >
                <TextSpan apparence="s2">Secure (SSL/TLS)</TextSpan>
              </Checkbox>
            </Col>
            <Col breakPoint={{ md: 12 }} className="mb-4">
              <TextSpan apparence="s2">Account name</TextSpan>
              <InputGroup fullWidth size="Small" className="mt-1">
                <input
                  type="text"
                  value={data?.accountname}
                  onChange={(e) => onChange("accountname", e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col breakPoint={{ md: 6 }} className="mb-4">
              <TextSpan apparence="s2">Email</TextSpan>
              <InputGroup fullWidth size="Small" className="mt-1">
                <input
                  type="email"
                  value={data?.email}
                  onChange={(e) => onChange("email", e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col breakPoint={{ md: 6 }} className="mb-4">
              <TextSpan apparence="s2">Password</TextSpan>
              <InputGroup fullWidth size="Small" className="mt-1">
                <input
                  type={showPass ? "text" : "password"}
                  value={data?.password}
                  onChange={(e) => onChange("password", e.target.value)}
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
          <Button size="Small" onClick={onSave}>
            <FormattedMessage id="save" />
          </Button>
        </CardFooter>
      </Card>
      <SpinnerFull isLoading={isLoading} />
    </>
  );
};

export default SetupEmailEnterprise;
