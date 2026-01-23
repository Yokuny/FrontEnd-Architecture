import { Button, EvaIcon, Row, Spinner, Tooltip } from "@paljs/ui";
import { Card, CardBody, CardHeader } from "@paljs/ui/Card";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Fetch, TextSpan } from "../../components";
import styled from "styled-components";

const Wrapper = styled.div`
  width: 100%;
  height: calc(100vh - 16rem);
`;

const MyFrame = () => {

  const intl = useIntl();
  const navigate = useNavigate()

  const [isLoading, setIsLoading] = React.useState(false);
  const [frameData, setFrameData] = React.useState();

  const idFrame = new URL(window.location.href).searchParams.get("id");

  React.useLayoutEffect(() => {
    loadFrameData()
  }, []);

  function loadFrameData() {
    setIsLoading(true)
    Fetch.get(`/dashboard/find?id=${idFrame}`, false)
      .then((response) => {
        setFrameData(response.data)
        setIsLoading(false)
      })
      .catch(() => toast.error(intl.formatMessage({ id: 'error.get' })))
  }

  return (
    <>
      <Card>
        <CardHeader>
          <Row center between style={{ paddingRight: '1rem' }}>
            <Row>
              <Tooltip
                trigger="hover"
                placement="top"
                content={
                  <TextSpan apparence="s2">
                    <FormattedMessage id="back" />
                  </TextSpan>
                }
              >
                <Button
                  size="Small"
                  appearance="ghost"
                  className="flex-between"
                  onClick={() => navigate('/list-dashboard')}
                  status="Basic">
                  <EvaIcon name="arrow-ios-back-outline" />
                </Button>
              </Tooltip>
              <TextSpan apparence="h6" className='m-1'>{frameData?.description}</TextSpan>
            </Row>


            {/* <Row style={{ gap: '0.5rem' }}>
              <Button
                size="Small"
                className="flex-between"

                onClick={() => {
                  setFrameData({ ...frameData, urlExternal: '' });
                  loadFrameData()
                }}
              >
                <EvaIcon name="refresh-outline" />
              </Button>
            </Row>*/}
          </Row>

        </CardHeader>
        <CardBody className="m-0" style={{ padding: 0, margin: 0 }}>
          {isLoading ? (
            <Wrapper><Spinner /></Wrapper>
          ) : (
            <Wrapper>
              <iframe
                frameBorder="0"
                style={{ width: '100%' }}
                src={frameData?.urlExternal}
                height="100%"
              />
            </Wrapper>
          )}
        </CardBody>
      </Card>
    </>
  );
};



export default MyFrame;
