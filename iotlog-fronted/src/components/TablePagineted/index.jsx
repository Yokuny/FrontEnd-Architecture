import React from "react";
import styled, { css } from "styled-components";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import { debounce } from "underscore";
import { FormattedMessage, useIntl } from "react-intl";
import { CardFooter, CardHeader } from "@paljs/ui/Card";
import { InputGroup } from "@paljs/ui/Input";
import { EvaIcon } from "@paljs/ui/Icon";
import Col from "@paljs/ui/Col";
import Row from "@paljs/ui/Row";
import Pagination from "../ListPaginated/Pagination";
import Sizenation from "../ListPaginated/Sizenation";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";

const ContainerItems = styled.div`
  min-width: 120px;
  margin-right: 30px;
`;

const TRStyled = styled(Tr)`
  ${({ theme }) => css`
    :nth-child(even) {
      background-color: ${theme.backgroundBasicColor2};
    }

    &:hover {
      background-color: ${theme.colorBasicHover};
      span {
        color: ${theme.tabsetTabHoverTextColor};
        background-color: ${theme.tabsetTabHoverBackgroundColor};
        &::before {
          background-color: ${theme.tabsetTabHoverUnderlineColor};
        }
      }
    }
  `}
`;

const THStyled = styled(Th)`
  ${({ theme, textAlign = "" }) => css`
    background-color: ${theme.backgroundBasicColor4};
    padding: 5px;
    ${textAlign && `text-align: ${textAlign};`}
  `}
`;

const TDStyled = styled(Td)`
  ${({ theme, textAlign = "" }) => css`
    padding: 5px;
    ${textAlign && `text-align: ${textAlign};`}
  `}
`;

const TableStyled = styled(Table)``;

const ContainerIcon = styled.a`
  position: absolute;
  right: 15px;
  top: 10px;
  cursor: pointer;
`;

const TablePagineted = ({
  data,
  renderItem,
  onPageChanged,
  headers,
  totalItems = 0,
  startSize = 10,
  renderHeader = undefined,
  initialText = "",
}) => {
  const [size, setSize] = React.useState(startSize);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [text, setText] = React.useState(initialText);

  const intl = useIntl();

  const hasMoreThanMinOptions = totalItems > 10;

  const changeValue = debounce((value) => {
    onPageChanged({ currentPage: 1, pageLimit: size, text: value });
    setCurrentPage(1);
    setText(text);

  }, 600);

  const changePage = ({ currentPage }) => {
    setCurrentPage(currentPage);
    onPageChanged({ currentPage, pageLimit: size, text });
  };

  const changeSize = (value) => {
    onPageChanged({
      currentPage: 1,
      pageLimit: value?.value,
      text,
    });
    setSize(value?.value);
    setCurrentPage(1);
  };

  return (
    <>
      <CardHeader>
        {renderHeader ? (
          renderHeader()
        ) : (
          <InputGroup fullWidth>
            <input
              placeholder={intl.formatMessage({ id: "search.placeholder" })}
              type="text"
              onChange={(e) => changeValue(e.target.value)}
              defaultValue={text}
            />
            <ContainerIcon onClick={() => {}}>
              <EvaIcon name="search-outline" status="Basic" />
            </ContainerIcon>
          </InputGroup>
        )}
      </CardHeader>

      <TableStyled>
        <Thead>
          <Tr>
            {headers?.map((head, index) => (
              <THStyled key={`${index}-h`} textAlign={head.textAlign}>
                <FormattedMessage id={head.textId} />
              </THStyled>
            ))}
          </Tr>
        </Thead>
        <Tbody>{data?.map((item, index) => renderItem({ item, index }))}</Tbody>
      </TableStyled>
      <CardFooter>
        <Col breakPoint={{ md: 12 }}>
          <Row end>
            {hasMoreThanMinOptions && (
              <ContainerItems>
                <Sizenation
                  total={totalItems}
                  value={size}
                  onChange={changeSize}
                />
              </ContainerItems>
            )}
            <Pagination
              totalRecords={totalItems}
              pageLimit={size}
              pageNeighbours={1}
              onPageChanged={changePage}
              currentPage={currentPage}
            />
          </Row>
        </Col>
      </CardFooter>
    </>
  );
};
export { TablePagineted, TRStyled, TDStyled };
