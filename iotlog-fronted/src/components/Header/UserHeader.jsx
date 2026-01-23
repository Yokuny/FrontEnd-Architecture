import React from "react";
import styled, { useTheme } from "styled-components";
import Overlay from "../Overlay";
import { Card, CardBody } from "@paljs/ui/Card";
import { Button } from "@paljs/ui/Button";
import { EvaIcon } from "@paljs/ui/Icon";
import { FormattedMessage } from "react-intl";
import { useNavigate } from "react-router-dom";
import { UserImage } from "../User/UserImage";
import { SelectLanguage, SelectTheme } from "../Select";
import { Fetch } from "../Fetch";
import ButtonLogout from "./ButtonLogout";

const MenuCard = styled(Card)`
  background: ${(props) => props.theme.backgroundBasicColor1}dd;
  border: 1px solid ${(props) => props.theme.borderBasicColor3 || props.theme.backgroundBasicColor3};
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

  @media (max-width: 768px) {
    .card-body {
      padding: 8px;
    }
  }
`;

const UserContainer = styled.div`
  cursor: pointer;
`;

export default function UserHeader(props) {
  const [user, setUser] = React.useState(undefined);
  const navigate = useNavigate();
  const theme = useTheme();

  React.useEffect(() => {
    infoMeAsync();
  }, []);

  const infoMeAsync = async () => {
    const userReaded = localStorage.getItem("user");
    if (!userReaded) {
      try {
        const response = await Fetch.get("/user/me");
        const userData = {
          name: response?.data?.name,
          image: response?.data?.image,
        };
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
      } catch (e) {}
    } else {
      setUser(JSON.parse(userReaded));
    }
  };

  const onProfile = () => {
    navigate("/user-profile");
  };

  return (
    <>
      <Overlay
        transformSize={28}
        target={
          <UserContainer onClick={props.onToggle}>
            <UserImage name={user?.name} image={user?.image?.url} size="Medium" />
          </UserContainer>
        }
        contextMenu
        placement="bottom"
        trigger="noop"
        show={props.isOpen}
        offset={8}
      >
        <MenuCard theme={theme} className="content-menu-profile">
          <CardBody style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <SelectTheme />
            <SelectLanguage isSaveLanguage />
            <Button size="Small" status="Info" fullWidth className="button-icon" onClick={onProfile}>
              <EvaIcon name="person-outline" className="mr-1" />
              <FormattedMessage id="profile" />
            </Button>
            <ButtonLogout />
          </CardBody>
        </MenuCard>
      </Overlay>
    </>
  );
}
