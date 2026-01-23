import { Button, Col, EvaIcon, Row } from "@paljs/ui";
import moment from "moment";
import React from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import styled from "styled-components";
import { TextSpan } from "../../../../components";

const Month = styled.b`
  text-transform: capitalize;
`;

const DivWrapper = styled(Col)`
  z-index: 10;
  padding-right: 0;
`;

const HeaderRow = styled(Row)`
  margin-right: 0;
  justify-content: space-between;
`;

const ToolbarCalendar = (props) => {
  const { view } = props;

  const hasPermissionEdit = props.items?.some(
    (x) => x === "/event-schedule-edit"
  );

  const goToBack = () => {
    if (view == "month") props.date.setMonth(props.date.getMonth() - 1);
    else if (view == "week") props.date.setDate(props.date.getDate() - 7);
    else if (view == "day" || view == "agenda")
      props.date.setDate(props.date.getDate() - 1);
    props.onNavigate("prev");
  };

  const goToNext = () => {
    if (view == "month") props.date.setMonth(props.date.getMonth() + 1);
    else if (view == "week") props.date.setDate(props.date.getDate() + 7);
    else if (view == "day" || view == "agenda")
      props.date.setDate(props.date.getDate() + 1);
    props.onNavigate("next");
  };

  const goToCurrent = () => {
    const now = new Date();
    props.date.setMonth(now.getMonth());
    props.date.setYear(now.getFullYear());
    props.date.setDate(now.getDate());
    props.onNavigate("current");
  };

  const goToView = (view) => {
    props.onView(view);
  };

  const label = () => {
    const date = moment(props.date);

    return (
      <TextSpan apparence="p1">
        <Month>
          {["day", "agenda"].includes(view) && <>{date.format("DD,")}</>}{" "}
          {date.format("MMMM")}
        </Month>
        <span> {date.format("YYYY")}</span>
      </TextSpan>
    );
  };

  return (
    <>
      <HeaderRow className="mb-4">
        <Col breakPoint={{ md: 3 }}>
        asdsd
          <Button size="Small" onClick={goToCurrent} status="Info">
            <FormattedMessage id="today" />
          </Button>

          <Button
            status="Basic"
            size="Tiny"
            className="ml-4"
            onClick={goToBack}
          >
            <EvaIcon name="arrow-ios-back-outline" />
          </Button>

          <Button
            status="Basic"
            size="Tiny"
            className="ml-1"
            onClick={goToNext}
          >
            <EvaIcon name="arrow-ios-forward-outline" />
          </Button>
        </Col>
        <Col breakPoint={{ md: 3 }}>
          <Row center middle>
            <TextSpan className="mt-2" apparence="s1">
              {label()}
            </TextSpan>
          </Row>
        </Col>

        <Col breakPoint={{ md: 2 }}>
          <Row end="xs" style={{ flexWrap: "nowrap" }}>

            <Button
              size="Tiny"
              status={"Basic"}
              appearance="ghost"
              className="flex-between"
              onClick={() => props.setFilterShow(!props.isShowFilter)}
            >
              <EvaIcon name="funnel-outline" className="mr-1" />
              <FormattedMessage id="filter" />
            </Button>
            <Button
              size="Tiny"
              status={"Info"}
              appearance="ghost"
              className="flex-between"
              onClick={() => props.setShowView()}
            >
              <EvaIcon name="list-outline" className="mr-1" />
              <FormattedMessage id="view" />
            </Button>

            {hasPermissionEdit && (
              <Button
                size="Tiny"
                onClick={() => props.setEventSelected({ id: 0 })}
                className="ml-3 flex-between"
              >
                <EvaIcon name="plus-outline" className="mr-1" />
                <FormattedMessage id="new.event" />
              </Button>
            )}
          </Row>
        </Col>
      </HeaderRow>
    </>
  );
};

const mapStateToProps = (state) => ({
  enterprises: state.enterpriseFilter.enterprises,
  items: state.menu.items,
});

export default connect(mapStateToProps, undefined)(ToolbarCalendar);
