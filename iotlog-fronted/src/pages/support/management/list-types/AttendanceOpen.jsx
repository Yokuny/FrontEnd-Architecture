import React from "react";
import ListBase from "./ListBase";
import { PERMISSIONS_SUPPORT } from "../../../../constants";
import { FetchSupport } from "../../../../components";
import { nanoid } from "nanoid";
import { useSocket } from "../../../../components/Contexts/SocketContext";

export default function AttendanceOpen(props) {
  const [newOrders, setNewOrders] = React.useState([]);
  const [data, setData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);


  const socket = useSocket();

  React.useEffect(() => {
    if (!socket) {
      return;
    }
    if (!!props.enterprises?.length) {
      socket.emit("join", {
        topics: props.enterprises.map((x) => `ordersupport_${x}`),
      });

      props.enterprises.forEach((x) => {

        socket.on(`ordersupport_${x}`, (payload) => {
          setNewOrders(payload);
        });
      });
    }

    return () => {
      if (socket) {
        props.enterprises.forEach((x) => {
          socket.emit("leave", {
            topic: `ordersupport_${x}`,
          });
        });
        socket.off("ordersupport", (payload) => {
          setNewOrders(payload);
        }
        );
      }
    };
  }, [socket]);

  React.useEffect(() => {
    onPageChanged({
      currentPage: 1,
      pageLimit: 10,
      text: localStorage.getItem("search_open"),
    });
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
    let url = `/ordersupport/open?page=${currentPage - 1}&size=${pageLimit}`;
    if (text) {
      url += `&search=${text}`;
    }

    localStorage.setItem("search_open", text ?? "");

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
        data={data}
        onPageChanged={onPageChanged}
        isLoading={isLoading}
        onClick={props.onClick}
        initialText={localStorage.getItem("search_open")}
        showSlaFirst
      />
    </>
  );
}
