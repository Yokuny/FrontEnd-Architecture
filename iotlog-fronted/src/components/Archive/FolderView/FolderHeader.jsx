import React from "react";
import { FormattedMessage } from "react-intl";
import { Button } from "@paljs/ui/Button";
import { EvaIcon } from "@paljs/ui/Icon";
import { CardHeader } from "@paljs/ui/Card";
import Row from "@paljs/ui/Row";
import styled from "styled-components";
import { TextSpan } from "../../";

const RowFlex = styled.div`
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  flex-direction: row;
`

export default function FolderHeader({
  onBack,
  messageId = undefined,
  children,
}) {
  return <>
    <CardHeader>
      <Row between="xs" middle="xs" className="m-0" style={{ flexWrap: `nowrap` }}>
        <RowFlex>
          <Button
            className="flex-between mr-2"
            status="Info"
            size="Tiny"
            appearance="ghost"
            onClick={
              onBack
            } >
            <EvaIcon name="arrow-ios-back-outline" />
            <FormattedMessage id={messageId ? messageId : "back"} />
          </Button>
          <TextSpan apparence="s1" style={{ width: `100%` }}>
            <FormattedMessage id="view.folder" />
          </TextSpan>
        </RowFlex>
        {children}
      </Row>

    </CardHeader>
  </>
}
