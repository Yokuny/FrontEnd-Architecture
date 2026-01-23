import React, { useState } from "react";
import { Button } from "@paljs/ui/Button";
import { InputGroup } from "@paljs/ui/Input";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { FormattedMessage, useIntl } from "react-intl";
import Row from "@paljs/ui/Row";
import Col from "@paljs/ui/Col";
import ReCAPTCHA from "react-google-recaptcha";
import { Card, CardBody, Checkbox, EvaIcon, Spinner } from "@paljs/ui";
import styled, { css } from "styled-components";
import { breakpointDown } from "@paljs/ui/breakpoints";
import * as Sentry from "@sentry/react";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { Fetch, Group, SpinnerFull, TextSpan } from "../../components";
import FooterAuth from "./FooterAuth";
import AuthLanguage from "./AuthLanguage";
import { useAuth } from "../../components/Contexts/Auth";
import SSO from "./SSO";
import { translate } from "../../components/language";
import { nanoid } from "nanoid";

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
  border-radius: 16px;
    ${({ theme }) => css`
    background-color: ${theme.backgroundBasicColor1}40;
    box-shadow: 0 4px 30px ${theme.boxShadowColor}99;
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
    border: 1px solid ${theme.borderBasicColor3};
  `}

  ${breakpointDown("sm")`
    margin: 0;
    height: 100vh;
  `}
  ${CardBody} {
    display: flex;
  }
`;

const A = styled.a`
  text-decoration: none;
  ${({ theme }) => css`
    color: #fff;
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

const RowStyleBg = styled(Row)`
  height: 100vh;
  background: url('https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0') no-repeat;
  background-size: cover;
  background-position: center;
  margin: 0;
`;

const THEMES_DARKS = ["cosmic", "dark"];
const REMEMBER_KEY = "loginRememberEmail";

const Login = (props) => {

  const recaptchRef = React.useRef();
  const [email, setEmail] = useState("");
  const [reCaptcha, setReCaptcha] = useState("");
  const [optionsSignIn, setOptionsSignIn] = useState([]);
  const [stepAtual, setStepAtual] = useState(0);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [searchParams] = useSearchParams();

  const { signIn, signInSSO, isLoading, isSigned, locked, rememberEmail, setRememberEmail } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const intl = useIntl();

  const from = location.state?.from?.pathname || "/";

  React.useEffect(() => {
    const saved = localStorage.getItem(REMEMBER_KEY);
    if (saved) {
      setEmail(saved);
      setRememberEmail(true);
    }
  }, []);

  React.useEffect(() => {
    if (rememberEmail && email) {
      localStorage.setItem(REMEMBER_KEY, email);
    } else if (!rememberEmail) {
      localStorage.removeItem(REMEMBER_KEY);
    }
  }, [rememberEmail, email]);

  React.useState(() => {
    if (!reCaptcha && recaptchRef?.current) {
      recaptchRef.current.reset();
    }
  }, [reCaptcha]);

  React.useEffect(() => {
    try {
      if (isSigned) {
        navigateToHome();
      }
    } catch {

    }

  }, [isSigned]);

  React.useEffect(() => {
    try {
      if (locked?.id) {
        navigate(`/code-unlock?r=${locked.id}`);
      }
    } catch {

    }

  }, [locked]);

  const navigateToHome = () => {
    if (from !== "/") {
      navigate(from, { replace: true });
    }
    else if (searchParams.get("origin")?.includes("frame")) {
      navigate(`/fleet-manager${window.location.search}`);
    } else {
      navigate("/home");
    }
  }

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
    signIn({ email, password },
      (user) => {
        try {
          if (process.env.NODE_ENV === "production" && process.env.REACT_APP_SENTRY_DSN) {
            Sentry.setUser({
              id: user?.id,
              username: user?.name,
              email: email,
              segment: localStorage.getItem('id_enterprise_filter')
            });
          }
        } catch {
        }
        navigateToHome();
      })
  };

  const onLoginSSO = ({ token, idToken }) => {
    signInSSO({ email, token, idToken },
      (user) => {
        try {
          if (process.env.NODE_ENV === "production") {
            Sentry.setUser({
              username: user?.name,
              email: email,
              segment: localStorage.getItem('id_enterprise_filter')
            });
          }
        } catch {
        }
        navigateToHome();
      })
  }

  const onBackStep = (step) => {
    setReCaptcha("");
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

        <Checkbox
          checked={rememberEmail}
          className="ml-1"
          onChange={(e) => setRememberEmail(prev => !prev)}>
          <TextSpan
            style={{ color: '#fff' }}
            apparence="p2" className="mr-1">
            <FormattedMessage id="remember.email" />
          </TextSpan>
        </Checkbox>

        {!!email?.includes('@') && <Button
          disabled={!email}
          status="Primary"
          fullWidth
          onClick={() => setStepAtual(1)}
          className="mt-2 mb-4 flex-between"
          style={{ justifyContent: "center" }}
        >
          <FormattedMessage id="next" />
          <EvaIcon name={"arrow-ios-forward-outline"} />
        </Button>}
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
            key={nanoid(5)}
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
          style={{ justifyContent: "center", color: '#fff' }}
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
      const optionSso = optionsSignIn?.find(x => x.isSso === true);

      return <>
        {optionPassword && optionSso && <Row center="xs" className="m-0">
          <TextSpan apparence="s2" hint className="mt-1 mb-4">
            <FormattedMessage id="login.with" />
          </TextSpan>
        </Row>}

        {!!optionSso && <SSO token={optionSso.token} onLogin={onLoginSSO} />}
        {!!optionSso && !optionPassword && <div className="mb-4 mt-4"></div>}
        {optionSso && optionPassword &&
          <Row center="xs" className="m-0">
            <TextSpan apparence="p3" hint className="mt-3 mb-3">
              <FormattedMessage id="condition.or" />
            </TextSpan>
          </Row>}
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
            {!!email && !!password && <Button
              disabled={!email || !password}
              status="Success"
              fullWidth
              className="mb-4"
              onClick={loginClick}
            >
              <FormattedMessage id="login.button-text" />
            </Button>}
          </>
        }
      </>
    }
  }

  return (
    <RowStyleBg center="xs">
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
                  {!!optionsSignIn?.some(x => x.isPassword === true) && <Link
                    style={{ textDecoration: 'none', color: '#fff' }}
                    to="/request-password">
                    <TextSpan apparence="s2">
                      <FormattedMessage id="lost.password" />
                    </TextSpan>
                  </Link>}
                </Group>

              </ContentCol>
            </ContentAround>
            <AuthLanguage />
            <FooterAuth />
          </CardBody>
        </CardAuth>
        <TextSpan apparence="s2"
          style={{ color: '#fff' }}
          className="copy-mobile-footer">
          <A
            href="https://www.bykonz.com?origin=iotlog"
            target="_blank"
            rel="noreferrer"
          >
            IoT Log powered Bykonz
          </A>{" "}
          &copy; {new Date().getFullYear()}
        </TextSpan>
      </ColContent>
      <SpinnerFull isLoading={isLoading} />
    </RowStyleBg>
  );
};

const mapStateToProps = (state) => ({
  theme: state.settings.theme,
});

export default connect(mapStateToProps, undefined)(Login);

