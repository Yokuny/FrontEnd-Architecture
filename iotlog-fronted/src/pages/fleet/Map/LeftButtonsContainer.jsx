import styled from "styled-components";
import { useTheme } from "styled-components";
import { connect } from "react-redux";

const Container = styled.div`
  position: absolute;
  top: 5rem;
  left: ${(props) => (props.isShowList ? "calc(4.5rem + 360px)" : "5rem")};
  z-index: 999;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  background: ${(props) => props.theme.backgroundBasicColor1}dd;
  padding: 0.5rem;
  border-radius: 12px;
  border: 1px solid ${(props) => props.theme.borderBasicColor3 || props.theme.backgroundBasicColor3};
  transition: left 0.3s ease;

  @media (max-width: 768px) {
    padding: 8px;
    gap: 4px;
    /* Esconde os botões quando MyListFleet está aberto em mobile */
    display: ${(props) => (props.isShowList ? "none" : "flex")};
    left: ${(props) => (props.isExpanded ? "5rem" : "0.6rem")};
  }

  @media (max-width: 600px) {
    display: ${(props) => (props.isShowList ? "none" : "flex")};
    left: ${(props) => (props.isExpanded ? "5rem" : "0.6rem")};
  }
`;

const LeftButtonsContainer = ({ children, isShowList, toggleMenu }) => {
  const theme = useTheme();
  return (
    <Container theme={theme} isShowList={isShowList} isExpanded={toggleMenu}>
      {children}
    </Container>
  );
};

const mapStateToProps = (state) => ({
  isShowList: state.fleet.isShowList,
  toggleMenu: state.settings.toggleMenu || state.menu.menuState === 'expanded',
});

export default connect(mapStateToProps, undefined)(LeftButtonsContainer);
