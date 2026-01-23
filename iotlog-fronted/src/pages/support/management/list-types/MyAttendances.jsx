import React from "react";
import ListBase from "./ListBase";
import FetchSupport from "../../../../components/Fetch/FetchSupport";
import { nanoid } from "nanoid";

export default function MyAttendances(props) {
  const [data, setData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useLayoutEffect(() => {
    onPageChanged({
      currentPage: 1,
      pageLimit: 10,
      text: localStorage.getItem("my_attendances"),
    });
  }, []);

  const onPageChanged = ({ currentPage, pageLimit, text = "" }) => {
    if (!currentPage) return;
    let url = `/ordersupport/my/attendances?page=${
      currentPage - 1
    }&size=${pageLimit}`;
    if (text) {
      url += `&search=${text}`;
    }
    localStorage.setItem("my_attendances", text ?? "");

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
        showSlaSolution
        showSchedule
        data={data}
        isLoading={isLoading}
        onClick={props.onClick}
        initialText={localStorage.getItem("my_attendances")}
      />
    </>
  );
}
