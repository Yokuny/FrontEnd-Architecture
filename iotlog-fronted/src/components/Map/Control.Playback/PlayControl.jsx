import React from 'react'
import { Button, Card, CardBody, EvaIcon, Row } from "@paljs/ui"
import { connect } from 'react-redux'
import styled, { css } from "styled-components"
import TextSpan from '../../Text/TextSpan'
import { Tacometer } from '../../Icons'
import { setPausePlayback, setRouteBack, setSpeedPlayback, setStartPlayback, setTimePlayback } from '../../../actions'


const Content = styled.div`
    bottom: 10px;
    left: 0px;
    width: calc(100vw);
    z-index: 9999;
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;

    .progress-container {
      height: 0.5rem;
    }

    .slider {
      ${({ theme }) => css`
      background: ${theme.backgroundBasicColor4};
      `}

      -webkit-appearance: none;

      height: 7px;
      border-radius: 5px;
      -webkit-transition: .2s;
      transition: opacity .2s;
    }

    .slider:hover {

    }

    .slider::-webkit-slider-thumb {
      width: 15px;
      height: 15px;
      border-radius: 15px;
      ${({ theme }) => css`
        background-color: ${theme.colorPrimary500};
      `}
      cursor: grab;
    }

    .slider::-moz-range-thumb {
      width: 25px;
      height: 25px;
      ${({ theme }) => css`
      background-color: ${theme.colorPrimary500};
      `}
      cursor: grab;
    }
`

const Col = styled.div`
   display: flex;
   flex-direction: column;
   justify-content: center;
   align-items: center;
`

const PlayControl = (props) => {

  const { playback } = props;

  const [minDate, setMinDate] = React.useState(false);
  const [maxDate, setMaxDate] = React.useState(false);

  React.useLayoutEffect(() => {
    setMinDate(new Date(props.min).getTime());
    setMaxDate(new Date(props.max).getTime());

    props.setTimePlayback(new Date(props.min).getTime());
  }, [props.min, props.max])


  const onPlay = () => {
    const isPlay = !!playback?.isPlaying;
    if (isPlay) {
      props.setPausePlayback();
      return
    }

    props.setStartPlayback();
  }

  const isPlay = !!playback?.isPlaying;

  const onPressSpeed = () => {
    const { speed } = playback;

    if (speed === 3e5/5) {
      props.setSpeedPlayback(1e4/5);
      return;
    }

    if (speed === 12e4/5) {
      props.setSpeedPlayback(3e5/5);
      return;
    }

    if (speed === 6e4/5) {
      props.setSpeedPlayback(12e4/5);
      return;
    }

    if (speed === 3e4/5) {
      props.setSpeedPlayback(6e4/5);
      return;
    }

    props.setSpeedPlayback(3e4/5);
  }

  const getTime = () => {
    const { speed } = playback;

    switch (speed) {
      case 1e4/5:
        return `1x`;
      case 3e4/5:
        return `2x`;
      case 6e4/5:
        return `3x`;
      case 12e4/5:
        return `4x`;
      case 3e5/5:
        return `5x`;
      default:
        return `${speed / 1000}K`
    }

  }

  return (
    <>
      <Content>
        <Card>
          <CardBody style={{ marginBottom: 0 }}>
            <Row style={{ display: 'flex', flexDirection: 'row', alignContent: 'center' }}>
              <Button size="Tiny" appearance="ghost" className="mr-3 ml-2" onClick={onPlay}>
                <EvaIcon name={isPlay ? "pause-circle-outline" : "play-circle-outline"} status={isPlay ? 'Danger' : 'Primary'} />
              </Button>
              <input
                type="range"
                min={minDate}
                max={maxDate}
                value={playback?.time}
                onChange={e => props.setTimePlayback(parseInt(e.target.value))}
                className="slider mt-3" />
              <Col className="ml-3">
                {playback?.time ?
                  <><TextSpan apparence="c2">
                    {new Date(playback?.time).toLocaleTimeString()}
                  </TextSpan>
                    <TextSpan apparence="p3" style={{ marginTop: -4 }}>
                      {new Date(playback?.time).toLocaleDateString()}
                    </TextSpan>
                  </>
                  : <TextSpan apparence='c2'>-</TextSpan>}
              </Col>
              <Col className="ml-4 mr-3">
                <Button
                  size='Tiny'
                  className='flex-between p-1'
                  onClick={onPressSpeed}>
                  <Tacometer
                    style={{
                      height: 15,
                      width: 15,
                      color: '#fff',
                    }}
                  />
                  <TextSpan apparence="c2" className={"ml-1"}>
                    {getTime()}
                  </TextSpan>
                </Button>
              </Col>
              <Col>
                <Button size='Tiny'
                  status='Danger'
                  appearance='ghost'
                  onClick={() => props.setRouteBack(undefined)}>
                  <EvaIcon name='close-outline' />
                </Button>
              </Col>
            </Row>



          </CardBody>
        </Card>
      </Content >
    </>
  )
}

const mapStateToProps = (state) => ({
  playback: state.map.playback,
});

const mapDispatchToProps = (dispatch) => ({
  setTimePlayback: (time) => {
    dispatch(setTimePlayback(time));
  },
  setStartPlayback: () => {
    dispatch(setStartPlayback());
  },
  setPausePlayback: () => {
    dispatch(setPausePlayback());
  },
  setSpeedPlayback: (time) => {
    dispatch(setSpeedPlayback(time));
  },
  setRouteBack: (routeBackSelected) => {
    dispatch(setRouteBack(routeBackSelected));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PlayControl);
