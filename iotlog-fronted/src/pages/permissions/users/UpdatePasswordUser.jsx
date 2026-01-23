import React from "react";
import { FormattedMessage } from "react-intl";
import { Card, CardBody } from "@paljs/ui/Card";
import Row from "@paljs/ui/Row";
import Col from "@paljs/ui/Col";
import { Button } from "@paljs/ui/Button";
import { useNavigate, useSearchParams } from "react-router-dom";
import Lottie from "react-lottie";
import { EvaIcon, Spinner } from "@paljs/ui";
import styled, { css } from "styled-components";
import {
  Fetch,
  TextSpan,
} from "../../../components";

const SpinnerStyled = styled(Spinner)`
  ${({ theme }) => css`
    background-color: transparent;
  `}
`;

const UpdatePasswordUser = (props) => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = React.useState(false);
  const [hasErro, setHasErro] = React.useState(false);

  const [searchparams] = useSearchParams();
  const id = searchparams.get("id");


  React.useEffect(() => {
    onSetNewPassword();
  }, []);

  const onSetNewPassword = () => {
    setIsLoading(true)
    Fetch.put('/user/update/password', {
      id
    })
      .then(res => {
        setIsLoading(false)
        setHasErro(false)
      })
      .catch(e => {
        setIsLoading(false)
        setHasErro(true)
      })
  }

  return (
    <>
      <Card>
        <CardBody>
          {isLoading
            ? <div className="mt-4 mb-4 pt-4 pb-4">
              <SpinnerStyled size="Medium" status="Primary" />
            </div>
            : <><Row middle="xs" center="xs">
              <Col breakPoint={{ md: 3 }}>
                <Lottie
                  options={{
                    loop: true,
                    autoplay: true,
                    animationData: require(`./../../../assets/lotties/${hasErro ? `fail` : 'email_sent'}.json`),
                    rendererSettings: {
                      preserveAspectRatio: "xMidYMid slice",
                    },
                  }}
                  isPaused={false}
                  isStopped={false}
                  height='100%'
                  width='100%'
                />
              </Col>

            </Row>
              <Row middle="xs" center="xs" className="mb-4 pb-4">
                <TextSpan apparence="s2" hint>
                  <FormattedMessage id={hasErro ? "error.sent.email" : "send.password.email"} />
                </TextSpan>
              </Row>

              <Row middle="xs" center="xs" className="mb-4 pb-4">
                {hasErro ?
                  <Button size="Tiny" status="Warning" className="flex-between" onClick={onSetNewPassword}>
                    <EvaIcon name="refresh-outline" className="mr-1" />
                    <FormattedMessage id="try.again" />
                  </Button>
                  : <Button size="Tiny" appearance="ghost" className="flex-between" onClick={() => navigate(-1)}>
                    <EvaIcon name="arrow-ios-back-outline" className="mr-1" />
                    <FormattedMessage id="back" />
                  </Button>
                }
              </Row>
            </>}
        </CardBody>
      </Card>
    </>
  );
};


export default UpdatePasswordUser;
