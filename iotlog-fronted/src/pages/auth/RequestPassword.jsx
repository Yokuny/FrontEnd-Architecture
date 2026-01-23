import React, { useState } from "react";
import { Button } from "@paljs/ui/Button";
import { InputGroup } from "@paljs/ui/Input";
import { Link, useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import styled from "styled-components";
import { FormattedMessage, useIntl } from "react-intl";
import { toast } from "react-toastify";
import { Fetch, SpinnerFull, LabelIcon, TextSpan } from "../../components";
import Row from "@paljs/ui/Row";
import { breakpointDown, Card, CardBody, EvaIcon } from "@paljs/ui";

const InputStyled = styled(InputGroup)`
  justify-content: center;
`;

const ContainerIcon = styled.div`
  position: absolute;
  right: 12px;
  top: 10px;
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

const RequestPassword = (props) => {
  const recaptchRef = React.useRef();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [reCaptcha, setReCaptcha] = useState("");
  const [messageShow, setMessageShow] = useState(false);

  const intl = useIntl();

  const requestClick = () => {
    setIsLoading(true);
    Fetch.post("/account/request-change-password", { email: email?.replace(/ /g, ""), reCaptcha })
      .then((response) => {
        toast.success(intl.formatMessage({ id: "email.send" }));
        setIsLoading(false);
        setMessageShow(true);
      })
      .catch((error) => {
        setIsLoading(false);
      });
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
              <FormattedMessage id="request.password.instructions" />
            </TextSpan>

            <form style={{ width: "100%" }}>
              {!!messageShow ? (
                <Button
                  status="Success"
                  type="button"
                  shape="SemiRound"
                  appearance="outline"
                  fullWidth
                  onClick={() => navigate("/login")}
                >
                  {intl.formatMessage({ id: "email.recover.send" })}
                </Button>
              ) : (
                <>
                  <div>
                    <LabelIcon iconName="email-outline" title={"Email"} />
                    <InputGroup fullWidth>
                      <input
                        type="email"
                        placeholder={intl.formatMessage({
                          id: "email",
                        })}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <ContainerIcon>
                        <EvaIcon name={"email-outline"} status="Basic" />
                      </ContainerIcon>
                    </InputGroup>
                  </div>
                  <InputStyled fullWidth className="mt-4 mb-4">
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
                    disabled={!email || !reCaptcha || !!messageShow}
                    fullWidth
                    style={{
                      display: "flex",
                      alignItems: "center",
                      flexDirection: "row",
                      justifyContent: "center",
                    }}
                    onClick={requestClick}
                  >

                    <FormattedMessage id="continue" />
                    <EvaIcon
                      className="ml-1"
                      name="arrow-ios-forward-outline"
                    />
                  </Button>
                </>
              )}
            </form>
            <Row center className="mt-4">
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
            </Row>
          </ContentAround>
        </CardBody>
      </CardAuth>
      <SpinnerFull isLoading={isLoading} />
    </Row>
  );
};

export default RequestPassword;
