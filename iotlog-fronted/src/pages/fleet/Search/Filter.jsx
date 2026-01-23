import { Badge, Button, Col, EvaIcon, InputGroup, Tooltip } from "@paljs/ui";
import React, { useEffect } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { connect } from "react-redux";
import styled from "styled-components";
import { debounce } from "underscore";
import { setIsShowList } from "../../../actions";
import FilterSearch from "../Status/FilterSearch";

const ContainerIcon = styled.a`
  position: absolute;
  right: 15px;
  top: 10px;
  cursor: pointer;
`;

const Container = styled.div`
  display: flex;
`;

const Filter = (props) => {
  const intl = useIntl();
  const refSearch = React.useRef();

  const {
    defaultValue,
    filterFind,
    setFilterFind,
    setTextFilter,
    setShowListFilter,
    showListFilter,
    setBtnEvent,
  } = props;

  useEffect(() => {
    refSearch.current.value = defaultValue;
  }, [defaultValue])

  const changeValueDebounced = debounce((text) => {
    setTextFilter(text);
  }, 500);

  const filterItens = (filters) => {
    setShowListFilter(false);
    setFilterFind(filters);
  };

  const isFiltered =
    !!filterFind?.filteredMachine?.length ||
    !!filterFind?.filteredModel?.length;

  return (
    <>
      <Container className="pt-4 pl-4">
        {!showListFilter ? (
          <>
            <div style={{ width: "100%" }}>
              <InputGroup fullWidth>
                <input
                  ref={refSearch}
                  placeholder={intl.formatMessage({ id: "search" })}
                  type="text"
                  onChange={(e) => changeValueDebounced(e.target.value)}
                />
                <ContainerIcon>
                  <EvaIcon name="search-outline" status="Basic" />
                </ContainerIcon>
              </InputGroup>
            </div>
            {props.children}
          </>
        ) : (
          <Col className="col-flex" style={{ padding: 0, margin: 0 }}>
            <Button
              size="Tiny"
              style={{ paddingTop: 2, paddingBottom: 2 }}
              status="Info"
              appearance="ghost"
              className="mr-4 row-flex-center"
              onClick={() => setShowListFilter(false)}
            >
              <EvaIcon name="arrow-ios-back-outline" />
              <FormattedMessage id="back.to.list" />
            </Button>
            <FilterSearch onFilter={filterItens} />
          </Col>
        )}
        {!showListFilter && (
          <>
            <div className="mt-1">
              <Button
                appearance={"ghost"}
                className="ml-2 mr-2"
                style={{ padding: 4 }}
                size="Small"
                status={
                  filterFind?.filteredMachine?.length ||
                  filterFind?.filteredModel?.length
                    ? "Primary"
                    : "Basic"
                }
                onClick={() => setShowListFilter(true)}
              >
                <EvaIcon
                  name={isFiltered ? "funnel" : "funnel-outline"}
                  options={{ animation: { hover: true, type: "pulse" } }}
                />
                {isFiltered && (
                  <div>
                    <Badge status="Primary" style={{ top: 10, right: 6 }}>
                      {filterFind?.filteredMachine?.length +
                        filterFind?.filteredModel?.length}
                    </Badge>
                  </div>
                )}
              </Button>
            </div>
            {!!(
              props.machineDetailsSelected || props.travelDetailsSelected
            ) && (
              <div id="minimizeMenuList" className="pt-1">
                <Tooltip
                  className="toottip-open-right"
                  trigger="hint"
                  placement="right"
                  content={<FormattedMessage id="minimize.list" />}
                  eventListener="#minimizeMenuList"
                >
                  <Button
                    appearance="ghost"
                    size="Small"
                    className="mr-2"
                    style={{ padding: 4 }}
                    status="Basic"
                    onClick={() => props.setIsShowList(false)}
                  >
                    <EvaIcon
                      name={"menu-arrow-outline"}
                      options={{ animation: { hover: true, type: "pulse" } }}
                    />
                  </Button>
                </Tooltip>
              </div>
            )}
          </>
        )}

        <div className="mt-1 btn-aside-mobile">
          <Button
            status="Danger"
            className="ml-2 mr-2"
            size="Small"
            onClick={setBtnEvent}
          >
            <EvaIcon name="close-outline" />
          </Button>
        </div>
      </Container>
    </>
  );
};

const mapStateToProps = (state) => ({
  machineDetailsSelected: state.fleet.machineDetailsSelected,
  travelDetailsSelected: state.fleet.travelDetailsSelected,
});

const mapDispatchToProps = (dispatch) => ({
  setIsShowList: (isShow) => {
    dispatch(setIsShowList(isShow));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Filter);
