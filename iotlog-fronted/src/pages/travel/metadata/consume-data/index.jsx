import React from "react";
import { connect } from "react-redux";
import { EvaIcon, InputGroup, Row, Select } from "@paljs/ui";
import { FormattedMessage, useIntl } from "react-intl";
import { useTheme } from "styled-components";
import { LabelIcon, TextSpan } from "../../../../components";
import { TABLE, TBODY, TD, TR } from "../../../../components/Table";
import { DENSITY_DEFAULT } from "../../Utils";
import { addDataConsumeVoyage } from "../../../../actions";
import { floatToStringExtendDot } from "../../../../components/Utils";
import { normalizedUnitValue } from "../../../statistics/Consumption/Utils";

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

const ConsumeData = (props) => {
  const { addDataConsumeVoyage, data, consume } = props;

  const intl = useIntl();
  const theme = useTheme();

  React.useLayoutEffect(() => {
    verifyCalculateAutomatic(data);
  }, [data]);

  const verifyCalculateAutomatic = (data) => {
    let dataToUpdate = {};
    if (
      data?.departureReport?.rboIfo &&
      data?.arrivalReport?.rboIfo &&
      data?.departureReport?.unitIfo &&
      data?.arrivalReport?.unitIfo
    ) {
      const firstUnit = data?.departureReport?.unitIfo;
      const valueIFODeparture = normalizedUnitValue({
        value: data?.departureReport?.rboIfo,
        densityReference:
          data?.departureReport?.densityIFO || DENSITY_DEFAULT.IFO,
        unitToDefault: firstUnit,
        unitValue: data?.departureReport?.unitIfo,
      });
      const valueIfoArrival = normalizedUnitValue({
        value: data?.arrivalReport?.rboIfo,
        densityReference:
          data?.arrivalReport?.densityIfo || DENSITY_DEFAULT.IFO,
        unitToDefault: firstUnit,
        unitValue: data?.arrivalReport?.unitIfo,
      });

      if (valueIFODeparture - valueIfoArrival > 0) {
        dataToUpdate = {
          ifo: valueIFODeparture - valueIfoArrival,
          unitIfo: firstUnit,
          densityIfo:
            ((data?.departureReport?.densityIfo || DENSITY_DEFAULT.IFO) +
              (data?.arrivalReport?.densityIfo || DENSITY_DEFAULT.IFO)) /
            2,
        };
      }
    }
    if (
      data?.departureReport?.rboMdo &&
      data?.arrivalReport?.rboMdo &&
      data?.departureReport?.unitMdo &&
      data?.arrivalReport?.unitMdo
    ) {
      const firstUnit = data?.departureReport?.unitMdo;
      const valueMDODeparture = normalizedUnitValue({
        value: data?.departureReport?.rboMdo,
        densityReference:
          data?.departureReport?.densityMdo || DENSITY_DEFAULT.MDO,
        unitToDefault: firstUnit,
        unitValue: data?.departureReport?.unitMdo,
      });
      const valueMDOArrival = normalizedUnitValue({
        value: data?.arrivalReport?.rboMdo,
        densityReference:
          data?.arrivalReport?.densityMdo || DENSITY_DEFAULT.MDO,
        unitToDefault: firstUnit,
        unitValue: data?.arrivalReport?.unitMdo,
      });

      if (valueMDODeparture - valueMDOArrival > 0) {
        dataToUpdate = {
          ...dataToUpdate,
          mdo: valueMDODeparture - valueMDOArrival,
          unitMdo: firstUnit,
          densityMdo:
            ((data?.departureReport?.densityMdo || DENSITY_DEFAULT.MDO) +
              (data?.arrivalReport?.densityMdo || DENSITY_DEFAULT.MDO)) /
            2,
        };
      }
    }
    if (
      data?.departureReport?.freshWater &&
      data?.arrivalReport?.freshWater &&
      data?.departureReport?.unitFreshWater &&
      data?.arrivalReport?.unitFreshWater
    ) {
      const firstUnit = data?.departureReport?.unitFreshWater;

      if (
        data?.departureReport?.freshWater - data?.arrivalReport?.freshWater >
        0
      ) {
        dataToUpdate = {
          ...dataToUpdate,
          freshWater:
            data?.departureReport?.freshWater - data?.arrivalReport?.freshWater,
          unitFreshWater: firstUnit,
        };
      }
    }
    if (
      data?.departureReport?.oilLubricant &&
      data?.arrivalReport?.oilLubricant &&
      data?.departureReport?.unitOilLubricant &&
      data?.arrivalReport?.unitOilLubricant
    ) {
      const firstUnit = data?.departureReport?.unitOilLubricant;

      if (
        data?.departureReport?.oilLubricant -
          data?.arrivalReport?.oilLubricant >
        0
      ) {
        dataToUpdate = {
          ...dataToUpdate,
          oilLubricant:
            data?.departureReport?.oilLubricant -
            data?.arrivalReport?.oilLubricant,
          unitOilLubricant: firstUnit,
        };
      }
    }

    if (Object.keys(dataToUpdate).length) {
      addDataConsumeVoyage(dataToUpdate);
    }
  };

  const onChangeData = (prop, value) => {
    addDataConsumeVoyage({ [prop]: value });
  };

  return (
    <>
      <TABLE>
        <thead>
          <tr>
            <th className="p-2"></th>
            <th style={{ textAlign: "center" }} className="p-2">
              <Row center style={{ margin: 0 }}>
                <LabelIcon
                  renderIcon={() => (
                    <EvaIcon
                      name={"arrow-circle-up"}
                      className="mt-1"
                      status="Danger"
                      options={{
                        height: 16,
                        width: 16,
                      }}
                    />
                  )}
                  renderTitle={() => (
                    <TextSpan apparence="s1">
                      <FormattedMessage id="departure" />
                    </TextSpan>
                  )}
                />
              </Row>
            </th>
            <th style={{ textAlign: "center" }} className="p-2">
              <Row center style={{ margin: 0 }}>
                <LabelIcon
                  renderIcon={() => (
                    <EvaIcon
                      name={"arrow-circle-down"}
                      className="pt-1"
                      status="Success"
                      options={{
                        height: 16,
                        width: 16,
                      }}
                    />
                  )}
                  renderTitle={() => (
                    <TextSpan apparence="s1">
                      <FormattedMessage id="arrival" />
                    </TextSpan>
                  )}
                />
              </Row>
            </th>
            <th style={{ textAlign: "center", maxWidth: 200 }}>
              <Row center style={{ margin: 0 }}>
                <LabelIcon
                  renderIcon={() => (
                    <EvaIcon
                      name={"droplet"}
                      className="pt-1"
                      status="Info"
                      options={{
                        height: 16,
                        width: 16,
                      }}
                    />
                  )}
                  renderTitle={() => (
                    <TextSpan apparence="s1">
                      <FormattedMessage id="total" />
                    </TextSpan>
                  )}
                />
              </Row>
            </th>
          </tr>
        </thead>
        <TBODY>
          <TR>
            <TD>
              <TextSpan apparence="s2">IFO</TextSpan>
            </TD>
            <TD textAlign="center">
              <TextSpan apparence="p2">{`${floatToStringExtendDot(
                data?.departureReport?.rboIfo
              )} ${data?.departureReport?.unitIfo || ""}`}</TextSpan>
            </TD>
            <TD textAlign="center">
              <TextSpan apparence="p2">{`${floatToStringExtendDot(
                data?.arrivalReport?.rboIfo
              )} ${data?.arrivalReport?.unitIfo || ""}`}</TextSpan>
            </TD>
            <TD textAlign="center">
            <TextSpan apparence="s2">{`${floatToStringExtendDot(
                consume?.ifo
              )} ${consume?.unitIfo || ""}`}</TextSpan>
              {/* <Row className="mt-1" between style={{ margin: 0 }}>
                <InputGroup fullWidth style={{ width: "66%" }}>
                  <InputDecimal
                    value={consume?.ifo}
                    onChange={(e) => onChangeData("ifo", e)}
                    type="text"
                    placeholder={`IFO`}
                  />
                </InputGroup>
                <div style={{ width: "32%" }}>
                  <Select
                    options={unitsOptions}
                    menuPosition="fixed"
                    placeholder={intl.formatMessage({ id: "unit.acronomy" })}
                    value={unitsOptions.find(
                      (x) => x.value === consume?.unitIfo
                    )}
                    onChange={(e) => onChangeData("unitIfo", e?.value)}
                  />
                </div>
              </Row> */}
            </TD>
          </TR>
          <TR>
            <TD>
              <TextSpan apparence="s2">MDO</TextSpan>
            </TD>
            <TD textAlign="center">
              <TextSpan apparence="p2">{`${floatToStringExtendDot(
                data?.departureReport?.rboMdo
              )} ${data?.departureReport?.unitMdo || ""}`}</TextSpan>
            </TD>
            <TD textAlign="center">
              <TextSpan apparence="p2">{`${floatToStringExtendDot(
                data?.arrivalReport?.rboMdo
              )} ${data?.arrivalReport?.unitMdo || ""}`}</TextSpan>
            </TD>
            <TD textAlign="center">
              <TextSpan apparence="s2">{`${floatToStringExtendDot(
                consume?.mdo
              )} ${consume?.unitMdo || ""}`}</TextSpan>
              {/* <Row className="mt-1" between style={{ margin: 0 }}>
                <InputGroup fullWidth style={{ width: "65%" }}>
                  <InputDecimal
                    value={consume?.mdo}
                    onChange={(e) => onChangeData("mdo", e)}
                    type="text"
                    placeholder={`MDO`}
                  />
                </InputGroup>
                <div style={{ width: "32%" }}>
                  <Select
                    options={unitsOptions}
                    menuPosition="fixed"
                    placeholder={intl.formatMessage({ id: "unit.acronomy" })}
                    value={unitsOptions.find(
                      (x) => x.value === consume?.unitMdo
                    )}
                    onChange={(e) => onChangeData("unitMdo", e?.value)}
                  />
                </div>
              </Row> */}
            </TD>
          </TR>
          <TR>
            <TD>
              <TextSpan apparence="s2">
                <FormattedMessage id="rbo.fresh.water" />
              </TextSpan>
            </TD>
            <TD textAlign="center">
              <TextSpan apparence="p2">{`${floatToStringExtendDot(
                data?.departureReport?.freshWater
              )} ${data?.departureReport?.unitFreshWater || ""}`}</TextSpan>
            </TD>
            <TD textAlign="center">
              <TextSpan apparence="p2">{`${floatToStringExtendDot(
                data?.arrivalReport?.freshWater
              )} ${data?.arrivalReport?.unitFreshWater || ""}`}</TextSpan>
            </TD>
            <TD textAlign="center">
              <TextSpan apparence="s2">{`${floatToStringExtendDot(
                consume?.freshWater
              )} ${consume?.unitFreshWater || ""}`}</TextSpan>
              {/* <Row className="mt-1" between style={{ margin: 0 }}>
                <InputGroup fullWidth style={{ width: "65%" }}>
                  <InputDecimal
                    value={consume?.freshWater}
                    onChange={(e) => onChangeData("freshWater", e)}
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
                      (x) => x.value === consume?.unitFreshWater
                    )}
                    onChange={(e) => onChangeData("unitFreshWater", e?.value)}
                  />
                </div>
              </Row> */}
            </TD>
          </TR>
          <TR>
            <TD>
              <TextSpan apparence="s2">
                <FormattedMessage id="rbo.lubricant" />
              </TextSpan>
            </TD>
            <TD textAlign="center">
              <TextSpan apparence="p2">{`${floatToStringExtendDot(
                data?.departureReport?.oilLubricant
              )} ${data?.departureReport?.unitOilLubricant || ""}`}</TextSpan>
            </TD>
            <TD textAlign="center">
              <TextSpan apparence="p2">{`${floatToStringExtendDot(
                data?.arrivalReport?.oilLubricant
              )} ${data?.arrivalReport?.unitOilLubricant || ""}`}</TextSpan>
            </TD>
            <TD textAlign="center">
              <TextSpan apparence="s2">{`${floatToStringExtendDot(
                consume?.oilLubricant
              )} ${consume?.unitOilLubricant || ""}`}</TextSpan>
              {/* <Row className="mt-1" between style={{ margin: 0 }}>
                <InputGroup fullWidth style={{ width: "65%" }}>
                  <InputDecimal
                    value={consume?.oilLubricant}
                    onChange={(e) => onChangeData("oilLubricant", e)}
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
                      (x) => x.value === consume?.unitOilLubricant
                    )}
                    onChange={(e) => onChangeData("unitOilLubricant", e?.value)}
                  />
                </div>
              </Row> */}
            </TD>
          </TR>
        </TBODY>
      </TABLE>
    </>
  );
};

const mapStateToProps = (state) => ({
  data: state.voyage.data,
  consume: state.voyage.consume,
});

const mapDispatchToProps = (dispatch) => ({
  addDataConsumeVoyage: (item) => {
    dispatch(addDataConsumeVoyage(item));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ConsumeData);
