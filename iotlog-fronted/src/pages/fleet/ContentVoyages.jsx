import { Button, List, ListItem, Spinner } from "@paljs/ui";
import React from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import styled, { css } from "styled-components";
import { useSearchParams } from "react-router-dom";

import { clearPoints, setTravelDetailsSelected } from "../../actions";
import { Fetch } from "../../components";
import { LoadingListTravel } from "./LoadingList";
import ItemStatusHistory from "./Status/ItemStatusHistory";

const SpinnerThemed = styled(Spinner)`
  ${({ theme }) => css`
    background-color: ${theme.backgroundBasicColor1};
  `}
`;

const VoyagesContent = (props) => {
  const [searchParams] = useSearchParams();
  const [travelStatus, setTravelStatus] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);
  const [total, setTotal] = React.useState(0);

  React.useEffect(() => {
    if (props.isReady) {
      getHistory(props.textFilter, page);
    }

    return () => {
      //props.setTravelDetailsSelected(undefined);
      setPage(0);
    };
  }, [props.enterprises, props.textFilter, props.filterFind]);

  React.useEffect(() => {
    if (
      props.isReady &&
      searchParams.get("idVoyage") &&
      searchParams.get("codeVoyage")
    ) {
      const idVoyage = searchParams.get("idVoyage");
      const codeVoyage = searchParams.get("codeVoyage");
      const voyage = travelStatus.find(
        (travel) => travel.id === idVoyage && travel.code === codeVoyage
      );
      if (voyage) {
        props.setTravelDetailsSelected(voyage);
      }
    }
  }, [props.isReady, travelStatus]);

  const getHistory = (search, page) => {
    setIsLoading(true);

    const idEnterpriseFilter = props.enterprises?.length
      ? props.enterprises[0].id
      : "";

    const queryFilters = [];
    if (idEnterpriseFilter) {
      queryFilters.push(`idEnterprise=${idEnterpriseFilter}`);
    }
    if (search) {
      queryFilters.push(`search=${search}`);
    }
    queryFilters.push(`travelType=travel`);
    queryFilters.push(`page=${page}`);
    queryFilters.push(`size=15`);

    if (props.filterFind) {
      props.filterFind?.filteredMachine?.map((x) =>
        queryFilters.push(`idMachine[]=${x}`)
      );
    }

    Fetch.get(`/travel/list?${queryFilters.join("&")}`)
      .then((response) => {
        const data = response.data?.data || [];
        if (page === 0) {
          setTravelStatus(data);
        } else {
          setTravelStatus((prevData) => [...(prevData || []), ...data]);
        }

        setTotal(
          response.data.pageInfo?.length ? response.data.pageInfo[0]?.count : 0
        );
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const openHistory = (item) => {
    props.setTravelDetailsSelected(item);
  };

  const onLoadMore = () => {
    const newPage = page + 1;
    setPage(newPage);
    getHistory(props.textFilter, newPage);
  };

  return (
    <>
      <List>
        {isLoading && page === 0 ? (
          <LoadingListTravel showMoreThanOne={!props.textFilter} />
        ) : (
          <>
            {travelStatus?.map((item, index) => (
              <ItemStatusHistory
                key={`history-${index}-row`}
                onClick={() => openHistory(item)}
                item={item}
              />
            ))}
            {15 * (page + 1) <= total && (
              <ListItem style={{ display: "flex", justifyContent: "center" }}>
                {isLoading ? (
                  <SpinnerThemed
                    style={{ position: "relative" }}
                    status="Primary"
                    size="Small"
                  />
                ) : (
                  <Button size="Small" onClick={onLoadMore}>
                    <FormattedMessage id="load.more" />
                  </Button>
                )}
              </ListItem>
            )}
          </>
        )}
      </List>
    </>
  );
};

const mapStateToProps = (state) => ({
  enterprises: state.enterpriseFilter.enterprises,
  isReady: state.enterpriseFilter.isReady,
  isShowList: state.fleet.isShowList,
  machines: state.fleet.machines,
});

const mapDispatchToProps = (dispatch) => ({
  setTravelDetailsSelected: (travel) => {
    dispatch(setTravelDetailsSelected(travel));
  },
  clearPoints: () => {
    dispatch(clearPoints());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(VoyagesContent);
