import React from "react";
import { Col, Row, Button, Select, EvaIcon } from "@paljs/ui";
import { useIntl } from "react-intl";
import styled from "styled-components";
import PropTypes from 'prop-types';

const FilterSelect = styled(Select)`
  min-width: 200px;
  position: relative;
  z-index: 3;
`;

const FilterContainer = styled(Row)`
  padding: 1rem;
`;

const FilterCol = styled(Col)`
  margin-bottom: 0.75rem;
`;

const NotificationFilters = ({
  selectedLevel,
  selectedStatus,
  selectedReadStatus,
  handleLevelFilter,
  handleStatusFilter,
  handleReadStatusFilter,
  loadDashboardData,
  getLevelOptions,
  getStatusOptions,
  getReadStatusOptions
}) => {
  const intl = useIntl();

  return (
    <FilterContainer>
      <Col breakPoint={{ xs: 12 }}>
        <Row>
          <FilterCol breakPoint={{ xs: 12, md: 4 }}>
            <FilterSelect
              options={getLevelOptions()}
              placeholder={intl.formatMessage({ id: 'notifications.filter.by.level' })}
              onChange={handleLevelFilter}
              value={selectedLevel ?
                {
                  value: selectedLevel,
                  label: intl.formatMessage({ id: `notifications.${selectedLevel.toLowerCase()}` })
                } : null
              }
            />
          </FilterCol>
          <FilterCol breakPoint={{ xs: 12, md: 4 }}>
            <FilterSelect
              options={getStatusOptions()}
              placeholder={intl.formatMessage({ id: 'notifications.filter.by.status' })}
              onChange={handleStatusFilter}
              value={selectedStatus ?
                {
                  value: selectedStatus,
                  label: intl.formatMessage({ id: `${selectedStatus}` })
                } : null
              }
            />
          </FilterCol>
          <FilterCol breakPoint={{ xs: 12, md: 4 }}>
            <div className="d-flex justify-content-between align-items-center">
              <FilterSelect
                options={getReadStatusOptions()}
                placeholder={intl.formatMessage({ id: 'notifications.filter.by.read' })}
                onChange={handleReadStatusFilter}
                value={selectedReadStatus ?
                  {
                    value: selectedReadStatus,
                    label: intl.formatMessage({ id: `notifications.filter.${selectedReadStatus}` })
                  } : null
                }
              />
              <Button
                appearance="ghost"
                status="Primary"
                onClick={loadDashboardData}
                className="ml-2"
                title={intl.formatMessage({ id: 'notifications.refresh' })}
              >
                <EvaIcon name="sync-outline" />
              </Button>
            </div>
          </FilterCol>
        </Row>
      </Col>
    </FilterContainer>
  );
};

NotificationFilters.propTypes = {
  selectedLevel: PropTypes.string,
  selectedStatus: PropTypes.string,
  selectedReadStatus: PropTypes.string,
  handleLevelFilter: PropTypes.func.isRequired,
  handleStatusFilter: PropTypes.func.isRequired,
  handleReadStatusFilter: PropTypes.func.isRequired,
  loadDashboardData: PropTypes.func.isRequired,
  getLevelOptions: PropTypes.func.isRequired,
  getStatusOptions: PropTypes.func.isRequired,
  getReadStatusOptions: PropTypes.func.isRequired
};

export default NotificationFilters;
