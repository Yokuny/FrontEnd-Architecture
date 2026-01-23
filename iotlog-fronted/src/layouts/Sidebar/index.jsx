import React from "react";
import { SidebarBody, Sidebar } from "@paljs/ui/Sidebar";
import { ifWidthInBreakpoint } from "@paljs/ui/breakpoints";
import { Link, useLocation } from "react-router-dom";
import { connect } from "react-redux";
import { Menu } from "@paljs/ui/Menu";
import menuItem from "../../routes/menuItem";
import { getItemsMenu, setStateViewer, setToggleMenu, setMenuState, setMenuFixed } from "../../actions";
import styled from "styled-components";

const DivWrapper = styled.div`

`

export const getPathReady = (path) => {
  return path.endsWith("/") ? path.slice(0, -1) : path;
};

const getMenuAllow = (paths, items) => {
  let menuShow = [];
  for (let x of items) {
    if (x.group && x.show.some((y) => paths.includes(y))) {
      menuShow.push(x);
    } else if (!!x.children?.length) {
      const itemsChildrenAllow = getMenuAllow(paths, x.children);
      if (itemsChildrenAllow?.length) {
        let item = { title: x.title, icon: x.icon };
        item.children = itemsChildrenAllow;
        menuShow.push(item);
      }
    } else if (!!x.link?.to && paths.includes(x.link.to)) {
      menuShow.push(x);
    }
  }

  return menuShow;
};

const SidebarCustom = (props) => {
  const menuRef = React.useRef(null);
  const sidebarRef = React.useRef(null);
  const wrapperRef = React.useRef(null);
  const location = useLocation();

  const [items, setItems] = React.useState([]);

  React.useEffect(() => {
    props.getItemsMenu();
    if (!props.startMenu) onMediaQueryChanges();
    window.addEventListener("resize", onMediaQueryChanges);

    return () => {
      window.removeEventListener("resize", onMediaQueryChanges);
    };
  }, []);

  React.useEffect(() => {
    if (props.toggleMenu) {
      props.setMenuState('expanded');
    } else {
      props.setMenuState(props.startMenu);
    }
  }, [props.toggleMenu, props.startMenu]);

  React.useEffect(() => {
    if (props.items?.length) {
      const menuOptions = getMenuAllow(props.items, menuItem);
      setItems(menuOptions);
    }
  }, [props.items]);

  const onMediaQueryChanges = () => {
    if (ifWidthInBreakpoint(props.hiddenBreakpoints)) {
      props.setMenuState("hidden");
      props.setMenuFixed(true);
    } else if (ifWidthInBreakpoint(props.compactedBreakpoints)) {
      props.setMenuState("compacted");
      props.setMenuFixed(true);
    } else {
      props.setMenuState("expanded");
      props.setMenuFixed(false);
    }
  };

  //?: 'hidden' | 'visible' | 'compacted' | 'expanded'
  const getState = (state) => {
    props.setMenuState(state);
    props.setViewerState(state);
  };


  const handleMouseEnter = React.useCallback(() => {
    if (props.startMenu === 'compacted' && props.menuState === 'compacted') {
      props.setMenuState('expanded');
    }
  }, [props.menuState, props.startMenu]);

  const handleMouseLeave = React.useCallback(() => {
    if (props.startMenu === 'compacted' && props.menuState === 'expanded' && !props.toggleMenu) {
      props.setMenuState('compacted');
    }
  }, [props.menuState, props.toggleMenu, props.startMenu]);

  const handleClickOutside = React.useCallback((event) => {
    if (
      wrapperRef.current &&
      !wrapperRef.current.contains(event.target) &&
      !document.querySelector(".header-bar a")?.contains(event.target)
    ) {
      if (props.toggleMenu) {
        props.setToggleMenu(false);
      }
    }
  }, [props.toggleMenu]);

  React.useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  if (!items?.length) return <></>;

  const toggleSidebar = () => {
    sidebarRef.current?.hide()
    props.setToggleMenu(false)
  }

  return (
    <Sidebar
      key={props.menuState}
      getState={getState}
      ref={sidebarRef}
      property="start"
      containerFixed
      fixed={props.isFixed || props.fixed}
      state={props.menuState}
      className="menu-sidebar"
    >
      <SidebarBody style={{ visibility: 'hidden' }}>
        <DivWrapper 
          ref={wrapperRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <Menu
            className="sidebar-menu"
            Link={Link}
            nextJs={false}
            ref={menuRef}
            items={items}
            currentPath={location.pathname}
            toggleSidebar={toggleSidebar}
          />
        </DivWrapper>
      </SidebarBody>
    </Sidebar>
  );
};

SidebarCustom.defaultProps = {
  compactedBreakpoints: ['sm', 'md', 'lg'],
  hiddenBreakpoints: ['xs', 'is'],
};

const mapStateToProps = (state) => ({
  toggleMenu: state.settings.toggleMenu,
  items: state.menu.items,
  menuState: state.menu.menuState,
  isFixed: state.menu.isFixed,
});

const mapDispatchToProps = (dispatch) => ({
  getItemsMenu: () => {
    dispatch(getItemsMenu());
  },
  setViewerState: (stateViewer) => {
    dispatch(setStateViewer(stateViewer));
  },
  setToggleMenu: (isOpen) => {
    dispatch(setToggleMenu(isOpen));
  },
  setMenuState: (state) => dispatch(setMenuState(state)),
  setMenuFixed: (isFixed) => dispatch(setMenuFixed(isFixed)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SidebarCustom);
