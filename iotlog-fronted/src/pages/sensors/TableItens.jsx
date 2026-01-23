import React from 'react';
import { FormattedMessage } from "react-intl";
import styled, { css } from "styled-components";
import { EditSensor } from "./EditSensor";
import { OPTIONS_TYPE } from "../../components/Select/SelectTypeSensor";
import { TextSpan } from "../../components";
import { TABLE, TBODY, TD, TH, THEAD, TR, TRH } from "../../components/Table";
import { floatToStringExtendDot } from "../../components/Utils";
import EditMinMax from "./EditMinMax";
import { Checkbox, Row } from '@paljs/ui';


const TheadStyle = styled(THEAD)`
  ${({ theme }) => css`
    th {
      background-color: ${theme.backgroundBasicColor1};
    }
  `}

  //position: sticky;
  top: 0;
  z-index: 2;
`;

const TableItens = ({
  fullData,
  onHandleChangeMinMax,
  idEnterprise,
  dataMinMaxRef,
  sensorsMinMax,
  isLoadingMinMax = false,
  onAfterDataSensorSave = () => { },
}) => {
  const [isActivatingAlerts, setIsActivatingAlerts] = React.useState(false);

  const handleBatchAlertToggle = (isActivatingAlerts) => {
    const alertButtons = document.querySelectorAll('button:has(.eva-bell-outline, .eva-bell-off-outline)');

    const buttonsToClick = Array.from(alertButtons).filter(button =>
      !isActivatingAlerts ? button.textContent.includes('OFF') : button.textContent.includes('ON')
    );

    if (buttonsToClick.length > 0) {
      buttonsToClick.forEach(button => {
        button.click();
      });
    }

    setIsActivatingAlerts(!isActivatingAlerts);
  };

  const SORT_PRIORITY = [
    "decimal",
    "double",
    "int"
  ];

  const dataSorted = fullData.sort((a, b) => {
    const getPriority = (typeInterna) => {
      if (SORT_PRIORITY.includes(typeInterna)) return 0;
      if (!typeInterna) return 1;
      return 2;
    };

    const prioA = getPriority(a.type);
    const prioB = getPriority(b.type);
    if (prioA !== prioB) return prioA - prioB;
    return (a.label || '').localeCompare(b.label || '');
  });

  if (!fullData?.length) {
    return (<></>);
  }

  return (
    <>
      <TABLE>
        <TheadStyle>
          <TRH>
            <TH>
              <TextSpan apparence="p2" hint>
                <FormattedMessage id="description" />
              </TextSpan>
            </TH>
            <TH textAlign="center">
              <TextSpan apparence="p2" hint>
                ID
              </TextSpan>
            </TH>
            <TH textAlign="center">
              <TextSpan apparence="p2" hint>
                <FormattedMessage id="type" />
              </TextSpan>
            </TH>

            <TH textAlign="center">
              <TextSpan apparence="p2" hint>
                <FormattedMessage id="unit" />
              </TextSpan>
            </TH>
            <TH textAlign="center">
              <TextSpan apparence="p2" hint>
                <FormattedMessage id="actions" />
              </TextSpan>
            </TH>
            <TH textAlign="center">
              <TextSpan apparence="p2" hint>
                <FormattedMessage id="sensor.min" />
              </TextSpan>
            </TH>
            <TH textAlign="center">
              <TextSpan apparence="p2" hint>
                <FormattedMessage id="sensor.max" />
              </TextSpan>
            </TH>
            <TH textAlign="center">
              <TextSpan apparence="p2" hint>
                <FormattedMessage id="copy" />
              </TextSpan>
            </TH>
            <TH textAlign="center">
              <TextSpan apparence="p2" hint>
                <FormattedMessage id="sensor.minInput" />
              </TextSpan>
            </TH>
            <TH textAlign="center">
              <TextSpan apparence="p2" hint>
                <FormattedMessage id="sensor.maxInput" />
              </TextSpan>
            </TH>
            <TH textAlign="center"
            style={{
              minWidth: "60px"
            }}
            >
              <Row center="xs">
                <Checkbox
                  checked={isActivatingAlerts}
                  onChange={() => handleBatchAlertToggle(isActivatingAlerts)}
                />
                <TextSpan apparence="p2" hint className="ml-1">
                  <FormattedMessage id="alert" />
                </TextSpan>
              </Row>
            </TH>
          </TRH>
        </TheadStyle>
        <TBODY>
          {dataSorted.map((sensor, index) => {

            const dataMinMaxInitial = dataMinMaxRef.current?.sensors?.find(s => s.idSensor === sensor.idSensor);
            const currentValues = sensorsMinMax?.[sensor.idSensor];

            return (
              <TR
                isEvenColor={index % 2 === 0}
                key={sensor.idSensor}>
                <TD
                  style={{ maxWidth: "250px" }}
                >
                  <TextSpan apparence="p2">
                    {sensor.label}
                  </TextSpan>
                </TD>
                <TD style={{ maxWidth: "150px" }} textAlign="center">
                  <TextSpan apparence="p2" style={{ wordBreak: "break-word" }}>
                    {sensor.idSensor}
                  </TextSpan>
                </TD>
                <TD textAlign="center">
                  <TextSpan apparence="p2">
                    {sensor.type ? OPTIONS_TYPE?.find(option => option.value === sensor.type)?.label : ""}
                  </TextSpan>
                </TD>
                <TD
                  textAlign="center"
                >
                  {sensor.unit}
                </TD>
                <TD
                  textAlign="center"
                >
                  <EditSensor
                    sensor={sensor}
                    idEnterprise={idEnterprise}
                    onAfterSave={onAfterDataSensorSave}
                  />
                </TD>
                <TD
                  textAlign="center"
                >
                  <TextSpan apparence="s2">
                    {sensor.min !== undefined
                      ? ["decimal", "double"].includes(sensor.type)
                        ? floatToStringExtendDot(sensor.min, 2)
                        : sensor.min
                      : ""}
                  </TextSpan>
                </TD>
                <TD
                  textAlign="center"
                >
                  <TextSpan apparence="s2">
                    {sensor.max !== undefined
                      ? ["decimal", "double"].includes(sensor.type)
                        ? floatToStringExtendDot(sensor.max, 2)
                        : sensor.max
                      : ""}
                  </TextSpan>
                </TD>
                <EditMinMax
                  itemConfig={sensor}
                  dataMinMaxInitial={dataMinMaxInitial}
                  currentValues={currentValues}
                  isLoadingMinMax={isLoadingMinMax}
                  onHandleChangeMinMax={onHandleChangeMinMax}

                />
              </TR>
            )
          })}
        </TBODY>
      </TABLE>
    </>
  );
}

export default React.memo(TableItens);
