import React from "react";
import Row from "@paljs/ui/Row";
import Popover from "@paljs/ui/Popover";
import styled, { css } from "styled-components";
import Spinner from "@paljs/ui/Spinner";
import TextSpan from "../Text/TextSpan";
import Col from "@paljs/ui/Col";
import DateTime from "../DateTime";
import { FormattedMessage, useIntl } from "react-intl";
import { Button } from "@paljs/ui/Button";
import { EvaIcon } from "@paljs/ui/Icon";
import Select from "@paljs/ui/Select";
import moment from "moment";
import { Divide } from "../Info";
import { LabelIcon } from "..";

const ContainerRow = styled(Row)`
  z-index: 9;
  display: flex;
  flex-direction: row;

  padding-left: 10px;
  padding-right: 10px;
  padding-top: 10px;

  input {
    line-height: 1.2rem;
  }

  a svg {
    top: -6px;
    position: absolute;
    right: -5px;
  }
`;
const SpinnerStyled = styled(Spinner)`
  ${({ theme }) => css`
    background-color: transparent;
  `}
`;

export const OPTIONS_DEFAULT = [
  { value: 1, label: "1 min" },
  { value: 2, label: "2 min" },
  { value: 5, label: "5 min" },
  { value: 10, label: "10 min" },
  { value: 15, label: "15 min" },
  { value: 30, label: "30 min" },
  { value: 60, label: "60 min" },
];

