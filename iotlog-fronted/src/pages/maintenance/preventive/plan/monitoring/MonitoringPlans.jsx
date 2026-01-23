import React from "react";
import { Card, CardHeader } from "@paljs/ui/Card";
import { FormattedMessage } from "react-intl";
import { Button, EvaIcon, Row } from "@paljs/ui";
import { connect } from "react-redux";
import moment from "moment";
import { useIntl } from "react-intl";
import { toast } from "react-toastify";
import { useSearchParams } from "react-router-dom";
import { Fetch, ListPaginated, SpinnerFull } from "../../../../../components";
import LineMonitoringPlan from "./LineMonitoringPlan";
import ModalFilter from "../ModalFilter";
import ModalEditEventSchedule from "../ModalEditEventSchedule";

const MonitoringPlans = (props) => {

  const filterRef = React.useRef({
    type: "maintenance",
  })

  const [isShowFilter, setIsShowFilter] = React.useState(false);
  const [data, setData] = React.useState();
  const [isLoading, setIsLoading] = React.useState();
  const [selectedItem, setSelectedItem] = React.useState(null);

  const [searchParams, setSearchParams] = useSearchParams();

  const intl = useIntl();

  React.useEffect(() => {
    if (props.isReady && props.enterprises?.length) {
      onPageChanged({
        currentPage: searchParams.get("page") ? parseInt(searchParams.get("page")) : 1,
        pageLimit: searchParams.get("size") ? parseInt(searchParams.get("size")) : 6,
        text: searchParams.get("search")
      });
    }
  }, [props.isReady, props.enterprises]);

  const onFilter = () => {
    setIsShowFilter(false);
    onPageChanged({ currentPage: 1, pageLimit: 5, text: searchParams.get("search") });
  }

  const onChangeFilter = (prop, value) => {
    if (prop === "clear") {
      filterRef.current = {
        type: "maintenance",
      }
      setIsShowFilter(false);
      onPageChanged({ currentPage: 1, pageLimit: 5, text: searchParams.get("search") });
    } else {
      filterRef.current[prop] = value
    }
  }

  const onPageChanged = ({ currentPage, pageLimit, text = "" }) => {

    if (!currentPage || !props.isReady) return;

    const querys = [
      `page=${currentPage - 1}`,
      `size=${pageLimit}`
    ]

    if (text) {
      querys.push(`search=${text}`);
    }
    const idEnterpriseFilter = props.enterprises?.length
      ? props.enterprises[0].id
      : "";
    if (idEnterpriseFilter) {
      querys.push(`idEnterprise=${idEnterpriseFilter}`);
    }

    if (filterRef.current?.filterMachine?.length) {
      filterRef.current?.filterMachine?.forEach(x => {
        querys.push(`idMachine[]=${x.value}`);
      })
    }
    if (filterRef.current?.filterMaintenancePlan?.length) {
      filterRef.current.filterMaintenancePlan.forEach(x => querys.push(`idMaintenancePlan[]=${x.value}`))
    }
    if (filterRef.current?.managers?.length)
      filterRef.current.managers.forEach(x => querys.push(`managers[]=${x.value}`))

    if (filterRef.current?.status)
      querys.push(`status=${filterRef.current.status}`)

    setIsLoading(true);
    Fetch.get(`/maintenancemachine/monitoring?${querys.join('&')}`)
      .then((response) => {
        setData(response.data);
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const renderItem = ({ item, index }) => {
    return (
      <>
        <LineMonitoringPlan onSelectItem={(item) => handleSelectedItem(item)} item={item} history={props.history} />
      </>
    );
  };

  function handleSelectedItem(item) {
    Fetch.get(`/event-schedule?idEnterprise=${props.enterprises[0].id}&idMachine[]=${item.idMachine}&idMaintenancePlan[]=${item.idMaintenancePlan}`)
      .then((response) => {
        const maintenanceWindows = response.data?.map((x) => {
          if (x.eventType === "teamChange") {
            let labelQlp = `${x.qlp?.name} - ${x.qlp?.month}`
            if (x.qlp?.qt)
              labelQlp = `${labelQlp} - ${x.qlp?.qt}`
            return ({
              title: x.machine?.name,
              machine: x.machine,

              date: x.date ? moment(x.date).format("YYYY-MM-DD") : x.date,
              qlp: x.qlp ? { value: x.qlp?.id, label: labelQlp } : null,
              local: x.local,
              idMachine: x.idMachine,
              idEnterprise: x.idEnterprise,
              eventType: { value: x.eventType },

              desc: intl.formatMessage({ id: "event.team.change" }),
              id: x.id,
              allDay: false,
              start: moment(x.date).utc().toDate(),
              end: moment(x.date).utc().toDate(),
            })
          } else {
            const start = x.dateDoneInit
              ? x.dateDoneInit
              : (x.datePlanInit
                ? x.datePlanInit
                : x.dateWindowInit)
            const end = x.dateDoneEnd
              ? x.dateDoneEnd
              : (x.datePlanEnd
                ? x.datePlanEnd
                : x.dateWindowEnd)
            return ({
              title: x.machine?.name,
              machine: x.machine,

              dateDoneInit: x.dateDoneInit ? moment(x.dateDoneInit).format("YYYY-MM-DD") : x.dateDoneInit,
              dateDoneEnd: x.dateDoneEnd ? moment(x.dateDoneEnd).format("YYYY-MM-DD") : x.dateDoneEnd,
              datePlanInit: x.datePlanInit ? moment(x.datePlanInit).format("YYYY-MM-DD") : x.datePlanInit,
              datePlanEnd: x.datePlanEnd ? moment(x.datePlanEnd).format("YYYY-MM-DD") : x.datePlanEnd,
              dateWindowInit: x.dateWindowInit ? moment(x.dateWindowInit).format("YYYY-MM-DD") : x.dateWindowInit,
              dateWindowEnd: x.dateWindowEnd ? moment(x.dateWindowEnd).format("YYYY-MM-DD") : x.dateWindowEnd,
              observation: x.observation,

              desc: x.maintenancePlan?.description,
              idMachine: x.idMachine,
              idMaintenancePlan: x.idMaintenancePlan,
              idEnterprise: x.idEnterprise,
              eventType: x.eventType,

              id: x.id,
              allDay: true,
              start: moment(start).utc().toDate(),
              end: end
                ? moment(end).utc().toDate()
                : moment().utc().toDate(),
            })
          }
        })

        const event = maintenanceWindows.find((event) => event.dateWindowEnd === item.dateWindowEnd.split("T")[0]);

        setSelectedItem(event);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  }

  const onCloseEdit = (isSuccess = false) => {
    if (isSuccess) {
      toast.success(intl.formatMessage({ id: "save.successfull" }));
      onPageChanged({
        currentPage: searchParams.get("page") ? parseInt(searchParams.get("page") ) : 1,
        pageLimit: searchParams.get("size") ? parseInt(searchParams.get("size") ) : 5,
        text: searchParams.get("search") });
    }
    setSelectedItem(null);
  }

  return (
    <>
      <Card>
        <CardHeader>
          <Row between="xs" className="m-0">
            <FormattedMessage id="monitoring.plan.maintenance" />
            <Button
              size="Small"
              status={isShowFilter ? "Info" : "Basic"}
              onClick={() => setIsShowFilter(true)}
              disabled={false}
              className="flex-between"
            >
              <EvaIcon name="funnel" className="mr-1" />
              <FormattedMessage id="filter" />
            </Button>
          </Row>
        </CardHeader>

        <ListPaginated
          data={data?.data}
          totalItems={data?.pageInfo?.length ? (data?.pageInfo[0]?.count ?? 0) : 0}
          renderItem={renderItem}
          onPageChanged={onPageChanged}
          contentStyle={{
            borderLeft: `6px solid #1087DB`,
            justifyContent: "space-between",
          }}
        />
        <SpinnerFull isLoading={isLoading} />
        <ModalFilter
          show={isShowFilter}
          onClose={() => setIsShowFilter(false)}
          idEnterprise={props.enterprises?.length ? props.enterprises[0].id : ""}
          onChangeFilter={onChangeFilter}
          filterData={filterRef.current}
          onFilter={onFilter}
          onlyMaintenance
        />

      {selectedItem && (
        <ModalEditEventSchedule
          event={selectedItem}
          idEnterprise={props.enterprises?.length ? props.enterprises[0].id : ""}
          onClose={onCloseEdit}
        />
      )}
      </Card>
    </>
  );
};

const mapStateToProps = (state) => ({
  enterprises: state.enterpriseFilter.enterprises,
  isReady: state.enterpriseFilter.isReady,
});

export default connect(mapStateToProps, undefined)(MonitoringPlans);
