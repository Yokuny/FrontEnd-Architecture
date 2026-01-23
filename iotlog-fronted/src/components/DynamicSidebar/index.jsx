import React, { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { connect } from "react-redux";
import { useLocation } from "react-router-dom";
import styled, { useTheme } from "styled-components";
import { setToggleMenu, getItemsMenu, setMenuState } from "../../actions";
import MenuItem from "./MenuItem";
import menuItems from "../../routes/menuItem";

const SidebarContainer = styled.div`
  width: 100%;
  border-radius: 12px;
  height: 100%;
  background: ${props => props.theme.backgroundBasicColor1}dd;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1), border-right-color 0.2s ease;
  overflow: hidden;
  position: relative;
  z-index: 998;
  display: flex;
  flex-direction: column;
  will-change: width;

  /* Quando fechada, desabilitar interações */
  pointer-events: ${props => props.isExpanded ? 'auto' : 'none'};
`;

const SidebarContent = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0.5rem;

  /* Scrollbar styling */
  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.backgroundBasicColor3};
    border-radius: 2px;
    transition: background 0.2s ease;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${props => props.theme.colorPrimary}60;
  }
`;

const DynamicSidebar = ({
  isExpanded,
  setToggleMenu,
  getItemsMenu,
  setMenuState,
  allowedItems = [],
  menuState = 'expanded',
  className = ""
}) => {
  const theme = useTheme();
  const location = useLocation();
  const sidebarRef = useRef(null);
  const [openAccordions, setOpenAccordions] = useState(new Set());

  // Estado para controlar se está em modo hover
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    getItemsMenu();
  }, [getItemsMenu]);

  // Sincronizar menuState com isExpanded quando não está em hover
  useEffect(() => {
    if (!isHovered) {
      if (isExpanded) {
        setMenuState('expanded');
      } else {
        setMenuState('compacted');
      }
    }
  }, [isExpanded, isHovered, setMenuState]);

  // Fechar todos os accordions quando a sidebar for fechada
  useEffect(() => {
    if (!isExpanded) {
      setOpenAccordions(new Set());
    }
  }, [isExpanded]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const isOutsideSidebar = sidebarRef.current && !sidebarRef.current.contains(event.target);
      const isNotMenuButton = !event.target.closest('.menu-button');
      const isNotHeaderArea = !event.target.closest('[class*="HeaderWrapper"]');

      if (isOutsideSidebar && isNotMenuButton && isNotHeaderArea) {
        if (isExpanded) {
          setToggleMenu(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded, setToggleMenu]);

  // Funcionalidades de hover
  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    if (menuState === 'compacted' || !isExpanded) {
      setMenuState('expanded');
    }
  }, [menuState, isExpanded, setMenuState]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    // Se o menu não foi aberto pelo header (isExpanded = false), voltar para compacted
    if (!isExpanded) {
      setMenuState('compacted');
    }
  }, [isExpanded, setMenuState]);

  const handleAccordionToggle = useCallback((itemTitle) => {
    // Se a sidebar estiver fechada, abrir a sidebar primeiro
    if (!isExpanded) {
      setToggleMenu(true);
      // Aguardar um pequeno delay para a sidebar abrir e depois abrir o accordion
      setTimeout(() => {
        setOpenAccordions(new Set([itemTitle]));
      }, 200);
      return;
    }

    // Comportamento normal quando sidebar está aberta
    setOpenAccordions(prev => {
      const newSet = new Set();
      // Single accordion behavior - close others when opening one
      if (!prev.has(itemTitle)) {
        newSet.add(itemTitle);
      }
      return newSet;
    });
  }, [isExpanded, setToggleMenu]);

  // Função para navegar e fechar sidebar em mobile
  const handleNavigate = useCallback((path) => {
    // Em telas pequenas, fechar a sidebar após navegação
    if (window.innerWidth <= 768) {
      setToggleMenu(false);
    }
  }, [setToggleMenu]);

  // Determinar se a sidebar deve estar expandida (por click do header OU por hover)
  const shouldBeExpanded = isExpanded || menuState === 'expanded';
  const renderedMenuItems = useMemo(() =>
    menuItems.map((item, index) => {
      const itemKey = item.titleId;
      return (
        <MenuItem
          item={item}
          key={`${itemKey}-${index}`}
            isAccordionOpen={openAccordions.has(itemKey)}
          allowedItems={allowedItems}
          isExpanded={shouldBeExpanded}
          onAccordionToggle={handleAccordionToggle}
          onNavigate={handleNavigate}
          currentPath={location.pathname}
          level={0}
        />
      );
    }),
    [
      openAccordions,
      allowedItems,
      shouldBeExpanded,
      handleAccordionToggle,
      handleNavigate,
      location.pathname
    ]
  );

  return (
    <SidebarContainer
      ref={sidebarRef}
      isExpanded={shouldBeExpanded}
      theme={theme}
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <SidebarContent theme={theme}>
        {renderedMenuItems}
      </SidebarContent>
    </SidebarContainer>
  );
};

const mapStateToProps = (state) => ({
  isExpanded: state.settings.toggleMenu,
  allowedItems: state.menu.items,
  menuState: state.menu.menuState,
});

const mapDispatchToProps = (dispatch) => ({
  setToggleMenu: (isOpen) => {
    dispatch(setToggleMenu(isOpen));
  },
  getItemsMenu: () => {
    dispatch(getItemsMenu());
  },
  setMenuState: (state) => dispatch(setMenuState(state)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DynamicSidebar);
