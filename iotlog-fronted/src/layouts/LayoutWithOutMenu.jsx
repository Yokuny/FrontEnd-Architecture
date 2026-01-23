import { connect } from "react-redux";
import styled from "styled-components";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { setToggleMenu } from "../actions";

const GridContainer = styled.div`
  display: grid;

  height: 100vh;
  width: 100vw;
  overflow: hidden;
`;

const MainArea = styled.div`
  grid-column: 1;
  grid-row: 1;
  height: 100vh;
  display: grid;
  grid-template-rows: ${(props) => (props.showHeader ? "auto 1fr" : "1fr")} ${(props) =>
      props.showFooter ? "auto" : ""};
  overflow: hidden;
`;

const ContentArea = styled.div`
  grid-row: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 1.7rem .7rem .7rem .7rem;
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
  grid-row: 2;
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

      <MainArea showHeader={showHeader} showFooter={showFooter}>
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
