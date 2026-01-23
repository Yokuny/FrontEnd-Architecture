import React from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import styled, { css } from "styled-components";
import { TextSpan, Toggle } from "../../../../../components";
import { setIsShowRoute } from "../../../../../actions/map.actions";

const Col = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const DivContent = styled.div`
  ${({ theme }) => css`
    background-color: ${theme.backgroundBasicColor1};
  `}
  position: absolute;
  right: 8px;
  bottom: -290px;
  z-index: 1020;
  display: flex;
  flex-direction: column;
  padding: 5px;
  border-radius: 4px;

  i {
    width: 18px;
    height: 18px;
    float: left;
    margin-right: 8px;
    border-radius: 0.2rem;
  }
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const RowSpaceBetween = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 1.5px;
  margin-bottom: 1.5px;
  align-items: center;
`;

const GradientLegend = ({
  min,
  max,
  theme,
  isShowRoute,
  setIsShowRoute,
}) => {

  const getAvg = (min, max) => {
    if (!min && !max) {
      return 0
    }

    return (min + (max - min) / 2)
  }

  return (
    <>
      <DivContent>
        <Col>
          {/* <TextSpan apparence="p3" hint>
            <FormattedMessage id="gradient.speed" />
          </TextSpan> */}
          <RowSpaceBetween>
            <TextSpan apparence="c2" hint>
              <FormattedMessage id="speed" />
            </TextSpan>
            <Toggle
              size="Tiny"
              checked={isShowRoute}
              onChange={() => {
                setIsShowRoute(!isShowRoute)
              }}
            />
          </RowSpaceBetween>
        </Col>
        {isShowRoute && (
          <>
            <Row className="mt-1">
              <i style={{ background: theme.colorDanger500 }}></i>
              <TextSpan apparence="s3">
                {(min || 0)?.toFixed(1)?.replace(".", ",")}
              </TextSpan>
              <TextSpan
                apparence="p4"
                className="ml-1"
                style={{ marginTop: 1.5 }}
              >
                <FormattedMessage id="min.contraction" />
              </TextSpan>
            </Row>
            <Row className="mt-1 mb-1">
              <i style={{ background: theme.colorWarning500 }}></i>
              <TextSpan apparence="s3">
                {(getAvg(min, max) || 0)?.toFixed(1)?.replace(".", ",")}
              </TextSpan>
              <TextSpan
                apparence="p4"
                className="ml-1"
                style={{ marginTop: 1.5 }}
              >
                <FormattedMessage id="avg.contraction" />
              </TextSpan>
            </Row>
            <Row>
              <i style={{ background: theme.colorSuccess500 }}></i>
              <TextSpan apparence="s3">
                {(max || 0)?.toFixed(1)?.replace(".", ",")}
              </TextSpan>
              <TextSpan
                apparence="p4"
                className="ml-1"
                style={{ marginTop: 1.5 }}
              >
                <FormattedMessage id="max.contraction" />
              </TextSpan>
            </Row>
          </>
        )}
      </DivContent>
    </>
  );
};

const mapStateToProps = (state) => ({
  isShowRoute: state.map.isShowRoute,
});

const mapDispatchToProps = (dispatch) => ({
  setIsShowRoute: (isShow) => {
    dispatch(setIsShowRoute(isShow));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(GradientLegend);
