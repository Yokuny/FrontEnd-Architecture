
import { Button, Col, ContextMenu, EvaIcon, Progress, Row } from "@paljs/ui";
import React from "react";
import { useIntl } from "react-intl";
import styled, { useTheme } from "styled-components";
import { ItemRow, TextSpan } from "../../components";
import moment from "moment";
import { calculateValueBetweenDates, getDiffDateString, mountTextPort } from "./Utils";
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

const ItemManualVoyage = (props) => {
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

    if (new Date(voyage?.metadata?.etd) > new Date()) {
      return {
        status: "Basic",
        value: 0,
      }
    }

    if (voyage?.metadata?.dateTimeArrival) {
      return {
        status: "Success",
        value: 100,
      };
    }

    if (voyage?.metadata?.eta) {
      if (new Date(voyage?.metadata?.eta) < new Date()) {
        return {
          status: "Primary",
          value: 95,
        };
      }

      return {
        status: "Info",
        value: calculateValueBetweenDates(
          voyage.metadata?.etd,
          voyage.metadata?.eta
        ),
      };
    }

    return {
      status: "Warning",
      value: 5,
    };
  };

  const showMenuItens = !!itemsMenu?.length;
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
        <TextSpan apparence="c3" hint>{`${item?.machine?.name}${item?.machine?.code ? ` - ${item?.machine?.code}` : ""
          }`}</TextSpan>
      </ColCenter>
      <ColCenter breakPoint={{ md: 5, xs: 12 }} className="mt-4 mb-4">
        <Row between="xs" middle="xs">
          <ColStart breakPoint={{ md: 5, xs: 5 }}>

            <TextSpan apparence="s2" className="mb-2">{item.metadata?.from?.where}</TextSpan>
            {!!item?.metadata?.from?.etd && (
              <RowRead>
                <TextSpan apparence="p3" hint>
                  <strong>ETD: </strong>
                  {`${moment(item.metadata?.from?.etd).format("HH:mm, DD MMM")}`}
                </TextSpan>
              </RowRead>
            )}
            {!!item?.metadata?.from?.etc && (
              <RowRead>
                <TextSpan apparence="p3" hint>
                  <strong>ETC: </strong>
                  {`${moment(item.metadata?.from?.etc).format("HH:mm, DD MMM")}`}
                </TextSpan>
              </RowRead>
            )}
            {!!item?.metadata?.from?.etb && (
              <RowRead>
                <TextSpan apparence="p3" hint>
                  <strong>ETB: </strong>
                  {`${moment(item.metadata?.from?.etb).format("HH:mm, DD MMM")}`}
                </TextSpan>
              </RowRead>
            )}

          </ColStart>
          <ColInCenter breakPoint={{ md: 2, xs: 2 }}>
            {!!item.metadata?.to?.where && (
              <EvaIcon
                name="arrow-forward-outline"
                status="Basic"
                options={{ height: 27, width: 27 }}
              />
            )}
          </ColInCenter>
          <ColEnd breakPoint={{ md: 5, xs: 5 }}>

            <TextSpan apparence="s2" className="mb-2" style={{ textAlign: "end" }}>{item.metadata?.to?.where}</TextSpan>
            {!!item?.metadata?.to?.eta && (
              <RowRead>
                <TextSpan apparence="p3" hint>
                  <strong>ETA: </strong>
                  {`${moment(item?.metadata?.to?.eta).format("HH:mm, DD MMM")}`}
                </TextSpan>
              </RowRead>
            )}
            {!!item?.metadata?.to?.etd && (
              <RowRead>
                <TextSpan apparence="p3" hint>
                  <strong>ETD: </strong>
                  {`${moment(item.metadata?.to?.etd).format("HH:mm, DD MMM")}`}
                </TextSpan>
              </RowRead>
            )}
            {!!item?.metadata?.to?.etb && (
              <RowRead>
                <TextSpan apparence="p3" hint>
                  <strong>ETB: </strong>
                  {`${moment(item.metadata?.to?.etb).format("HH:mm, DD MMM")}`}
                </TextSpan>
              </RowRead>
            )}
          </ColEnd>
        </Row>
      </ColCenter>
      <ColCenter breakPoint={{ md: 3, xs: 12 }} className="mb-2">
        {!!item?.metadata?.from?.etd &&
        !!item?.metadata?.to?.eta && (
          <RowRead style={{ justifyContent: "center" }}>
            <EvaIcon
              name="clock-outline"
              status="Basic"
              className="mt-1 mr-1"
              options={{ height: 18, width: 16 }}
            />
            <TextSpan style={{ marginTop: 2 }} apparence="s3" hint className="mr-1">
              ET:
            </TextSpan>
            <TextSpan style={{ marginTop: 2 }} apparence="p3" hint>
              {getDiffDateString(item?.metadata?.from?.etd, item?.metadata?.to?.eta, intl)}
            </TextSpan>
          </RowRead>
        )}
        {!!item?.metadata?.from?.atd &&
        !!item?.metadata?.to?.ata && (
          <RowRead style={{ justifyContent: "center" }}>
            <EvaIcon
              name="clock"
              status="Basic"
              className="mt-1 mr-1"
              options={{ height: 18, width: 16 }}
            />
            <TextSpan style={{ marginTop: 2 }} apparence="s3" hint className="mr-1">
              AT:
            </TextSpan>
            <TextSpan style={{ marginTop: 2 }} apparence="p3" hint>
              {getDiffDateString(item?.metadata?.from?.atd, item?.metadata?.to?.ata, intl)}
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

export default ItemManualVoyage;
