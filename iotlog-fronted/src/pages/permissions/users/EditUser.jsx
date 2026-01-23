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
import { Checkbox } from "@paljs/ui/Checkbox";
import {
  SpinnerFull,
  SelectLanguageForm,
  Fetch,
  TextSpan,
  DeleteConfirmation,
  SelectTypeUser,
  LabelIcon,
} from "../../../components";
import InputWhatsapp from "../../../components/Inputs/InputWhatsapp";
import BackButton from "../../../components/Button/BackButton";
import { LANGUAGES } from "../../../constants";
import { convertTypeUserTOSelect } from "../../../components/Select/SelectTypeUser";
import DisableUser from "./DisableUser";
import { useNavigate } from "react-router-dom";
import { EvaIcon, Select } from "@paljs/ui";

const ContainerRow = styled(Row)`
  input {
    line-height: 0.5rem;
  }
`;

const EditUser = (props) => {
  const intl = useIntl();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = React.useState(false);
  const [data, setData] = React.useState();
  const searchparams = new URL(window.location.href).searchParams;
  const id = searchparams.get("id");

  const optionsLogin = [
    { value: 'password', label: intl.formatMessage({ id: 'login.password' }) },
    { value: 'sso', label: 'SSO' }
  ]

  const hasPermissionUserDelete = props.items?.some(
    (x) => x === "/delete-user"
  );

  const hasPermissionUserDisable = props.items?.some(
    (x) => x === "/disable-user"
  );


  React.useLayoutEffect(() => {
    getData();
  }, []);

  const getData = () => {
    setIsLoading(true);
    Fetch.get(`/user/find/details?id=${id}`)
      .then((response) => {
        setData({
          ...response.data,
          language: LANGUAGES.find((x) => x.value === response.data?.language),
          types: response.data?.types?.map(y => convertTypeUserTOSelect(y)),
          typeCredentials: optionsLogin.filter(x => response.data?.typeCredentials?.includes(x.value))
        });
        setIsLoading(false);
      })
      .catch((e) => {
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
    if (!data?.email && !data?.isOnlyContact) {
      toast.warn(intl.formatMessage({ id: "email.required" }));
      return;
    }

    if (!data?.name) {
      toast.warn(intl.formatMessage({ id: "name.required" }));
      return;
    }

    setIsLoading(true);
    Fetch.put("/user/update", {
      id,
      name: data?.name,
      email: data?.email ? data?.email?.replace(/ /g, "") : "",
      language: data?.language?.value,
      phone: data?.phone,
      isOnlyContact: data?.isOnlyContact,
      isSentMessageWelcome: !!data?.isSentMessageWelcome,
      types: data?.types?.map(x => x.value),
      typeCredentials: data?.typeCredentials?.map(x => x.value)
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

  const onDelete = () => {
    setIsLoading(true);
    Fetch.delete(`/user/delete?id=${id}`)
      .then((response) => {
        toast.success(intl.formatMessage({ id: "delete.successfull" }));
        setIsLoading(false);
        navigate(-1);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const isDisabled = !!data?.disabledAt;

  return (
    <>
      <Card>
        <CardHeader>
          <Row middle="xs">
            <FormattedMessage id={"edit.user"} />
          </Row>
        </CardHeader>
        <CardBody>
          <ContainerRow>
            <Col breakPoint={{ lg: 8, md: 8 }} className="mb-4">
              <LabelIcon
                iconName="person-outline"
                title={`${intl.formatMessage({ id: 'account.name' })} *`}
              />
              <InputGroup fullWidth className="mt-1">
                <input
                  disabled={isDisabled}
                  type="text"
                  placeholder={intl.formatMessage({
                    id: "account.name",
                  })}
                  onChange={(text) => onChange("name", text.target.value)}
                  value={data?.name}
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
                checked={!data?.isOnlyContact}
                disabled={isDisabled}
                onChange={(e) =>
                  onChange("isOnlyContact", !data?.isOnlyContact)
                }
              >
                <TextSpan apparence="s2">
                  <FormattedMessage id="user.system" />
                </TextSpan>
              </Checkbox>
            </Col>
            <Col breakPoint={{ lg: 8, md: 8 }} className="mb-4">
              <LabelIcon
                iconName="email-outline"
                title={`${intl.formatMessage({ id: 'login.email' })} ${!data?.isOnlyContact ? "*" : ""}`}
              />
              <InputGroup fullWidth className="mt-1">
                <input
                  type="email"
                  placeholder={intl.formatMessage({
                    id: "login.email",
                  })}
                  disabled={isDisabled}
                  value={data?.email}
                  onChange={(e) => onChange("email", e.target.value)}
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
                disabled={isDisabled}
                value={data?.phone}
                className="pl-1 mt-1"
                onChange={(value) => onChange("phone", value)}
              />
            </Col>
            <Col breakPoint={{ lg: 8, md: 8 }} className="mb-4">
              <LabelIcon
                iconName="info-outline"
                title={`${intl.formatMessage({ id: 'type' })}`}
              />
              <div className="mt-1"></div>
              <SelectTypeUser
                isMulti
                isDisabled={isDisabled}
                onChange={(value) => onChange("types", value)}
                value={data?.types}
                idEnterprise={
                  !props.enterprises?.length ? props.enterprises[0]?.id : ""
                }
              />
            </Col>
            <Col breakPoint={{ lg: 4, md: 4 }} className="mb-4">
              <LabelIcon
                iconName="globe-outline"
                title={`${intl.formatMessage({ id: 'language' })}`}
              />
              <div className="mt-1"></div>
              <SelectLanguageForm
                onChange={(value) => onChange("language", value)}
                value={data?.language}
                isDisabled={isDisabled}
              />
            </Col>
            <Col breakPoint={{ lg: 4, md: 4 }} className="mb-4">
              <LabelIcon
                iconName="lock-outline"
                title={intl.formatMessage({ id: 'credentials.by' })} />
              <Select
                options={optionsLogin}
                placeholder={intl.formatMessage({ id: 'credentials.by' })}
                value={data?.typeCredentials}
                onChange={(value) => onChange('typeCredentials', value)}
                isMulti
                menuPosition="fixed"
              />
            </Col>
            {data?.phone > 1 && (
              <Col breakPoint={{ lg: 4, md: 4 }}>
                <LabelIcon
                  iconName="message-circle-outline"
                  title={`${intl.formatMessage({ id: 'message' })}`}
                />
                <Checkbox
                  checked={data?.isSentMessageWelcome}
                  disabled={isDisabled}
                  onChange={(e) =>
                    onChange(
                      "isSentMessageWelcome",
                      !data?.isSentMessageWelcome
                    )
                  }
                >
                  <TextSpan apparence="s2">
                    <FormattedMessage id="sent.message.welcome" /> (WhatsApp)
                  </TextSpan>
                </Checkbox>
              </Col>
            )}
          </ContainerRow>
        </CardBody>
        <CardFooter>
          <Row between={"xs"} className="ml-1 mr-1">
            <Row className="m-0">
            <BackButton />
            <Row className="m-0">
              {!!hasPermissionUserDisable && <DisableUser
                idUser={id}
                history={props.history}
                disable={data?.disabledAt}
              />}
              {!!hasPermissionUserDelete && <DeleteConfirmation
                message={intl.formatMessage({ id: "delete.message.default" })}
                onConfirmation={onDelete}
                iconButton={() => <EvaIcon name="person-delete-outline" className="mr-1" />}
              />}
            </Row>
            </Row>
            {!data?.disabledAt && <Button size="Small" disabled={!id} onClick={onSave}>
              <FormattedMessage id="save" />
            </Button>}
          </Row>
        </CardFooter>
      </Card>
      <SpinnerFull isLoading={isLoading} />
    </>
  );
};

const mapStateToProps = (state) => ({
  items: state.menu.items,
  enterprises: state.enterpriseFilter.enterprises,
});

export default connect(mapStateToProps, undefined)(EditUser);