export const FilterData = (props) => {
  const { onApply, isLoading, title, renderFooter, noShowInterval } = props;
  const [isReady, setIsReady] = React.useState(false);
  const [isShowClean, setIsShowClean] = React.useState(false);
  const [dateInit, setDateInit] = React.useState(moment().format("YYYY-MM-DD"));
  const [dateEnd, setDateEnd] = React.useState(moment().format("YYYY-MM-DD"));
  const [timeInit, setTimeInit] = React.useState("00:00");
  const [timeEnd, setTimeEnd] = React.useState("23:59");
  const [intervalData, setIntervalData] = React.useState({
    value: 30,
    label: "30 min",
  });

  const buttonOutRef = React.useRef();

  React.useEffect(() => {
    setIsReady(true);
  }, []);

  React.useEffect(() => {
    if (isReady) {
      const options = getOptionsInterval();
      if (!options?.some((x) => x.value === intervalData?.value)) {
        setIntervalData(null);
      }
    }
  }, [dateInit, dateEnd]);

  const intl = useIntl();

  const getOptionsInterval = () => {
    if (
      moment(dateEnd).diff(moment(dateInit), "days") === 0 &&
      !props.noShowNoInterval
    ) {
      return [
        { value: "noInterval", label: "Sem intervalo" },
        ...OPTIONS_DEFAULT,
      ];
    } else if (moment(dateEnd).diff(moment(dateInit), "days") <= 1 || props.isShowAllOptions) {
      return OPTIONS_DEFAULT.filter((x) => x.value >= 1);
    } else if (moment(dateEnd).diff(moment(dateInit), "days") <= 2) {
      return OPTIONS_DEFAULT.filter((x) => x.value >= 2);
    } else if (moment(dateEnd).diff(moment(dateInit), "days") <= 3) {
      return OPTIONS_DEFAULT.filter((x) => x.value >= 5);
    } else if (moment(dateEnd).diff(moment(dateInit), "days") <= 5) {
      return OPTIONS_DEFAULT.filter((x) => x.value >= 10);
    } else if (moment(dateEnd).diff(moment(dateInit), "days") < 16) {
      return OPTIONS_DEFAULT.filter((x) => x.value > 15);
    }
    return OPTIONS_DEFAULT.filter((x) => x.value >= 30);
  };

  const handleClick = () => {
    setIsShowClean(true);
    onApply({
      dateInit,
      dateEnd,
      timeInit,
      timeEnd,
      interval: intervalData?.value,
    });
    if (buttonOutRef.current) buttonOutRef.current.click();
  };

  const classFilter = props.isClassFilter ? "filterPosition" : "inline-block";

  const handleClickClean = () => {
    setDateInit(moment().format("YYYY-MM-DD"));
    setDateEnd(moment().format("YYYY-MM-DD"));
    setTimeInit("00:00");
    setTimeEnd("23:59");
    setIsShowClean(false);
    onApply({
      isClean: true,
    });

    if (buttonOutRef.current) buttonOutRef.current.click();
  };

  return (
    <>
      <button ref={buttonOutRef} style={{ display: "none", height: 0 }}></button>
      <Popover
        className={classFilter}
        trigger="click"
        placement="bottom"
        overlay={
          <ContainerRow
            className="card-show"
            style={{ minWidth: 100, maxWidth: 380 }}
          >
            <Col breakPoint={{ md: 12 }} className="ml-2 mb-3">
              <LabelIcon
                iconName="funnel-outline"
                title={title || <FormattedMessage id="filter" />}
              />
            </Col>
            <Divide mh="-1px" style={{ width: "100%" }} />
            <Row className="m-2" style={{ width: "100%" }}>
              <Col breakPoint={{ md: 12 }} className="mb-4">
                <Row>
                  <Col breakPoint={{ md: 6, xs: 7 }}>
                    <TextSpan apparence="s2">
                      <FormattedMessage id="date.start" />
                    </TextSpan>
                  </Col>
                  <Col breakPoint={{ md: 6, xs: 5 }}>
                    <TextSpan apparence="s2">
                      <FormattedMessage id="hour.start" />
                    </TextSpan>
                  </Col>
                </Row>
                <div className="mt-1" />
                <DateTime
                  onChangeDate={(value) => setDateInit(value)}
                  onChangeTime={(value) => setTimeInit(value)}
                  date={dateInit}
                  time={timeInit}
                  max={dateEnd}
                />
              </Col>
              <Col breakPoint={{ md: 12 }} className="mb-4">
                <Row>
                  <Col breakPoint={{ md: 6, xs: 7 }}>
                    <TextSpan apparence="s2">
                      <FormattedMessage id="date.end" />
                    </TextSpan>
                  </Col>
                  <Col breakPoint={{ md: 6, xs: 5 }}>
                    <TextSpan apparence="s2">
                      <FormattedMessage id="hour.end" />
                    </TextSpan>
                  </Col>
                </Row>
                <div className="mt-1" />
                <DateTime
                  onChangeDate={(value) => setDateEnd(value)}
                  onChangeTime={(value) => setTimeEnd(value)}
                  date={dateEnd}
                  time={timeEnd}
                  min={dateInit}
                />
              </Col>
              {!!dateInit &&
                !!dateEnd && [
                  <Col
                    breakPoint={{ md: isShowClean ? 8 : 10 }}
                    className="mb-4"
                  >
                    {!noShowInterval && <>
                      <TextSpan apparence="s2">
                        <FormattedMessage id="interval" />
                      </TextSpan>
                      <div className="mt-1" />
                      <Select
                        options={getOptionsInterval()}
                        onChange={(value) => setIntervalData(value)}
                        value={intervalData}
                        placeholder={intl.formatMessage({ id: "interval" })}
                      />
                    </>}
                  </Col>,
                  <Col breakPoint={{ md: 2 }} className={`pt-2 col-flex-center`}>
                    {isLoading ? (
                      <SpinnerStyled size="Small" status="Primary" />
                    ) : (
                      <Button
                        size="Tiny"
                        status="Primary"
                        disabled={
                          !dateInit ||
                          !dateEnd ||
                          !intervalData ||
                          (intervalData?.value === "noInterval" &&
                            moment(dateEnd).diff(moment(dateInit), "days") > 0)
                        }
                        onClick={handleClick}
                      >
                        <EvaIcon name="search-outline" />
                      </Button>
                    )}
                  </Col>,
                  <>
                    {isShowClean && (
                      <Col
                        breakPoint={{ md: 2 }}
                        className="pt-2 col-flex-center"
                      >
                        <Button
                          size="Tiny"
                          status="Danger"
                          onClick={handleClickClean}
                        >
                          <EvaIcon name="close-circle-outline" />
                        </Button>
                      </Col>
                    )}
                  </>,
                ]}
            </Row>
            {renderFooter ? renderFooter() : undefined}
          </ContainerRow>
        }
      >
        {props.children}
      </Popover>
      {isLoading && (
        <div
          style={{
            ...{
              padding: 3,
              position: "absolute",
              left: 80,
              top: 5,
              zIndex: 999,
              width: 40,
              height: 40,
            },
            ...(props.styleSpinner || {}),
          }}
        >
          <SpinnerStyled />
        </div>
      )}
    </>
  );
};
