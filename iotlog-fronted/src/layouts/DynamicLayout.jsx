import { connect } from "react-redux";
import styled from "styled-components";
import Header from "../components/Header";
import DynamicSidebar from "../components/DynamicSidebar";
import Footer from "../components/Footer";
import { setToggleMenu } from "../actions";

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: ${(props) => {
    if (!props.showSidebar) return "1fr";
    return props.isExpanded ? "280px 1fr" : "70px 1fr";
  }};

  @media (max-width: 768px) {
    grid-template-columns: ${(props) => {
      if (!props.showSidebar) return "1fr";
      return props.isExpanded ? "280px 1fr" : "0px 1fr";
    }};
  }

  grid-template-rows: 1fr;
  height: 100vh;
  transition: grid-template-columns 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  will-change: grid-template-columns;
`;

const SidebarArea = styled.div`
  grid-column: 1;
  padding: 0.5rem 0 0.5rem 0.5rem;

  @media (max-width: 768px) {
    padding: ${(props) => (props.isExpanded ? "0.5rem 0 0.5rem 0.5rem" : "0")};
  }

  grid-row: 1;
  height: 100vh;
  overflow: hidden;
  position: relative;
`;

const MainArea = styled.div`
  grid-column: 2;
  grid-row: 1;
  height: 100vh;
  display: grid;
  grid-template-rows: ${(props) => (props.showHeader ? "auto 1fr" : "1fr")} ${(props) =>
      props.showFooter ? "auto" : ""};
  overflow: hidden;
`;

const HeaderArea = styled.div`
  grid-row: 1;
  position: relative;
  z-index: 999;
`;

const ContentArea = styled.div`
  grid-row: 2;
  overflow-y: auto;
  overflow-x: hidden;
  padding: ${(props) => (props.showHeader ? "4.7rem" : "0")} .7rem .7rem .7rem;
  transition: padding 0.3s ease;

  & > * {
    border-radius: 12px;
    box-shadow: none;
  }

  & > * > * {
    border-radius: 12px;
    box-shadow: none;
  }

  & > * > * > * {
    border-radius: 12px;
    box-shadow: none;
  }
`;

const FooterArea = styled.div`
  grid-row: 3;
  position: relative;
  padding: 0.7rem;
`;

const DynamicLayout = (props) => {
  const {
    children,
    showHeader = true,
    showSidebar = true,
    showFooter = true,
    isSmallLayout = false,
    columnStyle = {},
    contentStyle = {},
    toggleMenu, // Get from Redux
  } = props;

  return (
    <GridContainer showSidebar={showSidebar} isExpanded={toggleMenu}>
      {showSidebar && (
        <SidebarArea isExpanded={toggleMenu}>
          <DynamicSidebar />
        </SidebarArea>
      )}

      <MainArea showHeader={showHeader} showFooter={showFooter}>
        {showHeader && (
          <HeaderArea>
            <Header isSmallLayout={isSmallLayout} />
          </HeaderArea>
        )}

        <ContentArea style={{ ...contentStyle, ...columnStyle }}>
          {children}
        </ContentArea>

        {showFooter && (
          <FooterArea>
            <Footer />
          </FooterArea>
        )}
      </MainArea>
    </GridContainer>
  );
};

const mapStateToProps = (state) => ({
  toggleMenu: state.settings.toggleMenu || state.menu.menuState === 'expanded',
});

const mapDispatchToProps = (dispatch) => ({
  setToggleMenu: (isOpen) => {
    dispatch(setToggleMenu(isOpen));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(DynamicLayout);
