import { connect } from "react-redux";
import { setMachineCamerasSelected } from "../../../../actions";
import { Button, EvaIcon, Row } from "@paljs/ui";
import { FormattedMessage, useIntl } from "react-intl";
import { useEffect, useState } from "react";
import { Fetch, TextSpan } from "../../../../components";
import { ButtonClosed, ColFlex, Content, Video } from "./styles";
import { Loading } from "./Loading";

const InfoCameras = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [videoSource, setVideoSource] = useState(null);
  const [data, setData] = useState(null);

  const intl = useIntl();

  useEffect(() => {
    if (props.machineCamerasSelected) {
      getVideoSource();
    }

    return () => {
      setVideoSource(null);
      setData(null);
    }
  }, [props.machineCamerasSelected])

  function getVideoSource() {
    setIsLoading(true);
    Fetch.get(`/machine/${props.machineCamerasSelected?.machine?.id}/cameras`)
      .then((response) => {
        setData(response.data);
        setVideoSource(null);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  }

  function handleVideoSource(index) {
    setVideoSource(data[index]);
  }

  if (isLoading) {
    return (
      <Loading />
    )
  }

  return (
    <>
      {props.machineCamerasSelected && (
        <Content>
          {!data?.filter(x => x.name)?.length ? (
              <Row className="m-0">
                <ColFlex breakPoint={{ md: 12 }}>
                  <TextSpan apparence="s1">
                    <FormattedMessage id="no.cameras" />
                  </TextSpan>
                </ColFlex>
              </Row>
            ) : (
            <Row className="m-0" middle="xs">
              <ColFlex className="p-3" breakPoint={{ md: 4 }}>
                {data?.filter(x => x.name)?.map((camera, index) => {
                  return (
                    <Button
                      key={camera.name + index}
                      status={(videoSource && videoSource.name === camera.name) ? "Primary" : "Basic"}
                      onClick={() => handleVideoSource(index)}
                    >
                      {camera.name}
                    </Button>
                  )
                })}
              </ColFlex>
              <ColFlex breakPoint={{ md: 8 }}>
                {videoSource && (
                  <Video src={videoSource.link} autoPlay controls={false}>
                    {intl.formatMessage({ id: "no.support.video" })}
                  </Video>
                )}
              </ColFlex>
            </Row>
            )}


          <ButtonClosed
            status="Danger"
            size="Tiny"
            onClick={() => props.setMachineCamerasSelected(null)}
          >
            <EvaIcon name="close-outline" />
          </ButtonClosed>
        </Content>
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  machineCamerasSelected: state.fleet.machineCamerasSelected,
});

const mapDispatchToProps = (dispatch) => ({
  setMachineCamerasSelected: (machineInfoSelected) => {
    dispatch(setMachineCamerasSelected(machineInfoSelected));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(InfoCameras);
