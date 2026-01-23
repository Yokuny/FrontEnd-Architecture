import { Button, Col, EvaIcon, Row, Select } from "@paljs/ui";
import React from "react";
import { useIntl } from "react-intl";
import { connect } from "react-redux";
import {
  Fetch,
  ListPaginatedNoQueryParams,
  SelectMachine,
  SpinnerFull,
} from "../../components";
import moment from "moment";
import InputDateTime from "../Inputs/InputDateTime";
import { useSearchParams } from "react-router-dom";

const FilterAvanced = (props) => {
  const [data, setData] = React.useState();
  const [isLoading, setIsLoading] = React.useState();
  const [ready, setReady] = React.useState(false);
  const [machine, setMachine] = React.useState();
  const [serviceDate, setserviceDate] = React.useState();
  const [status, setstatus] = React.useState();
  const [searchParams, setSearchParams] = useSearchParams();
  const intl = useIntl();


  React.useEffect(() => {
    if (ready && props.enterprises?.length && props.filterEnterprise) {
      onPageChanged({ currentPage: 1, pageLimit: 5 });
    }
  }, [ready, props.enterprises]);

  const onPageChanged = ({
    currentPage,
    pageLimit,
    text = "",
    reset = false,
  }) => {
    if (!currentPage) return;
    let url = `${props.pathUrlSearh}&page=${currentPage - 1}&size=${pageLimit}`;

    if (!reset) {
      if (props.isFilterAdvanced) {
        machine?.value && (url += `&vessel=${machine?.value}`);
        serviceDate && (url += `&date=${serviceDate}`);
        status?.value && status?.value !== "all" && (url += `&status=${status?.value}`);
      }
      if (searchParams.get("search") && !props.isFilterAdvanced) {
        url += `&name=${searchParams.get("search")}`
      }
      if (text) {
        url += `&search=${text}`;
      }
    }

    const idEnterpriseFilter = localStorage.getItem("id_enterprise_filter");
    if (props.filterEnterprise && idEnterpriseFilter) {
      url += `&idEnterprise=${idEnterpriseFilter}`;
    }
    setIsLoading(true);
    Fetch.get(url)
      .then((response) => {
        setData(response.data);
        setIsLoading(false);
        setReady(true);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const renderFilter = () => {
    const optionsStatus = [
      {
        value: "awaiting.create.confirm",
        label: intl.formatMessage({ id: "awaiting.create.confirm" }),
        type: [String],
      },
      {
        value: "awaiting.request",
        label: intl.formatMessage({ id: "awaiting.request" }),
        type: [String],
      },
      {
        value: "supplier.canceled",
        label: intl.formatMessage({ id: "supplier.canceled" }),
        type: [String],
      },
      {
        value: "awaiting.buy.request",
        label: intl.formatMessage({ id: "awaiting.buy.request" }),
        type: [String],
      },
      {
        value: "awaiting.collaborators",
        label: intl.formatMessage({ id: "awaiting.collaborators" }),
        type: [String],
      },
      {
        value: "confirm.bms",
        label: intl.formatMessage({ id: "confirm.bms" }),
        type: [String],
      },
      {
        value: "confirm.order",
        label: intl.formatMessage({ id: "confirm.order" }),
        type: [String],
      },
      {
        value: "awaiting.bms.confirm",
        label: intl.formatMessage({ id: "awaiting.bms.confirm" }),
        type: [String],
      },
      {
        value: "awaiting.contract.validation",
        label: intl.formatMessage({ id: "awaiting.contract.validation" }),
        type: [String],
      },
      {
        value: "awaiting.sap",
        label: intl.formatMessage({ id: "awaiting.sap" }),
        type: [String],
      },
      {
        value: "awaiting.bms",
        label: intl.formatMessage({ id: "awaiting.bms" }),
        type: [String],
      },
      {
        value: "awaiting.payment",
        label: intl.formatMessage({ id: "awaiting.payment" }),
        type: [String],
      },
      {
        value: "awaiting.invoice",
        label: intl.formatMessage({ id: "awaiting.invoice" }),
        type: [String],
      },
      {
        value: "fas.closed",
        label: intl.formatMessage({ id: "fas.closed" }),
        type: [String],
      },
      {
        value: "awaiting.rating",
        label: intl.formatMessage({ id: "awaiting.rating" }),
        type: [String],
      },
      {
        value: "cancelled",
        label: intl.formatMessage({ id: "cancelled" }),
        type: [String],
      },
    ];


    return (
      <>
        <Row middle="xs">
          <Col breakPoint={{ md: 4 }}>
            <SelectMachine
              value={machine}
              onChange={(value) => setMachine(value)}
              placeholder={"vessel"}
            />
          </Col>
          <Col breakPoint={{ md: 3 }}>
            <InputDateTime
              onlyDate={true}
              onChange={(value) => setserviceDate(moment(value).format('YYYY-MM-DD'))}
              value={serviceDate}
            />
          </Col>
          <Col breakPoint={{ md: 4 }}>
            <Select
              options={optionsStatus}
              placeholder={intl.formatMessage({
                id: "status",
              })}
              onChange={(value) => setstatus(value)}
              value={status}
              isClearable
            />
          </Col>
          <Col breakPoint={{ md: 1 }}>
            <Button
              size="Tiny"
              status="Info"
              onClick={() => onPageChanged({ currentPage: 1, pageLimit: 5 })}
            >
              <EvaIcon name="search" />
            </Button>
          </Col>
        </Row>
      </>
    );
  };

  return (
    <>
      <ListPaginatedNoQueryParams
        data={data?.data}
        totalItems={data?.pageInfo[0]?.count}
        renderItem={props.renderItem}
        onPageChanged={onPageChanged}
        contentStyle={props.contentStyle}
        renderHeader={props.isFilterAdvanced && renderFilter}
      />
      <SpinnerFull isLoading={isLoading} />
    </>
  );
};

const mapStateToProps = (state) => ({
  enterprises: state.enterpriseFilter.enterprises,
  isReady: state.enterpriseFilter.isReady,
});

export default connect(mapStateToProps, undefined)(FilterAvanced);
