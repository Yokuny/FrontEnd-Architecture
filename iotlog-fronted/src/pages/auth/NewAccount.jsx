import React, { useState } from "react";

import { Button } from "@paljs/ui/Button";
import { InputGroup } from "@paljs/ui/Input";
import { Checkbox } from "@paljs/ui/Checkbox";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { Auth, Fetch, SpinnerFull } from "../../components";
import { injectIntl, FormattedMessage } from "react-intl";
import Col from "@paljs/ui/Col";
import Row from "@paljs/ui/Row";
import ReCAPTCHA from "react-google-recaptcha";
import { toast } from "react-toastify";

const Input = styled(InputGroup)`
  margin-bottom: 2rem;
`;

const InputStyled = styled(InputGroup)`
  justify-content: center;
`;

const NewAccount = (props) => {
  const { intl } = props;

  const navigate = useNavigate();

  const recaptchRef = React.useRef();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [reCaptcha, setReCaptcha] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  const searchparams = new URL(window.location.href).searchParams;
  const idEnterprise = searchparams.get("id");
  const enterprise = searchparams.get("enterprise");

  const onSave = () => {
    setIsLoading(true);
    Fetch.post("/account/new-portal", {
      name,
      email,
      password,
      reCaptcha,
      termsAccepted,
      language: props.locale,
      enterprise: idEnterprise,
    })
      .then((response) => {
        setIsLoading(false);
        localStorage.setItem("token", response.data.token);
        toast.success(props.intl.formatMessage({ id: "user.created" }));
        navigate("/home");
      })
      .catch((error) => {
        setIsLoading(false);

        if (recaptchRef && recaptchRef.current) recaptchRef.current.reset();

        setReCaptcha("");
      });
  };

  return (
    <Auth
      title={intl.formatMessage({
        id: "new.account",
      })}
    >
      <Row breakPoint={{ md: 12 }}>
        <Col breakPoint={{ md: 12 }}>
          <Input fullWidth>
            <input
              type="text"
              placeholder={intl.formatMessage({
                id: "account.name",
              })}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Input>
        </Col>
        <Col breakPoint={{ md: 12 }}>
          <Input fullWidth>
            <input
              type="email"
              placeholder={intl.formatMessage({
                id: "login.email",
              })}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Input>
        </Col>
        <Col breakPoint={{ md: 6 }}>
          <Input fullWidth>
            <input
              type="password"
              placeholder={intl.formatMessage({
                id: "login.password",
              })}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Input>
        </Col>
        <Col breakPoint={{ md: 6 }}>
          <Input fullWidth>
            <input
              type="password"
              placeholder={intl.formatMessage({
                id: "account.confirm.password",
              })}
              value={rePassword}
              onChange={(e) => setRePassword(e.target.value)}
              required
            />
          </Input>
        </Col>
        {enterprise && idEnterprise && (
          <Col breakPoint={{ md: 12 }}>
            <Input fullWidth>
              <input type="text" id="#enterprise" value={enterprise} disabled />
            </Input>
          </Col>
        )}
        <Col breakPoint={{ md: 12 }}>
          <Checkbox
            checked={termsAccepted}
            onChange={() => setTermsAccepted(!termsAccepted)}
          >
            <FormattedMessage id="accept.terms" />{" "}
            <Link to="/terms">
              <FormattedMessage id="terms" />
            </Link>{" "}
            <FormattedMessage id="accept.policy" />{" "}
            <Link to="/policy">
              <FormattedMessage id="policy" />
            </Link>
            .
          </Checkbox>
        </Col>
        <Col breakPoint={{ md: 12 }} className="mt-4 mb-4">
          <InputStyled fullWidth>
            <ReCAPTCHA
              onChange={(value) => setReCaptcha(value)}
              size="normal"
              sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
              ref={recaptchRef}
            />
          </InputStyled>
        </Col>
      </Row>

      <Button
        disabled={
          !name || !email || !password || password != rePassword || !reCaptcha
        }
        status="Success"
        type="button"
        shape="SemiRound"
        onClick={onSave}
        fullWidth
      >
        <FormattedMessage id="save" />
      </Button>

      <p>
        <Link to="/login">
          <FormattedMessage id="back.login" />
        </Link>
      </p>
      <SpinnerFull isLoading={isLoading} />
    </Auth>
  );
};

export default injectIntl(NewAccount);
