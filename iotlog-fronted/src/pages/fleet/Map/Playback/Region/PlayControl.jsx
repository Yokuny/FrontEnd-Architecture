import React from 'react'
import { Button, Card, CardBody, EvaIcon, Row } from "@paljs/ui"
import { connect } from 'react-redux'
import styled, { css } from "styled-components"
import { TextSpan } from '../../../../../components'
import { Tacometer } from '../../../../../components/Icons'
import { setIsRegionPlayback, setPausePlayback, setSpeedPlayback, setStartPlayback, setStopPlayback, setTimePlayback } from '../../../../../actions'


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

  const { hourPosition, filterRouter, playback } = props;

  const [minDate, setMinDate] = React.useState(props.minDate);
  const [maxDate, setMaxDate] = React.useState(props.maxDate || new Date().getTime());

  React.useLayoutEffect(() => {
    props.setTimePlayback(props.minDate);
    return () => {
      props.setStopPlayback();
    }
  }, [props.minDate])

  React.useLayoutEffect(() => {
    if (playback.time >= maxDate) {
      props.setPausePlayback();
    }
  }, [playback.time])


  const onPlay = () => {
    if (playback.time >= maxDate) {
      props.setTimePlayback(props.minDate);
    }

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

    // if (speed === 3e5) {
    //   props.setSpeedPlayback(1e4);
    //   return;
    // }

    if (speed === 12e4) {
      props.setSpeedPlayback(3e5);
      return;
    }

    if (speed === 6e4) {
      props.setSpeedPlayback(12e4);
      return;
    }

    if (speed === 3e4) {
      props.setSpeedPlayback(6e4);
      return;
    }

    props.setSpeedPlayback(3e4);
  }

  const getTime = () => {
    const { speed } = playback;
    if (speed < 6e4) {
      return `${speed / 1000}s`
    }

    return `${speed / 60000}m`
  }

  const onClose = () => {
    props.setIsRegionPlayback(false);
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
                  onClick={() => onClose()}>
                  <EvaIcon name='close-outline' />
                </Button>
              </Col>
            </Row>



          </CardBody>
        </Card>
      </Content>
    </>
  )
}

const mapStateToProps = (state) => ({
  hourPosition: state.map.router?.hourPosition,
  filterRouter: state.map.filterRouter,
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
  setStopPlayback: () => {
    dispatch(setStopPlayback());
  },
  setIsRegionPlayback: (isPlaybackRegion) => {
    dispatch(setIsRegionPlayback(isPlaybackRegion));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PlayControl);
