import React from "react";
import styled, { keyframes } from "styled-components";
import { EvaIcon } from "@paljs/ui";
import { FormattedMessage } from "react-intl";

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-8px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const BreadcrumbContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 12px 16px;
  background: ${props => props.theme.backgroundBasicColor2};
  border-radius: 12px;
  flex-wrap: wrap;
  margin-bottom: 8px;
`;

const BreadcrumbItem = styled.span`
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: ${(props) => (props.clickable ? "pointer" : "default")};
  color: ${(props) => props.active ? props.theme.colorPrimary600 : props.theme.colorBasic600};
  font-size: 0.875rem;
  font-weight: ${(props) => (props.active ? "600" : "500")};
  padding: 6px 12px;
  border-radius: 8px;
  transition: all 0.2s ease;
  animation: ${slideIn} 0.25s ease-out;
  background: ${props => props.active ? props.theme.backgroundBasicColor1 : 'transparent'};
  box-shadow: ${props => props.active ? '0 2px 4px rgba(0, 0, 0, 0.06)' : 'none'};

  &:hover {
    color: ${(props) => props.clickable ? props.theme.colorPrimary500 : "inherit"};
    background: ${props => props.clickable && !props.active ? props.theme.backgroundBasicColor3 : props.active ? props.theme.backgroundBasicColor1 : 'transparent'};
  }

  svg {
    font-size: 16px;
  }
`;

const Separator = styled.span`
  color: ${(props) => props.theme.colorBasic500};
  font-size: 14px;
  display: flex;
  align-items: center;
  opacity: 0.5;
`;

const HomeIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: ${props => props.active
    ? `linear-gradient(135deg, ${props.theme.colorPrimary500} 0%, ${props.theme.colorPrimary400} 100%)`
    : props.theme.backgroundBasicColor3};
  color: ${props => props.active ? '#fff' : props.theme.colorBasic600};
  transition: all 0.2s ease;
  margin-right: 4px;

  ${BreadcrumbItem}:hover & {
    background: ${props => props.clickable && !props.active
      ? props.theme.colorPrimary100
      : props.active
        ? `linear-gradient(135deg, ${props.theme.colorPrimary500} 0%, ${props.theme.colorPrimary400} 100%)`
        : props.theme.backgroundBasicColor3};
    color: ${props => props.clickable && !props.active ? props.theme.colorPrimary500 : props.active ? '#fff' : props.theme.colorBasic600};
  }
`;

const AssetFolderBreadcrumb = ({ folderPath = [], onNavigate }) => {
  const isAtRoot = folderPath.length === 0;

  return (
    <BreadcrumbContainer>
      <BreadcrumbItem
        clickable={!isAtRoot}
        active={isAtRoot}
        onClick={() => !isAtRoot && onNavigate(null)}
      >
        <HomeIcon active={isAtRoot} clickable={!isAtRoot}>
          <EvaIcon name="home-outline" style={{ fontSize: "16px" }} />
        </HomeIcon>
        <FormattedMessage id="folder.root" />
      </BreadcrumbItem>

      {folderPath.map((folder, index) => {
        const isLast = index === folderPath.length - 1;
        return (
          <React.Fragment key={folder.id}>
            <Separator>
              <EvaIcon name="chevron-right-outline" style={{ fontSize: "16px" }} />
            </Separator>
            <BreadcrumbItem
              clickable={!isLast}
              active={isLast}
              onClick={() => !isLast && onNavigate(folder.id)}
            >
              <EvaIcon name={isLast ? "folder" : "folder-outline"} style={{ fontSize: "16px" }} />
              {folder.name}
            </BreadcrumbItem>
          </React.Fragment>
        );
      })}
    </BreadcrumbContainer>
  );
};

export default AssetFolderBreadcrumb;


