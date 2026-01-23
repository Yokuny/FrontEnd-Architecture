import React from "react";
import styled, { useTheme } from "styled-components";
import { Button } from "@paljs/ui/Button";
import { EvaIcon } from "@paljs/ui/Icon";
import { connect } from "react-redux";
import { setToggleMenu } from "../../actions";
import { SelectFilterEnterprise } from "../Select";
import NotificationBell from "../Notifications/NotificationBell";
import UserHeader from "./UserHeader";
import { ArrowForward } from "../Icons";

export const getPathReady = (path) => {
  return path.endsWith("/") ? path.slice(0, -1) : path;
};

const HeaderWrapper = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  right: 10px;
  z-index: 999;
`;

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.4rem;
  background: ${(props) => props.theme.backgroundBasicColor1}dd;
  padding: 0.5rem;
  border-radius: 12px;
  border: 1px solid ${(props) => props.theme.borderBasicColor3 || props.theme.backgroundBasicColor3};

  @media (max-width: 768px) {
    padding: 8px;
    gap: 4px;
  }
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 180px;
  justify-content: flex-end;
`;

const Separator = styled.div`
  width: 1px;
  height: 24px;
  background: ${(props) => props.theme.backgroundBasicColor3};
`;

const Header = (props) => {
  const theme = useTheme();
  const [openOverlay, setOpenOverlay] = React.useState(null);

  const handleMenuClick = (event) => {
    event.stopPropagation();
    props.setToggleMenu(!props.toggleMenu);
  };

  const handleOverlayToggle = (overlayName) => {
    setOpenOverlay(openOverlay === overlayName ? null : overlayName);
  };

  const handleGoBack = () => {
    window.history.back();
  };

  const pathsDistinct = [...new Set(props.itemsByEnterprise?.map((x) => x.paths)?.flat())];
  const hasNotification = pathsDistinct.includes("/my-notification-list");

  return (
    <HeaderWrapper>
      <Container theme={theme}>
        <LeftSection>
          <Button size="Tiny" status="Basic" appearance="ghost" onClick={handleMenuClick} className="menu-button">
            <EvaIcon name="menu-2-outline" />
          </Button>
          {/* <Button
            style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}
            size="Tiny"
            status="Basic"
            appearance="ghost"
            onClick={handleGoBack}
            title="Voltar">
            <ArrowForward style={{ width: "1rem", height: "1rem", transform: "rotate(180deg)" }} />
            Voltar
          </Button> */}
          <SelectFilterEnterprise />
        </LeftSection>

        <RightSection>
          {hasNotification && (
            <>
              <NotificationBell
                isOpen={openOverlay === "notifications"}
                onToggle={() => handleOverlayToggle("notifications")}
              />
              <Separator theme={theme} />
            </>
          )}
          <UserHeader isOpen={openOverlay === "user"} onToggle={() => handleOverlayToggle("user")} />
        </RightSection>
      </Container>
    </HeaderWrapper>
  );
};

const mapStateToProps = (state) => ({
  toggleMenu: state.settings.toggleMenu,
  itemsByEnterprise: state.menu.itemsByEnterprise,
});

const mapDispatchToProps = (dispatch) => ({
  setToggleMenu: (isOpen) => {
    dispatch(setToggleMenu(isOpen));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
