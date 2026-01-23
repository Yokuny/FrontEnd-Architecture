import React from "react";
import { connect } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { Fetch } from "../Fetch";
import { SpinnerFull } from "../Loading";

import ListPaginatedGeofence from "./ListPaginatedGeofence";

const ListSearchPaginatedGeofense = (props) => {
  const [data, setData] = React.useState();
  const [typesList, setTypesList] = React.useState([]);
  const [initialTypesList, setInitialTypesList] = React.useState([]);

  const [isLoading, setIsLoading] = React.useState();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedType, setSelectedType] = React.useState([]);

  const loaded = React.useRef(false);

  const handleTypeChange = (option) => {
    setSelectedType(option);

    const newSearchParams = new URLSearchParams(searchParams);

    if (option === "remove" || !option?.length) {
      newSearchParams.delete("type");
    } else {
      newSearchParams.set("type", option.map(x => x.value).join(","));
    }

    newSearchParams.set("page", 1);

    setSearchParams(newSearchParams);
  };

  React.useEffect(() => {
    if (data?.data && initialTypesList.length === 0) {
      const uniqueTypes = [
        ...new Map(
          data.data
            .filter((item) => item.type)
            .map((item) => [
              item.type.value,
              { value: item.type.value, label: item.type.label },
            ])
        ).values(),
      ];
      setInitialTypesList(uniqueTypes);
      setTypesList(uniqueTypes);
    }
  }, [data]);

  React.useEffect(() => {
    const shouldReset = selectedType === "remove" || selectedType;
    if (shouldReset) {
      setSelectedType(selectedType === "remove" ? null : selectedType);
      onPageChanged({
        currentPage: 1,
        pageLimit: Number(searchParams.get("size") || 5),
        text: searchParams.get("search") || "",
      });
    }
  }, [selectedType]);

  React.useEffect(() => {
    if (props.isReady && props.enterprises?.length && loaded.current) {
      const types = searchParams.get("type");
      if (types)
        setSelectedType(types.split(","));
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
    if (searchParams.get("type")) {
      searchParams.get("type").split(',').forEach((item) => {
        query.push(`type[]=${item}`);
      });
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

    const url = `${props.pathUrlSearh}${props.pathUrlSearh?.includes("?") ? "&" : "?"
      }${query.join("&")}`;
    setIsLoading(true);
    Fetch.get(url)
      .then((response) => {
        loaded.current = true;
        setData(response.data);
      })
      .catch((e) => { })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
      <ListPaginatedGeofence
        data={data?.data}
        totalItems={data?.pageInfo?.length ? data?.pageInfo[0]?.count ?? 0 : 0}
        renderItem={props.renderItem}
        onPageChanged={onPageChanged}
        contentStyle={props.contentStyle}
        isLoading={isLoading}
        noShowHeader={props.noShowHeader}
        types={typesList}
        selectedType={selectedType}
        onTypeChange={handleTypeChange}
      />
      <SpinnerFull isLoading={isLoading} />
    </>
  );
};

const mapStateToProps = (state) => ({
  enterprises: state.enterpriseFilter.enterprises,
  isReady: state.enterpriseFilter.isReady,
});

export default connect(mapStateToProps, undefined)(ListSearchPaginatedGeofense);
