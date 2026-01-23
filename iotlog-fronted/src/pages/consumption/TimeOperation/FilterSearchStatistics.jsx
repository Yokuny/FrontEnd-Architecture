import { Button, CardFooter, Select, Col, EvaIcon, Row } from "@paljs/ui";
import moment from "moment";
import React from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import styledComponents, { useTheme } from "styled-components";
import { DateTime, LabelIcon, Modal, SelectMachineEnterprise } from "../../../components";
import { Vessel } from "../../../components/Icons";

const unitsOptions = [
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
    label: "Ton",
  },
];

const Content = styledComponents.div`
  width: 100%;
`

const FilterSearchStatistics = (props) => {
  const { filterData, onChange, showUnit } = props;

  const theme = useTheme();

  const onSearch = () => {
    props.onFilter({
      filteredMachine: filterData?.filteredMachine,
      isShowDisabled: filterData?.isShowDisabled,
      dateMin: moment(`${filterData?.dateInit}T00:00:00`).format("YYYY-MM-DDTHH:mm:ssZ"),
      dateMax: moment(`${filterData?.dateEnd}T23:59:59`).format("YYYY-MM-DDTHH:mm:ssZ"),
      idEnterprise: props.enterprises?.length
        ? props.enterprises[0]?.id
        : undefined,
      isFilterByAdvanced: true,
      unit: filterData?.unit
    });
  };


  const onClearSearch = () => {
    props.onClearFilter();
    props.onFilter({
      filteredMachine: [],
      isShowDisabled: false,
      dateMin: `${moment().subtract(8, `days`).format('YYYY-MM-DD')}T00:00:00${moment().format("Z")}`,
      dateMax: `${moment().subtract(1, `days`).format('YYYY-MM-DD')}T23:59:59${moment().format("Z")}`,
      isClearing: true,
      unit: filterData?.unit
    });
  };

  const isFiltered =
    filterData?.filteredMachine?.length ||
    filterData?.dateInit ||
    filterData?.dateEnd;

  return (
    <>
      <Modal
        title="filter"
        onClose={props.onClose}
        show={props.show}
        size="Medium"
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
          <Row className="w-100">
            <Col breakPoint={{ md: 6 }} className="mb-4">
              <LabelIcon
                iconName="calendar-outline"
                title={<FormattedMessage id="date.start" />}
              />

              <DateTime
                onChangeDate={(value) => onChange("dateInit", value)}
                date={filterData?.dateInit}
                onlyDate
                max={filterData?.dateEnd}
              />
            </Col>
            <Col breakPoint={{ md: 6 }} className="mb-4">
              <LabelIcon
                iconName="calendar-outline"
                title={<FormattedMessage id="date.end" />}
              />
              <DateTime
                onChangeDate={(value) => onChange("dateEnd", value)}
                date={filterData?.dateEnd}
                min={filterData?.dateInit}
                max={moment().subtract(1,'day').format("YYYY-MM-DD")}
                onlyDate
              />
            </Col>

            <Col breakPoint={{ md: 12 }} className="mb-4">
              <LabelIcon
                renderIcon={() => (
                  <Vessel
                    style={{
                      height: 13,
                      width: 13,
                      color: theme.textHintColor,
                      marginRight: 5,
                      marginTop: 2,
                      marginBottom: 2,
                    }}
                  />
                )}
                title={<FormattedMessage id="vessels" />}
              />
              <SelectMachineEnterprise
                idEnterprise={props.enterprises?.length
                  ? props.enterprises[0]?.id
                  : undefined}
                value={filterData?.filteredMachine}
                isMulti
                placeholder="vessels"
                onChange={(value) => onChange("filteredMachine", value)}
              />
            </Col>
            {showUnit && <Col breakPoint={{ md: 4 }} className="mb-4">
              <LabelIcon
                iconName="droplet-outline"
                title={<FormattedMessage id="unit" />}
              />
              <Select
                options={unitsOptions}
                menuPosition="fixed"
                placeholder={<FormattedMessage id="unit" />}
                value={unitsOptions?.find(x => x.value === filterData.unit)}
                onChange={(e) => onChange("unit", e?.value)}
              />
            </Col>}
          </Row>

        </Content>
      </Modal>
    </>
  );
};

const mapStateToProps = (state) => ({
  enterprises: state.enterpriseFilter.enterprises,
});

export default connect(mapStateToProps, undefined)(FilterSearchStatistics);
