import React from "react";
import styled from "styled-components";
import { EvaIcon } from "@paljs/ui/Icon";
import { Link as RouterLink } from "react-router-dom";
import Overlay from "../Overlay";

const MenuContainer = styled.div`
  background-color: ${({ theme }) => theme.backgroundBasicColor1};
  border: 1px solid ${({ theme }) => theme.borderBasicColor4};
  border-radius: 0.25rem;
  box-shadow: 0 0.5rem 1rem ${({ theme }) => theme.backgroundBasicColor3};
  min-width: 200px;
  padding: 0.5rem 0;
  z-index: 1000;
`;

const MenuItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: background-color 0.15s ease-in-out;
  color: ${({ theme }) => theme.textBasicColor};

  &:hover {
    background-color: ${({ theme }) => theme.backgroundBasicColor2};
  }

  .eva-icon {
    margin-right: 0.75rem;
  }
`;

const MenuItemText = styled.span`
  font-size: 0.875rem;
  font-weight: 400;
`;

const DropdownMenu = ({ items, children, placement = "bottom", trigger = "click" }) => {
  return (
    <Overlay
      target={children}
      trigger={trigger}
      placement={placement}
     >
      <MenuContainer>
        {items.map((item, index) => (
          <RouterLink
            key={index}
            to={item.link?.to || "#"}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <MenuItem>
              {item.icon && (
                <EvaIcon
                  name={item.icon}
                  options={{ height: 18, width: 18 }}
                />
              )}
              <MenuItemText>{item.title}</MenuItemText>
            </MenuItem>
          </RouterLink>
        ))}
      </MenuContainer>
    </Overlay>
  );
};

export default DropdownMenu;
