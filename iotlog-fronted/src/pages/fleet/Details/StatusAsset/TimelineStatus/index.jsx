import React from "react";
import { nanoid } from "nanoid";
import styled, { css, useTheme } from "styled-components";
import { FormattedMessage, useIntl } from "react-intl";
import { connect } from "react-redux";
import { Button, Spinner } from "@paljs/ui";
import ReactCountryFlag from "react-country-flag";
import { Fetch, TextSpan } from "../../../../../components";
import { IconBorder } from "../../../../../components/Icons/IconRounded";
import { getIcon } from "./IconTimelineStatus";
import { DateTimeDifference } from "./DateTimeDifference";
import LoadingTimeline from "./LoadingTimeline";
import { setTimelineSelected } from "../../../../../actions";
import { v4 as uuidv4 } from 'uuid';
import TimelineFilter from "./TimelineFilter";
import moment from "moment";

const Item = styled.li`
  ${({ theme, isSelected = false, color = "", noLine = false }) => css`
    ${!noLine
      ? `border-left: 2px solid ${color ?? theme.colorBasicFocusBorder};`
      : `border-left: 2px solid ${theme.backgroundBasicColor1};`}
    ${isSelected && ` background-color: ${theme.backgroundBasicColor2}; `}
  `}
  list-style: none;
  cursor: pointer;
`;

const ContainerIcon = styled.div`
  position: absolute;
  margin-left: -1.8rem;
`;

const RowCenter = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SpinnerStyled = styled(Spinner)`
  ${({ theme }) => css`
    background-color: transparent;
    position: relative;
  `}
`;

