import { Button, Col, ContextMenu, EvaIcon, Progress, Row } from "@paljs/ui";
import React from "react";
import { useIntl } from "react-intl";
import styled, { useTheme } from "styled-components";
import { ItemRow, TextSpan } from "../../components";
import moment from "moment";
import {
  calculateValueBetweenDates,
  getDiffDateString,
  mountTextPort,
} from "./Utils";
import { Link } from "react-router-dom";
import { Crane } from "../../components/Icons";

const RowRead = styled.div`
  display: flex;
  flex-direction: row;
`;

const ColCenter = styled(Col)`
  display: flex;
  flex-direction: column;
  justify-content: center;

  .progress-container {
    height: 0.2rem;
  }
`;

const ColEnd = styled(Col)`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const ColInCenter = styled(Col)`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ItemInPort = (props) => {
  const { item, itemsMenu } = props;

  const intl = useIntl();
  const theme = useTheme();

  const colorStatus = !!item?.dateTimeEnd ? "colorBasic600" : "colorInfo500";

  const showMenuItens = !!itemsMenu?.length;

  const getStatusAndValue = (voyage) => {
    if (!voyage) {
      return {
        status: "Basic",
        value: 0,
      };
    }
    if (voyage?.dateTimeEnd) {
      return {
        status: "Info",
        value: 100,
      };
    }

    if (voyage?.metadata?.etd) {
      const late = new Date() > new Date(voyage.metadata.etd);
      return {
        status: late ? "Danger" : "Info",
        value: late
          ? 90
          : calculateValueBetweenDates(
              voyage.dateTimeStart,
              voyage.metadata.etd
            ),
      };
    }

    return {
      status: "Info",
      value: 5,
    };
  };

  const statusProps = getStatusAndValue(item);

  const port = item?.portPointSource || item?.portPointStart;

  return (
    <ItemRow
      colorTextTheme={colorStatus}
      style={{ backgroundColor: theme.backgroundBasicColor2, flexWrap: "wrap" }}
    >
      <ColCenter
        breakPoint={{ md: 3, sm: 12, is: 12, xs: 12 }}
        className="mb-4 mt-4 center-mobile"
      >
        <Row style={{ margin: 0 }}>
          <Crane
            style={{
              height: 18,
              width: 18,
              fill: theme[colorStatus],
              marginRight: 8,
            }}
          />
          <TextSpan apparence="s1">{item.code}</TextSpan>
        </Row>
        <TextSpan apparence="c3">{`${item?.machine?.name}${
          item?.machine?.code ? ` - ${item?.machine?.code}` : ""
        }`}</TextSpan>
      </ColCenter>
      <ColCenter breakPoint={{ md: 5, xs: 12 }} className="mt-4 mb-4">
        <Row center middle="xs"className="mb-4">
          <ColInCenter
            breakPoint={{ md: 12, xs: 12 }}
          >
            {!!port && (
              <>
                {!!port?.code && (
                  <TextSpan apparence="s2">{port?.code}</TextSpan>
                )}
                <TextSpan apparence="p3">{port?.description}</TextSpan>
              </>
            )}
          </ColInCenter>
        </Row>
        <Progress
          status={statusProps?.value === 100 ? '' : statusProps.status}
          style={statusProps?.value === 100 ? { backgroundColor: theme.colorBasic600, height: '0.2rem' } : {}}
          size="Tiny"
          value={statusProps.value}
        />
        <Row between="xs" middle="xs" className="mt-2">
          <Col breakPoint={{ md: 5, xs: 5 }}>
            <RowRead>
              <EvaIcon
                name="arrow-circle-down"
                status="Success"
                className="mt-1 mr-1"
                options={{ height: 18, width: 18 }}
              />
              <TextSpan style={{ marginTop: 2.8 }} apparence="p3">
                {`${moment(
                  item.metadata?.dateTimeArrival || item.dateTimeStart
                ).format("HH:mm, DD MMM")}`}
              </TextSpan>
            </RowRead>
          </Col>
          <Col breakPoint={{ md: 2, xs: 2 }}></Col>
          <ColEnd breakPoint={{ md: 5, xs: 5 }}>
            {!!item?.metadata?.etd && (
              <RowRead>
                <EvaIcon
                  name="navigation-2-outline"
                  status="Basic"
                  className="mt-1 mr-1"
                  options={{ height: 18, width: 18 }}
                />
                <TextSpan apparence="p3" style={{ marginTop: 2.8 }}>
                  <strong>ETD </strong>
                  {`${moment(item?.metadata?.etd).format("HH:mm, DD MMM")}`}
                </TextSpan>
              </RowRead>
            )}

            {!!(item?.metadata?.dateTimeDeparture || item.dateTimeEnd) && (
              <RowRead>
                <EvaIcon
                  name="arrow-circle-up"
                  status="Danger"
                  className="mt-1 mr-1"
                  options={{ height: 18, width: 18 }}
                />
                <TextSpan apparence="p3" style={{ marginTop: 2.8 }}>
                  {`${moment(
                    item?.metadata?.dateTimeDeparture || item.dateTimeEnd
                  ).format("HH:mm, DD MMM")}`}
                </TextSpan>
              </RowRead>
            )}
          </ColEnd>
        </Row>
      </ColCenter>
      <ColCenter breakPoint={{ md: 3, xs: 12 }} className="mb-2">
        {!!item?.dateTimeEnd && (
          <RowRead style={{ justifyContent: "center" }}>
            <EvaIcon
              name="clock-outline"
              status="Basic"
              className="mt-1 mr-1"
              options={{ height: 18, width: 16 }}
            />
            <TextSpan style={{ marginTop: 2 }} apparence="p3">
              {getDiffDateString(item.dateTimeStart, item.dateTimeEnd, intl)}
            </TextSpan>
          </RowRead>
        )}
      </ColCenter>
      {showMenuItens && (
        <ColCenter breakPoint={{ md: 1 }}>
          <ContextMenu
            className="inline-block mr-1 text-start"
            placement="left"
            items={itemsMenu}
            Link={Link}
          >
            <div className="col-flex-center">
              <Button size="Tiny" status="Basic">
                <EvaIcon name="more-vertical" />
              </Button>
            </div>
          </ContextMenu>
        </ColCenter>
      )}
    </ItemRow>
  );
};

export default ItemInPort;
