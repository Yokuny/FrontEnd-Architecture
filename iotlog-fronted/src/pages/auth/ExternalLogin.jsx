import React, { useState } from "react";
import { Button } from "@paljs/ui/Button";
import { InputGroup } from "@paljs/ui/Input";
import { Link } from "react-router-dom";
import { FormattedMessage, useIntl } from "react-intl";
import Row from "@paljs/ui/Row";
import Col from "@paljs/ui/Col";
import ReCAPTCHA from "react-google-recaptcha";
import { Card, CardBody, EvaIcon, Spinner } from "@paljs/ui";
import styled, { css } from "styled-components";
import { breakpointDown } from "@paljs/ui/breakpoints";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { Fetch, Group, SpinnerFull, TextSpan } from "../../components";
import FooterAuth from "./FooterAuth";
import AuthLanguage from "./AuthLanguage";
import { useAuth } from "../../components/Contexts/Auth";
import { translate } from "../../components/language";

const InputStyled = styled(InputGroup)`
  justify-content: center;
`;

const ColContent = styled(Col)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: calc(100vh);

  .copy-mobile-footer {
    @media screen and (max-width: 768px) {
      margin-top: 50px;
    }
  }
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
  max-height: 460px;

  ${breakpointDown("sm")`
    margin: 0;
    height: 100vh;
  `}
  ${CardBody} {
    display: flex;
  }
`;

const A = styled.a`
  ${({ theme }) => css`
    color: ${theme.textHintColor};
  `}
`;

const Img = styled.img`
  width: 8rem;
`;

const ContentAround = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  width: 100%;
  min-width: 270px;
`;

const ContentRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const ContentCol = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const THEMES_DARKS = ["cosmic", "dark"];

const ExtenalLogin = (props) => {
  const intl = useIntl();
  const { externalSignIn, isLoading } = useAuth();

  const recaptchRef = React.useRef();

  const [email, setEmail] = useState("");
  const [optionsSignIn, setOptionsSignIn] = useState([]);
  const [stepAtual, setStepAtual] = useState(0);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const verifyEmail = (reCaptcha) => {
    setStepAtual(2)
    Fetch
      .post(`/auth/verifyemail`, {
        email,
        reCaptcha
      })
      .then(response => {
        if (response.data?.length) {
          setOptionsSignIn(response.data)
          setStepAtual(3)
        } else {
          onBackStep(1)
        }
      })
      .catch(error => {
        if (error.response && error.response.status === 400) {
          if (error.response.data && error.response.data.code) {
            toast.warn(translate(error.response.data.code));
          }
          else {
            toast.warn(error.response.data.message);
          }
        }

        onBackStep(1)
      })

  }

  const loginClick = () => {
    externalSignIn({ email, password }, (request) => {
      const getRedirectParams = new URLSearchParams(window.location.search);
      const redirect = getRedirectParams.get("redirect_uri");
      const state = getRedirectParams.get("state");
      if (!redirect || !state) return;

      const redirectWithAccessToken = new URL(`${redirect}#state=${state}&access_token=${request.token}&token_type=Bearer`);

      window.location.replace(redirectWithAccessToken);
    })
  };

  const onBackStep = (step) => {
    if (recaptchRef?.current)
      recaptchRef.current.reset();
    setStepAtual(step);
  }

  const onSetReCaptcha = (token) => {
    verifyEmail(token);
  }

  const sourceColor = THEMES_DARKS.includes(props.theme)
    ? `iotlog_white`
    : `iotlog`;


  const renderLoginOptions = () => {
    if (stepAtual === 0) {
      return <>
        <InputGroup fullWidth className="mb-2">
          <input
            type="email"
            placeholder={intl.formatMessage({ id: "login.email" })}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <ContainerIcon>
            <EvaIcon name={"person-outline"} status="Basic" />
          </ContainerIcon>
        </InputGroup>
        <Button
          disabled={!email}
          status="Primary"
          fullWidth
          onClick={() => setStepAtual(1)}
          className="mt-2 mb-4 flex-between"
          style={{ justifyContent: "center" }}
        >
          <FormattedMessage id="next" />
          <EvaIcon name={"arrow-ios-forward-outline"} />
        </Button>
      </>
    }

    if (stepAtual === 1) {
      return <>
        <InputGroup fullWidth className="mb-2">
          <input
            type="email"
            value={email}
            disabled
          />
          <ContainerIcon>
            <EvaIcon name={"person-outline"} status="Basic" />
          </ContainerIcon>
        </InputGroup>
        <InputStyled fullWidth className="mt-2">
          <ReCAPTCHA
            onChange={(value) => onSetReCaptcha(value)}
            size="normal"
            sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
            ref={recaptchRef}
          />
        </InputStyled>
        <Button
          disabled={!email}
          status="Basic"
          appearance="ghost"
          size="Tiny"
          fullWidth
          onClick={() => onBackStep(0)}
          className="mt-4 mb-4 flex-between"
          style={{ justifyContent: "center" }}
        >
          <EvaIcon name={"arrow-ios-back-outline"} />
          <FormattedMessage id="back" />
        </Button>
      </>
    }

    if (stepAtual === 2) {
      return <div style={{ minHeight: 80, display: 'flex', justifyContent: 'center', alignItems: 'center' }} className="mt-4">
        <Spinner size="Large" />
      </div>
    }

    if (stepAtual === 3) {

      const optionPassword = !!optionsSignIn?.some(x => x.isPassword === true);

      return <>


        {optionPassword &&
          <>
            <InputGroup fullWidth className="mb-2">
              <input
                type={showPassword ? "text" : "password"}
                placeholder={intl.formatMessage({ id: "login.password" })}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <ContainerIcon onClick={() => setShowPassword(!showPassword)}>
                <EvaIcon
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  status="Basic"
                />
              </ContainerIcon>
            </InputGroup>
            <Button
              disabled={!email || !password}
              status="Success"
              fullWidth
              className="mb-4"
              onClick={loginClick}
            >
              <FormattedMessage id="login.button-text" />
            </Button>
          </>
        }
      </>
    }
  }

  return (
    <Row style={{ margin: 0 }} center="md">
      <ColContent breakPoint={{ md: 4, sm: 12, lg: 4, xs: 12 }}>
        <CardAuth>
          <CardBody>
            <ContentAround>
              <ContentRow className="pb-4">
                <Img
                  src={require(`../../assets/img/${sourceColor}.png`)}
                  alt="logo_iot"
                />
              </ContentRow>
              <ContentCol>

                {renderLoginOptions()}

                <Group>
                  <AuthLanguage />
                  {!!optionsSignIn?.some(x => x.isPassword === true) && <Link to="/request-password">
                    <TextSpan apparence="s2">
                      <FormattedMessage id="lost.password" />
                    </TextSpan>
                  </Link>}
                </Group>

              </ContentCol>
            </ContentAround>
            <FooterAuth />
          </CardBody>
        </CardAuth>
        <TextSpan apparence="s2" hint className="copy-mobile-footer">
          <A
            href="https://www.bykonz.com?origin=iotlog"
            target="_blank"
            rel="noreferrer"
          >
            Bykonz
          </A>{" "}
          &copy; {new Date().getFullYear()}
        </TextSpan>
      </ColContent>
      <SpinnerFull isLoading={isLoading} />
    </Row >
  );
};

const mapStateToProps = (state) => ({
  theme: state.settings.theme,
});

export default connect(mapStateToProps, undefined)(ExtenalLogin);
