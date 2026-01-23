
import React from 'react';
import { Marker, Popup, Tooltip } from 'react-leaflet';
import { DivIcon } from 'leaflet';
import { Col } from '@paljs/ui';
import { FormattedMessage } from 'react-intl';
import { useTheme } from 'styled-components';
import { connect } from 'react-redux';
import { DateDiff } from '../../../../../components/Date/DateDiff';
import { Tacometer } from '../../../../../components/Icons';
import { LabelIcon, TextSpan } from '../../../../../components';

const INDEX_REGION_DATA = {
  TIMESTAMP: 0,
  LAT: 1,
  LON: 2,
  SPEED: 3,
  COURSE: 4,
  HEADING: 5,
  VESSEL_ID: 6,
  NAME: 7,
  MMSI: 8,
  VESSEL_CLASS: 9,
  VESSEL_TYPE: 10
}

const getTextValid = (text) => {
  if (text === null || text === undefined) {
    return ""
  }

  return text?.toString();
}

function ControlMarkerRegion(props) {

  const { playback, data } = props

  const theme = useTheme();

  const onGetItens = (playback) => {
    return data?.length &&
      playback.time &&
      data?.find(x => x[0] >= playback.time)?.length
      ? data?.find(x => x[0] >= playback.time)[1]?.filter(x => x[INDEX_REGION_DATA.LAT] !== undefined)
      : data?.length && data[1]?.length
        ? data[1]?.filter(x => x[INDEX_REGION_DATA.LAT] !== undefined)[0]
        : []
  }

  const getIcon = (x, course) => {
    const name = x[INDEX_REGION_DATA.NAME];
    if (x[INDEX_REGION_DATA.VESSEL_CLASS] === "ATON") {
      return {
        iconSize: [18, 18],
        html: `<svg fill="#000000" viewBox="0 0 24 24" id="lighthouse-2" data-name="Flat Line" xmlns="http://www.w3.org/2000/svg" class="icon flat-line"><path id="secondary" d="M15,11H9L8,21h8ZM12,3h0a3,3,0,0,1,3,3V7H9V6A3,3,0,0,1,12,3Z" style="fill: rgb(0, 0, 0); stroke-width: 2;"></path><path id="primary" d="M15,7H9v4h6Zm0,4H9L8,21h8ZM12,3h0a3,3,0,0,1,3,3V7H9V6A3,3,0,0,1,12,3ZM6,21H18" style="fill: none; stroke: rgb(0, 0, 0); stroke-linecap: round; stroke-linejoin: round; stroke-width: 1;"></path></svg>`
      }
    }

    if (x[INDEX_REGION_DATA.VESSEL_TYPE] === "PLT") {
      return {
        iconSize: [18, 18],
        html: `<svg aria-hidden="true" style="
      transform:rotate(${(course) - 45}deg)";
      display: flex; border-radius: 50%;
      focusable="false" data-prefix="fad" data-icon="location-arrow" role="img" viewBox="0 0 512 512"><g class="fa-group"><path fill="${theme.colorDanger500}" d="M461.91 0a45 45 0 0 0-17.4 3.52L28.73 195.42c-48 22.39-32 92.75 19.19 92.75h175.91v175.91c0 30 24.21 47.94 48.74 47.94 17.3 0 34.76-8.91 44-28.75L508.48 67.49C522.06 34.89 494.14 0 461.91 0zM303.83 320V208.17H192l207.67-95.85z" class="fa-secondary"></path><path fill="#ffffff" d="M399.68 112.32L303.83 320V208.17H192l207.67-95.85" class="fa-primary"></path></g></svg>`
      }
    }



    if (getTextValid(x[INDEX_REGION_DATA.VESSEL_CLASS]).toUpperCase()?.includes("FISHING")) {
      return {
        iconSize: [17, 17],
        html: `<svg aria-hidden="true" style="
      transform:rotate(${(course) - 45}deg)";
      display: flex; border-radius: 50%;
      focusable="false" data-prefix="fad" data-icon="location-arrow" role="img" viewBox="0 0 512 512"><g class="fa-group"><path fill="#B432AC" d="M461.91 0a45 45 0 0 0-17.4 3.52L28.73 195.42c-48 22.39-32 92.75 19.19 92.75h175.91v175.91c0 30 24.21 47.94 48.74 47.94 17.3 0 34.76-8.91 44-28.75L508.48 67.49C522.06 34.89 494.14 0 461.91 0zM303.83 320V208.17H192l207.67-95.85z" class="fa-secondary"></path><path fill="#ffffff" d="M399.68 112.32L303.83 320V208.17H192l207.67-95.85" class="fa-primary"></path></g></svg>`
      }
    }

    if (x[INDEX_REGION_DATA.VESSEL_TYPE] === "TUG") {
      return {
        iconSize: [20, 20],
        html: `<svg aria-hidden="true" style="
      transform:rotate(${(course) - 45}deg)";
      display: flex; border-radius: 50%;
      focusable="false" data-prefix="fad" data-icon="location-arrow" role="img" viewBox="0 0 512 512"><g class="fa-group"><path fill="${getTextValid(name)?.toUpperCase()?.includes("SAAM") ? theme.colorWarning500 : theme.colorInfo600}" d="M461.91 0a45 45 0 0 0-17.4 3.52L28.73 195.42c-48 22.39-32 92.75 19.19 92.75h175.91v175.91c0 30 24.21 47.94 48.74 47.94 17.3 0 34.76-8.91 44-28.75L508.48 67.49C522.06 34.89 494.14 0 461.91 0zM303.83 320V208.17H192l207.67-95.85z" class="fa-secondary"></path><path fill="#ffffff" d="M399.68 112.32L303.83 320V208.17H192l207.67-95.85" class="fa-primary"></path></g></svg>`
      }
    }

    if (x[INDEX_REGION_DATA.VESSEL_CLASS] === "TUG") {
      return {
        iconSize: [18, 18],
        html: `<svg aria-hidden="true" style="
      transform:rotate(${(course) - 45}deg)";
      display: flex; border-radius: 50%;
      focusable="false" data-prefix="fad" data-icon="location-arrow" role="img" viewBox="0 0 512 512"><g class="fa-group"><path fill="${theme.colorSuccess700}" d="M461.91 0a45 45 0 0 0-17.4 3.52L28.73 195.42c-48 22.39-32 92.75 19.19 92.75h175.91v175.91c0 30 24.21 47.94 48.74 47.94 17.3 0 34.76-8.91 44-28.75L508.48 67.49C522.06 34.89 494.14 0 461.91 0zM303.83 320V208.17H192l207.67-95.85z" class="fa-secondary"></path><path fill="#ffffff" d="M399.68 112.32L303.83 320V208.17H192l207.67-95.85" class="fa-primary"></path></g></svg>`
      }
    }

    if (x[INDEX_REGION_DATA.VESSEL_CLASS] === "CARGO_SHIP") {
      return {
        iconSize: [27, 27],
        html: `<svg aria-hidden="true" style="
      transform:rotate(${(course) - 45}deg)";
      display: flex; border-radius: 50%;
      focusable="false" data-prefix="fad" data-icon="location-arrow" role="img" viewBox="0 0 512 512"><g class="fa-group"><path fill="${theme.colorPrimary600}" d="M461.91 0a45 45 0 0 0-17.4 3.52L28.73 195.42c-48 22.39-32 92.75 19.19 92.75h175.91v175.91c0 30 24.21 47.94 48.74 47.94 17.3 0 34.76-8.91 44-28.75L508.48 67.49C522.06 34.89 494.14 0 461.91 0zM303.83 320V208.17H192l207.67-95.85z" class="fa-secondary"></path><path fill="#ffffff" d="M399.68 112.32L303.83 320V208.17H192l207.67-95.85" class="fa-primary"></path></g></svg>`
      }
    }

    if (x[INDEX_REGION_DATA.VESSEL_CLASS] === "PASSENGER_SHIP") {
      return {
        iconSize: [23, 23],
        html: `<svg aria-hidden="true" style="
      transform:rotate(${(course) - 45}deg)";
      display: flex; border-radius: 50%;
      focusable="false" data-prefix="fad" data-icon="location-arrow" role="img" viewBox="0 0 512 512"><g class="fa-group"><path fill="#14004F" d="M461.91 0a45 45 0 0 0-17.4 3.52L28.73 195.42c-48 22.39-32 92.75 19.19 92.75h175.91v175.91c0 30 24.21 47.94 48.74 47.94 17.3 0 34.76-8.91 44-28.75L508.48 67.49C522.06 34.89 494.14 0 461.91 0zM303.83 320V208.17H192l207.67-95.85z" class="fa-secondary"></path><path fill="#ffffff" d="M399.68 112.32L303.83 320V208.17H192l207.67-95.85" class="fa-primary"></path></g></svg>`
      }
    }

    if (x[INDEX_REGION_DATA.VESSEL_CLASS] === "TANKER") {
      return {
        iconSize: [27, 27],
        html: `<svg aria-hidden="true" style="
      transform:rotate(${(course) - 45}deg)";
      display: flex; border-radius: 50%;
      focusable="false" data-prefix="fad" data-icon="location-arrow" role="img" viewBox="0 0 512 512"><g class="fa-group"><path fill="${theme.colorDanger600}" d="M461.91 0a45 45 0 0 0-17.4 3.52L28.73 195.42c-48 22.39-32 92.75 19.19 92.75h175.91v175.91c0 30 24.21 47.94 48.74 47.94 17.3 0 34.76-8.91 44-28.75L508.48 67.49C522.06 34.89 494.14 0 461.91 0zM303.83 320V208.17H192l207.67-95.85z" class="fa-secondary"></path><path fill="#ffffff" d="M399.68 112.32L303.83 320V208.17H192l207.67-95.85" class="fa-primary"></path></g></svg>`
      }
    }

    return {
      iconSize: [21, 21],
      html: `<svg aria-hidden="true" style="
    transform:rotate(${(course) - 45}deg)";
    display: flex; border-radius: 50%;
    focusable="false" data-prefix="fad" data-icon="location-arrow" role="img" viewBox="0 0 512 512"><g class="fa-group"><path fill="#2cb9f3" d="M461.91 0a45 45 0 0 0-17.4 3.52L28.73 195.42c-48 22.39-32 92.75 19.19 92.75h175.91v175.91c0 30 24.21 47.94 48.74 47.94 17.3 0 34.76-8.91 44-28.75L508.48 67.49C522.06 34.89 494.14 0 461.91 0zM303.83 320V208.17H192l207.67-95.85z" class="fa-secondary"></path><path fill="#ffffff" d="M399.68 112.32L303.83 320V208.17H192l207.67-95.85" class="fa-primary"></path></g></svg>`
    }
  }

  const itens = onGetItens(playback);
  return (
    <>
      {!!itens?.length && itens?.map((x) => {
        const course = x[INDEX_REGION_DATA.HEADING] || x[INDEX_REGION_DATA.COURSE];

        // if (x[INDEX_REGION_DATA.LAT] === null ||
        //   x[INDEX_REGION_DATA.LAT] === undefined ||
        //   x[INDEX_REGION_DATA.LON] === null ||
        //   x[INDEX_REGION_DATA.LON] === undefined) {
        //   return <></>
        // }

        return <Marker
          key={`${x[INDEX_REGION_DATA.VESSEL_ID]}`}
          position={[
            x[INDEX_REGION_DATA.LAT],
            x[INDEX_REGION_DATA.LON],
          ]}
          icon={
            new DivIcon({
              className: "leaflet-div-icon-img",
              ...getIcon(x, course)

            })
          }
        >
          <Popup>
            <TextSpan apparence="s2">{x[INDEX_REGION_DATA.NAME]}</TextSpan>
            <br />
            <TextSpan apparence="c3">{`MMSI: ${x[INDEX_REGION_DATA.MMSI]}`}</TextSpan>
            <br />
            <TextSpan apparence="c3">{getTextValid(x[INDEX_REGION_DATA.VESSEL_CLASS])?.replace('_', ' ')}</TextSpan>
            <br />
            <br />
            {x[INDEX_REGION_DATA.COURSE] !== undefined &&
              x[INDEX_REGION_DATA.COURSE] !== null && (
                <>
                  <Col breakPoint={{ md: 12 }} className='p-0 mb-1'>
                    <LabelIcon
                      titleApparence="c3"
                      iconName="compass-outline"
                      title="Course"
                    />
                    <TextSpan apparence="c2" className="ml-3">
                      <strong>{x[INDEX_REGION_DATA.COURSE]}º</strong>
                    </TextSpan>
                  </Col>
                </>
              )}
            {x[INDEX_REGION_DATA.SPEED] !== undefined &&
              x[INDEX_REGION_DATA.SPEED] !== null && (
                <>
                  <Col breakPoint={{ md: 12 }} className='p-0 mb-1'>
                    <LabelIcon
                      titleApparence="c3"
                      renderIcon={() => (
                        <Tacometer
                          style={{
                            height: 22,
                            width: 15,
                            color: theme.textHintColor,
                            marginRight: 5,
                          }}
                        />
                      )}
                      title="Speed"
                    />
                    <TextSpan apparence="c2" className="ml-3">
                      <strong>{x[INDEX_REGION_DATA.SPEED]} kn</strong>
                    </TextSpan>
                  </Col>
                </>
              )}
            {x[INDEX_REGION_DATA.TIMESTAMP] !== undefined && (
              <>
                <Col breakPoint={{ md: 12 }} className='p-0'>
                  <LabelIcon
                    titleApparence="c3"
                    iconName="radio-outline"
                    title={<FormattedMessage id="last.date.acronym" />}
                  />
                  <TextSpan className="ml-1" apparence="c2">
                    <DateDiff dateInitial={new Date(x[INDEX_REGION_DATA.TIMESTAMP] * 1000)} />
                  </TextSpan>
                  <br />
                  <TextSpan apparence='p3' className="ml-1">
                    {new Date(x[INDEX_REGION_DATA.TIMESTAMP] * 1000).toLocaleTimeString()}
                  </TextSpan>
                </Col>
              </>
            )}
          </Popup>
          {props.showName &&
            <Tooltip permanent
              direction="top"
              offset={[-5, -7]}
            >
              <TextSpan apparence='s2'>{x[INDEX_REGION_DATA.NAME]}</TextSpan>
            </Tooltip>}
        </Marker>
      })}
    </>
  )
}

const mapStateToProps = (state) => ({
  playback: state.map.playback,
  filterRouter: state.map.filterRouter,
  interval: state.map.router?.interval,
  hourPosition: state.map.router?.hourPosition,
  showName: state.map.showName,
});

export default connect(mapStateToProps, undefined)(ControlMarkerRegion);
