import { Col, Row } from "@paljs/ui";
import { FormattedMessage } from "react-intl";
import { useTheme } from "styled-components";
import { TextSpan } from "../../../components";
import { floatToStringNormalize } from "../../../components/Utils";

export default function MetadataDetails(props) {
  const { metadata } = props;
  const theme = useTheme();

  return (
    <>
      <Row className="mt-4">
        {metadata?.data?.barge !== undefined && (
          <Col breakPoint={{ md: 4 }} className="col-flex mb-4">
            <TextSpan apparence="p2" style={{ color: theme.colorBasic600 }}>
              <FormattedMessage id="barge" />
            </TextSpan>
            <TextSpan apparence="s2">{metadata?.data?.barge}</TextSpan>
          </Col>
        )}

        {metadata?.data?.freshWater !== undefined && (
          <Col breakPoint={{ md: 4 }} className="col-flex  mb-4">
            <TextSpan apparence="p2" style={{ color: theme.colorBasic600 }}>
              <FormattedMessage id="rbo.fresh.water" />
            </TextSpan>
            <TextSpan apparence="s2">
              {floatToStringNormalize(metadata?.data?.freshWater)} m³
            </TextSpan>
          </Col>
        )}

        {metadata?.data?.ifo !== undefined && (
          <Col breakPoint={{ md: 4 }} className="col-flex  mb-4">
            <TextSpan apparence="p2" style={{ color: theme.colorBasic600 }}>
              IFO (ROB)
            </TextSpan>
            <TextSpan apparence="s2">
              {floatToStringNormalize(metadata?.data?.ifo)} m³
            </TextSpan>
          </Col>
        )}

        {metadata?.data?.mdo !== undefined && (
          <Col breakPoint={{ md: 4 }} className="col-flex  mb-4">
            <TextSpan apparence="p2" style={{ color: theme.colorBasic600 }}>
              MDO (ROB)
            </TextSpan>
            <TextSpan apparence="s2">
              {floatToStringNormalize(metadata?.data?.mdo)} m³
            </TextSpan>
          </Col>
        )}

        {metadata?.data?.oilLubricant !== undefined && (
          <Col breakPoint={{ md: 4 }} className="col-flex  mb-4">
            <TextSpan apparence="p2" style={{ color: theme.colorBasic600 }}>
              <FormattedMessage id="rbo.lubricant" />
            </TextSpan>
            <TextSpan apparence="s2">
              {floatToStringNormalize(metadata?.data?.oilLubricant)} m³
            </TextSpan>
          </Col>
        )}

        {metadata?.data?.avPushed !== undefined && (
          <Col breakPoint={{ md: 4 }} className="col-flex  mb-4">
            <TextSpan apparence="p2" style={{ color: theme.colorBasic600 }}>
              <FormattedMessage id="pushed" /> (AV)
            </TextSpan>
            <TextSpan apparence="s2">
              {floatToStringNormalize(metadata?.data?.avPushed)} m
            </TextSpan>
          </Col>
        )}

        {metadata?.data?.mnPushed !== undefined && (
          <Col breakPoint={{ md: 4 }} className="col-flex  mb-4">
            <TextSpan apparence="p2" style={{ color: theme.colorBasic600 }}>
              <FormattedMessage id="pushed" /> (MN)
            </TextSpan>
            <TextSpan apparence="s2">
              {floatToStringNormalize(metadata?.data?.mnPushed)} m
            </TextSpan>
          </Col>
        )}

        {metadata?.data?.arPushed !== undefined && (
          <Col breakPoint={{ md: 4 }} className="col-flex  mb-4">
            <TextSpan apparence="p2" style={{ color: theme.colorBasic600 }}>
              <FormattedMessage id="pushed" /> (AR)
            </TextSpan>
            <TextSpan apparence="s2">
              {floatToStringNormalize(metadata?.data?.arPushed)} m
            </TextSpan>
          </Col>
        )}

        {metadata?.data?.avBarge !== undefined && (
          <Col breakPoint={{ md: 4 }} className="col-flex  mb-4">
            <TextSpan apparence="p2" style={{ color: theme.colorBasic600 }}>
              <FormattedMessage id="barge" /> (AV)
            </TextSpan>
            <TextSpan apparence="s2">
              {floatToStringNormalize(metadata?.data?.avBarge)} m
            </TextSpan>
          </Col>
        )}

        {metadata?.data?.mnBarge !== undefined && (
          <Col breakPoint={{ md: 4 }} className="col-flex  mb-4">
            <TextSpan apparence="p2" style={{ color: theme.colorBasic600 }}>
              <FormattedMessage id="barge" /> (MN)
            </TextSpan>
            <TextSpan apparence="s2">
              {floatToStringNormalize(metadata?.data?.mnBarge)} m
            </TextSpan>
          </Col>
        )}

        {metadata?.data?.arBarge !== undefined && (
          <Col breakPoint={{ md: 4 }} className="col-flex  mb-4">
            <TextSpan apparence="p2" style={{ color: theme.colorBasic600 }}>
              <FormattedMessage id="barge" /> (AR)
            </TextSpan>
            <TextSpan apparence="s2">
              {floatToStringNormalize(metadata?.data?.arBarge)} m
            </TextSpan>
          </Col>
        )}
      </Row>
    </>
  );
}
