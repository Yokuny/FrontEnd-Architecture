import React from "react";
import { Chat, ChatMessages } from "@paljs/ui/Chat";
import axios from "axios";
import { Button, InputGroup, Spinner } from "@paljs/ui";
import { FormattedMessage, useIntl } from "react-intl";
import styled, { css } from "styled-components";
import { Fetch } from "../../../components";

const SpinnerStyled = styled(Spinner)`
  ${({ theme }) => css`
    background-color: transparent;
    height: 1.9rem;

  `}
  position: relative;
  width: 100%;
`;

const ChatStyled = styled(Chat)`
height: 36rem;

.avatar {
  background-size: contain;
}

.sender {
  font-weight: bold;
  font-size: 0.8rem;
}

.sender time {
  font-size: 0.65rem;
  font-weight: normal;
}

.text {
  white-space: pre-wrap !important;
}
`

const Row = styled.div`
display: flex;
flex-direction: row;
flex-wrap: nowrap;
align-items: center;
width: 100%;

${({ theme }) => css`
  border-top: 1px solid ${theme.colorBasicDefaultBorder};
`}
`

const PromptAI = () => {

  const [question, setQuestion] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const [messages, setMessages] = React.useState([
  ]);

  const intl = useIntl();

  const onSendHandle = () => {
    const message = question;
    setQuestion('');

    onSend({ message });

    const newMessage = {
      message: message,
      date: new Date().toLocaleTimeString(),
      reply: true,
      type: 'text',
      sender: 'Você',
      avatar: 'https://i.gifer.com/no.gif',
    };
    setMessages(prevState => [...prevState, newMessage]);
  };

  const onSend = (v) => {
    setIsLoading(true);
    Fetch.post('/ai/prompt', {
      question: v.message
    })
      .then(response => {
        const newMessage = {
          message: response.data?.text,
          date: new Date().toLocaleTimeString(),
          reply: false,
          type: 'text',
          sender: 'Bykonz IA',
          avatar: require('../../../assets/img/bykonz_robot.png'),
        };
        setMessages(prevState => [...prevState, newMessage]);
      })
      .catch(error => {
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <>
      <ChatStyled title="Bykonz IA" status="Basic">
        <ChatMessages
          noMessages={intl.formatMessage({ id: 'can.i.help.you' })}
          messages={messages} />

        <Row className="p-4">
          {isLoading
            ? <SpinnerStyled size="Small" status="Primary" />
            : <>
              <InputGroup fullWidth style={{ width: `100%` }}>
                <input
                  type="text"
                  placeholder={
                    `${intl.formatMessage({
                      id: 'search.placeholder',
                    })} ...`
                  }
                  onChange={(e) => setQuestion(e.target.value)}
                  value={question}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      onSendHandle();
                    }
                  }}
                />
              </InputGroup>
              <Button size="Small"
                onClick={() => onSendHandle()}
                status="Success"
                className="ml-4">
                <FormattedMessage id="send" />
              </Button>
            </>}
        </Row>
      </ChatStyled>
    </>
  );
}

export default PromptAI;
