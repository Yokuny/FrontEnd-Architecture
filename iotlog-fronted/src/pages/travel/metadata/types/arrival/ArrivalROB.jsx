import { Card, CardHeader, Col, InputGroup, Row, Select } from "@paljs/ui";
import { FormattedMessage, useIntl } from "react-intl";
import styled, { useTheme } from "styled-components";
import { DateTime, LabelIcon, TextSpan } from "../../../../../components";
import { InputDecimal } from "../../../../../components/Inputs/InputDecimal";
import { getIsShowBarge } from "../../common";
import { Draught, Route } from "../../../../../components/Icons";
import { DENSITY_DEFAULT } from "../../../Utils";

const unitsOptions = [
  {
    value: "m³",
    label: "m³",
  },
  // {
  //   value: "L",
  //   label: "L",
  // },
  {
    value: "T",
    label: "T",
  },
];

const ColDate = styled(Col)`
  input {
    line-height: 1.1rem;
  }

  a svg {
    top: -7px;
    position: absolute;
    right: -5px;
  }
`;

export default function ArrivalROB(props) {
  const { onChangeDataRBO, onChangeData, machine, data } = props;

  const dataRBO = data?.arrivalReport;

  const intl = useIntl();
  const theme = useTheme();

  const isShowBarge = getIsShowBarge(machine?.model?.description);

  return (
    <>
      <Row style={{ margin: 0 }}>
        <ColDate breakPoint={{ md: 6 }} className="mb-4">
          <LabelIcon
            iconName="calendar-outline"
            title={<FormattedMessage id="datetime.in" />}
          />
          <DateTime
            className="mt-1"
            onChangeTime={(value) => onChangeData("dateTimeArrivalTime", value)}
            onChangeDate={(time) => onChangeData("dateTimeArrivalDate", time)}
            min={data?.dateTimeStart}
            date={data?.dateTimeArrivalDate}
            time={data?.dateTimeArrivalTime}
            breakPointDate={{ md: 7 }}
            breakPointTime={{ md: 5 }}
          />
        </ColDate>
        <Col breakPoint={{ md: 6 }} className="pt-1 mb-4">
          <LabelIcon
            renderIcon={() => (
              <Route
                style={{
                  height: 13,
                  width: 13,
                  fill: theme.textHintColor,
                  marginRight: 5,
                }}
              />
            )}
            title={`${intl.formatMessage({ id: "distance" })} (nm)`}
          />
          <InputGroup fullWidth className="mt-1">
            <InputDecimal
              value={dataRBO?.distance}
              onChange={(e) => onChangeDataRBO("distance", e)}
              type="text"
              placeholder={`${intl.formatMessage({ id: "distance" })} (nm)`}
            />
          </InputGroup>
        </Col>
        <Col breakPoint={{ md: 3 }} className="mb-4">
          <LabelIcon iconName="droplet" title={`IFO`} />
          <Row className="mt-1" between style={{ margin: 0 }}>
            <InputGroup fullWidth style={{ width: "65%" }}>
              <InputDecimal
                value={dataRBO?.rboIfo}
                onChange={(e) => onChangeDataRBO("rboIfo", e)}
                type="text"
                placeholder={`IFO`}
              />
            </InputGroup>
            <div style={{ width: "32%" }}>
              <Select
                options={unitsOptions}
                menuPosition="fixed"
                placeholder={intl.formatMessage({ id: "unit.acronomy" })}
                value={unitsOptions.find((x) => x.value === dataRBO?.unitIfo)}
                onChange={(e) => onChangeDataRBO("unitIfo", e?.value)}
              />
            </div>
          </Row>
        </Col>
        <Col breakPoint={{ md: 3 }} className="mb-4">
          <LabelIcon
            iconName="droplet-off"
            title={`${intl.formatMessage({ id: "density" })} IFO (T/m³)`}
          />
          <InputGroup fullWidth className="mt-1">
            <InputDecimal
              value={dataRBO?.densityIfo ?? DENSITY_DEFAULT.IFO}
              onChange={(e) => onChangeDataRBO("densityIfo", e)}
              type="text"
              placeholder={`${intl.formatMessage({
                id: "density",
              })} IFO (T/m³)`}
            />
          </InputGroup>
        </Col>
        <Col breakPoint={{ md: 3 }} className="mb-4">
          <LabelIcon iconName="droplet" title={`MDO`} />
          <Row className="mt-1" between style={{ margin: 0 }}>
            <InputGroup fullWidth style={{ width: "65%" }}>
              <InputDecimal
                value={dataRBO?.rboMdo}
                onChange={(e) => onChangeDataRBO("rboMdo", e)}
                type="text"
                placeholder={`MDO`}
              />
            </InputGroup>
            <div style={{ width: "32%" }}>
              <Select
                options={unitsOptions}
                menuPosition="fixed"
                placeholder={intl.formatMessage({ id: "unit.acronomy" })}
                value={unitsOptions.find((x) => x.value === dataRBO?.unitMdo)}
                onChange={(e) => onChangeDataRBO("unitMdo", e?.value)}
              />
            </div>
          </Row>
        </Col>
        <Col breakPoint={{ md: 3 }} className="mb-4">
          <LabelIcon
            iconName="droplet-off"
            title={`${intl.formatMessage({ id: "density" })} MDO (T/m³)`}
          />
          <InputGroup fullWidth className="mt-1">
            <InputDecimal
              value={dataRBO?.densityMdo ?? DENSITY_DEFAULT.MDO}
              onChange={(e) => onChangeDataRBO("densityMdo", e)}
              type="text"
              placeholder={`${intl.formatMessage({
                id: "density",
              })} MDO (T/m³)`}
            />
          </InputGroup>
        </Col>



        <Col breakPoint={{ md: 6 }} className="mb-4">
          <LabelIcon
            iconName="droplet-outline"
            title={`${intl.formatMessage({ id: "rbo.fresh.water" })}`}
          />
          <Row className="mt-1" between style={{ margin: 0 }}>
            <InputGroup fullWidth style={{ width: "65%" }}>
              <InputDecimal
                value={dataRBO?.freshWater}
                onChange={(e) => onChangeDataRBO("freshWater", e)}
                type="text"
                placeholder={intl.formatMessage({ id: "rbo.fresh.water" })}
              />
            </InputGroup>
            <div style={{ width: "32%" }}>
              <Select
                options={unitsOptions}
                menuPosition="fixed"
                placeholder={intl.formatMessage({ id: "unit.acronomy" })}
                value={unitsOptions.find(
                  (x) => x.value === dataRBO?.unitFreshWater
                )}
                onChange={(e) => onChangeDataRBO("unitFreshWater", e?.value)}
              />
            </div>
          </Row>
        </Col>

        <Col breakPoint={{ md: 6 }} className="mb-4">
          <LabelIcon
            iconName="droplet"
            title={`${intl.formatMessage({ id: "rbo.lubricant" })}`}
          />
          <Row className="mt-1" between style={{ margin: 0 }}>
            <InputGroup fullWidth style={{ width: "65%" }}>
              <InputDecimal
                value={dataRBO?.oilLubricant}
                onChange={(e) => onChangeDataRBO("oilLubricant", e)}
                type="text"
                placeholder={intl.formatMessage({ id: "rbo.lubricant" })}
              />
            </InputGroup>
            <div style={{ width: "32%" }}>
              <Select
                options={unitsOptions}
                menuPosition="fixed"
                placeholder={intl.formatMessage({ id: "unit.acronomy" })}
                value={unitsOptions.find(
                  (x) => x.value === dataRBO?.unitOilLubricant
                )}
                onChange={(e) => onChangeDataRBO("unitOilLubricant", e?.value)}
              />
            </div>
          </Row>
        </Col>

        {isShowBarge && (
          <>
            <Col breakPoint={{ md: 12 }}>
              <Card className="mt-2">
                <CardHeader style={{ display: "flex", flexDirection: "row" }}>
                  <Draught
                    style={{
                      width: 22,
                      height: 22,
                      fill: theme.colorPrimary500,
                    }}
                  />
                  <TextSpan apparence="s2" className="ml-1">
                    <FormattedMessage id="draught" />
                  </TextSpan>
                </CardHeader>
                <Row style={{ margin: 0 }} className="pt-2 pl-1 pr-1">
                  <Col breakPoint={{ md: 4 }} className="mb-4">
                    <TextSpan apparence="p2" hint>
                      <FormattedMessage id="pushed" /> (AV) m
                    </TextSpan>
                    <InputGroup fullWidth className="mt-1">
                      <InputDecimal
                        value={dataRBO?.avPushed}
                        onChange={(e) => onChangeDataRBO("avPushed", e)}
                        placeholder={`${intl.formatMessage({
                          id: "pushed",
                        })} (AV)`}
                      />
                    </InputGroup>
                  </Col>

                  <Col breakPoint={{ md: 4 }} className="mb-4">
                    <TextSpan apparence="p2" hint>
                      <FormattedMessage id="pushed" /> (MN) m
                    </TextSpan>
                    <InputGroup fullWidth className="mt-1">
                      <InputDecimal
                        value={dataRBO?.mnPushed}
                        onChange={(e) => onChangeDataRBO("mnPushed", e)}
                        placeholder={`${intl.formatMessage({
                          id: "pushed",
                        })} (MN)`}
                      />
                    </InputGroup>
                  </Col>

                  <Col breakPoint={{ md: 4 }} className="mb-4">
                    <TextSpan apparence="p2" hint>
                      <FormattedMessage id="pushed" /> (AR) m
                    </TextSpan>
                    <InputGroup fullWidth className="mt-1">
                      <InputDecimal
                        value={dataRBO?.arPushed}
                        onChange={(e) => onChangeDataRBO("arPushed", e)}
                        placeholder={`${intl.formatMessage({
                          id: "pushed",
                        })} (AR)`}
                      />
                    </InputGroup>
                  </Col>

                  <Col breakPoint={{ md: 4 }} className="mb-4">
                    <TextSpan apparence="p2" hint>
                      <FormattedMessage id="barge" /> (AV) m
                    </TextSpan>
                    <InputGroup fullWidth className="mt-1">
                      <InputDecimal
                        value={dataRBO?.avBarge}
                        onChange={(e) => onChangeDataRBO("avBarge", e)}
                        placeholder={`${intl.formatMessage({
                          id: "barge",
                        })} (AV)`}
                      />
                    </InputGroup>
                  </Col>

                  <Col breakPoint={{ md: 4 }} className="mb-4">
                    <TextSpan apparence="p2" hint>
                      <FormattedMessage id="barge" /> (MN) m
                    </TextSpan>
                    <InputGroup fullWidth className="mt-1">
                      <InputDecimal
                        value={dataRBO?.mnBarge}
                        onChange={(e) => onChangeDataRBO("mnBarge", e)}
                        placeholder={`${intl.formatMessage({
                          id: "barge",
                        })} (MN)`}
                      />
                    </InputGroup>
                  </Col>

                  <Col breakPoint={{ md: 4 }} className="mb-4">
                    <TextSpan apparence="p2" hint>
                      <FormattedMessage id="barge" /> (AR) m
                    </TextSpan>
                    <InputGroup fullWidth className="mt-1">
                      <InputDecimal
                        value={dataRBO?.arBarge}
                        onChange={(e) => onChangeDataRBO("arBarge", e)}
                        placeholder={`${intl.formatMessage({
                          id: "barge",
                        })} (AR)`}
                      />
                    </InputGroup>
                  </Col>
                </Row>
              </Card>
            </Col>
          </>
        )}
      </Row>
    </>
  );
}
