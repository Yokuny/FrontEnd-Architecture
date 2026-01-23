import React from 'react';
import { FormattedMessage } from 'react-intl';
import { CardBody } from '@paljs/ui';
import moment from 'moment';
import styled, { css } from 'styled-components';
import { TextSpan } from '../../../components';
import { TABLE, TBODY, TD, TH, THEAD, TR } from '../../../components/Table';
import { floatToStringExtendDot } from '../../../components/Utils';

const DataTable = styled(CardBody)`
  overflow-x: hidden;
  overflow-y: auto;
  margin-bottom: 0px;
  max-height: calc(100vh - 380px);

  padding: 0px;
`

const TheadStyle = styled(THEAD)`
  ${({ theme }) => css`
    th {
      background-color: ${theme.backgroundBasicColor1};
    }
  `}

  position: sticky;
  top: 0;
`

export default function TableListConsumption({
  data,
  unitSelected,
  isReal,
  isEstimated,
}) {
  const engines = [...new Set(data?.flatMap(x => x?.engines?.map(y => y?.description)))]
    ?.filter(x => x)

  return (<>
    <DataTable>
      <TABLE>
        <TheadStyle>
          <TR>
            <TH textAlign="center">
              <TextSpan apparence='s2' hint>
                <FormattedMessage id="date" />
              </TextSpan>
            </TH>
            <TH textAlign="center">
              <TextSpan apparence='s2' hint>
                <FormattedMessage id="vessel" />
              </TextSpan>
            </TH>

            {isReal &&
              <>
                <TH textAlign="end">
                  <TextSpan apparence='s2' hint>
                    <FormattedMessage id="polling" /> ({unitSelected?.label})
                  </TextSpan>
                </TH>
                <TH textAlign="end">
                  <TextSpan apparence='s2' hint>
                    CO₂ <FormattedMessage id="polling" /> (Ton)
                  </TextSpan>
                </TH>
              </>}

            {isEstimated &&
              <>
                <TH textAlign="end">
                  <TextSpan apparence='s2' hint>
                    <FormattedMessage id="flowmeter" /> ({unitSelected?.label})
                  </TextSpan>
                </TH>
                <TH textAlign="end">
                  <TextSpan apparence='s2' hint>
                    CO₂ <FormattedMessage id="flowmeter" /> (Ton)
                  </TextSpan>
                </TH>
              </>}
            <TH textAlign="end">
              <TextSpan apparence='s2' hint>
                <FormattedMessage id="stock" /> ({unitSelected?.label})
              </TextSpan>
            </TH>
            {engines?.map((engine, index) => (
              <>
                <TH key={index} textAlign="end">
                  <TextSpan apparence='s2' hint>
                    {engine}
                  </TextSpan>
                </TH>
                <TH key={`${index}-ab`} textAlign="end">
                  <TextSpan apparence='s2' hint>
                    {engine} HR
                  </TextSpan>
                </TH>
              </>
            ))}
          </TR>
        </TheadStyle>
        <TBODY>
          {data?.map((item, index) => (
            <TR key={index} isEvenColor={index % 2 === 0}>
              <TD textAlign="center">
                <TextSpan apparence='p2'>
                  {moment(item?.date).format('DD MMM YYYY')}
                </TextSpan>
              </TD>
              <TD textAlign="center">
                <TextSpan apparence='p2'>
                  {item?.machine?.name}
                </TextSpan>
              </TD>

              {isReal &&
                <>
                  <TD textAlign="end">
                    <TextSpan apparence='p2'>
                      {item?.consumptionReal?.value ? floatToStringExtendDot(item?.consumptionReal?.value, 2) : '-'}
                    </TextSpan>
                  </TD>
                  <TD textAlign="end">
                    <TextSpan apparence='p2'>
                      {item?.consumptionReal?.co2 ? floatToStringExtendDot(Number(item?.consumptionReal?.co2 / 1000), 2) : '-'}
                    </TextSpan>
                  </TD>
                </>}

              {isEstimated &&
                <>
                  <TD textAlign="end">
                    <TextSpan apparence='p2'>
                      {item?.consumption?.value ? floatToStringExtendDot(item?.consumption?.value, 2) : '-'}
                    </TextSpan>
                  </TD>
                  <TD textAlign="end">
                    <TextSpan apparence='p2'>
                      {floatToStringExtendDot(Number(item?.consumption?.co2 / 1000), 2)}
                    </TextSpan>
                  </TD>
                </>}
              <TD textAlign="end">
                <TextSpan apparence='p2'>
                  {floatToStringExtendDot(item?.oil?.stock, 2)}
                </TextSpan>
              </TD>
              {engines?.map((engine, index) => (
                <>
                  <TD key={`${index}-de`} textAlign="end">
                    <TextSpan apparence='p2'>
                      {floatToStringExtendDot(item?.engines?.find(x => x?.description === engine)?.consumption?.value, 2)}
                    </TextSpan>
                  </TD>
                  <TD key={`${index}-ce`} textAlign="end">
                    <TextSpan apparence='p2'>
                      {floatToStringExtendDot(item?.engines?.find(x => x?.description === engine)?.hours, 2)}
                    </TextSpan>
                  </TD>
                </>
              ))}
            </TR>
          ))}
        </TBODY>
      </TABLE>
    </DataTable>
  </>)
}
