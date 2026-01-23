import React from "react";
import styled from "styled-components";
import { Button } from "@paljs/ui/Button";
import { Card, CardBody, EvaIcon, List, ListItem, Popover } from "@paljs/ui";
import { FormattedMessage } from "react-intl";
import { TextSpan, DeleteConfirmation } from "../../";


const TextSpanStyled = styled(TextSpan)`
  word-wrap: break-word;
  word-break: break-all;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export default function OsEditButtonOverlay({
  data,
  items,
  Link,
  openEditFolderModal,
  onDeleteFolder,
  onShowQrModal
}) {

  const buttonRemoveRef = React.useRef(null);

  if (!Link && !data && !items) return null;

  const onHandleDeleteFolder = () => {
    buttonRemoveRef.current.click()
    onDeleteFolder()
  }

  const renderDeleteButton = () => {
    return (
      <ListItem
        style={{ borderTop: 'none' }}
      >
        <DeleteConfirmation
          onConfirmation={onHandleDeleteFolder}
          onCancel={() => buttonRemoveRef.current.click()}
          message={<FormattedMessage id="delete.message.default" />}
        >
          <div
            ref={buttonRemoveRef}
          >
            <EvaIcon status="Basic" className="mr-1" name="trash-2-outline" />
            <TextSpan apparence="s2">
              <FormattedMessage id="delete" />
            </TextSpan>
          </div>
        </DeleteConfirmation>
      </ListItem>
    );
  }

  const renderEditButton = () => {
    return (<ListItem
      onClick={(e) => {
        e.preventDefault();
        openEditFolderModal()
      }}
    >
      <TextSpanStyled apparence="s2">
        <EvaIcon status="Basic" className="mr-1" name="edit-outline" />
        <FormattedMessage id="edit" />
      </TextSpanStyled>
    </ListItem>);
  }

  const renderQrButton = () => {
    return (<ListItem
      style={{ borderBottom: 'none' }}
      onClick={(e) => {
        e.preventDefault();
        onShowQrModal()
      }}>
      <TextSpanStyled apparence="s2">
        <EvaIcon status="Basic" className="mr-1" name="eye-outline" />
        <FormattedMessage id="qr.code" />
      </TextSpanStyled>
    </ListItem>);
  }

  return (
    <>
      <Popover
        trigger="click"
        placement="right"
        eventListener="#os-edit-button-overlay"
        key={data?.id}
        overlay={<Card style={{ marginBottom: 0 }}>
          <CardBody style={{ padding: 0 }}>
            {items?.includes("/add-archive-item") &&
              <>
                <List id="list-itens">
                  {renderDeleteButton()}
                  {renderEditButton()}
                  {renderQrButton()}
                </List>
              </>}
          </CardBody>
        </Card>}>
        <Button
          id={"os-edit-button-overlay"}
          size="Tiny"
          className="flex-between"
          status="Basic">
          <EvaIcon name="more-vertical-outline" />
          <FormattedMessage id="options" />
        </Button>
      </Popover>
    </>
  )
}
