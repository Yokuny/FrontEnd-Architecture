import React from "react";
import { Button, Col, EvaIcon, Row } from "@paljs/ui";
import { FormattedMessage, useIntl } from "react-intl";
import  { useTheme } from "styled-components";
import { Route } from "../../../components/Icons";
import ItineraryCard from "./ItineraryCard";
import { LabelIcon } from "../../../components";

export default function ListItinerary({ formData, onChange, idEnterprise, isPrinter = false }) {

  const intl = useIntl()
  const theme = useTheme()

  const onChangeItem = (data, i) => {
    onChange("itinerary", [
      ...(formData?.itinerary || [])?.slice(0, i),
      {
        ...(formData?.itinerary[i] || {}),
        ...(data || {})
      },
      ...(formData?.itinerary || [])?.slice(i + 1),
    ])
  }

  const onDelete = (i) => {
    onChange("itinerary", [
      ...(formData?.itinerary || [])?.slice(0, i),
      ...(formData?.itinerary || [])?.slice(i + 1),
    ])
  }

  const onAdd = () => {
    onChange("itinerary", [
      ...(formData?.itinerary || []),
      {
        onShowModal: true
      }
    ])
  }

  return (
    <>
      <Row middle="xs" center="xs">
        <Col breakPoint={{ md: 12 }}>
          <LabelIcon
            renderIcon={() => <Route
              style={{
                height: 13,
                width: 13,
                fill: theme.textHintColor,
                marginRight: 5,
              }}
            />}
            title={<FormattedMessage id="itinerary" />}
          />

          <Row middle="xs" center="xs" className="mt-1">
            {formData?.itinerary?.map((x, i) =>
              <>
                <ItineraryCard
                  isFinishVoyage={formData?.isFinishVoyage}
                  key={i}
                  index={i}
                  data={x}
                  idEnterprise={idEnterprise}
                  onChangeData={(data) => onChangeItem(data, i)}
                  onDelete={() => onDelete(i)}
                  isLast={i === (formData?.itinerary?.length - 1)}
                  isPrinter={isPrinter}
                />
              </>)}
          </Row>

          <Row className="m-0" middle="xs" center="xs">
            <Button
              status="Info"
              size="Tiny"
              className="flex-between mt-2 mb-4"
              onClick={onAdd}
              disabled={formData?.isFinishVoyage}
            >
              <EvaIcon name="plus-circle-outline" className="mr-1" />
              {`${intl.formatMessage({ id: 'add' })} ${intl.formatMessage({ id: formData?.itinerary?.length ? 'destiny.port' : 'source' })}`}
            </Button>
          </Row>
        </Col>
      </Row>
    </>
  );
}
