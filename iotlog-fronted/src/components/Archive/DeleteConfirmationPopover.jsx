import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Button } from "@paljs/ui/Button";
import { EvaIcon } from "@paljs/ui/Icon";
import { FormattedMessage } from "react-intl";
import TextSpan from "../Text/TextSpan";

const PopoverContainer = styled.div`
  position: fixed;
  background: ${(props) => props.theme.backgroundBasicColor1};
  border: 1px solid ${(props) => props.theme.borderBasicColor3};
  border-radius: 4px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  min-width: 280px;
  max-width: 320px;
  padding: 12px;
`;

const WarningBox = styled.div`
  background-color: rgba(255, 61, 113, 0.1);
  border-left: 3px solid #ff3d71;
  padding: 8px 10px;
  border-radius: 4px;
  margin: 8px 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 12px;
  justify-content: flex-end;
`;

const DeleteConfirmationPopover = ({ item, type, onConfirm, onCancel, buttonRef }) => {
  const isFolder = type === 'folder';
  const popoverRef = useRef(null);
  const [position, setPosition] = useState({ top: 0, right: 0 });

  useEffect(() => {
    if (buttonRef && buttonRef.current && popoverRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const popoverHeight = popoverRef.current.offsetHeight;
      const viewportHeight = window.innerHeight;
      
      const spaceBelow = viewportHeight - buttonRect.bottom;
      const spaceAbove = buttonRect.top;
      
      let top;
      if (spaceBelow >= popoverHeight || spaceBelow >= spaceAbove) {
        top = buttonRect.bottom + 4;
      } else {
        top = buttonRect.top - popoverHeight - 4;
      }
      
      const right = window.innerWidth - buttonRect.right;
      
      setPosition({ top, right });
    }
  }, [buttonRef]);

  return (
    <PopoverContainer ref={popoverRef} style={{ top: `${position.top}px`, right: `${position.right}px` }}>
      <div style={{ marginBottom: "8px" }}>
        <TextSpan apparence="p2" status="Danger" style={{ fontWeight: "600", display: "flex", alignItems: "center", gap: "6px" }}>
          <EvaIcon name="alert-triangle-outline" status="Danger" style={{ fontSize: "18px" }} />
          <FormattedMessage id={isFolder ? "delete.folder.title" : "delete.document.title"} />
        </TextSpan>
      </div>

      <TextSpan apparence="c1" style={{ display: "block", marginBottom: "4px" }}>
        {isFolder ? (
          <FormattedMessage 
            id="delete.folder.warning.short" 
            values={{ name: <strong>{item?.name}</strong> }}
          />
        ) : (
          <FormattedMessage 
            id="delete.document.warning.short" 
            values={{ name: <strong>{item?.title || item?.fileName}</strong> }}
          />
        )}
      </TextSpan>

      {isFolder && (
        <WarningBox>
          <TextSpan apparence="c2" status="Danger" style={{ fontSize: "0.75rem" }}>
            <EvaIcon name="alert-circle-outline" status="Danger" style={{ fontSize: "14px", marginRight: "4px" }} />
            <FormattedMessage id="delete.folder.content.warning.short" />
            {item?.itemCount > 0 && (
              <span style={{ display: "block", marginTop: "4px", marginLeft: "18px" }}>
                <FormattedMessage 
                  id="delete.folder.items.count.short" 
                  values={{ count: item.itemCount }}
                />
              </span>
            )}
          </TextSpan>
        </WarningBox>
      )}

      <ButtonGroup>
        <Button 
          size="Tiny" 
          status="Basic"
          appearance="ghost"
          onClick={onCancel}
        >
          <FormattedMessage id="cancel" />
        </Button>
        
        <Button 
          size="Tiny" 
          status="Danger"
          onClick={onConfirm}
        >
          <EvaIcon name="trash-2-outline" style={{ fontSize: "14px", marginRight: "4px" }} />
          <FormattedMessage id="delete" />
        </Button>
      </ButtonGroup>
    </PopoverContainer>
  );
};

export default DeleteConfirmationPopover;

