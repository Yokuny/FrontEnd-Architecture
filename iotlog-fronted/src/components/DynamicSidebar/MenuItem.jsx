import React, { useCallback, useRef, useEffect, useState, memo } from "react";
import { Link, useLocation } from "react-router-dom";
import { useIntl } from "react-intl";
import styled, { useTheme } from "styled-components";
import * as Icons from "../Icons";

const MenuItemContainer = styled.div`
  display: flex;
  align-items: center;
  padding: .4rem;
  cursor: pointer;
  transition: all 0.2s ease, background-color 0.15s ease;
  border-radius: .5rem;
  margin: .2rem .4rem;
  position: relative;
  transform: translateZ(0);

  &:hover {
    background: ${props => props.theme.backgroundBasicColor2}dd;
    transform: translateX(2px);
  }

  ${props => props.isActive && `
    background: ${props.theme.colorPrimary}20;
    border-left: 3px solid ${props.theme.colorPrimary};

    &:hover {
      background: ${props.theme.colorPrimary}30;
    }
  `}

  ${props => !props.isExpanded && `
    pointer-events: auto;

    &:hover {
      background: ${props.theme.backgroundBasicColor2}60;
    }
  `}
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.$isActive ? props.theme.colorPrimary : props.theme.textHintColor};
  transition: color 0.2s ease;

  svg {
    width: 1.2rem;
    height: 1.2rem;
    stroke: currentColor;
  }
`;

const TextContainer = styled.div`
  margin-left: 1rem;
  color: ${props => props.isActive ? props.theme.colorPrimary : props.theme.textBasicColor};
  font-size: 0.875rem;
  font-weight: ${props => props.isActive ? 600 : 500};
  white-space: nowrap;
  overflow: hidden;
  opacity: ${props => props.isExpanded ? 1 : 0};
  pointer-events: ${props => props.isExpanded ? 'auto' : 'none'};
  will-change: opacity, transform;
  transform: translateX(${props => props.isExpanded ? '0' : '-10px'});
  transition: opacity 0.2s ease-in-out, transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transition-delay: ${props => props.isExpanded ? '0.1s' : '0s'};
`;

const ChevronContainer = styled.div`
  margin-left: auto;
  color: ${props => props.theme.textHintColor};
  opacity: ${props => props.isExpanded ? 1 : 0};
  transform: rotate(${props => props.isOpen ? '90deg' : '0deg'})
             translateX(${props => props.isExpanded ? '0' : '10px'});
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform, opacity;
  transition-delay: ${props => props.isExpanded ? '0.1s' : '0s'};

  svg {
    width: 1rem;
    transition: fill 0.2s ease;
  }
`;

const AccordionContent = styled.div`
  max-height: ${props => props.isOpen ? `${props.contentHeight}px` : '0px'};
  overflow: hidden;
  transition: max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1),
              opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: ${props => props.isExpanded ? (props.isOpen ? 1 : 0.7) : 0};
  will-change: max-height, opacity;

  transition-delay: ${props => {
    if (!props.isExpanded) return '0s';
    return props.isOpen ? '0.1s' : '0s';
  }};
`;

const MenuItemWrapper = styled.div`
  width: 100%;
`;

const DefaultIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

// Styled components for submenu items
const SubMenuItemContainer = styled.div`
  display: flex;
  align-items: center;
  padding: .3rem .5rem;
  cursor: pointer;
  transition: all 0.2s ease, background-color 0.15s ease;
  border-radius: 6px;
  margin: .1rem .2rem;
  margin-left: ${props => props.level * 12}px;
  position: relative;
  transform: translateZ(0);

  &:hover {
    background: ${props => props.theme.backgroundBasicColor2}60;
    transform: translateX(1px);
  }

  ${props => props.isActive && `
    background: ${props.theme.colorPrimary}15;
    border-left: 2px solid ${props.theme.colorPrimary};

    &:hover {
      background: ${props.theme.colorPrimary}25;
    }
  `}
`;

const SubIconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  min-width: 16px;
  color: ${props => props.isActive ? props.theme.colorPrimary : props.theme.textHintColor};
  transition: color 0.2s ease;
  margin-right: 12px;

  svg {
    width: 14px;
    height: 14px;
    fill: currentColor;
  }
`;

const SubTextContainer = styled.div`
  color: ${props => props.isActive ? props.theme.colorPrimary : props.theme.textBasicColor};
  font-size: 0.8rem;
  font-weight: ${props => props.isActive ? 600 : 400};
  white-space: nowrap;
  overflow: hidden;
  opacity: ${props => props.isExpanded ? 1 : 0};
  transform: translateX(${props => props.isExpanded ? '0' : '-10px'});
  transition: opacity 0.2s ease-in-out, transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: ${props => props.isExpanded ? 'auto' : 'none'};
  flex: 1;
  will-change: opacity, transform;
  transition-delay: ${props => props.isExpanded ? '0.15s' : '0s'};
`;

const DefaultSubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="12" r="2"/>
  </svg>
);

const MenuItem = ({
  item,
  isExpanded,
  isAccordionOpen = false,
  onAccordionToggle,
  onNavigate,
  level = 0,
  currentPath = "",
  allowedItems = []
}) => {
  const theme = useTheme();
  const location = useLocation();
  const intl = useIntl();
  const accordionRef = useRef(null);
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    // Pegando altura para animação do accordion
    if (accordionRef.current && item.children) {
      const height = accordionRef.current.scrollHeight;
      setContentHeight(height);
    }
  }, [item.children, isAccordionOpen, isExpanded]);

  const getItemKey = useCallback(() => {
    if (item.titleId) {
      return item.titleId;
    }
    return `${item.link?.to || 'item'}-${level}`;
  }, [item.titleId, item.link?.to, level]);

  const getIconComponent = useCallback(() => {
    if (!item.icon?.name) {
      return DefaultIcon;
    }

    if (Icons[item.icon.name]) {
      return Icons[item.icon.name];
    }

    return DefaultIcon;
  }, [item.icon?.name]);

  const handleClick = useCallback((e) => {
    if (item.children && item.children.length > 0) {
      e.preventDefault();
      if (onAccordionToggle) {
        onAccordionToggle(getItemKey());
      }
    } else if (item.link?.to) {
      if (onNavigate) {
        onNavigate(item.link.to);
      }
    }
  }, [item, onAccordionToggle, onNavigate, getItemKey]);

  // Determine if this item has children
  const hasChildren = item.children && item.children.length > 0;

  // Items with children should always be visible, regardless of show property
  const isVisible = hasChildren || !item.show || item.show.includes(currentPath);

  if (!isVisible) {
    return null;
  }

  // Determine if this item is active
  const isActive = item.link?.to && location.pathname === item.link.to;

  const hasAllowedDescendants = (item, allowedItems) => {
    if (!item.children || item.children.length === 0) {
      return allowedItems.includes(item.link?.to);
    }
    
    const directChildrenAllowed = item.children.some(child => 
      allowedItems.includes(child.link?.to)
    );
    
    if (directChildrenAllowed) return true;
    
    const grandchildrenAllowed = item.children.some(child => {
      if (child.children && child.children.length > 0) {
        return child.children.some(grandchild => 
          allowedItems.includes(grandchild.link?.to)
        );
      }
      return false;
    });
    
    return grandchildrenAllowed;
  };

  // Render the menu item content
  const renderContent = () => (!hasChildren
  ? allowedItems.includes(item.link?.to)
  : hasAllowedDescendants(item, allowedItems)) && (
    <MenuItemContainer
      theme={theme}
      isActive={isActive}
      isExpanded={isExpanded}
      onClick={handleClick}
    >
      <IconContainer theme={theme} $isActive={isActive}>
        {React.createElement(getIconComponent())}
      </IconContainer>

      <TextContainer
        theme={theme}
        isActive={isActive}
        isExpanded={isExpanded}
      >
        {item.titleId ? intl.formatMessage({ id: item.titleId }) : item.title}
      </TextContainer>

      {hasChildren && (
        <ChevronContainer
          theme={theme}
          isExpanded={isExpanded}
          isOpen={isAccordionOpen}
        >
          <Icons.ArrowCircle />
        </ChevronContainer>
      )}
    </MenuItemContainer>
  );

  const renderNestedItems = () => {
    if (!hasChildren || !item.children) return null;
    
      const shouldShowChild = (childItem) => {
      if (childItem.link?.to && allowedItems.includes(childItem.link.to)) {
        return true;
      }
      
      if (!childItem.link?.to && childItem.children && childItem.children.length > 0) {
        return childItem.children.some(grandchild => 
          allowedItems.includes(grandchild.link?.to)
        );
      }
      
      return false;
    };

    return (
      <div ref={accordionRef}>
        {item.children.filter(shouldShowChild).map((childItem, index) => {
          return renderSubMenuItem(childItem, index, level + 1);
        })}
      </div>
    );
  };

  const renderSubMenuItem = (childItem, index, itemLevel) => {
    const childKey = childItem.titleId
      ? `${childItem.titleId}-${itemLevel}`
      : `${childItem.link?.to || 'child'}-${index}-${itemLevel}`;

    const isChildActive = childItem.link?.to && location.pathname === childItem.link.to;
    const hasGrandChildren = childItem.children && childItem.children.length > 0;
    const isChildVisible = hasGrandChildren || !childItem.show || childItem.show.includes(currentPath);

    if (!isChildVisible) {
      return null;
    }

    const handleChildClick = (e) => {
      if (childItem.link?.to && onNavigate) {
        onNavigate(childItem.link.to);
      }
    };

    const childContent = (
      <SubMenuItemContainer
        theme={theme}
        isActive={isChildActive}
        level={itemLevel}
        onClick={handleChildClick}
      >
        <SubIconContainer theme={theme} isActive={isChildActive}>
          <DefaultSubIcon />
        </SubIconContainer>

        <SubTextContainer
          theme={theme}
          isActive={isChildActive}
          isExpanded={isExpanded}
        >
          {childItem.titleId ? intl.formatMessage({ id: childItem.titleId }) : childItem.title}
        </SubTextContainer>
      </SubMenuItemContainer>
    );

    if (hasGrandChildren) {
      const allowedGrandChildren = childItem.children.filter(grandchild => 
        allowedItems.includes(grandchild.link?.to)
      );
      
      return (
        <div key={childKey}>
          {childItem.link?.to ? (
            <Link to={childItem.link.to} style={{ textDecoration: 'none', color: 'inherit' }}>
              {childContent}
            </Link>
          ) : (
            childContent
          )}
          {allowedGrandChildren.map((grandChild, grandIndex) =>
            renderSubMenuItem(grandChild, grandIndex, itemLevel + 1)
          )}
        </div>
      );
    }

    if (childItem.link?.to) {
      return (
        <Link
          key={childKey}
          to={childItem.link.to}
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          {childContent}
        </Link>
      );
    }

    return <div key={childKey}>{childContent}</div>;
  };

  if (item.link?.to && !hasChildren) {
    const StyledLink = styled(Link)`
      text-decoration: none;
      color: inherit;
      display: flex;
      align-items: center;
      width: 100%;
    `;
    return (
      <MenuItemWrapper>
        <StyledLink to={item.link.to}>
          {renderContent()}
        </StyledLink>
      </MenuItemWrapper>
    );
  }

  return (
    <MenuItemWrapper>
      {renderContent()}
      {hasChildren && (
        <AccordionContent
          isOpen={isAccordionOpen}
          isExpanded={isExpanded}
          contentHeight={contentHeight}
        >
          {renderNestedItems()}
        </AccordionContent>
      )}
    </MenuItemWrapper>
  );
};

export default memo(MenuItem);
