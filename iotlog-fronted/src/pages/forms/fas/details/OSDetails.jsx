import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import moment from "moment";
import Col from "@paljs/ui/Col";
import Row from "@paljs/ui/Row";
import { useNavigate } from "react-router-dom";
import { EvaIcon } from "@paljs/ui/Icon";
import { Button } from "@paljs/ui/Button";
import { FasSpan } from "../components/FasSpan";
import { FasSpanOrderDescription } from "../components/FasSpanOrderDescription";
import { LabelIcon, TextSpan } from "../../../../components";
import OsEditButtonOverlay from "../../../../components/Fas/OsEditButtonOverlay";
import { DeleteConfirmation } from "../../../../components";


export default function OSDetails({
  data,
  items,
  openEditOrderModal,
  onEditRecommendedSupplier,
  onEditRecommendedSupplierCount,
  onDelete,
  openTransferOrderModal,
  confirmObservation,
  setConfirmObservation,
}) {
  const navigate = useNavigate();
  const intl = useIntl()

  if (!data) return null;

  return (
    <>
      <FasSpan breakPoint={{ lg: 4, md: 4 }} title="os" text={data.name} />
      <FasSpan
        breakPoint={{ lg: 4, md: 4 }}
        title="vessel"
        text={data.fasHeader?.vessel?.name}
      />

      <FasSpan
        breakPoint={{ lg: 3, md: 3 }}
        title="type"
        text={data.fasHeader?.type}
      />
      <Col breakPoint={{ lg: 1, md: 1 }}>
        <Row end="xs">
          <OsEditButtonOverlay
            orderId={data.id}
            Link={navigate}
            openEditOrderModal={openEditOrderModal}
            onEditRecommendedSupplier={onEditRecommendedSupplier}
            onEditRecommendedSupplierCount={onEditRecommendedSupplierCount}
            openTransferOrderModal={openTransferOrderModal}
            items={items}
            data={data}
          />
          {data.state !== "cancelled" && items?.includes("/fas-remove") && (
            <DeleteConfirmation
              className
              onConfirmation={onDelete}
              message={<FormattedMessage id="delete.message.default" />}
            >
              <Button size="Tiny" status="Danger" appearance="ghost">
                <EvaIcon name="trash-2-outline" />
              </Button>
            </DeleteConfirmation>
          )}
        </Row>
      </Col>
      <FasSpan
        breakPoint={{ lg: 4, md: 4 }}
        title="service.date"
        text={
          data.fasHeader?.serviceDate
            ? moment(data.fasHeader?.serviceDate).format("DD MMM YYYY HH:mm")
            : ""
        }
      />

      <FasSpan
        breakPoint={{ lg: 4, md: 4 }}
        title="local"
        text={data.fasHeader?.local}
      />

      <FasSpan
        breakPoint={{ lg: 4, md: 4 }}
        title="event.team.change"
        text={intl.formatMessage({ id: data.fasHeader?.teamChange ? 'yes' : 'not' })}
      />

      <FasSpanOrderDescription
        breakPoint={{ lg: 12, md: 12 }}
        title="description"
        text={data?.description}
      />

      <FasSpan
        title="materialFas.label"
        text={data.materialFas}
        className="mb-4"
      />

      <FasSpan title="materialFas.code.label" text={data.materialFasCode} />

      <FasSpan title="onboardMaterialFas.label" text={data.onboardMaterial} />

      <FasSpan title="rmrbFas.label" text={data.rmrb} />

      <FasSpan title="rmrbFas.code.label" text={data.rmrbCode} />

      <FasSpan titleText="JOB" text={data.job} />

      {data.requestOrder && (
        <FasSpan
          breakPoint={{ lg: 12, md: 12 }}
          title="add.request"
          text={data.requestOrder}
          className="mb-4"
        />
      )}

      {data.vor && (
        <FasSpan
          breakPoint={{ lg: 12, md: 12 }}
          title="VOR"
          text={data.vor}
          className="mb-4"
        />
      )}

      {
        !data?.supplierRejectReason?.length &&
        !data?.supplierData?.cancelled &&
        !!data.supplierData?.codigoFornecedor && (
          <>
            <FasSpan
              title="supplier.code.label"
              text={data.supplierData.codigoFornecedor}
              className="mb-4"
            />
            <FasSpan
              title="supplier.name.label"
              text={data.supplierData.razao}
              className="mb-4"
            />
            <Col breakPoint={{ lg: 4, md: 4 }} className="mb-4">
              <LabelIcon
                title={<FormattedMessage id="supplier.email.label" />}
              />
              {data?.supplierData?.emails?.map((email) => (
                <Row key={email} className="ml-0">
                  <TextSpan className="pl-1" apparence="s1">
                    {email}
                  </TextSpan>
                </Row>
              ))}
            </Col>
          </>
        )}
    </>
  );
}
