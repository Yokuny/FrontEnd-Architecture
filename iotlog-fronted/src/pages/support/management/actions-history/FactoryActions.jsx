import React from "react";
import {
  PERMISSIONS_SUPPORT,
  STATUS_ORDER_SUPPORT,
  ACTIONS_SUPPORT,
} from "../../../../constants";
import ControlAttendanceBase from "./ControlAttendanceBase";
import InitMaintenance from "./InitMaintenance";
import InitAttendace from "./InitAttendace";
import { injectIntl } from "react-intl";
import InitAnalysisMaintenance from "./InitAnalysisMaintenance";
import ViewFeedback from "./ViewFeedback";

const FactoryActions = (props) => {
  const { intl, history, order, permissions } = props;
  const [statusOrder, setStatusOrder] = React.useState(undefined);

  React.useEffect(() => {
    setStatusOrder(props.order.status);
  }, []);

  const permissionTransfer = permissions?.some(
    (x) =>
      x.permission == PERMISSIONS_SUPPORT.transfer_user &&
      x.idEnterprise == order.idEnterprise
  );

  const permissionSchedule = permissions?.some(
    (x) =>
      x.permission == PERMISSIONS_SUPPORT.schedule_maintenance &&
      x.idEnterprise == order.idEnterprise
  );

  const permissionClose = permissions?.some(
    (x) =>
      x.permission == PERMISSIONS_SUPPORT.to_do_close &&
      x.idEnterprise == order.idEnterprise
  );

  const permissionCancel = permissions?.some(
    (x) =>
      x.permission == PERMISSIONS_SUPPORT.cancel &&
      x.idEnterprise == order.idEnterprise
  );

  if (statusOrder == STATUS_ORDER_SUPPORT.MAINTENANCE) {
    const listStatusMaintenance = [
      {
        value: STATUS_ORDER_SUPPORT.MAINTENANCE,
        label: intl.formatMessage({ id: "write.comment" }),
      },
      {
        value: STATUS_ORDER_SUPPORT.SCHEDULE,
        label: intl.formatMessage({ id: "send.back" }),
      },
      {
        value: STATUS_ORDER_SUPPORT.FINISHED_MAINTENANCE,
        label: intl.formatMessage({ id: "finish.service" }),
      },
    ];

    if (permissionSchedule) {
      listStatusMaintenance.push({
        value: STATUS_ORDER_SUPPORT.WAITING_SCHEDULE,
        label: intl.formatMessage({ id: "schedule" }),
      });
    }

    if (permissionTransfer) {
      listStatusMaintenance.push({
        value: ACTIONS_SUPPORT.TRANSFER,
        label: intl.formatMessage({ id: "transfer.to" }),
        action: STATUS_ORDER_SUPPORT.SCHEDULE,
      });
    }

    if (permissionCancel) {
      listStatusMaintenance.push({
        value: STATUS_ORDER_SUPPORT.CANCELED,
        label: intl.formatMessage({ id: "cancel" }),
      });
    }

    if (permissionClose) {
      listStatusMaintenance.push({
        value: STATUS_ORDER_SUPPORT.CLOSED,
        label: intl.formatMessage({ id: "send.closed" }),
      });
    }

    return (
      <ControlAttendanceBase
        order={props.order}
        optionsActions={listStatusMaintenance}
        history={history}
        onChangeStatus={setStatusOrder}
        permissionTransfer={permissionTransfer}
      />
    );
  }

  if (statusOrder == STATUS_ORDER_SUPPORT.ATTENDANCE) {
    const listStatus = [
      {
        value: STATUS_ORDER_SUPPORT.ATTENDANCE,
        label: intl.formatMessage({ id: "write.comment" }),
      },
      {
        value: STATUS_ORDER_SUPPORT.OPEN,
        label: intl.formatMessage({ id: "send.back" }),
      },
      {
        value: STATUS_ORDER_SUPPORT.WAITING_MAINTENANCE,
        label: intl.formatMessage({ id: "send.maintenance" }),
      },
    ];

    if (permissionSchedule) {
      listStatus.push({
        value: STATUS_ORDER_SUPPORT.WAITING_SCHEDULE,
        label: intl.formatMessage({ id: "schedule" }),
      });
    }

    if (permissionTransfer) {
      listStatus.push({
        value: ACTIONS_SUPPORT.TRANSFER,
        label: intl.formatMessage({ id: "transfer.to" }),
        action: STATUS_ORDER_SUPPORT.ATTENDANCE,
      });
    }

    if (permissionCancel) {
      listStatus.push({
        value: STATUS_ORDER_SUPPORT.CANCELED,
        label: intl.formatMessage({ id: "cancel" }),
      });
    }

    if (permissionClose) {
      listStatus.push({
        value: STATUS_ORDER_SUPPORT.CLOSED,
        label: intl.formatMessage({ id: "send.closed" }),
      });
    }

    return (
      <ControlAttendanceBase
        order={props.order}
        optionsActions={listStatus}
        history={history}
        onChangeStatus={setStatusOrder}
        permissionTransfer={permissionTransfer}
      />
    );
  }

  if (statusOrder == STATUS_ORDER_SUPPORT.FINISHED_MAINTENANCE) {
    const listStatus = [
      {
        value: STATUS_ORDER_SUPPORT.FINISHED_MAINTENANCE,
        label: intl.formatMessage({ id: "write.comment" }),
      },
      {
        value: STATUS_ORDER_SUPPORT.MAINTENANCE,
        label: intl.formatMessage({ id: "send.back" }),
      },
      {
        value: STATUS_ORDER_SUPPORT.WAITING_MAINTENANCE,
        label: intl.formatMessage({ id: "send.maintenance" }),
      },
    ];

    if (permissionTransfer) {
      listStatus.push({
        value: ACTIONS_SUPPORT.TRANSFER,
        label: intl.formatMessage({ id: "transfer.to" }),
        action: STATUS_ORDER_SUPPORT.ATTENDANCE,
      });
    }

    if (permissionCancel) {
      listStatus.push({
        value: STATUS_ORDER_SUPPORT.CANCELED,
        label: intl.formatMessage({ id: "cancel" }),
      });
    }

    if (permissionClose) {
      listStatus.push({
        value: STATUS_ORDER_SUPPORT.CLOSED,
        label: intl.formatMessage({ id: "send.closed" }),
      });
    }

    return (
      <ControlAttendanceBase
        order={props.order}
        optionsActions={listStatus}
        history={history}
        onChangeStatus={setStatusOrder}
        permissionTransfer={permissionTransfer}
      />
    );
  }

  if (statusOrder == STATUS_ORDER_SUPPORT.ANALYSIS_MAINTENANCE) {
    const listStatusAnalysis = [
      {
        value: STATUS_ORDER_SUPPORT.ANALYSIS_MAINTENANCE,
        label: intl.formatMessage({ id: "write.comment" }),
      },
      {
        value: STATUS_ORDER_SUPPORT.ATTENDANCE,
        label: intl.formatMessage({ id: "send.back" }),
      },
    ];
    if (permissionSchedule) {
      listStatusAnalysis.push({
        value: STATUS_ORDER_SUPPORT.WAITING_SCHEDULE,
        label: intl.formatMessage({ id: "schedule" }),
      });
    }
    if (permissionTransfer) {
      listStatusAnalysis.push({
        value: ACTIONS_SUPPORT.TRANSFER,
        label: intl.formatMessage({ id: "transfer.to" }),
        action: STATUS_ORDER_SUPPORT.WAITING_SCHEDULE,
      });
    }

    if (permissionCancel) {
      listStatusAnalysis.push({
        value: STATUS_ORDER_SUPPORT.CANCELED,
        label: intl.formatMessage({ id: "cancel" }),
      });
    }

    if (permissionClose) {
      listStatusAnalysis.push({
        value: STATUS_ORDER_SUPPORT.CLOSED,
        label: intl.formatMessage({ id: "send.closed" }),
      });
    }
    return (
      <ControlAttendanceBase
        order={props.order}
        optionsActions={listStatusAnalysis}
        history={history}
        onChangeStatus={setStatusOrder}
        permissionTransfer={permissionTransfer}
      />
    );
  }

  if (statusOrder == STATUS_ORDER_SUPPORT.WAITING_SCHEDULE) {
    const permissionConfirmSchedule = permissions?.some(
      (x) =>
        x.permission == PERMISSIONS_SUPPORT.confirm_schedule_maintenance &&
        x.idEnterprise == order.idEnterprise
    );

    const listStatusWaitingSchedule = [
      {
        value: STATUS_ORDER_SUPPORT.WAITING_MAINTENANCE,
        label: intl.formatMessage({ id: "send.back" }),
      },
    ];

    if (permissionSchedule) {
      listStatusWaitingSchedule.push({
        value: STATUS_ORDER_SUPPORT.WAITING_SCHEDULE,
        label: intl.formatMessage({ id: "new.schedule" }),
      });
    }

    if (permissionTransfer) {
      listStatusWaitingSchedule.push({
        value: ACTIONS_SUPPORT.TRANSFER,
        label: intl.formatMessage({ id: "transfer.to" }),
        action: STATUS_ORDER_SUPPORT.WAITING_SCHEDULE,
      });
    }

    if (permissionConfirmSchedule) {
      listStatusWaitingSchedule.push({
        value: STATUS_ORDER_SUPPORT.SCHEDULE,
        label: intl.formatMessage({ id: "schedule.confirm" }),
        action: STATUS_ORDER_SUPPORT.SCHEDULE,
      });
    }

    return (
      <ControlAttendanceBase
        order={props.order}
        optionsActions={listStatusWaitingSchedule}
        history={history}
        onChangeStatus={setStatusOrder}
        permissionTransfer={permissionTransfer}
      />
    );
  }

  if (statusOrder == STATUS_ORDER_SUPPORT.OPEN) {
    return (
      <InitAttendace order={props.order} onChangeStatus={setStatusOrder} />
    );
  }

  const permissionManageMaintenance = permissions?.some(
    (x) =>
      x.permission == PERMISSIONS_SUPPORT.manage_maintenance &&
      x.idEnterprise == order.idEnterprise
  );

  if (
    statusOrder == STATUS_ORDER_SUPPORT.WAITING_MAINTENANCE &&
    permissionManageMaintenance
  ) {
    return (
      <InitAnalysisMaintenance
        order={props.order}
        onChangeStatus={setStatusOrder}
      />
    );
  }

  if (statusOrder == STATUS_ORDER_SUPPORT.SCHEDULE && permissionTransfer) {
    const listStatusScheduled = [
      {
        value: STATUS_ORDER_SUPPORT.MAINTENANCE,
        label: intl.formatMessage({ id: "init.maintenance" }),
      },
    ];

    if (permissionTransfer) {
      listStatusScheduled.push({
        value: ACTIONS_SUPPORT.TRANSFER,
        label: intl.formatMessage({ id: "transfer.to" }),
        action: STATUS_ORDER_SUPPORT.SCHEDULE,
      });
    }

    if (permissionSchedule) {
      listStatusScheduled.push({
        value: STATUS_ORDER_SUPPORT.WAITING_SCHEDULE,
        label: intl.formatMessage({ id: "schedule" }),
      });
    }

    return (
      <ControlAttendanceBase
        order={props.order}
        optionsActions={listStatusScheduled}
        history={history}
        onChangeStatus={setStatusOrder}
        permissionTransfer={permissionTransfer}
      />
    );
  }

  if (statusOrder == STATUS_ORDER_SUPPORT.SCHEDULE) {
    return (
      <InitMaintenance order={props.order} onChangeStatus={setStatusOrder} />
    );
  }

  const permissionViewFeedback = permissions?.some(
    (x) =>
      x.permission == PERMISSIONS_SUPPORT.view_feedback &&
      x.idEnterprise == order.idEnterprise
  );

  if (statusOrder == STATUS_ORDER_SUPPORT.CLOSED && permissionViewFeedback) {
    return <ViewFeedback order={props.order} />;
  }

  return <></>;
};

export default injectIntl(FactoryActions);
