import { Button, EvaIcon, Radio, Row } from "@paljs/ui";
import React, { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { connect } from "react-redux";
import { setIsShowWeatherRoute, setIsShowDirectionRoute } from "../../../../../actions/map.actions";
import { TextSpan, Toggle } from "../../../../../components";
import {
  Col,
  ColStyled,
  Container,
  DivContent,
  InputColor,
  RowSpaceBetween,
  ClickableTextSpan
} from "./styles";

const WeatherLegend = ({
  min,
  max,
  onChangeDirection,
  onChangeWeather,
  color,
  onChangeColor,
  optionDirection,
  optionWeather,
  isShowWeatherRoute,
  setIsShowWeatherRoute,
  setIsShowDirectionRoute,
  isShowRoute,
}) => {
  const intl = useIntl();
  const [showOptionsDirection, setShowOptionsDirection] = useState(false);
  const [showOptionsWeather, setShowOptionsWeather] = useState(false);
  const [isShowDirection, setIsShowDirection] = useState(false);
  const [isShowWeather, setIsShowWeather] = useState(false);

  const getAvg = (min, max) => {
    if (!min && !max) {
      return 0;
    }

    return min + (max - min) / 2;
  };

  const optionsDirection = [
    {
      label: intl.formatMessage({ id: "wave.direction" }),
      value: "wave_direction",
    },
    {
      label: intl.formatMessage({ id: "wind.wave.direction" }),
      value: "wind_wave_direction",
    },
    {
      label: intl.formatMessage({ id: "swell.wave.direction" }),
      value: "swell_wave_direction",
    },
    {
      label: intl.formatMessage({
        id: "ocean.current.direction",
      }),
      value: "ocean_current_direction",
    },
  ].map((x) => (x.value === optionDirection ? { ...x, checked: true } : x));

  const optionsWeather = [
    {
      label: intl.formatMessage({ id: "wave.height" }),
      value: "wave_height",
    },
    {
      label: intl.formatMessage({ id: "wave.period" }),
      value: "wave_period",
    },
    {
      label: intl.formatMessage({ id: "wind.wave.height" }),
      value: "wind_wave_height",
    },
    {
      label: intl.formatMessage({ id: "wind.wave.period" }),
      value: "wind_wave_period",
    },
    {
      label: intl.formatMessage({ id: "wind.wave.peak.period" }),
      value: "wind_wave_peak_period",
    },
    {
      label: intl.formatMessage({ id: "swell.wave.height" }),
      value: "swell_wave_height",
    },
    {
      label: intl.formatMessage({ id: "swell.wave.period" }),
      value: "swell_wave_period",
    },
    {
      label: intl.formatMessage({ id: "swell.wave.peak.period" }),
      value: "swell_wave_peak_period",
    },
    {
      label: intl.formatMessage({ id: "ocean.current.velocity" }),
      value: "ocean_current_velocity",
    },
  ].map((x) => (x.value === optionWeather ? { ...x, checked: true } : x));

  const getCheckedOption = () => {
    if (showOptionsDirection)
      return optionsDirection?.some((x) => x.checked);
    else
      return optionsWeather?.some((x) => x.checked);
  }

  const getOptions = () => {
    if (showOptionsDirection)
      return optionsDirection;
    else
      return optionsWeather;
  }

  const onOpenOptionsDirection = () => {
    if (showOptionsWeather) {
      setShowOptionsDirection(false)
      setShowOptionsWeather(false)
    } else {
      setShowOptionsDirection(!showOptionsDirection)
    }
  }

  const onOpenOptionsWeather = () => {
    if (showOptionsDirection) {
      setShowOptionsDirection(false)
      setShowOptionsWeather(false)
    } else {
      setShowOptionsWeather(!showOptionsWeather)
    }
  }

  const onChangeTooggleDirection = () => {
    setIsShowDirection(!isShowDirection)
    setIsShowDirectionRoute(!isShowDirection)
    setShowOptionsDirection(false)
    setShowOptionsWeather(false)
    onChangeDirection("wave_direction")
  }

  return (
    <Container
      style={{ bottom: -180 }}>
      {(showOptionsDirection || showOptionsWeather) && (
        <DivContent>
          <Col className="pr-2 pl-2">
            <Row between="md" middle="md" className="pl-2 pt-2 pr-2">
              <TextSpan apparence="p2" hint>
                <FormattedMessage id="options" />:
              </TextSpan>
              <Button
                onClick={() => {
                  setShowOptionsDirection(false)
                  setShowOptionsWeather(false)
                }}
                size="Tiny"
                appearance="ghost"
                status="Danger"
              >
                <EvaIcon name="close-outline" />
              </Button>
            </Row>
            <Col className="pl-1">
              <Radio
                name="options"
                onChange={(value) => {
                  if (showOptionsDirection)
                    onChangeDirection(value)
                  else
                    onChangeWeather(value)
                }}
                options={getOptions()}
                size="Small"
              />
            </Col>
          </Col>
        </DivContent>
      )}

      <DivContent
        style={{
          height: "max-content",
          marginLeft: "0.6rem",
          padding: "0.3rem 0.9rem",
          maxWidth: "113px",
          width: "113px",
        }}
      >
        <Row
          center="xs"
          style={{ marginBottom: "0.1rem", marginTop: "0.1rem" }}
          className="pr-1 pl-1"
        >
          <ColStyled>
            {!!getCheckedOption() && (
              <TextSpan
                apparence="c2"
                style={{
                  textAlign: "center",
                }}
                hint
              >
                {getCheckedOption()?.label}
              </TextSpan>
            )}
            {optionDirection && isShowDirection && <TextSpan
            style={{ textAlign: "center" }}
            apparence="p3" hint>
              {optionsDirection.find(x => x.value === optionDirection)?.label}
            </TextSpan>}

            <RowSpaceBetween>
              <ClickableTextSpan
                style={{ flexWrap: "nowrap", display: "flex" }}
                apparence="c2" hint onClick={() => onOpenOptionsDirection()}>
                <EvaIcon name="settings-2-outline" options={{
                  height: 16,
                  width: 16,
                }} />
                <FormattedMessage id="direction" />
              </ClickableTextSpan>
              <Toggle
                size="Tiny"
                checked={isShowDirection}
                onChange={() => onChangeTooggleDirection()}
              />
            </RowSpaceBetween>
            {optionWeather && isShowWeather && <TextSpan
            style={{ textAlign: "center" }}
            className="mt-1"
            apparence="p3" hint>
              {optionsWeather.find(x => x.value === optionWeather)?.label}
            </TextSpan>}
            <RowSpaceBetween>
              <ClickableTextSpan
                style={{ flexWrap: "nowrap", display: "flex" }}
                apparence="c2" hint onClick={() => onOpenOptionsWeather()}>
                <EvaIcon name="settings-2-outline" options={{
                  height: 16,
                  width: 16,
                }} />
                <FormattedMessage id="weather" />
              </ClickableTextSpan>
              <Toggle
                size="Tiny"
                checked={isShowWeather}
                onChange={() => {
                  setIsShowWeather(!isShowWeather)
                  setIsShowWeatherRoute(!isShowWeather)
                  setShowOptionsDirection(false)
                  setShowOptionsWeather(false)
                  onChangeWeather("wave_height")
                }}
              />
            </RowSpaceBetween>
          </ColStyled>
        </Row>
        {isShowWeather && (
          <>
            <Row className="pr-1" between="xs" middle="xs">
              <InputColor
                type="color"
                value={color.min}
                onChange={(e) => onChangeColor("min", e.target.value)}
              />
              <TextSpan apparence="s3">
                {(min || 0)?.toFixed(1)?.replace(".", ",")}
              </TextSpan>
              <TextSpan apparence="p4" className="ml-1" style={{ marginTop: 1.5 }}>
                <FormattedMessage id="min.contraction" />
              </TextSpan>
            </Row>
            <Row className="pr-1" between="xs" middle="xs">
              <InputColor
                type="color"
                name=""
                id=""
                value={color.med}
                onChange={(e) => onChangeColor("med", e.target.value)}
              />

              <TextSpan apparence="s3">
                {(getAvg(min, max) || 0)?.toFixed(1)?.replace(".", ",")}
              </TextSpan>
              <TextSpan apparence="p4" className="ml-1" style={{ marginTop: 1.5 }}>
                <FormattedMessage id="avg.contraction" />
              </TextSpan>
            </Row>
            <Row className="pr-1" between="xs" middle="xs">
              <InputColor
                type="color"
                name=""
                id=""
                value={color.max}
                onChange={(e) => onChangeColor("max", e.target.value)}
              />

              <TextSpan apparence="s3">
                {(max || 0)?.toFixed(1)?.replace(".", ",")}
              </TextSpan>
              <TextSpan apparence="p4" className="ml-1" style={{ marginTop: 1.5 }}>
                <FormattedMessage id="max.contraction" />
              </TextSpan>
            </Row>
          </>
        )}
      </DivContent>
    </Container>
  );
};

const mapStateToProps = (state) => ({
  isShowWeatherRoute: state.map.isShowWeatherRoute,
  isShowRoute: state.map.isShowRoute,
});

const mapDispatchToProps = (dispatch) => ({
  setIsShowWeatherRoute: (isShow) => {
    dispatch(setIsShowWeatherRoute(isShow));
  },
  setIsShowDirectionRoute: (isShow) => {
    dispatch(setIsShowDirectionRoute(isShow));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(WeatherLegend);
