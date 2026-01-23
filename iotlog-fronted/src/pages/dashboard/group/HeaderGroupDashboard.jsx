import React from "react";
import { Button, Col, EvaIcon, Row } from "@paljs/ui";
import styled from "styled-components";
import { FormattedMessage, useIntl } from "react-intl";
import { connect } from "react-redux";
import Tooltip from '@paljs/ui/Tooltip';
import { useNavigate } from "react-router-dom";
import { TextSpan } from "../../../components";
import { setDragEnabled, setFilterDashboard } from "../../../actions";
import { FilterData } from "../../../components/FilterData";

const RowNoWrap = styled(Row)`
  flex-wrap: nowrap;
`;

const RowHeader = styled(Row)`
  input {
    line-height: 1.2rem;
  }

  a svg {
    top: -6px;
    position: absolute;
    right: -5px;
  }
`;

const HeaderDashboard = (props) => {
  const { data, onPressFullScreen, handle, dragEnabled, status = "Basic" } = props;

  const intl = useIntl();
  const navigate = useNavigate();

  React.useLayoutEffect(() => {
    return () => {
      props.setFilterDashboard(undefined);
    };
  }, []);

  return (
    <>
      <RowHeader>
        <Col breakPoint={{ md: 9, sm: 8, xs: 8 }} className="mb-4">
          {!!data?.description && <Row className="m-0" middle="xs">
            <Tooltip
              trigger="hover"
              placement="top"
              content={<TextSpan apparence="s2">
                <FormattedMessage id="back" />
              </TextSpan>}
            >
              <Button
                style={{ padding: 4 }}
                size="Small"
                appearance="ghost"
                className="flex-between"
                onClick={() => navigate(-1)}
                status="Basic">
                <EvaIcon name="arrow-ios-back-outline" />
              </Button>
            </Tooltip>
            <TextSpan apparence={"h6"} className="ml-1">{data?.description}</TextSpan>
          </Row>}
        </Col>
        <Col breakPoint={{ md: 3, sm: 4, xs: 4 }} className="mb-4">
          <RowNoWrap end>
            <FilterData
              onApply={props.setFilterDashboard}
              title={<FormattedMessage id="filter.all.dashboard" />}
            >
              <Button
                className="mr-4"
                size="Tiny"
                status={props.isFiltered ? "Primary" : status}
              >
                <EvaIcon name={"funnel-outline"} />
              </Button>
            </FilterData>

            {data?.isCanEdit && (
              <>
                <Tooltip
                  key="edit"
                  eventListener="#scrollPlacementId"
                  className="inline-block"
                  trigger="hint"
                  content={intl.formatMessage({ id: 'setup.chart' })}
                  placement={"top"}
                >
                  <Button
                    onClick={() => props.setDragEnabled(!dragEnabled)}
                    className="mr-4"
                    size="Tiny"
                    status={dragEnabled ? "Success" : status}
                  >
                    <EvaIcon
                      name="settings-outline"
                      options={{ animation: { hover: true, type: "pulse" } }}
                    />
                  </Button>
                </Tooltip>
              </>
            )}
            <Tooltip
              key="expand"
              eventListener="#scrollPlacementId"
              className="inline-block"
              trigger="hint"
              content={intl.formatMessage({ id: handle.active ? 'reduce' : 'expand' })}
              placement={"top"}
            >
              <Button
                onClick={onPressFullScreen}
                size="Tiny"
                status={handle.active ? "Primary" : status}
                className="mr-1"
              >
                <EvaIcon
                  name={handle.active ? "collapse-outline" : "expand-outline"}
                  options={{ animation: { hover: true, type: "pulse" } }}
                />
              </Button>
            </Tooltip>
          </RowNoWrap>
        </Col>
      </RowHeader>
    </>
  );
};

const mapStateToProps = (state) => ({
  filter: state.dashboard.filter,
  isFiltered: state.dashboard.isFiltered,
  dragEnabled: state.dashboard.dragEnabled,
});

const mapDispatchToProps = (dispatch) => ({
  setFilterDashboard: (filter) => {
    dispatch(setFilterDashboard(filter));
  },
  setDragEnabled: (dragEnabled) => {
    dispatch(setDragEnabled(dragEnabled));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(HeaderDashboard);
