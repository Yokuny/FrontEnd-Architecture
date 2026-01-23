import {
  Button,
  CardFooter,
  Checkbox,
  Col,
  EvaIcon,
  Radio,
  Row,
} from "@paljs/ui";
import moment from "moment";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { connect } from "react-redux";
import styled from "styled-components";
import {
  DateTime,
  Fetch,
  LabelIcon,
  Modal,
  TextSpan,
} from "../../../../components";
import { SkeletonThemed } from "../../../../components/Skeleton";

const RowScroll = styled.div`
  width: 100%;
  height: calc(100vh - 180px);
`;

const optionsUnit = [
  {
    value: "m³",
    label: "m³",
  },
  {
    value: "L",
    label: "L",
  },
  {
    value: "T",
    label: "T",
  },
];

const ModalFilter = (props) => {
  const { filterData, onChange, noFilterModel, noFilterMachine } = props;

  const intl = useIntl();

  const optionsDate = [
    {
      value: "1m",
      label: intl.formatMessage({ id: "in.month" }),
    },
    {
      value: "2m",
      label: intl.formatMessage({ id: "last.months" }).replace("{0}", "2"),
    },
    {
      value: "3m",
      label: intl.formatMessage({ id: "last.months" }).replace("{0}", "3"),
    },
    {
      value: "6m",
      label: intl.formatMessage({ id: "last.months" }).replace("{0}", "6"),
    },
    {
      value: "12m",
      label: intl.formatMessage({ id: "last.months" }).replace("{0}", "12"),
    },
  ];

  const [isFetching, setIsFetching] = React.useState(false);
  const [listModel, setListModel] = React.useState([]);
  const [isFetchingMachine, setIsFetchingMachine] = React.useState(false);
  const [listMachines, setListMachines] = React.useState([]);

  React.useEffect(() => {
    if (props.isReady && !noFilterMachine) {
      getMachines(filterData?.filteredModel, props.enterprises);
    }
  }, [
    filterData?.filteredModel,
    props.enterprises,
    props.isReady,
    noFilterMachine,
  ]);

  React.useLayoutEffect(() => {
    if (props.isReady && !noFilterModel) {
      getModel(props.enterprises);
    }
  }, [props.enterprises, props.isReady, noFilterModel]);

  const getModel = (enterprises) => {
    setIsFetching(true);
    setIsFetchingMachine(true);
    let urlQuery = [];
    if (enterprises?.length) {
      urlQuery.push(`idEnterprise=${enterprises[0].id}`);
    }
    Fetch.get(`/modelmachine?${urlQuery.join("&")}`)
      .then((res) => {
        setListModel(res.data ?? []);
        setIsFetching(false);
      })
      .catch((e) => {
        setIsFetching(false);
      });
  };

  const getMachines = (filter, enterprises) => {
    setIsFetchingMachine(true);
    let urlQuery = filter?.map((x, i) => `idModel[]=${x}`) || [];
    if (enterprises?.length) {
      urlQuery.push(`idEnterprise=${enterprises[0].id}`);
    }
    Fetch.get(`/machine?${urlQuery?.join("&")}`)
      .then((res) => {
        setListMachines(res.data);
        setIsFetchingMachine(false);
      })
      .catch((e) => {
        setIsFetchingMachine(false);
      });
  };

  const onChangeItem = (id) => {
    const toUpdate = filterData?.filteredModel?.some((x) => x === id)
      ? filterData?.filteredModel.filter((x) => x !== id)
      : [...(filterData?.filteredModel || []), id];
    onChange("filteredModel", toUpdate);
  };

  const onChangeMachineItem = (id) => {
    const toUpdate = filterData?.filteredMachine?.some((x) => x === id)
      ? filterData?.filteredMachine.filter((x) => x !== id)
      : [...(filterData?.filteredMachine || []), id];
    onChange("filteredMachine", toUpdate);
  };

  const onSearch = () => {
    props.onFilter({
      filteredModel: filterData?.filteredModel,
      filteredMachine: filterData?.filteredMachine,
      dateMin: filterData?.dateInit,
      dateMax: filterData?.dateEnd,
      idEnterprise: props.enterprises?.length
        ? props.enterprises[0]?.id
        : undefined,
      unit: filterData?.unit,
      period: filterData?.dateFilter,
    });
    props.onClose();
  };

  const onClearSearch = () => {
    props.onFilter({
      filteredModel: [],
      filteredMachine: [],
      dateMin: "",
      dateMax: "",
      isClearing: true,
      unit: filterData?.unit,
      period: filterData?.dateFilter,
      idEnterprise: props.enterprises?.length
        ? props.enterprises[0]?.id
        : undefined,
    });
    props.onClose();
  };

  const isFiltered =
    filterData?.filteredModel?.length ||
    filterData?.filteredMachine?.length ||
    filterData?.dateInit ||
    filterData?.dateEnd;

  return (
    <>
      <Modal
        title="filter"
        onClose={props.onClose}
        show={props.show}
        styleContent={{ maxHeight: "calc(100vh - 220px)" }}
        size="Large"
        renderFooter={() => (
          <CardFooter>
            <Row end={!isFiltered && true} between={isFiltered && true}>
              {isFiltered && (
                <Button
                  size="Small"
                  status="Danger"
                  appearance="ghost"
                  onClick={onClearSearch}
                  style={{ lineHeight: 0.6 }}
                  disabled={isFetching || isFetchingMachine}
                  className="mr-3 flex-between"
                >
                  <EvaIcon name="close-circle" className="mr-1" />
                  <FormattedMessage id="clear.filter" />
                </Button>
              )}
              <Button
                size="Small"
                status="Success"
                onClick={onSearch}
                style={{ lineHeight: 0.6 }}
                disabled={isFetching || isFetchingMachine}
                className="mr-1 flex-between"
              >
                <EvaIcon name="funnel" className="mr-1" />
                <FormattedMessage id="filter" />
              </Button>
            </Row>
          </CardFooter>
        )}
      >
        <RowScroll>
          <LabelIcon
            iconName="droplet-outline"
            title={<FormattedMessage id="unit" />}
          />
          <Row>
            <Radio
              key={"rd_unit"}
              className="ml-3"
              name="rd_unit"
              onChange={(value) => onChange("unit", value)}
              status="Info"
              options={optionsUnit?.map((x) => ({
                ...x,
                checked: !!(x.value === filterData?.unit),
              }))}
            />
          </Row>
          <div className="mt-2"></div>
          <LabelIcon
            iconName="funnel-outline"
            title={<FormattedMessage id="period" />}
          />
          <Row>
            <Radio
              className="ml-3"
              key={"rd_periodo"}
              name={"rd_periodo"}
              onChange={(value) => {
                onChange("dateFilter", value);
                onChange("dateInit", "");
                onChange("dateEnd", "");
              }}
              options={optionsDate?.map((x) => ({
                ...x,
                checked: !!(x.value == filterData?.dateFilter),
              }))}
            />
          </Row>
          <div className="mt-2"></div>

          <LabelIcon
            iconName="funnel-outline"
            title={<FormattedMessage id="filter.by.date" />}
          />
          <Row style={{ width: "100%" }}>
            <Col breakPoint={{ md: 6, is: 12 }} className="mb-4">
              <Row>
                <Col breakPoint={{ md: 6, is: 12 }}>
                  <TextSpan apparence="s2">
                    <FormattedMessage id="date.start" />
                  </TextSpan>
                </Col>
                {/* <Col breakPoint={{ md: 6, is: 6 }}>
                  <TextSpan apparence="s2">
                    <FormattedMessage id="hour.start" />
                  </TextSpan>
                </Col> */}
              </Row>
              <div className="mt-1" />
              <DateTime
                onChangeDate={(value) => onChange("dateInit", value)}
                // onChangeTime={(value) => onChange("timeInit", value)}
                date={filterData?.dateInit}
                onlyDate
                // time={filterData?.timeInit}
                max={filterData?.dateEnd}
              />
            </Col>
            <Col breakPoint={{ md: 6, is: 12 }} className="mb-4">
              <Row>
                <Col breakPoint={{ md: 6, is: 12 }}>
                  <TextSpan apparence="s2">
                    <FormattedMessage id="date.end" />
                  </TextSpan>
                </Col>
                {/* <Col breakPoint={{ md: 6, is: 6 }}>
                  <TextSpan apparence="s2">
                    <FormattedMessage id="hour.end" />
                  </TextSpan>
                </Col> */}
              </Row>
              <div className="mt-1" />
              <DateTime
                onChangeDate={(value) => onChange("dateEnd", value)}
                // onChangeTime={(value) => onChange("timeEnd", value)}
                date={filterData?.dateEnd}
                // time={filterData?.timeEnd}
                onlyDate
                min={filterData?.dateInit}
              />
            </Col>
          </Row>

          {!noFilterModel && (
            <>
              <LabelIcon
                iconName="funnel-outline"
                title={<FormattedMessage id="filter.by.model" />}
              />
              <Row className="mb-4 mr-4">
                {isFetching && (
                  <div className="ml-4" style={{ width: "100%" }}>
                    <Row>
                      <Col breakPoint={{ md: 3, is: 6 }} className="mb-4">
                        <SkeletonThemed width={"100%"} />
                      </Col>
                      <Col breakPoint={{ md: 3, is: 6 }} className="mb-4">
                        <SkeletonThemed width={"100%"} />
                      </Col>
                      <Col breakPoint={{ md: 3, is: 6 }} className="mb-4">
                        <SkeletonThemed width={"100%"} />
                      </Col>
                      <Col breakPoint={{ md: 3, is: 6 }} className="mb-4">
                        <SkeletonThemed width={"100%"} />
                      </Col>
                    </Row>
                  </div>
                )}
                {!isFetching &&
                  listModel?.map((modelMachine) => (
                    <Col
                      breakPoint={{ md: 3, is: 6 }}
                      className="mt-3"
                      key={modelMachine.id}
                    >
                      <Checkbox
                        checked={filterData?.filteredModel?.some(
                          (x) => x === modelMachine.id
                        )}
                        onChange={(e) => onChangeItem(modelMachine.id)}
                      >
                        <TextSpan
                          apparence="s2"
                          style={{ lineHeight: "1.1rem" }}
                        >
                          {modelMachine.description}
                        </TextSpan>
                      </Checkbox>
                    </Col>
                  ))}
              </Row>
            </>
          )}

          {!noFilterMachine && (
            <>
              <LabelIcon
                iconName="funnel-outline"
                title={<FormattedMessage id="filter.by.active" />}
              />

              <Row className="mr-4">
                {isFetchingMachine ? (
                  <div className="ml-4" style={{ width: "100%" }}>
                    <Row>
                      <Col breakPoint={{ md: 3, is: 6 }} className="mb-4">
                        <SkeletonThemed width={"100%"} />
                      </Col>
                      <Col breakPoint={{ md: 3, is: 6 }} className="mb-4">
                        <SkeletonThemed width={"100%"} />
                      </Col>
                      <Col breakPoint={{ md: 3, is: 6 }} className="mb-4">
                        <SkeletonThemed width={"100%"} />
                      </Col>
                      <Col breakPoint={{ md: 3, is: 6 }} className="mb-4">
                        <SkeletonThemed width={"100%"} />
                      </Col>
                    </Row>
                  </div>
                ) : (
                  <>
                    {!!listMachines?.length ? (
                      <>
                        {listMachines?.map((machine) => (
                          <Col
                            breakPoint={{ md: 3, is: 6 }}
                            className="mt-3"
                            key={`l_filter_${machine.id}`}
                          >
                            <Checkbox
                              checked={filterData?.filteredMachine?.some(
                                (x) => x === machine.id
                              )}
                              onChange={(e) => onChangeMachineItem(machine.id)}
                            >
                              <TextSpan
                                apparence="s2"
                                style={{ lineHeight: "1.1rem" }}
                              >
                                {machine.name}
                              </TextSpan>
                            </Checkbox>
                          </Col>
                        ))}
                      </>
                    ) : (
                      <>
                        <Col breakPoint={{ md: 12 }}>
                          <TextSpan apparence="s3">
                            <FormattedMessage id="not.found" />
                          </TextSpan>
                        </Col>
                      </>
                    )}
                  </>
                )}
              </Row>
            </>
          )}
        </RowScroll>
      </Modal>
    </>
  );
};

const mapStateToProps = (state) => ({
  enterprises: state.enterpriseFilter.enterprises,
  isReady: state.enterpriseFilter.isReady,
});

export default connect(mapStateToProps, undefined)(ModalFilter);
