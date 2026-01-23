import React from "react";
import { Card } from "@paljs/ui/Card";
import { injectIntl } from "react-intl";
import { Tabs, Tab } from "@paljs/ui/Tabs";
import styled from "styled-components";
import AttendanceOpen from "./list-types/AttendanceOpen";
import MyAttendances from "./list-types/MyAttendances";
import MaintenanceOpen from "./list-types/MaintenanceOpen";
import MyMaintenances from "./list-types/MyMaintenances";
import Closed from "./list-types/Closed";
import { useFetchSupport } from "../../../components/Fetch/FetchSupport";
import { SpinnerFull } from "../../../components";
import { PERMISSIONS_SUPPORT } from "../../../constants";
import { useNavigate } from "react-router-dom";

const TabsWrapped = styled(Tabs)`
  .tabs {
    flex-wrap: wrap;
  }

  .tab-content {
    padding: 0 !important;
  }

  @media screen and (max-width: 720px) {
    .tab {
      width: 100%;
      display: flex;
      justify-content: center;
    }
  }
`;

const OrderListManagement = (props) => {
  const { intl } = props;
  const navigate = useNavigate();

  const { data, isLoading } = useFetchSupport("/ordersupport/my/dashboard");

  const attendanceAllow = data?.permissions.some(
    (x) => x.permission == PERMISSIONS_SUPPORT.to_do_attendance
  );
  const managerMaintenance = data?.permissions.some(
    (x) => x.permission == PERMISSIONS_SUPPORT.manage_maintenance
  );
  const maintanceAllow = data?.permissions.some(
    (x) => x.permission == PERMISSIONS_SUPPORT.to_do_maintenance
  );
  const viewClosed = data?.permissions.some(
    (x) => x.permission == PERMISSIONS_SUPPORT.view_closed
  );

  const managerSupport = data?.permissions.some(
    (x) => x.permission == PERMISSIONS_SUPPORT.manager_support
  );

  const openDetails = (idOrder) => {
    navigate(`/details-order-management?id=${idOrder}`);
  };

  const getTabs = () => {
    let tabs = [];
    if (attendanceAllow)
      tabs = [
        <Tab
          badge={{
            status: "Warning",
            title: data?.open || 0,
            position: "topEnd",
          }}
          title={intl.formatMessage({ id: "list.opens" })}
        >
          <AttendanceOpen
            typeProblems={data?.typeProblems}
            permissions={data?.permissions}
            enterprises={data?.enterprises}
            onClick={openDetails}
          />
        </Tab>,
        <Tab
          badge={{
            status: "Primary",
            title: data?.attendance || 0,
            position: "topEnd",
          }}
          title={intl.formatMessage({
            id: managerSupport ? "in.attendance" : "my.attendance",
          })}
        >
          <MyAttendances onClick={openDetails} />
        </Tab>,
      ];

    if (managerMaintenance || maintanceAllow) {
      tabs = [
        ...tabs,
        <Tab
          badge={{
            status: "Danger",
            title: data?.maintenanceopen || 0,
            position: "topEnd",
          }}
          title={intl.formatMessage({ id: "list.maintance.open" })}
        >
          <MaintenanceOpen
            managerMaintenance={managerMaintenance}
            typeProblems={data?.typeProblems}
            permissions={data?.permissions}
            onClick={openDetails}
            enterprises={data?.enterprises}
          />
        </Tab>,
      ];
    }

    if (maintanceAllow) {
      tabs = [
        ...tabs,
        <Tab
          badge={{
            status: "Info",
            title: data?.mymaintenance || 0,
            position: "topEnd",
          }}
          title={intl.formatMessage({ id: "my.maintance" })}
        >
          <MyMaintenances onClick={openDetails} />
        </Tab>,
      ];
    }

    if (viewClosed)
      tabs = [
        ...tabs,
        <Tab
          badge={{
            status: "Success",
            title: data?.closed || 0,
            position: "topEnd",
          }}
          title={intl.formatMessage({ id: "closed" })}
        >
          <Closed onClick={openDetails} />
        </Tab>,
      ];

    return tabs;
  };

  return (
    <>
      <Card>
        <TabsWrapped fullWidth>{getTabs()}</TabsWrapped>
      </Card>
      <SpinnerFull isLoading={isLoading} />
    </>
  );
};

export default injectIntl(OrderListManagement);
