import { Card, CardBody, EvaIcon, Row, breakpointDown } from "@paljs/ui";
import { Button } from "@paljs/ui/Button";
import { InputGroup } from "@paljs/ui/Input";
import React, { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { FormattedMessage, useIntl } from "react-intl";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styled from "styled-components";
import { Fetch, Group, LabelIcon, SpinnerFull, TextSpan } from "../../components";

const InputStyled = styled(InputGroup)`
  justify-content: center;
`;

const ContainerIcon = styled.div`
  position: absolute;
  right: 12px;
  top: 10px;
  cursor: pointer;
`;

const CardAuth = styled(Card)`
  margin: 50px;
  height: calc(100vh - 7rem);
  ${breakpointDown("sm")`
    margin: 0;
    height: 100vh;
  `}
  ${CardBody} {
    display: flex;
  }
`;

const ContentAround = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  width: 100%;
`;

const CriteriasWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 1rem;
`;

const ResetPassword = (props) => {
  const recaptchRef = React.useRef();
  const timeRef = React.useRef();
  const navigate = useNavigate();
  const intl = useIntl();

  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [reCaptcha, setReCaptcha] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showPassConfirm, setShowPassConfirm] = useState(false);

  const [passwordIcons, setPasswordIcons] = useState({
    minLength: { name: "alert-circle-outline", status: "Danger" },
    hasLowerCase: { name: "alert-circle-outline", status: "Danger" },
    hasUpperCase: { name: "alert-circle-outline", status: "Danger" },
    hasSpecialChar: { name: "alert-circle-outline", status: "Danger" },
  });

  React.useEffect(() => {
    return () => {
      if (timeRef.current) {
        clearTimeout(timeRef.current);
      }
    };
  }, []);

  const resetClick = () => {
    const request = new URL(window.location.href).searchParams.get("request");

    if (!request) {
      toast.warn(intl.formatMessage({ id: "change.required" }));
      return;
    }

    if (!password) {
      toast.warn(intl.formatMessage({ id: "password.required" }));
      return;
    }

    if (password !== rePassword) {
      toast.warn(intl.formatMessage({ id: "passwords.different" }));
      return;
    }

    setIsLoading(true);
    Fetch.post("/account/new-password", { request, password, reCaptcha })
      .then((response) => {
        setIsLoading(false);
        toast.success(intl.formatMessage({ id: "save.successfull" }));
        timeRef.current = setTimeout(() => {
          navigate("/login");
        }, 1000);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  };

  const handlePasswordChange = (newPassword) => {

    setPassword(newPassword);

    setPasswordIcons({
      minLength: {
        name: newPassword.length >= 8 ? "checkmark-circle-outline" : "alert-circle-outline",
        status: newPassword.length >= 8 ? "Success" : "Danger",
      },
      hasLowerCase: {
        name: /[a-z]/.test(newPassword) ? "checkmark-circle-outline" : "alert-circle-outline",
        status: /[a-z]/.test(newPassword) ? "Success" : "Danger",
      },
      hasUpperCase: {
        name: /[A-Z]/.test(newPassword) ? "checkmark-circle-outline" : "alert-circle-outline",
        status: /[A-Z]/.test(newPassword) ? "Success" : "Danger",
      },
      hasSpecialChar: {
        name: /[*,@,#,!,?,_,-,=,+,$]/.test(newPassword) ? "checkmark-circle-outline" : "alert-circle-outline",
        status: /[*,@,#,!,?,_,-,=,+,$]/.test(newPassword) ? "Success" : "Danger",
      },
    });
  };

  const isPasswordValid = () => {
    return (
      passwordIcons.minLength.status === "Success" &&
      passwordIcons.hasLowerCase.status === "Success" &&
      passwordIcons.hasUpperCase.status === "Success" &&
      passwordIcons.hasSpecialChar.status === "Success"
    );
  };

  function renderCriteriaIcon({ name, status }) {
    return <EvaIcon name={name} status={status} options={{ width: 16, height: 16 }} />
  };

  return (
    <Row center middle="xs"style={{ margin: 0 }}>
      <CardAuth>
        <CardBody>
          <ContentAround>
            <TextSpan apparence="s1">
              <FormattedMessage id="request.password" />
            </TextSpan>
            <TextSpan apparence="p2" hint>
              <FormattedMessage id="new.password.details" />
            </TextSpan>

            <form style={{ width: "100%" }}>
              <LabelIcon
                iconName="unlock-outline"
                title={<FormattedMessage id="new.password" />}
              />
              <InputGroup fullWidth className="mb-4">
                <input
                  type={showPass ? "text" : "password"}
                  placeholder={intl.formatMessage({
                    id: "new.password",
                  })}
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                />
                <ContainerIcon onClick={() => setShowPass(!showPass)}>
                  <EvaIcon
                    name={showPass ? "eye-outline" : "eye-off-outline"}
                    status="Basic"
                  />
                </ContainerIcon>

              </InputGroup>

              <CriteriasWrapper>
                <LabelIcon
                  title={intl.formatMessage({ id: "form.min.length" })}
                  renderIcon={() => renderCriteriaIcon(passwordIcons.minLength)}
                />
                <LabelIcon
                  title={intl.formatMessage({ id: "form.has.lower.case" })}
                  renderIcon={() => renderCriteriaIcon(passwordIcons.hasLowerCase)}
                />
                <LabelIcon
                  title={intl.formatMessage({ id: "form.has.upper.case" })}
                  renderIcon={() => renderCriteriaIcon(passwordIcons.hasUpperCase)}
                />
                <LabelIcon
                  title={intl.formatMessage({ id: "form.has.special.char" })}
                  renderIcon={() => renderCriteriaIcon(passwordIcons.hasSpecialChar)}
                />
              </CriteriasWrapper>

              <LabelIcon
                iconName="lock-outline"
                title={<FormattedMessage id="account.confirm.password" />}
              />
              <InputGroup fullWidth className="mb-4">
                <input
                  type={showPassConfirm ? "text" : "password"}
                  placeholder={intl.formatMessage({
                    id: "account.confirm.password",
                  })}
                  value={rePassword}
                  onChange={(e) => setRePassword(e.target.value)}
                />
                <ContainerIcon
                  onClick={() => setShowPassConfirm(!showPassConfirm)}
                >
                  <EvaIcon
                    name={showPassConfirm ? "eye-outline" : "eye-off-outline"}
                    status="Basic"
                  />
                </ContainerIcon>
              </InputGroup>

              <InputStyled fullWidth className="mb-4">
                <ReCAPTCHA
                  onChange={(value) => setReCaptcha(value)}
                  size="normal"
                  sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
                  ref={recaptchRef}
                />
              </InputStyled>
              <Button
                status="Primary"
                type="button"
                fullWidth
                onClick={resetClick}
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "row",
                  justifyContent: "center",
                }}
                disabled={!isPasswordValid() || !password || !rePassword || !reCaptcha}
              >
                 <EvaIcon
                  className="mr-1"
                  name="checkmark-outline"
                />
                <FormattedMessage id="save" />
              </Button>
            </form>

            <Group>
              <Button
                appearance="ghost"
                status="Info"
                size="Tiny"
                className="flex-between"
                onClick={() => navigate("/login")}
              >
                <EvaIcon
                  className="mr-1"
                  name="arrow-ios-back-outline"
                />
                <FormattedMessage id="back.login" />
              </Button>
            </Group>
          </ContentAround>
        </CardBody>
      </CardAuth>
      <SpinnerFull isLoading={isLoading} />
    </Row>
  );
};

export default ResetPassword;
