import React from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  EvaIcon,
  Row,
  Select,
} from "@paljs/ui";
import { FormattedMessage, useIntl } from "react-intl";
import { connect } from "react-redux";
import PathsDashboard from "./PathsDashboard";
import UsersDashboard from "./UsersDashboard";
import AccessDayDashboard from "./AccessDayDashboard";
import UserAcessDayDashboard from "./UserAcessDayDashboard";
import { SelectUserSamePermission, TextSpan } from "../../components";
import LocationsDashboard from "./LocationsDashboard";
import DevicesDashboard from "./DevicesDashboard";
import UsersWhatsappDashboard from "./UsersWhatsappDashboard";
import ActionsFleetDashboard from "./ActionsFleetDashboard";
import UserRMDayDashboard from "./UserRMDayDashboard";
import UsersRMDashboard from "./UsersRMDashboard";

const DashboardTrackingActivity = (props) => {
  const intl = useIntl();

  const optionsFilter = [
    {
      value: 12,
      label: `12 ${intl.formatMessage({ id: "hours" })}`,
    },
    {
      value: 24,
      label: `24 ${intl.formatMessage({ id: "hours" })}`,
    },
    {
      value: 168,
      label: `7 ${intl.formatMessage({ id: "days" })}`,
    },
    {
      value: 360,
      label: `15 ${intl.formatMessage({ id: "days" })}`,
    },
    {
      value: 720,
      label: `1 ${intl.formatMessage({ id: "month" }).toLowerCase()}`,
    },
    {
      value: 4320,
      label: `2 ${intl.formatMessage({ id: "months" })}`,
    },
    {
      value: 2160,
      label: `3 ${intl.formatMessage({ id: "months" })}`,
    },
    {
      value: 12960,
      label: `6 ${intl.formatMessage({ id: "months" })}`,
    },
    {
      value: 25920,
      label: `12 ${intl.formatMessage({ id: "months" })}`,
    },
  ];

  const [periodFilter, setPeriodFilter] = React.useState(12);
  const [users, setUsers] = React.useState([]);
  const [notIncludedUsers, setNotIncludedUsers] = React.useState([]);
  const [showFilter, setShowFilter] = React.useState(false);

  const idEnterprise = props.enterprises?.length
    ? props.enterprises[0].id
    : undefined;

  return (
    <>
      <Card>
        <CardHeader>
          <Row between className="pl-2 pr-2">
            <TextSpan apparence="s1">
              <FormattedMessage id="tracking.activity" />
              {` - ${intl.formatMessage({ id: "last" })} ${optionsFilter?.find((x) => x.value === periodFilter)?.label
                }`}
            </TextSpan>
            <Button
              size="Tiny"
              status={showFilter ? "Primary" : "Basic"}
              onClick={() => setShowFilter((prevState) => !prevState)}
            >
              <EvaIcon name="funnel-outline" />
            </Button>
          </Row>
          {showFilter && (
            <Row>
              <Col breakPoint={{ md: 5 }} className="mb-4">
                <TextSpan apparence="s2">
                  <FormattedMessage id="users.included" />
                </TextSpan>
                <div className="mt-1"></div>
                <SelectUserSamePermission
                  isClearable
                  isMulti
                  className="mt-1"
                  onChange={(value) => setUsers(value)}
                  value={users}
                  optionsDefault={[
                    {
                      value: "fleet_intranet",
                      label: "Fleet intranet",
                    },
                  ]}
                />
              </Col>
              <Col breakPoint={{ md: 5 }} className="mb-4">
                <TextSpan apparence="s2">
                  <FormattedMessage id="users.not.included" />
                </TextSpan>
                <div className="mt-1"></div>
                <SelectUserSamePermission
                  isClearable
                  isMulti
                  className="mt-1"
                  onChange={(value) => setNotIncludedUsers(value)}
                  value={notIncludedUsers}
                  optionsDefault={[
                    {
                      value: "fleet_intranet",
                      label: "Fleet intranet",
                    },
                  ]}
                />
              </Col>
              <Col breakPoint={{ md: 2 }} className="mb-4">
                <TextSpan apparence="s2">
                  <FormattedMessage id="last" />
                </TextSpan>
                <Select
                  className="mt-1"
                  noOptionsMessage={() =>
                    intl.formatMessage({ id: "nooptions.message" })
                  }
                  placeholder={<FormattedMessage id="period" />}
                  options={optionsFilter}
                  value={optionsFilter?.find((x) => x?.value === periodFilter)}
                  onChange={(value) => setPeriodFilter(value?.value)}
                />
              </Col>
            </Row>
          )}
        </CardHeader>
        <CardBody>
          {!!idEnterprise && <>
            <Row>
              <Col
                breakPoint={{ md: periodFilter >= 720 ? 12 : 6 }}
                className="mb-4"
              >
                <AccessDayDashboard
                  periodFilter={periodFilter}
                  idUsers={users?.map((x) => x.value)}
                  idUsersNotIncluded={notIncludedUsers?.map((x) => x.value)}
                  idEnterprise={idEnterprise}
                />
              </Col>
              <Col
                breakPoint={{ md: periodFilter >= 720 ? 12 : 6 }}
                className="mb-4"
              >
                <UserAcessDayDashboard
                  periodFilter={periodFilter}
                  idUsers={users?.map((x) => x.value)}
                  idUsersNotIncluded={notIncludedUsers?.map((x) => x.value)}
                  idEnterprise={idEnterprise}
                />
              </Col>

              <Col breakPoint={{ md: 6 }} className="mb-4">
                <UsersDashboard
                  periodFilter={periodFilter}
                  idUsers={users?.map((x) => x.value)}
                  idUsersNotIncluded={notIncludedUsers?.map((x) => x.value)}
                  idEnterprise={idEnterprise}
                />
              </Col>
              <Col breakPoint={{ md: 6 }} className="mb-4">
                <UsersWhatsappDashboard
                  periodFilter={periodFilter}
                  idUsers={users?.map((x) => x.value)}
                  idUsersNotIncluded={notIncludedUsers?.map((x) => x.value)}
                  idEnterprise={idEnterprise}
                />
              </Col>
              <Col breakPoint={{ md: 6 }} className="mb-4">
                <PathsDashboard
                  periodFilter={periodFilter}
                  idUsers={users?.map((x) => x.value)}
                  idUsersNotIncluded={notIncludedUsers?.map((x) => x.value)}
                  idEnterprise={idEnterprise}
                />
              </Col>

              <Col breakPoint={{ md: 6 }} className="mb-4">
                <ActionsFleetDashboard
                  periodFilter={periodFilter}
                  idUsers={users?.map((x) => x.value)}
                  idUsersNotIncluded={notIncludedUsers?.map((x) => x.value)}
                  idEnterprise={idEnterprise}
                />
              </Col>

              {idEnterprise === "ce21881c-6c0d-41b4-ace2-b0d846398b84" &&
                <><Col
                  breakPoint={{ md: periodFilter >= 720 ? 12 : 6 }}
                  className="mb-4"
                >
                  <UserRMDayDashboard
                    periodFilter={periodFilter}
                    idUsers={users?.map((x) => x.value)}
                    idUsersNotIncluded={notIncludedUsers?.map((x) => x.value)}
                    idEnterprise={idEnterprise}
                  />
                </Col>
                  <Col breakPoint={{ md: 6 }} className="mb-4">
                    <UsersRMDashboard
                      periodFilter={periodFilter}
                      idUsers={users?.map((x) => x.value)}
                      idUsersNotIncluded={notIncludedUsers?.map((x) => x.value)}
                      idEnterprise={idEnterprise}
                    />
                  </Col>
                </>}



              <Col breakPoint={{ md: 6 }} className="mb-4">
                <LocationsDashboard
                  periodFilter={periodFilter}
                  idUsers={users?.map((x) => x.value)}
                  idUsersNotIncluded={notIncludedUsers?.map((x) => x.value)}
                  idEnterprise={idEnterprise}
                />
              </Col>
              <Col breakPoint={{ md: 6 }} className="mb-4">
                <DevicesDashboard
                  periodFilter={periodFilter}
                  idUsers={users?.map((x) => x.value)}
                  idUsersNotIncluded={notIncludedUsers?.map((x) => x.value)}
                  idEnterprise={idEnterprise}
                />
              </Col>
            </Row>
          </>}
        </CardBody>
      </Card>
    </>
  );
};

const mapStateToProps = (state) => ({
  enterprises: state.enterpriseFilter.enterprises,
});

export default connect(mapStateToProps, undefined)(DashboardTrackingActivity);
