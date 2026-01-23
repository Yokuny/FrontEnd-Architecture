import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import Col from "@paljs/ui/Col";
import Row from "@paljs/ui/Row";
import { Checkbox } from "@paljs/ui";
import styled from "styled-components";
import { TextSpan } from "../../";
import { TABLE, TBODY, TD, TH, THEAD, TR, TRH } from "../../Table";
import { extractResumeFromDescription } from "../Utils/RavitecHelpers";

const CounterBadge = styled.div`
  background-color: ${props => props.theme.primaryColor || '#0095ff'};
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  font-weight: bold;
  font-size: 14px;
  margin-bottom: 16px;
  display: inline-block;
`;

const TableContainer = styled.div`
  width: 100%;
  max-width: 100%;
  margin-top: 16px;
  box-sizing: border-box;
  
  table {
    width: 100%;
    table-layout: auto;
    
    td, th {
      overflow-wrap: break-word;
      word-wrap: break-word;
      word-break: break-word;
    }
  }
`;

const Container = styled.div`
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
`;

const Step1SelectOrders = ({ orders, selectedOrders, onSelectionChange }) => {
  const intl = useIntl();

  const handleToggleOrder = (orderId) => {
    const isSelected = selectedOrders.includes(orderId);
    
    if (isSelected) {
      onSelectionChange(selectedOrders.filter(id => id !== orderId));
    } else {
      onSelectionChange([...selectedOrders, orderId]);
    }
  };

  const handleToggleAll = () => {
    if (selectedOrders.length === orders.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(orders.map(order => order.id));
    }
  };

  const allSelected = orders.length > 0 && selectedOrders.length === orders.length;

  return (
    <Container>
      <Row>
      <Col breakPoint={{ lg: 12, md: 12 }}>
        
        <CounterBadge>
          <FormattedMessage 
            id="ravitec.counter" 
            values={{ 
              selected: selectedOrders.length, 
              total: orders?.length || 0 
            }}
            defaultMessage="{selected} de {total} OSs selecionadas"
          />
        </CounterBadge>

        <TableContainer>
          <TABLE>
            <THEAD>
              <TRH>
                <TH style={{ width: "60px" }}>
                  <Checkbox 
                    checked={allSelected}
                    onChange={handleToggleAll}
                  />
                </TH>
                <TH style={{ width: "60px" }}>
                  <TextSpan apparence="p2" hint>
                    N°
                  </TextSpan>
                </TH>
                <TH textAlign="center">
                  <TextSpan apparence="p2" hint>
                    JOB
                  </TextSpan>
                </TH>
                <TH textAlign="center">
                  <TextSpan apparence="p2" hint>
                    <FormattedMessage id="os" />
                  </TextSpan>
                </TH>
                <TH textAlign="left">
                  <TextSpan apparence="p2" hint>
                    <FormattedMessage id="description" defaultMessage="Descrição" />
                  </TextSpan>
                </TH>
              </TRH>
            </THEAD>
            <TBODY>
              {orders && orders.length > 0 ? (
                orders.map((order, index) => {
                  const isSelected = selectedOrders.includes(order.id);
                  return (
                    <TR key={order.id} isEvenColor={index % 2 === 0}>
                      <TD textAlign="center">
                        <Checkbox
                          checked={isSelected}
                          onChange={() => handleToggleOrder(order.id)}
                        />
                      </TD>
                      <TD textAlign="center">
                        <TextSpan apparence="s2">{order.index}</TextSpan>
                      </TD>
                      <TD textAlign="center">
                        <TextSpan apparence="s2">{order.job || "-"}</TextSpan>
                      </TD>
                      <TD textAlign="center">
                        <TextSpan apparence="s2">{order.name}</TextSpan>
                      </TD>
                      <TD textAlign="left">
                        <TextSpan apparence="s2">
                          {extractResumeFromDescription(order.description)}
                        </TextSpan>
                      </TD>
                    </TR>
                  );
                })
              ) : (
                <TR>
                  <TD colSpan={5} textAlign="center">
                    <TextSpan apparence="s2" hint>
                      <FormattedMessage id="no.orders.available" defaultMessage="Nenhuma OS disponível" />
                    </TextSpan>
                  </TD>
                </TR>
              )}
            </TBODY>
          </TABLE>
        </TableContainer>
      </Col>
    </Row>
    </Container>
  );
};

export default Step1SelectOrders;
