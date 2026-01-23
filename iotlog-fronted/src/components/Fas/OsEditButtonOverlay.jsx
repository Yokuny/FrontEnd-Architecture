import styled from "styled-components";
import { Button } from "@paljs/ui/Button";
import { Card, CardBody, EvaIcon } from "@paljs/ui";
import Col from "@paljs/ui/Col";
import { FormattedMessage } from "react-intl";
import Overlay from "../Overlay";
import { TextSpan } from "../";
import { canEditOS, canEditRating, canEditRecomendedSupplier, canTransferOrder, canEditRecommendedSupplierCount } from "./Utils/FasPermissions";


const MenuItem = styled.div`
border-bottom: 1px solid #edf1f7;
padding: 0.25rem !important;

&: last-child {
  border-bottom: none;
}
`

const TextSpanStyled = styled(TextSpan)`
  word-wrap: break-word;
  word-break: break-all;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between
`;

export default function OsEditButtonOverlay({
    data,
    items,
    Link,
    openEditOrderModal,
    openTransferOrderModal,
    onEditRecommendedSupplier,
    onEditRecommendedSupplierCount,
}) {

    if (!Link && !data && !items) return null;

    const canEditOSValue = canEditOS(data.fasHeader, data, items);
    const canEditRatingValue = canEditRating(data);
    const canEditRecommendedSupplierValue = canEditRecomendedSupplier(items, data);
    const canEditRecommendedSupplierCountValue = canEditRecommendedSupplierCount(items, data);
    const canTransferOrderValue = canTransferOrder(items, data);

    return (
        (canEditOSValue || canEditRatingValue || canEditRecommendedSupplierValue || canEditRecommendedSupplierCountValue || canTransferOrderValue) &&
        <Col breakPoint={{ lg: 1, md: 1 }} style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Overlay
                trigger="click"
                placement="left"
                positionOverlay={{ top: 200, right: 120 }}
                target={
                    <>
                        <Button
                            size="Tiny"
                            appearance="ghost">
                            <EvaIcon name="edit-2-outline" />
                        </Button>
                    </>
                }>
                <Card>
                    <CardBody style={{
                        padding: 0,
                    }}>
                        {canEditOSValue &&
                            <MenuItem
                                className="m-2"
                                onClick={openEditOrderModal}>
                                <TextSpanStyled apparence="s2">
                                    <EvaIcon status="Basic" className="mr-1" name="edit-outline" />
                                    <FormattedMessage id="edit.order.label" />
                                </TextSpanStyled>
                            </MenuItem>}
                        {canEditRatingValue &&
                            <MenuItem
                                className="m-2"
                                onClick={() => Link(`/fas-add-rating?id=${data.id}&not-realized=true`)}>
                                <TextSpanStyled apparence="s2">
                                    <EvaIcon status="Basic" className="mr-1" name="star-outline" />
                                    <FormattedMessage id="edit.rating" />
                                </TextSpanStyled>
                            </MenuItem>}
                        {canEditRecommendedSupplierValue &&
                            <MenuItem className="m-2" onClick={onEditRecommendedSupplier}>
                                <TextSpanStyled apparence="s2">
                                    <EvaIcon status="Basic" className="mr-1" name="people-outline" />
                                    <FormattedMessage id="edit.recommended.supplier" />
                                </TextSpanStyled>
                            </MenuItem>}
                        {canEditRecommendedSupplierCountValue &&
                            <MenuItem className="m-2" onClick={onEditRecommendedSupplierCount}>
                                <TextSpanStyled apparence="s2">
                                    <EvaIcon status="Basic" className="mr-1" name="people-outline" />
                                    <FormattedMessage id="edit.recommended.supplier.count" />
                                </TextSpanStyled>
                            </MenuItem>}
                        {canTransferOrderValue &&
                            <MenuItem className="m-2" onClick={openTransferOrderModal}>
                                <TextSpanStyled apparence="s2">
                                    <EvaIcon status="Basic" className="mr-1" name="flip-2-outline" />
                                    <FormattedMessage id="transfer.service" />
                                </TextSpanStyled>
                            </MenuItem>}
                    </CardBody>
                </Card>
            </Overlay>
        </Col>
    )
}
