import React from "react";
import ListBase from "./ListBase";
import { FetchSupport } from "../../../../components";
import { PERMISSIONS_SUPPORT } from "../../../../constants";
import { getTokenDecoded } from "../../../../components/Utils";
import { nanoid } from "nanoid";
import { useSocket } from "../../../../components/Contexts/SocketContext";

const MaintenanceOpen = (props) => {
  const [newOrders, setNewOrders] = React.useState([]);
  const [data, setData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const socket = useSocket();

  React.useEffect(() => {
    if (!socket) {
      return;
    }
    const tokenDecoded = getTokenDecoded();
    if (props.managerMaintenance && props.enterprises?.length) {
      socket.emit("join", {
        topics: [
          ...props.enterprises.map(
            (x) => `ordersupport_waiting_maintenance_${x}`),
          `ordersupport_waiting_maintenance_user_${tokenDecoded?.id}`
        ]
      });
      props.enterprises.forEach((x) => {
        socket.on(`ordersupport_waiting_maintenance_${x}`, (payload) => {
          setNewOrders(payload);
        });
      });
    }
    socket.on(
      `ordersupport_waiting_maintenance_user_${tokenDecoded?.id}`,
      (payload) => {
        setNewOrders(payload);
      }
    );

    return () => {
      if (socket) {
        socket.emit("leave", {
          topics: [
            ...props.enterprises.map(
              (x) => `ordersupport_waiting_maintenance_${x}`),
            `ordersupport_waiting_maintenance_user_${tokenDecoded?.id}`
          ]
        });
        socket.off(
          `ordersupport_waiting_maintenance_user_${tokenDecoded?.id}`,
          (payload) => {
            setNewOrders(payload);
          }
        );
        props.enterprises.forEach((x) => {
          socket.emit("leave", {
            topic: `ordersupport_waiting_maintenance_${x}`,
          });
          socket.off(`ordersupport_waiting_maintenance_${x}`, (payload) => {
            setNewOrders(payload);
          });
        });

      }
    };
  }, [socket]);

  React.useEffect(() => {
    onPageChanged({ currentPage: 1, pageLimit: 10, text: localStorage.getItem("maintenance_open") });
  }, []);

  React.useEffect(() => {
    if (newOrders && newOrders.length) {
      const newOrder = newOrders[0];
      if (
        props?.permissions.some(
          (x) =>
            x.idEnterprise == newOrder?.idEnterprise &&
            x.permission == PERMISSIONS_SUPPORT.all_type_problems
        )
      ) {
        setData({
          rows: [newOrder, ...data.rows],
          count: (data?.count ?? 0) + 1,
        });
      } else if (
        props?.typeProblems.some(
          (x) =>
            x.idEnterprise == newOrder?.idEnterprise &&
            x.idTypeProblem == newOrder?.idTypeProblem
        )
      ) {
        setData({
          rows: [newOrder, ...data.rows],
          count: (data?.count ?? 0) + 1,
        });
      } else {
        return;
      }
    }
  }, [newOrders]);

  const onPageChanged = ({ currentPage, pageLimit, text = "" }) => {
    if (!currentPage) return;
    let url = `/ordersupport/maintenance/open?page=${currentPage - 1
      }&size=${pageLimit}`;
    if (text) {
      url += `&search=${text}`;
    }

    localStorage.setItem(`maintenance_open`, text ?? "");

    setIsLoading(true);
    FetchSupport.get(url)
      .then((response) => {
        setData(response.data);
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  return (
    <>
      <ListBase
        key={nanoid()}
        onPageChanged={onPageChanged}
        data={data}
        isLoading={isLoading}
        onClick={props.onClick}
        initialText={localStorage.getItem("maintenance_open")}
        showSlaSolution
        showSchedule
      />
    </>
  );
};

export default MaintenanceOpen;
