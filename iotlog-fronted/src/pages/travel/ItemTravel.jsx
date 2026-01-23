import { Button, Col, ContextMenu, EvaIcon, Progress, Row } from "@paljs/ui";
import React from "react";
import { useIntl } from "react-intl";
import styled, { useTheme } from "styled-components";
import { ItemRow, TextSpan } from "../../components";
import moment from "moment";
import { calculateValueBetweenDates, getDiffDateString } from "./Utils";
import { Link } from "react-router-dom";
import { Route } from "../../components/Icons";

const RowRead = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
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

const ColStart = styled(Col)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const ColInCenter = styled(Col)`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ItemTravel = (props) => {
  const { item, itemsMenu } = props;

  const intl = useIntl();
  const theme = useTheme();

  const colorStatus = !!item?.dateTimeEnd
    ? "colorSuccess500"
    : "colorWarning500";

  const getStatusAndValue = (voyage) => {
    if (!voyage) {
      return {
        status: "Basic",
        value: 0,
      };
    }
    if (voyage?.dateTimeEnd) {
      return {
        status: "Success",
        value: 100,
      };
    }

    if (voyage?.metadata?.eta) {
      const late = new Date() > new Date(voyage.metadata.eta);
      return {
        status: late ? "Danger" : "Primary",
        value: late
          ? 90
          : calculateValueBetweenDates(
              voyage.dateTimeStart,
              voyage.metadata.eta
            ),
      };
    }

    return {
      status: "Warning",
      value: 5,
    };
  };

  const showMenuItens = !!itemsMenu?.length;
  const portFinal = (item?.portPointDestiny || item?.portPointEnd);
  const statusProps = getStatusAndValue(item);

  return (
    <ItemRow colorTextTheme={colorStatus} style={{ flexWrap: "wrap" }}>
      <ColCenter
        breakPoint={{ md: 3, sm: 12, is: 12, xs: 12 }}
        className="mb-4 mt-4 center-mobile"
      >
        <Row style={{ margin: 0 }}>
          <Route
            style={{
              height: 17,
              width: 17,
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
        <Row between="xs" middle="xs" className="mb-4">
          <ColStart breakPoint={{ md: 5, xs: 5 }}>
            {!!item?.portPointStart && <>
              {!!item?.portPointStart?.code && <TextSpan apparence="s2">{item?.portPointStart?.code}</TextSpan>}
              <TextSpan apparence="p3">{item?.portPointStart?.description}</TextSpan>
            </>}
          </ColStart>
          <ColInCenter breakPoint={{ md: 2, xs: 2 }}>
            {!!portFinal && (
              <EvaIcon
                name="arrow-forward-outline"
                status="Basic"
                options={{ height: 27, width: 27 }}
              />
            )}
          </ColInCenter>
          <ColEnd breakPoint={{ md: 5, xs: 5 }}>
            {!!portFinal && <>
              {!!portFinal?.code && <TextSpan apparence="s2">{portFinal?.code}</TextSpan>}
              <TextSpan style={{ textAlign: 'right' }} apparence="p3">{portFinal?.description}</TextSpan>
            </>}
          </ColEnd>
        </Row>
        <Progress
          status={statusProps.status}
          size="Tiny"
          value={statusProps.value}
        />
        <Row between="xs" middle="xs" className="mt-2">
          <Col breakPoint={{ md: 5, xs: 5 }}>
            <RowRead>
              <EvaIcon
                name="arrow-circle-up"
                status="Danger"
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
            {!!item?.metadata?.eta && (
              <RowRead>
                <EvaIcon
                  name="flag-outline"
                  status="Basic"
                  className="mt-1 mr-1"
                  options={{ height: 18, width: 18 }}
                />
                <TextSpan apparence="p3" style={{ marginTop: 2.8 }}>
                  <strong>ETA </strong>
                  {`${moment(item?.metadata?.eta).format("HH:mm, DD MMM")}`}
                </TextSpan>
              </RowRead>
            )}

            {!!(item?.metadata?.dateTimeArrival || item.dateTimeEnd) && (
              <RowRead>
                <EvaIcon
                  name="arrow-circle-down"
                  status="Success"
                  className="mt-1 mr-1"
                  options={{ height: 18, width: 18 }}
                />
                <TextSpan apparence="p3" style={{ marginTop: 2.8 }}>
                  {`${moment(
                    item?.metadata?.dateTimeArrival || item.dateTimeEnd
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

export default ItemTravel;
