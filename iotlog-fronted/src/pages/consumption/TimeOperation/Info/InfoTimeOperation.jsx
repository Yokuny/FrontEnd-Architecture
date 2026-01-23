import React from "react";
import { Card, CardHeader, CardBody } from "@paljs/ui/Card";
import styled, { useTheme } from "styled-components";
import { FormattedMessage } from "react-intl";
import Row from "@paljs/ui/Row";
import { TABLE, THEAD, TBODY, TR, TD, TRH, TH } from "../../../../components/Table";
import { ListType, getIcon } from "../../../fleet/Details/StatusAsset/TimelineStatus/IconTimelineStatus";
import { TextSpan } from "../../../../components";
import { IconBorder } from "../../../../components/Icons/IconRounded";

const Col = styled.div`
  display: flex;
  flex-direction: column;
`

const RULES_ = [
  {
    mode: "dp",
    rules: [
      "<= 500M da plataforma",
      "<= 900M da plataforma e <= 1 nós"
    ],
    observation: "Regra se aplica quando não há sensor de telemetria de DP, caso haja sensor de telemetria, o DP é obtido diretamente do sensor.",
  },
  {
    mode: "standby",
    rules: [
      ">= 500M e <= 2500M da plataforma e <= 2.6 nós"
    ],
  },
  {
    mode: "underway",
    rules: [
      "> 4 nós e <= 2.6 nós"
    ],
  },
  {
    mode: "fasttransit",
    rules: [
      "> 11 nós"
    ],
  },
  {
    mode: "slow",
    rules: [
      "<= 4 nós"
    ],
    observation: "Dentro da Baía de Guanabara"
  },
  {
    mode: "at_anchor",
    rules: [
      "<= 1.9 nós"
    ],
    observation: "Dentro de uma cerca do tipo Fundeio"
  },
  {
    mode: "port",
    rules: [
      "<= 1 nós"
    ],
    observation: "Dentro de uma cerca do tipo Porto"
  },
  {
    mode: "dock",
    rules: [
      "<= 1 nós"
    ],
    observation: "Dentro de uma cerca do tipo Docagem"
  }
]

export const getDetailsInfoMode = (idEnterprise, mode) => {
  if (idEnterprise === "99ea60e8-29d3-4bfa-b72e-f913ecd34fa0") {
    return RULES_.find((x) => x.mode === mode);
  }
}

export default function InfoTimeOperation() {
  const theme = useTheme();
  return (
    <Card>
      <CardHeader>
        <FormattedMessage id="info" />
      </CardHeader>
      <CardBody>
        <TABLE>
          <THEAD>
            <TRH>
              <TH>
                <TextSpan apparence="s2" hint>
                  <FormattedMessage id="mode.operation" />
                </TextSpan>
              </TH>
              <TH textAlign="center">
                <TextSpan apparence="s2" hint>
                  <FormattedMessage id="rule" />
                </TextSpan>
              </TH>
              <TH textAlign="center">
                <TextSpan apparence="s2" hint>
                  <FormattedMessage id="observation" />
                </TextSpan>
              </TH>
            </TRH>
          </THEAD>
          <TBODY>
            {ListType?.map((x, i) => {
              const iconProps = getIcon(x.value, theme, true, { fill: theme?.colorBasic600 });
              const rule = RULES_.find((y) => y.mode === x.value);
              return (
                <TR key={i}
                  isEvenColor={i % 2 === 0}
                >
                  <TD>
                    <Row
                      className="m-0 pt-2 pb-2">
                      <IconBorder
                        color="transparent"
                        style={{ padding: 3 }}
                      >
                        {iconProps.component}
                      </IconBorder>
                      <TextSpan apparence="s2" className="ml-1" style={{ marginTop: '0.2rem' }}>
                        <FormattedMessage id={iconProps.text} />
                      </TextSpan>
                    </Row>
                  </TD>
                  <TD textAlign="center">
                    <Col>
                      {rule?.rules?.map((y, idex) => (
                        <TextSpan apparence="p2" className="mb-2" key={`${i}-${idex}`}>
                          {y}
                        </TextSpan>
                      ))}
                    </Col>
                  </TD>
                  <TD textAlign="center" style={{maxWidth: 200 }}>
                    <TextSpan apparence="p2">
                      {rule.observation}
                    </TextSpan>
                  </TD>
                </TR>)
            })}
          </TBODY>
        </TABLE>
      </CardBody>
    </Card>
  );
}
