import { nanoid } from "nanoid";
import React from "react";
import { FetchSupport } from "../../../../components";
import ListBase from "./ListBase";

export default function Closed(props) {
  const [data, setData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useLayoutEffect(() => {
    onPageChanged({ currentPage: 1, pageLimit: 10, text: localStorage.getItem("closed") });
  }, []);

  const onPageChanged = ({ currentPage, pageLimit, text = "" }) => {
    if (!currentPage) return;
    let url = `/ordersupport/my/closed?page=${
      currentPage - 1
    }&size=${pageLimit}`;
    if (text) {
      url += `&search=${text}`;
    }
    localStorage.setItem('closed', text ?? "")
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
        initialText={localStorage.getItem("closed")}
        showSlaFirst
        showSlaSolution
        showEnd
      />
    </>
  );
}
