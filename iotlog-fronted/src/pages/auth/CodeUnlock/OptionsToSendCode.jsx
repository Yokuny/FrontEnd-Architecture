import React from 'react'
import { FormattedMessage, useIntl } from "react-intl";
import { nanoid } from "nanoid";
import { Button, EvaIcon, Radio, Row } from "@paljs/ui";
import { Fetch, SpinnerFull, TextSpan } from "../../../components";
import styled from 'styled-components';
import { useSearchParams } from 'react-router-dom';
import InputCodeUnlock from './InputCodeUnlock';

const ButtonSendCode = styled(Button)`
display: flex;
flex-direction: row;
justify-content: center;
align-items: center;
`

export default function OptionsToSendCode(props) {
  const intl = useIntl()

  const [data, setData] = React.useState();
  const [isLoading, setIsLoading] = React.useState(false);
  const [codeSentTime, setCodeSentTime] = React.useState();
  const [option, setOption] = React.useState();

  const [searchParams] = useSearchParams();
  const id = searchParams.get("r")

  React.useEffect(() => {
    if (id) {
      getData(id)
    }
  }, [id])

  const getData = (id) => {
    setIsLoading(true);
    Fetch.get(`/auth/data-unlock?id=${id}`)
      .then(response => {
        setData(response.data)
        // setOption(response.data ? response.data.phone ? 'whatsapp' : 'email' : '')
        setIsLoading(false);
      })
      .catch(e => {
        setIsLoading(false);
      })
  }

  const optionsRadio = []
  if (data?.phone) {
    optionsRadio.push({
      value: 'whatsapp',
      label: `WhatsApp: ${data.phone}`,
      checked: option === 'whatsapp'
    })
  }

  if (data?.email) {
    optionsRadio.push({
      value: 'email',
      label: `${intl.formatMessage({ id: 'email' })}: ${data.email}`,
      checked: option === 'email'
    })
  }

  const onSendCode = (id) => {
    setIsLoading(true);
    Fetch.post(`/auth/send-code-unlock`, {
      id,
      type: option
    })
      .then(response => {
        setIsLoading(false);
        setCodeSentTime(response.data?.time || 0)
      })
      .catch(e => {
        setIsLoading(false);
      })
  }

  if (codeSentTime) {
    return (<>
      <InputCodeUnlock
        idRequest={id}
      />
    </>)
  }

  return (<>
    <Row className="m-0" center="xs">
      <EvaIcon
        name="person-delete-outline"
        status="Basic"
        className="mr-1"
      />
      <TextSpan apparence="s1" style={{ textAlign: 'center' }} hint className="mb-4">
        <FormattedMessage id="account.locked" />
      </TextSpan>
    </Row>
    <TextSpan apparence="p2" hint className="mt-4 mb-4">
      {intl.formatMessage({ id: 'user.description.unlock' }).replace('{0}', data?.name)}
    </TextSpan>

    <Row className="m-0 pb-4 pt-2">
      <Radio
        className="ml-2"
        key={nanoid(5)}
        onChange={v => setOption(v)}
        name="radio"
        options={optionsRadio}
      />

    </Row>

    <ButtonSendCode
      onClick={() => onSendCode(id)}
      disabled={isLoading || !option}
      status="Success"
      fullWidth
      className="mt-4"
      size="Small"
    >
      <EvaIcon name="paper-plane-outline" className="mr-1" />
      <FormattedMessage id="send" />
    </ButtonSendCode>
    <SpinnerFull isLoading={isLoading} />
  </>)
}
