import React from "react";
import { useIntl } from "react-intl";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import styled, { css, useTheme } from "styled-components";
import moment from "moment";

import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import { ContentChart } from "../../Utils";

const THeadStyled = styled(Thead)`
  tr {
    position: relative;
    display: block;
  }
`;

const TbodyStyled = styled(Tbody)`
  display: block;
  overflow: auto;
`;

const TRStyled = styled(Tr)`
  ${({ theme }) => css`
    :nth-child(even) {
      background-color: ${theme.backgroundBasicColor2};
    }
  `}
`;

const THStyled = styled(Th)`
  ${({ theme }) => css`
    background-color: ${theme.backgroundBasicColor4};
    padding: 5px;
  `}
`;

const TDStyled = styled(Td)`
  ${({ theme }) => css`
    padding: 5px;
  `}
`;

const DataTableChart = (props) => {
  const { dataTable, data, id } = props;

  const intl = useIntl();

  const getValue = (item, index) => {
    if (data?.columns[index]?.typeCell?.value == "dateServer") {
      return moment(item).format(intl.formatMessage({ id: "format.datetime" }));
    }
    return item;
  };

  return (
    <ContentChart>
      <Table
        style={{
          width: "100%",
          textAlign: "center",
          height: "100%",
          display: "inline-block",
          overflow: "auto",
        }}
      >
        <Thead>
          <Tr>
            {data?.columns?.map((item, j) => (
              <THStyled key={`header-${j}-${id}`}>
                <div>{item.header}</div>
              </THStyled>
            ))}
          </Tr>
        </Thead>
        <Tbody style={{ overflow: "auto" }}>
          {dataTable?.map((x, i) => (
            <TRStyled key={`line-${i}-${id}`}>
              {x?.map((item, j) => (
                <TDStyled key={`column-${i}-${j}-${id}`}>
                  {getValue(item, j)}
                </TDStyled>
              ))}
            </TRStyled>
          ))}
        </Tbody>
      </Table>
    </ContentChart>
  );
};
export default DataTableChart;
