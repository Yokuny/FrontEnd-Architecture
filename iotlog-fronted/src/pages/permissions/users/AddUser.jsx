import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Card, CardHeader, CardBody, CardFooter } from "@paljs/ui/Card";
import Row from "@paljs/ui/Row";
import Col from "@paljs/ui/Col";
import { InputGroup } from "@paljs/ui/Input";
import { Button } from "@paljs/ui/Button";
import { toast } from "react-toastify";
import { connect } from "react-redux";
import styled from "styled-components";
import {
  SelectEnterprise,
  SelectLanguageForm,
  SpinnerFull,
  SelectRole,
  Fetch,
  TextSpan,
  SelectTypeUser,
  SelectCustomer,
  LabelIcon,
} from "../../../components";
import InputWhatsapp from "../../../components/Inputs/InputWhatsapp";
import { Checkbox, Select } from "@paljs/ui";
import { useNavigate } from "react-router-dom";
import { SelectEnterpriseWithSetup } from "../../../components/Select";

const ContainerRow = styled(Row)`
  input {
    line-height: 0.5rem;
  }
`;

const AddUser = (props) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);
  const [enterprise, setEnterprise] = React.useState(undefined);
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [isUser, setIsUser] = React.useState(true);
  const [roles, setRoles] = React.useState([]);
  const [language, setLanguage] = React.useState([]);
  const [userTypes, setUserTypes] = React.useState([]);
  const [customers, setCustomers] = React.useState([]);

  const [isSentMessageWelcome, setIsSentMessageWelcome] = React.useState(true);
  const [isUserCustomer, setIsUserCustomer] = React.useState(false);

  const optionsLogin = [
    { value: 'password', label: intl.formatMessage({ id: 'login.password' }) },
    { value: 'sso', label: 'SSO' }
  ]

  const [typeCredentials, setTypeCredentials] = React.useState([optionsLogin[0]]);

  const onSave = () => {
    if (!enterprise?.value) {
      toast.warn(intl.formatMessage({ id: "enterprise.required" }));
      return;
    }

    if (!email && isUser) {
      toast.warn(intl.formatMessage({ id: "email.required" }));
      return;
    }

    if (!name) {
      toast.warn(intl.formatMessage({ id: "name.required" }));
      return;
    }

    if (isUserCustomer && !customers?.length) {
      toast.warn(intl.formatMessage({ id: "customers.required" }));
      return;
    }

    setIsLoading(true);
    Fetch.post("/user/add", {
      email: email ? email.replace(/ /g, "") : "",
      name,
      idEnterprise: enterprise?.value,
      roles: roles?.map((x) => x.value),
      language: language?.value,
      phone,
      isUser,
      isSentMessageWelcome,
      types: userTypes?.map(x => x.value),
      isUserCustomer,
      customers: isUserCustomer && customers?.length
        ? customers?.map(x => x.value)
        : [],
      typeCredentials: isUser && typeCredentials?.length
        ? typeCredentials?.map(x => x.value)
        : []
    })
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
          <FormattedMessage id={"add.user"} />
        </CardHeader>
        <CardBody>
          <ContainerRow>
            <Col breakPoint={{ lg: 12, md: 12 }} className="mb-4">
              <LabelIcon
                iconName="home-outline"
                title={`${intl.formatMessage({ id: 'enterprise' })} *`}
              />
              <div className="mt-1"></div>
              <SelectEnterpriseWithSetup
                onChange={(value) => setEnterprise(value)}
                value={enterprise}
                oneBlocked
              />
            </Col>
            <Col breakPoint={{ lg: 8, md: 8 }} className="mb-4">
              <LabelIcon
                iconName="person-outline"
                title={`${intl.formatMessage({ id: 'account.name' })} *`}
              />
              <InputGroup fullWidth className="mt-1">
                <input
                  type="text"
                  placeholder={intl.formatMessage({
                    id: "account.name",
                  })}
                  onChange={(text) => setName(text.target.value)}
                  value={name}
                  maxLength={150}
                />
              </InputGroup>
            </Col>
            <Col breakPoint={{ lg: 4, md: 4 }} className="mb-4">
              <LabelIcon
                iconName="monitor-outline"
                title={`${intl.formatMessage({ id: 'system' })}`}
              />
              <Checkbox
                className="mt-1"
                checked={isUser} onChange={(e) => setIsUser(!isUser)}>
                <TextSpan apparence="s2">
                  <FormattedMessage id="user.system" />
                </TextSpan>
              </Checkbox>
            </Col>
            <Col breakPoint={{ lg: 8, md: 8 }} className="mb-4">
              <LabelIcon
                iconName="email-outline"
                title={`${intl.formatMessage({ id: 'login.email' })} ${isUser ? "*" : ""}`}
              />
              <InputGroup fullWidth className="mt-1">
                <input
                  type="email"
                  placeholder={intl.formatMessage({
                    id: "login.email",
                  })}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </InputGroup>
            </Col>
            <Col breakPoint={{ lg: 4, md: 4 }} className="mb-4">
              <LabelIcon
                iconName="phone-outline"
                title={`WhatsApp`}
              />
              <InputWhatsapp
                value={phone}
                className="pl-1 mt-1"
                onChange={(value) => setPhone(value)}
              />
            </Col>
            <Col breakPoint={{ lg: 12, md: 12 }} className="mb-4">
              <LabelIcon
                iconName="shield-outline"
                title={`${intl.formatMessage({ id: 'role' })}`}
              />
              <div className="mt-1"></div>
              <SelectRole onChange={(value) => setRoles(value)} value={roles} />
            </Col>
            <Col breakPoint={{ lg: 8, md: 8 }} className="mb-4">
              <LabelIcon
                iconName="info-outline"
                title={`${intl.formatMessage({ id: 'type' })}`}
              />
              <div className="mt-1"></div>
              <SelectTypeUser
                isMulti
                onChange={(value) => setUserTypes(value)}
                value={userTypes}
                idEnterprise={enterprise?.value}
              />
            </Col>
            <Col breakPoint={{ lg: 4, md: 4 }} className="mb-4">
              <LabelIcon
                iconName="globe-outline"
                title={`${intl.formatMessage({ id: 'language' })}`}
              />
              <div className="mt-1"></div>
              <SelectLanguageForm onChange={(value) => setLanguage(value)} value={language} />
            </Col>

            {enterprise?.ssoSetuped && <Col breakPoint={{ lg: 4, md: 4 }} className="mb-4">
              <LabelIcon
                iconName="lock-outline"
                title={intl.formatMessage({ id: 'credentials.by' })} />
              <Select
                options={optionsLogin}
                placeholder={intl.formatMessage({ id: 'credentials.by' })}
                value={typeCredentials}
                onChange={(value) => setTypeCredentials(value)}
                isMulti
                menuPosition="fixed"
                isDisabled={!enterprise?.ssoSetuped}
              />
            </Col>}

            {phone > 1 && (
              <Col breakPoint={{ lg: 4, md: 4 }} className="mb-4">
                <LabelIcon
                  iconName="message-circle-outline"
                  title={`${intl.formatMessage({ id: 'message' })}`}
                />
                <Checkbox
                  checked={isSentMessageWelcome}
                  onChange={(e) =>
                    setIsSentMessageWelcome(!isSentMessageWelcome)
                  }
                >
                  <TextSpan apparence="s2">
                    <FormattedMessage id="sent.message.welcome" /> (WhatsApp)
                  </TextSpan>
                </Checkbox>
              </Col>
            )}
            <Col breakPoint={{ lg: 4, md: 4 }} className="mb-4">
              <LabelIcon
                iconName="people-outline"
                title={`${intl.formatMessage({ id: 'customer' })}`}
              />
              <Checkbox checked={isUserCustomer} onChange={(e) => setIsUserCustomer(prevState => !prevState)}>
                <TextSpan apparence="s2">
                  <FormattedMessage id="user.customer" />
                </TextSpan>
              </Checkbox>
            </Col>
            {isUserCustomer && <Col breakPoint={{ lg: 12, md: 12 }}>
              <LabelIcon
                iconName="people-outline"
                title={`${intl.formatMessage({ id: 'customer' })}`}
              />
              <SelectCustomer
                onChange={(value) => setCustomers(value)}
                value={customers}
                idEnterprise={enterprise?.value}
                className="mt-1"
                isMulti
              />
            </Col>}
          </ContainerRow>
        </CardBody>
        <CardFooter>
          <Row end="xs" className="ml-1 mr-1">
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

const mapStateToProps = (state) => ({
  locale: state.settings.locale,
});

export default connect(mapStateToProps, undefined)(AddUser);
