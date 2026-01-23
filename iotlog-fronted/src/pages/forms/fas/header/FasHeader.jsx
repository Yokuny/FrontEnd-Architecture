import React from "react";
import { FormattedMessage } from "react-intl";
import { Button } from "@paljs/ui/Button";
import { EvaIcon } from "@paljs/ui/Icon";
import { CardHeader } from "@paljs/ui/Card";
import Row from "@paljs/ui/Row";
import { SidebarBody } from "@paljs/ui/Sidebar";
import styled from "styled-components";
import { FasSidebarStyled, FasTimelineEvents, TextSpan, DeleteConfirmation } from "../../../../components";
import BackButton from "../../../../components/Button/BackButton";

const RowFlex = styled.div`
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  flex-direction: row;
`

export default function FasHeader({
  onBack,
  data,
  fasId,
  getData,
  canEditFAS,
  showEditFields,
  editFields,
  canRemoveFAS,
  onDeleteConfirmation,
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
          <FasTimelineEvents fasId={fasId} />
        </SidebarBody>
      </FasSidebarStyled>
    }
    <CardHeader>
      <Row between="xs" middle="xs" className="m-0" style={{ flexWrap: `nowrap` }}>
        <RowFlex>
          <BackButton onClick={onBack} />
          <TextSpan apparence="s1" style={{ width: `100%` }}>
            <FormattedMessage id="service.management" />
          </TextSpan>
        </RowFlex>
        <RowFlex>
          {!!data?.events?.length &&
            <Button
              className="mr-2 flex-between"
              appearance="ghost"
              size="Tiny"
              onClick={() => setShowTimeline(!showTimeline)}
            >
              <EvaIcon name="more-vertical-outline" />
              <FormattedMessage id="timeline" />
            </Button>
          }
          {canEditFAS && !editFields ? (
            <Button
              style={{ marginRight: -4 }}
              size="Tiny"
              className="flex-between mr-2"
              status="Info"
              appearance="ghost"
              onClick={() => showEditFields()}
            >
              <EvaIcon name="edit-outline" className="mr-1" />
              <FormattedMessage id="edit" />
            </Button>
          ) : (
            <></>
          )}
          {canRemoveFAS && (
            <DeleteConfirmation
              className
              onConfirmation={onDeleteConfirmation}
              message={<FormattedMessage id="fas.delete.message.default" />}
            >
              <Button size="Tiny" status="Danger" appearance="ghost">
                <EvaIcon name="trash-2-outline" />
              </Button>
            </DeleteConfirmation>
          )}
        </RowFlex>
        {editFields ? (
          <RowFlex>
            <Button
              size="Tiny"
              className="flex-between mr-4"
              status="Danger"
              appearance="ghost"
              onClick={() => showEditFields(false)}
            >
              <EvaIcon name="close-outline" className="mr-1" />
              <FormattedMessage id="cancel" />
            </Button>
            <Button
              size="Tiny"
              className="flex-between mr-2"
              status="Success"
              onClick={() => getData()}
            >
              <EvaIcon name="checkmark-outline" className="mr-1" />
              <FormattedMessage id="save" />
            </Button>
          </RowFlex>
        ) : (
          <></>
        )}
      </Row>
    </CardHeader>
  </>
}
