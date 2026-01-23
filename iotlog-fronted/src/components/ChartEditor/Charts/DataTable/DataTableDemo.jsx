import React from "react";
import { FormattedMessage } from "react-intl";
import TextSpan from "../../../Text/TextSpan";
import { ContainerChart } from "../../Utils";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import styled, { css } from "styled-components";

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
    padding: 10px;
  `}
`;

const TDStyled = styled(Td)`
  ${({ theme }) => css`
    padding: 5px;
  `}
`;

const DataTableDemo = (props) => {
  const { height = 200, width = 200 } = props;
  let sizeCol = (width - 30) / 3;
  return (
    <ContainerChart height={height} width={width} className="card-shadow pt-1">
      <TextSpan apparence="s2" className="pb-2">
        <FormattedMessage id="data.table" />
      </TextSpan>
      <Table
        style={{
          height: height - 17,
          width: "100%",
          textAlign: "center",
          marginLeft: 10
        }}
      >
        <THeadStyled>
          <Tr>
            <THStyled style={{ width: sizeCol }}>Col 1</THStyled>
            <THStyled style={{ width: sizeCol }}>Col 2</THStyled>
            <THStyled style={{ width: sizeCol }}>Col 3</THStyled>
          </Tr>
        </THeadStyled>
        <TbodyStyled>
          <TRStyled>
            <TDStyled style={{ width: sizeCol }}>Row 1</TDStyled>
            <TDStyled style={{ width: sizeCol }}>Row 1</TDStyled>
            <TDStyled style={{ width: sizeCol }}>Row 2</TDStyled>
          </TRStyled>
          <TRStyled>
            <TDStyled style={{ width: sizeCol }}>Row 2</TDStyled>
            <TDStyled style={{ width: sizeCol }}>Row 2</TDStyled>
            <TDStyled style={{ width: sizeCol }}>Row 2</TDStyled>
          </TRStyled>
          <TRStyled>
            <TDStyled style={{ width: sizeCol }}>Row 3</TDStyled>
            <TDStyled style={{ width: sizeCol }}>Row 3</TDStyled>
            <TDStyled style={{ width: sizeCol }}>Row 3</TDStyled>
          </TRStyled>
        </TbodyStyled>
      </Table>
    </ContainerChart>
  );
};
export default DataTableDemo;
