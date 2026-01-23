import { Button, CardFooter, Checkbox, Col, EvaIcon, Row } from "@paljs/ui";
import moment from "moment";
import React from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import styledComponents from "styled-components";
import { DateTime, Fetch, LabelIcon, Modal, TextSpan } from "../../components";
import { SkeletonThemed } from "../../components/Skeleton";

const Content = styledComponents.div`
  width: 100%;
  height: calc(100vh - 180px);
`

const FilterSearchStatistics = (props) => {
  const { breakPointItens, filterData, onChange, minDateDefault } = props;

  const [isFetching, setIsFetching] = React.useState(false);
  const [listModel, setListModel] = React.useState([]);
  const [isFetchingMachine, setIsFetchingMachine] = React.useState(false);
  const [listMachines, setListMachines] = React.useState([]);

  React.useEffect(() => {
    getMachines(filterData?.filteredModel);
  }, [filterData?.filteredModel]);

  React.useEffect(() => {
    if (props.isReady) {
      getModel();
    }
  }, [props.enterprises]);

  const getModel = () => {
    setIsFetching(true);
    const idEnterpriseFilter = props.enterprises?.length
      ? props.enterprises[0]?.id
      : "";
    Fetch.get(
      `/modelmachine${idEnterpriseFilter ? `?idEnterprise=${idEnterpriseFilter}` : ""
      }`
    )
      .then((res) => {
        setListModel(res.data ?? []);
        setIsFetching(false);
      })
      .catch((e) => {
        setIsFetching(false);
      });
  };

  const getMachines = (filter) => {
    setIsFetchingMachine(true);
    let urlQuery = filter?.map((x, i) => `idModel[]=${x}`)?.join("&");

    const idEnterpriseFilter = props?.enterprises?.length
      ? props?.enterprises[0].id
      : "";

    if (idEnterpriseFilter) {
      urlQuery += `${urlQuery ? "&" : ""}idEnterprise=${idEnterpriseFilter}`;
    }
    Fetch.get(`/machine${urlQuery ? `?${urlQuery}` : ""}`)
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

  const onChangeShowDisable = () => {
    onChange("isShowDisabled", !filterData?.isShowDisabled);
  };

  const onSearch = () => {
    props.onFilter({
      filteredModel: filterData?.filteredModel,
      filteredMachine: filterData?.filteredMachine,
      isShowDisabled: filterData?.isShowDisabled,
      dateMin: filterData?.dateInit
        ? moment(
          `${filterData?.dateInit}${filterData?.timeInit ? `T${filterData?.timeInit}:00` : `T00:00:00${moment().format("Z")}`
          }`
        ).format("YYYY-MM-DDTHH:mm:ssZ")
        : "",
      dateMax: filterData?.dateEnd
        ? moment(
          `${filterData?.dateEnd}${filterData?.timeEnd
            ? `T${filterData?.timeEnd}:59.999`
            : filterData?.dateEnd == moment().format("YYYY-MM-DD")
              ? `T${moment().format("HH:mm:ss")}`
              : `T23:59:59.999`
          }${moment().format("Z")}`
        ).format("YYYY-MM-DDTHH:mm:ssZ")
        : moment().format("YYYY-MM-DDTHH:mm:ssZ"),
      idEnterprise: props.enterprises?.length
        ? props.enterprises[0]?.id
        : undefined,
      isFilterByAdvanced: true
    });
  };

  const onClearSearch = () => {
    props.onClearFilter();
    props.onFilter({
      filteredModel: [],
      filteredMachine: [],
      isShowDisabled: false,
      dateMin: props.minDateDefault ? `${moment(minDateDefault).format("YYYY-MM-DDTHH:mm:ssZ")}` : "",
      dateMax: "",
      isClearing: true
    });
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
        <Content>
          <LabelIcon
            iconName="funnel-outline"
            title={<FormattedMessage id="filter.by.date" />}
          />
          <Row className="w-100">
            <Col breakPoint={{ md: 6 }} className="mb-4">
              <Row>
                <Col breakPoint={{ md: 6 }}>
                  <TextSpan apparence="s2">
                    <FormattedMessage id="date.start" />
                  </TextSpan>
                </Col>
                <Col breakPoint={{ md: 6 }}>
                  <TextSpan apparence="s2">
                    <FormattedMessage id="hour.start" />
                  </TextSpan>
                </Col>
              </Row>
              <div className="mt-1" />
              <DateTime
                onChangeDate={(value) => onChange("dateInit", value)}
                onChangeTime={(value) => onChange("timeInit", value)}
                date={filterData?.dateInit}
                time={filterData?.timeInit}
                max={filterData?.dateEnd}
              />
            </Col>
            <Col breakPoint={{ md: 6 }} className="mb-4">
              <Row>
                <Col breakPoint={{ md: 6 }}>
                  <TextSpan apparence="s2">
                    <FormattedMessage id="date.end" />
                  </TextSpan>
                </Col>
                <Col breakPoint={{ md: 6 }}>
                  <TextSpan apparence="s2">
                    <FormattedMessage id="hour.end" />
                  </TextSpan>
                </Col>
              </Row>
              <div className="mt-1" />
              <DateTime
                onChangeDate={(value) => onChange("dateEnd", value)}
                onChangeTime={(value) => onChange("timeEnd", value)}
                date={filterData?.dateEnd}
                time={filterData?.timeEnd}
                min={filterData?.dateInit}
              />
            </Col>
          </Row>

          <LabelIcon
            iconName="funnel-outline"
            title={<FormattedMessage id="filter.by.model" />}
          />
          <Row className="mb-4 mr-4">
            {isFetching && (
              <div className="ml-4" style={{ width: "100%" }}>
                <Row>
                  <Col
                    breakPoint={breakPointItens || { md: 6 }}
                    className="mb-4"
                  >
                    <SkeletonThemed width={"100%"} />
                  </Col>
                  <Col
                    breakPoint={breakPointItens || { md: 6 }}
                    className="mb-4"
                  >
                    <SkeletonThemed width={"100%"} />
                  </Col>
                  <Col
                    breakPoint={breakPointItens || { md: 6 }}
                    className="mb-4"
                  >
                    <SkeletonThemed width={"100%"} />
                  </Col>
                  <Col
                    breakPoint={breakPointItens || { md: 6 }}
                    className="mb-4"
                  >
                    <SkeletonThemed width={"100%"} />
                  </Col>
                </Row>
              </div>
            )}
            {!isFetching &&
              listModel?.map((modelMachine) => (
                <Col
                  breakPoint={breakPointItens || { md: 6 }}
                  className="mt-3"
                  key={modelMachine.id}
                >
                  <Checkbox
                    checked={filterData?.filteredModel.some(
                      (x) => x === modelMachine.id
                    )}
                    onChange={(e) => onChangeItem(modelMachine.id)}
                  >
                    <TextSpan apparence="s2" style={{ lineHeight: "1.1rem" }}>
                      {modelMachine.description}
                    </TextSpan>
                  </Checkbox>
                </Col>
              ))}
          </Row>
          <LabelIcon
            iconName="funnel-outline"
            title={<FormattedMessage id="filter.by.active" />}
          />

          <Row className="mr-4">
            {isFetchingMachine ? (
              <div className="ml-4" style={{ width: "100%" }}>
                <Row>
                  <Col
                    breakPoint={breakPointItens || { md: 6 }}
                    className="mb-4"
                  >
                    <SkeletonThemed width={"100%"} />
                  </Col>
                  <Col
                    breakPoint={breakPointItens || { md: 6 }}
                    className="mb-4"
                  >
                    <SkeletonThemed width={"100%"} />
                  </Col>
                  <Col
                    breakPoint={breakPointItens || { md: 6 }}
                    className="mb-4"
                  >
                    <SkeletonThemed width={"100%"} />
                  </Col>
                  <Col
                    breakPoint={breakPointItens || { md: 6 }}
                    className="mb-4"
                  >
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
                        breakPoint={breakPointItens || { md: 6 }}
                        className="mt-3"
                        key={`l_filter_${machine.id}`}
                      >
                        <Checkbox
                          checked={filterData?.filteredMachine.some(
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
          <LabelIcon
            className="mt-4"
            iconName="eye-outline"
            title={<FormattedMessage id="display" />}
          />
          <Row className="pl-3 mr-4 pb-4">
            <Checkbox
              checked={filterData?.isShowDisabled}
              onChange={(e) => onChangeShowDisable()}
            >
              <TextSpan apparence="s2" style={{ lineHeight: "1.1rem" }}>
                <FormattedMessage id="display.disabled" />
              </TextSpan>
            </Checkbox>
          </Row>
        </Content>
      </Modal>
    </>
  );
};

const mapStateToProps = (state) => ({
  enterprises: state.enterpriseFilter.enterprises,
  isReady: state.enterpriseFilter.isReady,
});

export default connect(mapStateToProps, undefined)(FilterSearchStatistics);
