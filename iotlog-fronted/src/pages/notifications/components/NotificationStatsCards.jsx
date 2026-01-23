import React from "react";
import { CardHeader, Col, Row, EvaIcon } from "@paljs/ui";
import { FormattedMessage } from "react-intl";
import styled, { css } from "styled-components";
import PropTypes from 'prop-types';
import { TextSpan } from "../../../components";
import { CardNoShadow } from "../../../components";

const StatsCard = styled(CardNoShadow)`
  h2, h3 {
    margin: 0.5rem 0;
    font-weight: 600;
  }
  h2 {
    font-size: 2rem;
  }
  h3 {
    font-size: 1.5rem;
  }

  ${({ theme, statusAccent }) => css`
    border-left: 6px solid ${theme[`color${statusAccent}500`] || theme.backgroundBasicColor4};
  `}
`;

const StatsRow = styled(Row)`
  &.bottom-row {
    padding-top: 0;
  }
`;

const StatItem = ({ title, value, status, icon }) => (
  <StatsCard
    statusAccent={status}
  >
    <CardHeader>
      <TextSpan apparence="s2" hint>
        <FormattedMessage id={title} />
      </TextSpan>

      <Row className="m-0 pl-3" between="xs" center="xs">
        <h2>{value}</h2>
        <EvaIcon
          name={icon}
          options={status ? { width: 32, height: 32 } : { width: 24, height: 24 }}
          status={status || 'Basic'}
        />
      </Row>
    </CardHeader>
  </StatsCard>
);

StatItem.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.number,
  status: PropTypes.string,
  icon: PropTypes.string.isRequired
};

const NotificationStatsCards = ({ stats }) => (
  <>
    <StatsRow>
      <Col breakPoint={{ xs: 12, md: 4 }}>
        <StatItem
          title="critical"
          value={stats?.critical || 0}
          status="Danger"
          icon="alert-circle-outline"
        />
      </Col>
      <Col breakPoint={{ xs: 12, md: 4 }}>
        <StatItem
          title="warn"
          value={stats?.warning || 0}
          status="Warning"
          icon="alert-triangle-outline"
        />
      </Col>
      <Col breakPoint={{ xs: 12, md: 4 }}>
        <StatItem
          title="info"
          value={stats?.info || 0}
          status="Success"
          icon="info-outline"
        />
      </Col>
    </StatsRow>

    <StatsRow className="bottom-row">
      <Col breakPoint={{ xs: 12, md: 6 }}>
        <StatItem
          title="notifications.total"
          value={stats?.total || 0}
          icon="bell-outline"
        />
      </Col>
      <Col breakPoint={{ xs: 12, md: 6 }}>
        <StatItem
          title="notifications.unread"
          value={stats?.unread || 0}
          icon="eye-off-outline"
        />
      </Col>
    </StatsRow>
  </>
);

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
