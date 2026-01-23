import { Button, EvaIcon, InputGroup } from "@paljs/ui";
import { FormattedMessage, useIntl } from "react-intl";
import React, { useState } from "react";
import styled from "styled-components";
import ReCAPTCHA from "react-google-recaptcha";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Fetch, LabelIcon, SpinnerFull } from "../../../components";

const Content = styled.div`

`

const ButtonSendCode = styled(Button)`
display: flex;
flex-direction: row;
justify-content: center;
align-items: center;
`
const InputStyled = styled(InputGroup)`
  justify-content: center;
`;

export default function InputCodeUnlock(props) {
  const { idRequest } = props;
  const [code, setCode] = useState('')
  const [isLoading, setIsLoading] = useState(false);
  const [hasErro, setHasErro] = useState(false);
  const [reCaptcha, setReCaptcha] = useState("");
  const recaptchRef = useRef();
  const intl = useIntl();
  const navigate = useNavigate();

  React.useState(() => {
    if (!reCaptcha && recaptchRef.current) {
      recaptchRef.current.reset()
    }
  }, [reCaptcha])

  const onUnlock = () => {
    if (code?.length !== 6 || !idRequest) return;
    setIsLoading(true)
    Fetch.post('/auth/unlock', { code, id: idRequest, reCaptcha, })
      .then(response => {
        toast.success(intl.formatMessage({ id: 'account.unlocked' }));
        navigate("/login");
        setIsLoading(false)
      })
      .catch(e => {
        setHasErro(true)
        setIsLoading(false)
        setReCaptcha('')
        recaptchRef.current.reset()
      })
  }

  const generateNew = () => {
    window.location.reload();
  }

  return (<>
    <Content className="mt-4">
      <LabelIcon
        title={"Insira o código que você recebeu:"}
        iconName="lock-outline"
      />
      <InputGroup
        fullWidth
        className="mt-1"
        status={hasErro ? 'Danger' : 'Basic'}
        size="Large"
      >
        <input
          style={{ textAlign: 'center', fontSize: 20, letterSpacing: 8 }}
          type="text"
          onChange={(e) => setCode(e.target.value ? e.target.value?.match(/[0-9]/g)?.join('')?.slice(0, 6) : '')}
          value={code}
          maxLength={6}
        />
      </InputGroup>

      <InputStyled fullWidth className="mt-4">
        <ReCAPTCHA
          onChange={(value) => setReCaptcha(value)}
          size="normal"
          sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
          ref={recaptchRef}
          key={idRequest}
        />
      </InputStyled>

      <ButtonSendCode
        onClick={onUnlock}
        fullWidth
        disabled={code?.length !== 6 || !reCaptcha}
        status="Success"
        size="Small" className="mt-4 mb-4">
        <EvaIcon name="unlock-outline" className="mr-1" />
        <FormattedMessage id="unlock" />
      </ButtonSendCode>

      <ButtonSendCode
        onClick={generateNew}
        fullWidth
        status="Info"
        appearance="ghost"
        size="Small" className="mt-4">
        <EvaIcon name="refresh-outline" className="mr-1" />
        <FormattedMessage id="generate.new.code" />
      </ButtonSendCode>

      <SpinnerFull isLoading={isLoading} />
    </Content>
  </>)
}
