
import { Badge, Button, Col, ContextMenu, EvaIcon, Row, Tooltip } from "@paljs/ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import styled, { useTheme } from "styled-components";
import { ItemRow, TextSpan } from "../../components";
import moment from "moment";
import { calculateValueBetweenDates, getDiffDateString } from "./Utils";
import { Link } from "react-router-dom";
import { Route } from "../../components/Icons";
import StatusVoyage from "./add/StatusVoyage";

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

const Img = styled.img`
  width: 45px;
  height: 45px;
  border-radius: 50%;
  object-fit: cover;
`;

const ItemItineraryManualVoyage = (props) => {
  const { item, itemsMenu } = props;

  const intl = useIntl();
  const theme = useTheme();

  const colorStatus = !!item?.dateTimeEnd
    ? "colorSuccess500"
    : "colorWarning500";

  const showMenuItens = !!itemsMenu?.length;

  const from = item.itinerary[0]

  const toLast = item.itinerary?.length > 1
    ? item.itinerary.slice(-1)[0]
    : undefined

  const renderVessel = (voyage) => {
    return <><Row
      className="m-0 pl-2"
      middle="xs"
      style={{ display: "flex", flexWrap: "nowrap" }}>
      {voyage?.machine?.image?.url ? (
        <Img src={voyage?.machine?.image?.url} alt={voyage?.machine?.name} />
      ) : (
        <div style={{ minHeight: 50 }} />
      )}
      <div className="ml-4">
        <TextSpan apparence="s2">
          {voyage?.code}
        </TextSpan>
        <br />
        <TextSpan apparence="p2" hint>
          {voyage?.machine?.name}
        </TextSpan>
      </div>
    </Row></>;
  }

  return (
    <ItemRow
      style={{
        lineHeight: 1.3,
      }}
    >
      <ColCenter
        breakPoint={{ md: 3, sm: 12, is: 12, xs: 12 }}
        className="mb-4 mt-4 center-mobile"
      >
        {renderVessel(item)}
      </ColCenter>
      <ColCenter breakPoint={{ md: 5, xs: 12 }} className="mt-4 mb-4">
        <Row between="xs" middle="xs">
          <ColStart breakPoint={{ md: 5, xs: 5 }}>

            <TextSpan apparence="p2" className="mb-2">{from?.where}</TextSpan>
            {!!from?.ets && (
              <RowRead>
                <TextSpan apparence="p3" hint>
                  <strong>ETS: </strong>
                  {`${moment(from?.ets).format("HH:mm, DD MMM")}`}
                </TextSpan>
              </RowRead>
            )}
            {!!from?.ats && (
              <RowRead>
                <TextSpan apparence="p3" hint>
                  <strong>ATS: </strong>
                  {`${moment(from?.ats).format("HH:mm, DD MMM")}`}
                </TextSpan>
              </RowRead>
            )}

          </ColStart>
          <ColInCenter breakPoint={{ md: 2, xs: 2 }}>

            {!!toLast?.where && (
              <EvaIcon
                name="arrow-forward-outline"
                status="Basic"
                options={{ height: 27, width: 27 }}
                className="mb-2"
              />
            )}
            {!!(item.itinerary?.length > 2)
              ?
              <Tooltip
                placement="top"
                content={<>
                  {item.itinerary.slice(1).map((x, i) => {
                    if (i === item.itinerary.length - 2) {
                      return <></>
                    }
                    return (
                      <>
                        <TextSpan apparence="p2" key={i}>
                          #{i + 1} - <strong>{x.where}</strong>
                        </TextSpan>
                        <br />
                      </>
                    )
                  })}
                </>}
                trigger="hint"
              >
                <Badge
                  status="Basic"
                  style={{
                    position: 'relative',
                    fontWeigth: 400
                  }}
                >
                  {item.itinerary?.length - 2} <FormattedMessage
                    id="connection"
                  />
                </Badge>
              </Tooltip>
              : <></>
            }
          </ColInCenter>
          <ColEnd breakPoint={{ md: 5, xs: 5 }}>

            <TextSpan apparence="p2" className="mb-2"
              style={{
                textAlign: "end"
              }}
            >{toLast?.where}</TextSpan>
            {!!toLast?.eta && (
              <RowRead>
                <TextSpan apparence="p3" hint>
                  <strong>ETA: </strong>
                  {`${moment(toLast.eta).format("HH:mm, DD MMM")}`}
                </TextSpan>
              </RowRead>
            )}
            {!!toLast?.ata && (
              <RowRead>
                <TextSpan apparence="p3" hint>
                  <strong>ATA: </strong>
                  {`${moment(toLast?.ata).format("HH:mm, DD MMM")}`}
                </TextSpan>
              </RowRead>
            )}
          </ColEnd>
        </Row>
      </ColCenter>
      <ColCenter breakPoint={{ md: 3, xs: 12 }} className="mb-2">
        {/* {!!from?.etd &&
          !!toLast?.eta && (
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
                {getDiffDateString(from?.etd, toLast.eta, intl)}
              </TextSpan>
            </RowRead>
          )}
        {!!from?.atd &&
          !!toLast?.ata && (
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
                {getDiffDateString(from?.atd, toLast.ata, intl)}
              </TextSpan>
            </RowRead>
          )} */}
        <Row className="m-0" center="xs" middle="xs">
          <StatusVoyage
            status={item?.status}
          />
        </Row>
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

export default ItemItineraryManualVoyage;
