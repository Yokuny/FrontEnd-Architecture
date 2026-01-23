import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  EvaIcon,
  InputGroup,
  Row,
  Tooltip,
} from "@paljs/ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { connect } from "react-redux";
import styled, { useTheme } from "styled-components";
import { Fetch, LabelIcon, SelectMachine, SelectMachineEnterprise, TextSpan } from "../../../components";
import { Vessel } from "../../../components/Icons";
import InputDateTime from "../../../components/Inputs/InputDateTime";
import { TABLE, TBODY } from "../../../components/Table";
import LoadingRows from "../LoadingRows";
import DataLine from "./DataLine";
import DataLineDetails from "./DataLineDetails";
import DownloadCSV from "./DownloadCSV";
import moment from "moment";

const ColumnFlex = styled.div`
  display: flex;
  flex-direction: column;
`;

const CardBodyStyled = styled(CardBody)`
  margin-bottom: 0px;
  padding-top: 0px;
  padding-bottom: 0px;
  max-height: calc(100vh - 290px);
`;

const ContainerRow = styled(Row)`
  input {
    line-height: 0.5rem;
  }

  input[type="date"] {
    line-height: 1.2rem;
  }
  input[type="time"] {
    line-height: 1.2rem;
  }
`;

function IndicatorsEEOICII(props) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [data, setData] = React.useState([]);
  const [isShowDetails, setIsShowDetails] = React.useState(false);
  const [filter, setFilter] = React.useState({
    filteredMachine: null,
    filteredDateStart: '',
    filteredDateEnd: '',
    filteredSearch: '',
  });

  const idEnterprise = localStorage.getItem("id_enterprise_filter");

  const theme = useTheme();
  const intl = useIntl();

  React.useEffect(() => {
    if (props.isReady) getData();
  }, [props.isReady, props.enterprises, isShowDetails]);

  const getData = () => {
    setIsLoading(true);

    let url = `/voyageintegration/${isShowDetails ? "item" : "list"
      }/indicators`;

    let query = [];

    if (filter.filteredMachine?.length) {
      query = filter.filteredMachine?.map((x) => `idMachine[]=${x.value}`);
    }

    if (filter.filteredDateStart) {
      query.push(
        `dateTimeStart=${moment(filter.filteredDateStart).format(
          "YYYY-MM-DD"
        )}T00:00:00${moment(filter.filteredDateStart).format("Z")}`
      );
    }

    if (filter.filteredDateEnd) {
      query.push(
        `dateTimeEnd=${moment(filter.filteredDateEnd).format(
          "YYYY-MM-DD"
        )}T23:59:59${moment(filter.filteredDateEnd).format("Z")}`
      );
    }

    if (filter.filteredSearch) {
      query.push(`search=${filter.filteredSearch}`);
    }

    query.push(`idEnterprise=${idEnterprise}`);

    url += `?${query.join("&")}`;

    Fetch.get(url)
      .then((response) => {
        setData(response.data?.length ? response.data : []);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  const onChangeFilter = (prop, value) => {
    setFilter((prevFilter) => ({
      ...prevFilter,
      [prop]: value,
    }));
  };

  const onClearFilter = () => {
    setFilter({
      filteredMachine: null,
      filteredDateStart: '',
      filteredDateEnd: '',
      filteredSearch: '',
    });
    getData();
  };

  return (
    <>
      <Card>
        <CardHeader>
          <Row between="xs" middle="xs" className="m-0">
            <ColumnFlex>
              <TextSpan apparence="s1">EEOI / CII</TextSpan>
            </ColumnFlex>
            <Row className="m-0">
              <DownloadCSV listData={data} isShowDetails={isShowDetails} />
              <Tooltip
                eventListener="#scrollPlacementId"
                className="inline-block"
                trigger="hint"
                content={
                  <FormattedMessage
                    id={
                      !isShowDetails
                        ? "method.voyage.kick"
                        : "method.voyage.full"
                    }
                  />
                }
                placement={"top"}
              >
                <Button
                  size="Tiny"
                  className="mr-4"
                  status="Basic"
                  onClick={() => setIsShowDetails((prevState) => !prevState)}
                >
                  <EvaIcon
                    name={!isShowDetails ? "list-outline" : "minus-outline"}
                  />
                </Button>
              </Tooltip>
            </Row>
          </Row>
          <ContainerRow className="mt-4 mb-2" middle="xs" between="xs">
            <Col breakPoint={{ md: 10 }}>
              <Row>
                <Col>
                  <LabelIcon
                    iconName={"search-outline"}
                    title={<FormattedMessage id="search" />}
                  />
                  <InputGroup fullWidth className="mb-2">
                    <input
                      type="text"
                      placeholder={intl.formatMessage({ id: "search" })}
                      onChange={(e) =>
                        onChangeFilter("filteredSearch", e.target.value)
                      }
                      value={filter.filteredSearch}
                    />
                  </InputGroup>
                </Col>

                <Col breakPoint={{ md: 6 }}>
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
                    title={<FormattedMessage id="machine" />}
                  />
                  <SelectMachineEnterprise
                    idEnterprise={idEnterprise}
                    onChange={(e) => onChangeFilter("filteredMachine", e)}
                    value={filter.filteredMachine}
                    isMulti
                  />
                </Col>
                <Col breakPoint={{ md: 3 }}>
                  <LabelIcon
                    iconName={"calendar-outline"}
                    title={<FormattedMessage id="date.start" />}
                  />
                  <InputDateTime
                    onlyDate
                    onChange={(e) => onChangeFilter("filteredDateStart", e)}
                    value={filter.filteredDateStart ? new Date(filter.filteredDateStart) : null}
                    max={new Date()}
                  />
                </Col>
                <Col breakPoint={{ md: 3 }}>
                  <LabelIcon
                    iconName={"calendar-outline"}
                    title={<FormattedMessage id="date.end" />}
                  />
                  <InputDateTime
                    onlyDate
                    onChange={(e) => onChangeFilter("filteredDateEnd", e)}
                    value={filter.filteredDateEnd ? new Date(filter.filteredDateEnd) : null}
                    max={new Date()}
                    min={filter.filteredDateStart}
                  />
                </Col>
              </Row>
            </Col>

            <Col breakPoint={{ md: 2 }} className="pt-3">
              <Row className="m-0"
                center={"xs"}
                style={{

                }}
                middle="xs">

                <Button
                  size="Small"
                  status="Primary"
                  className="mt-4 flex-between"
                  onClick={getData}
                >
                  <EvaIcon name="search-outline" className="mr-1" />
                  <FormattedMessage id="filter" />
                </Button>
                {Object.values(filter).filter(Boolean).length ? (
                  <Button
                    size="Tiny"
                    appearance="ghost"
                    status="Danger"
                    className="mt-4 flex-between"
                    onClick={onClearFilter}
                  >
                    <EvaIcon name="close-outline" className="mr-1" />
                    <FormattedMessage id="clear.filter" />
                  </Button>
                ) : null}
              </Row>
            </Col>

          </ContainerRow>

        </CardHeader>
        <CardBodyStyled>
          {isLoading ? (
            <TABLE>
              <TBODY>
                <LoadingRows />
              </TBODY>
            </TABLE>
          ) : (
            <>
              {isShowDetails ? (
                <DataLineDetails data={data} />
              ) : (
                <DataLine data={data} />
              )}
            </>
          )}
        </CardBodyStyled>
      </Card>
    </>
  );
}

const mapStateToProps = (state) => ({
  enterprises: state.enterpriseFilter.enterprises,
  isReady: state.enterpriseFilter.isReady,
});

export default connect(mapStateToProps, undefined)(IndicatorsEEOICII);