const DataTimelineStatus = (props) => {
  const { idMachine } = props;

  const [isLoading, setIsLoading] = React.useState(false);
  const [data, setData] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [max, setMax] = React.useState(0);
  const [filterDates, setFilterDates] = React.useState(null);
  const [filteredMin, setFilteredMin] = React.useState(moment().subtract(2, 'days').startOf('day').format("YYYY-MM-DDTHH:mm:ssZ"));
  const [filteredMax, setFilteredMax] = React.useState(moment().endOf('day').format("YYYY-MM-DDTHH:mm:ssZ"));

  const theme = useTheme();
  const intl = useIntl();

  React.useEffect(() => {
    if (idMachine) getData(idMachine, 0, {
      dateMin: filteredMin,
      dateMax: filteredMax,
    });
    else setData([]);
    return () => {
      setData([]);
      setPage(0);
    };
  }, [idMachine]);

  const getData = (idMachine, page, dates = null) => {
    const idEnterprise = props.enterprises?.length
      ? props.enterprises[0].id
      : localStorage.getItem("id_enterprise_filter");
    setIsLoading(true);

    const dateParams = dates || filterDates;
    let url = `/machineevent/timeline?idMachine=${idMachine}&idEnterprise=${idEnterprise}&page=${page}&size=10`;

    if (dateParams?.dateMin) {
      url += `&min=${dateParams.dateMin}`;
    }
    if (dateParams?.dateMax) {
      url += `&max=${dateParams.dateMax}`;
    }

    Fetch.get(url)
      .then((response) => {
        setData((prevState) => [
          ...prevState,
          ...(response.data?.data || []),
        ])
        setMax(
          response.data?.pageInfo?.length
            ? response.data?.pageInfo[0]?.count || 0
            : 0
        );
        setPage(page);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  const getUniques = (statusList) => {
    if (!statusList?.length) return [];

    let currentStatus = null;

    const newList = [];

    const statusListSorted = statusList?.sort((a, b) => new Date(b.data.dateTimeStart).getTime() - new Date(a.data.dateTimeStart).getTime());

    for (const itemCurrent of statusListSorted) {
      if (!currentStatus) {
        currentStatus = itemCurrent.data.status;
        newList.push(itemCurrent);
        continue;
      }

      if (currentStatus === itemCurrent.data.status) {
        const lastItem = newList[newList.length - 1];
        lastItem.data.dateTimeStart = itemCurrent.data.dateTimeStart;
        continue;
      }

      if (currentStatus !== itemCurrent.data.status) {
        currentStatus = itemCurrent.data.status;
        newList.push(itemCurrent);
      }
    }

    return newList;
  }

  const getStateName = (x) => {
    if (Number.isInteger(x.proximity?.state?.code)) return x.proximity?.state?.name;
    return x.proximity?.state?.code ?? x.proximity?.state?.name;
  }

  const handleFilter = (dates) => {
    setFilterDates(dates);
    setData([]);
    setPage(0);
    getData(idMachine, 0, dates);
  };

  const handleClearFilter = () => {
    setFilteredMin(undefined);
    setFilteredMax(undefined);
    setFilterDates(null);
    setData([]);
    setPage(0);
    getData(idMachine, 0, null);
  };

  const isShowLoadMore = data?.length < max;

  return (
    <>
      {isLoading && !data?.length ? (
        <LoadingTimeline />
      ) : (
        <>
          <TimelineFilter
            onFilter={handleFilter}
            onClear={handleClearFilter}
            filteredMin={filteredMin}
            filteredMax={filteredMax}
            setFilteredMin={setFilteredMin}
            setFilteredMax={setFilteredMax}
          />
          <div className="pl-4 pt-4 ml-2 mt-2">
            {getUniques(data)?.map((x, i) => {
              const iconProps = getIcon(x.data?.status, theme);
              const isSelected = x?.id === props?.eventTimelineSelect?.id;
              return (
                <Item
                  noLine={i === data.length - 1}
                  isSelected={isSelected}
                  key={nanoid()}
                  color={iconProps.bgColor}
                  className="pl-4 pb-4"
                  onClick={() => props.setTimelineSelected(isSelected ? undefined : x)}
                >
                  <ContainerIcon>
                    <IconBorder
                      borderColor={iconProps.bgColor}
                      color={iconProps.bgColor}
                      style={{ padding: 1 }}
                    >
                      {iconProps.component}
                    </IconBorder>
                  </ContainerIcon>
                  <div className="col-flex pb-4 pl-2">
                    <TextSpan
                      apparence="c3"
                      hint
                      style={{ textTransform: "uppercase" }}
                    >
                      {intl.formatMessage({ id: iconProps.text })}
                    </TextSpan>
                    {x.geofence && (
                      <TextSpan apparence="s2">{`${x.geofence.description} ${x.geofence.code ? `(${x.geofence.code})` : ""
                        }`}</TextSpan>
                    )}
                    {x.platform && (
                      <TextSpan apparence="s2">{`${x.platform.name} ${x.platform.acronym ? `(${x.platform.acronym})` : ""
                        }`}</TextSpan>
                    )}
                    {x.proximity && (
                      <TextSpan apparence="s2">{`${x.proximity?.name} - ${getStateName(x)} (${x.proximity?.country?.code})`}
                        <ReactCountryFlag
                          countryCode={x.proximity?.country?.code}
                          svg
                          style={{ marginLeft: 5, marginRight: 3, marginTop: -3, fontSize: "1.4em", borderRadius: 4 }} />
                      </TextSpan>
                    )}
                    <DateTimeDifference
                      start={x.data?.dateTimeStart}
                      end={x.data?.dateTimeEnd}
                    />
                  </div>
                </Item>
              );
            })}
          </div>
          {isShowLoadMore && (
            <RowCenter>
              {isLoading ? (
                <SpinnerStyled />
              ) : (
                <Button
                  size="Small"
                  onClick={() => getData(idMachine, page + 1)}
                >
                  <FormattedMessage id="load.more" />
                </Button>
              )}
            </RowCenter>
          )}
        </>
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  eventTimelineSelect: state.fleet.eventTimelineSelect,
  enterprises: state.enterpriseFilter.enterprises,
});

const mapDispatchToProps = (dispatch) => ({
  setTimelineSelected: (eventTimelineSelect) => {
    dispatch(setTimelineSelected(eventTimelineSelect));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(DataTimelineStatus);

