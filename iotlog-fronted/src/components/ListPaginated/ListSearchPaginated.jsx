import React from "react";
import { connect } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { Fetch } from "../Fetch";
import { SpinnerFull } from "../Loading";
import ListPaginated from "./ListPaginated";

const ListSearchPaginated = (props) => {
  const [data, setData] = React.useState();
  const [isLoading, setIsLoading] = React.useState();
  const [searchParams, setSearchParams] = useSearchParams();
  const loaded = React.useRef(false);

  React.useEffect(() => {
    if (props.isReady && props.enterprises?.length && loaded.current) {
      onPageChanged({
        currentPage: Number(searchParams.get("page") || 1),
        pageLimit: Number(searchParams.get("size") || 5),
        text: searchParams.get("search") || "",
      });
    }
  }, [props.isReady, props.enterprises]);

  const onPageChanged = ({ currentPage, pageLimit, text = "" }) => {
    if (!currentPage) return;

    const query = [];
    query.push(`page=${currentPage - 1}`);
    query.push(`size=${pageLimit}`);
    if (text) {
      query.push(`search=${text}`);
    }

    if (props.filterEnterprise) {
      let idEnterprise = props.enterprises?.length
        ? props.enterprises[0].id
        : "";
      if (!idEnterprise) {
        idEnterprise = localStorage.getItem("id_enterprise_filter");
      }
      if (idEnterprise) query.push(`idEnterprise=${idEnterprise}`);
    }

    const url = `${props.pathUrlSearh}${props.pathUrlSearh?.includes("?") ? "&" : "?"}${query.join("&")}`;
    setIsLoading(true);
    Fetch.get(url)
      .then((response) => {
        loaded.current = true;
        setData(response.data);
      })
      .catch((e) => {})
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
      <ListPaginated
        data={data?.data}
        totalItems={data?.pageInfo?.length ? data?.pageInfo[0]?.count ?? 0 : 0}
        renderItem={props.renderItem}
        onPageChanged={onPageChanged}
        contentStyle={props.contentStyle}
        isLoading={isLoading}
        noShowHeader={props.noShowHeader}
      />
      <SpinnerFull isLoading={isLoading} />
    </>
  );
};

const mapStateToProps = (state) => ({
  enterprises: state.enterpriseFilter.enterprises,
  isReady: state.enterpriseFilter.isReady,
});

export default connect(mapStateToProps, undefined)(ListSearchPaginated);
