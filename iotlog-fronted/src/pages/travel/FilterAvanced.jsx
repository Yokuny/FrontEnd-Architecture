import { Button, Col, EvaIcon, Row, Select } from "@paljs/ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { connect } from "react-redux";
import moment from "moment";
import {
  DateTime,
  Fetch,
  LabelIcon,
  ListPaginated,
  SelectMachineEnterprise,
  SpinnerFull,
} from "../../components";
import { TYPE_TRAVEL } from "../../constants";
import KPIsTravel from "./KPIsTravel";
import { useSearchParams } from "react-router-dom";
import KPIsTravelNew from "./KPIsTravelNew";

const FilterAvanced = (props) => {
  const [data, setData] = React.useState();
  const [isLoading, setIsLoading] = React.useState();
  const [machine, setMachine] = React.useState();
  const [typeTravel, setTypeTravel] = React.useState();
  const [statusTravel, setStatusTravel] = React.useState();
  const [dateInit, setDateInit] = React.useState();
  const [dateEnd, setDateEnd] = React.useState();

  const [searchParams] = useSearchParams();

  const size = Number(searchParams.get("size") || 5);
  const currentPage = Number(searchParams.get("page") || 1);

  const intl = useIntl();

  React.useEffect(() => {
    if (props.isReady && props.enterprises?.length && props.filterEnterprise) {
      onPageChanged({});
    }
  }, [props.isReady, props.enterprises]);

  const onPageChanged = ({
    text = "",
    reset = false,
  }) => {
    if (!currentPage) return;
    let url = `${props.pathUrlSearh}?page=${currentPage - 1}&size=${size}`;

    if (!reset) {
      if (machine?.length) {
        machine.forEach((element) => {
          url += `&idMachine[]=${element.value}`;
        });
      }

      typeTravel?.value &&
        typeTravel?.value !== "all" &&
        (url += `&travelType=${typeTravel?.value}`);
      statusTravel?.value &&
        statusTravel?.value !== "all" &&
        (url += `&statusTravel=${statusTravel?.value}`);

      if (text?.trim()) {
        url += `&search=${text?.trim()}`;
      }
    }

    const idEnterpriseFilter = localStorage.getItem("id_enterprise_filter");
    if (props.filterEnterprise && idEnterpriseFilter) {
      url += `&idEnterprise=${idEnterpriseFilter}`;
    }

    if (dateInit) {
      url += `&dateInit=${dateInit}`;
    }

    if (dateEnd) {
      url += `&dateEnd=${dateEnd}`;
    }

    url += `&showAnalytics=true`;

    setIsLoading(true);
    Fetch.get(url)
      .then((response) => {
        setData(response.data);
        props.onFilter(response.data.all)
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const renderFilter = () => {

    const idEnterprise = props.enterprises?.length
      ? props.enterprises[0]?.id
      : undefined;

    const optionsTypeTravel = [
      {
        value: "all",
        label: intl.formatMessage({ id: "all" }),
      },
      {
        value: TYPE_TRAVEL.TRAVEL,
        label: intl.formatMessage({ id: TYPE_TRAVEL.TRAVEL }),
      },
      {
        value: TYPE_TRAVEL.MANEUVER,
        label: intl.formatMessage({ id: 'in.port' }),
      },
    ];

    const optionsStatusTravel = [
      {
        value: "all",
        label: intl.formatMessage({ id: "all" }),
        type: [TYPE_TRAVEL.TRAVEL, TYPE_TRAVEL.MANEUVER],
      },
      {
        value: "in_travel",
        label: intl.formatMessage({ id: "in.travel" }),
        type: [TYPE_TRAVEL.TRAVEL],
      },
      {
        value: "finished_travel",
        label: intl.formatMessage({ id: "finished.travel" }),
        type: [TYPE_TRAVEL.TRAVEL],
      },
    ];

    return (
      <>
        <Row middle="xs" center="xs">
          <Col breakPoint={{ md: 10 }}>
            <Row className="m-0">
              <Col breakPoint={{ md: 6 }} className="mb-2">
                <LabelIcon
                  title={<FormattedMessage id="vessel" />}
                  iconName="navigation-2-outline"
                />
                <SelectMachineEnterprise
                  value={machine}
                  onChange={(value) => setMachine(value)}
                  placeholder={"vessels"}
                  idEnterprise={idEnterprise}
                  isMulti
                />
              </Col>
              <Col breakPoint={{ md: 3 }} className="mb-2">
                <LabelIcon
                  title={<FormattedMessage id="type" />}
                  iconName="pin-outline"
                />
                <Select
                  options={optionsTypeTravel}
                  placeholder={intl.formatMessage({
                    id: "type",
                  })}
                  onChange={(value) => setTypeTravel(value)}
                  value={typeTravel}
                  isClearable
                />
              </Col>
              <Col breakPoint={{ md: 3 }} className="mb-2">
                <LabelIcon
                  title={<FormattedMessage id="status" />}
                  iconName="alert-circle-outline"
                />
                <Select
                  options={
                    typeTravel?.value
                      ? optionsStatusTravel.filter((x) =>
                        x.type.includes(typeTravel.value)
                      )
                      : optionsStatusTravel
                  }
                  placeholder={intl.formatMessage({
                    id: "status",
                  })}
                  onChange={(value) => setStatusTravel(value)}
                  value={statusTravel}
                  isClearable
                />
              </Col>

              <Col breakPoint={{ md: 6 }} className="mb-2">
                <LabelIcon
                  title={<FormattedMessage id="date.start" />}
                  iconName="calendar-outline"
                />
                <DateTime
                  onlyDate
                  value={dateInit}
                  max={dateEnd}
                  onChangeDate={(value) => setDateInit(value)}
                />
              </Col>
              <Col breakPoint={{ md: 6 }} className="mb-2">
                <LabelIcon
                  title={<FormattedMessage id="date.end" />}
                  iconName="calendar-outline"
                />
                <DateTime
                  onlyDate
                  min={dateInit}
                  max={moment().format("YYYY-MM-DD")}
                  value={dateEnd}
                  onChangeDate={(value) => setDateEnd(value)}
                />
              </Col>
            </Row>
          </Col>
          <Col breakPoint={{ md: 2 }}>
            <Row className="m-0" middle="xs" center="xs">
              <Button
                size="Tiny"
                status="Info"
                className="flex-between"
                onClick={() => onPageChanged({ currentPage: 1, pageLimit: 5 })}
              >
                <EvaIcon name="search" />
                <FormattedMessage id="filter" />
              </Button>
            </Row>
          </Col>
        </Row>
      </>
    );
  };

  const idEnterprise = props.enterprises?.length
    ? props.enterprises[0]?.id
    : undefined;

  return (
    <>
      <ListPaginated
        data={data?.data}
        totalItems={data?.pageInfo?.length ? data?.pageInfo[0]?.count : 0}
        renderItem={props.renderItem}
        onPageChanged={onPageChanged}
        contentStyle={props.contentStyle}
        renderHeader={props.isFilterAdvanced && renderFilter}
      >
        {!isLoading && <>
        <div className="mt-3"></div>
        {idEnterprise === "66522106-ccb4-4508-a90b-c1486d95cb78" ||
        idEnterprise === "9f2c962b-c214-46cf-9403-6de812dc86df"
          ? <KPIsTravelNew
            idEnterprise={idEnterprise}
          />
          : <KPIsTravel
            data={data?.analytics}
          />}
        <div className="mt-1"></div></>}
      </ListPaginated>
      <SpinnerFull isLoading={isLoading} />
    </>
  );
};

const mapStateToProps = (state) => ({
  enterprises: state.enterpriseFilter.enterprises,
  isReady: state.enterpriseFilter.isReady,
});

export default connect(mapStateToProps, undefined)(FilterAvanced);
