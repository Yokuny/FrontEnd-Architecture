import React from "react";
import { FormattedMessage } from "react-intl";
import { Button } from "@paljs/ui/Button";
import { EvaIcon } from "@paljs/ui/Icon";
import { CardHeader } from "@paljs/ui/Card";
import Row from "@paljs/ui/Row";
import { SidebarBody } from "@paljs/ui/Sidebar";
import styled from "styled-components";
import { FasSidebarStyled, FasTimelineEvents, TextSpan } from "../../../../components";
import StatusFas from "../StatusFas";

const RowFlex = styled.div`
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  flex-direction: row;
`

export default function OSHeader({
  navigate,
  data,
  orderId,
  getData,
}) {
  const [showTimeline, setShowTimeline] = React.useState(false);

  return <>
    {showTimeline &&
      <FasSidebarStyled property="right" fixed={true}>
        <SidebarBody>
          <Button
            className="mr-2"
            appearance="ghost"
            size="Tiny"
            style={{ marginLeft: "-1.2rem" }}
            onClick={() => setShowTimeline(false)}
          >
            <EvaIcon name="chevron-right-outline" />
          </Button>
          <FasTimelineEvents orderId={orderId} supplierData={data.supplierData} />
        </SidebarBody>
      </FasSidebarStyled>
    }
    <CardHeader>
      <Row between="xs" middle="xs" className="m-0" style={{ flexWrap: `nowrap` }}>
        <RowFlex>
          <Button
            className="flex-between"
            status="Info"
            size="Tiny"
            appearance="ghost"
            onClick={
              () => navigate(-1)
            } >
            <EvaIcon name="arrow-ios-back-outline" />
            <FormattedMessage id="back" />
          </Button>
          <Button
            className="mr-2"
            appearance="ghost"
            size="Tiny"
            onClick={() => getData()}
          >
            <EvaIcon name="refresh-outline" />
          </Button>

          <TextSpan apparence="s1" style={{ width: `100%` }}>
            <FormattedMessage id="view.order.service" />
          </TextSpan>
        </RowFlex>
        <RowFlex>
          {!!data?.events?.length &&
            <Button
              className="mr-4 flex-between"
              appearance="ghost"
              size="Tiny"
              onClick={() => setShowTimeline(!showTimeline)}
            >
              <EvaIcon name="more-vertical-outline" />
              <FormattedMessage id="timeline" />
            </Button>
          }
          <StatusFas status={data.state} />
        </RowFlex>
      </Row>
    </CardHeader>
  </>
}
