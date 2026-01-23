import React from "react";
import {  EvaIcon } from "@paljs/ui";
import { FormattedMessage } from "react-intl";
import styled from "styled-components";
import PropTypes from 'prop-types';

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  padding: 1rem;
`;

const StatsCard = styled.div`
  background: ${({ theme }) => theme.cardBackground};
  border-radius: 0.5rem;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: ${({ theme }) => theme.cardShadow};
`;

const StatsIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ status, theme }) =>
    status === 'Danger' ? theme.dangerLight :
    status === 'Warning' ? theme.warningLight :
    status === 'Info' ? theme.infoLight :
    theme.backgroundBasic};

  svg {
    width: 24px;
    height: 24px;
    color: ${({ status, theme }) =>
      status === 'Danger' ? theme.danger :
      status === 'Warning' ? theme.warning :
      status === 'Info' ? theme.info :
      theme.textBasic};
  }
`;

const StatsContent = styled.div`
  flex: 1;
`;

const StatsValue = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${({ theme }) => theme.textBasic};
  margin-bottom: 0.25rem;
`;

const StatsTitle = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.textHint};
`;

const NotificationStatsCards = ({ stats }) => {
  return (
    <StatsContainer>
      <StatsCard>
        <StatsIcon status="Danger">
          <EvaIcon name="alert-circle-outline" />
        </StatsIcon>
        <StatsContent>
          <StatsValue>{stats?.critical || 0}</StatsValue>
          <StatsTitle>
            <FormattedMessage id="notifications.chart.critical" />
          </StatsTitle>
        </StatsContent>
      </StatsCard>

      <StatsCard>
        <StatsIcon status="Warning">
          <EvaIcon name="alert-triangle-outline" />
        </StatsIcon>
        <StatsContent>
          <StatsValue>{stats?.warning || 0}</StatsValue>
          <StatsTitle>
            <FormattedMessage id="notifications.chart.warning" />
          </StatsTitle>
        </StatsContent>
      </StatsCard>

      <StatsCard>
        <StatsIcon status="Info">
          <EvaIcon name="info-outline" />
        </StatsIcon>
        <StatsContent>
          <StatsValue>{stats?.info || 0}</StatsValue>
          <StatsTitle>
            <FormattedMessage id="notifications.chart.info" />
          </StatsTitle>
        </StatsContent>
      </StatsCard>
    </StatsContainer>
  );
};

NotificationStatsCards.propTypes = {
  stats: PropTypes.shape({
    critical: PropTypes.number,
    warning: PropTypes.number,
    info: PropTypes.number,
    total: PropTypes.number,
    unread: PropTypes.number
  }).isRequired
};

export default NotificationStatsCards;
