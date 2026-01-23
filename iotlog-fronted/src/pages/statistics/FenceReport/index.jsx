import { Card, CardBody, CardFooter, CardHeader, EvaIcon } from "@paljs/ui";
import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { FormattedMessage } from "react-intl";
import { useSearchParams } from "react-router-dom";
import { Button } from "@paljs/ui/Button";
import moment from "moment";
import SelectMachineEnterprise from "../../../components/Select/SelectMachineEnterprise";
import SelectFence from "../../../components/Select/SelectFence";
import SelectFenceType from "../../../components/Select/SelectFenceType";
import { TABLE, TBODY, TD, TH, THEAD, TR, TRH } from "../../../components/Table";
import DownloadCSV from "./DownloadCSV";
import { DateTime, Fetch, LabelIcon, TextSpan } from "../../../components";


const CardBodyStyled = styled(CardBody)`
  margin-bottom: 0px;
  padding-top: 20px;
  padding-bottom: 20px;
`;

const FilterContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FilterField = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  input[type="date"] {
    line-height: 18px; 
  }

  a {
    margin-top: -4px !important;
  }
`;

const ControlsContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;
  align-items: flex-start;
  width: 100%;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const FiltersWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
  flex-grow: 1;
  width: 100%;
`;

const ActionsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  
  @media (max-width: 768px) {
    width: 100%;
    flex-direction: row;
  }
`;

const TableContainer = styled.div`
  margin-top: 0.2rem;
  max-height: calc(100vh - 408px);
  overflow-y: auto;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
  color: ${(props) => props.theme.textBasicColor};
`;

const EmptyContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
  color: ${(props) => props.theme.textHintColor};
`;

const FenceReport = (props) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const idEnterprise = props.enterprises?.length
    ? props.enterprises[0]?.id
    : localStorage.getItem("id_enterprise_filter");

  const filters = React.useMemo(() => {
    return {
      machine: searchParams.get("machine") ? JSON.parse(searchParams.get("machine")) : null,
      fence: searchParams.get("fence") ? JSON.parse(searchParams.get("fence")) : null,
      fenceType: searchParams.get("fenceType") ? JSON.parse(searchParams.get("fenceType")) : null,
      dateStart: searchParams.get("dateStart") || moment().subtract(7, "days").format("YYYY-MM-DD"),
      dateEnd: searchParams.get("dateEnd") || moment().format("YYYY-MM-DD"),
    };
  }, [searchParams]);

  const handleFilterChange = (field, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      if (typeof value === 'object' && value !== null) {
        newParams.set(field, JSON.stringify(value));
      } else {
        newParams.set(field, value);
      }
    } else {
      newParams.delete(field);
    }
    setSearchParams(newParams);
  };

  const fetchData = (filterParams) => {
    setIsLoading(true);

    const queryParams = [
      `idEnterprise=${idEnterprise}`,
    ];

    if (filterParams.machine?.length) {
      filterParams.machine.forEach((m) => {
        queryParams.push(`idMachine[]=${m.value}`);
      });
    }

    if (filterParams.fence?.length) {
      queryParams.push(`idFence=${filterParams.fence.map((f) => f.value).join(",")}`);
    }

    if (filterParams.fenceType?.length) {
      queryParams.push(`fenceType=${filterParams.fenceType.map((ft) => ft.value).join(",")}`);
    }

    if (filterParams.dateStart) {
      queryParams.push(`min=${filterParams.dateStart}T00:00:00.000${moment().format("Z")}`);
    }

    if (filterParams.dateEnd) {
      queryParams.push(`max=${filterParams.dateEnd}T23:59:59.999${moment().format("Z")}`);
    }

    const queryString = queryParams.join("&");

    Fetch.get(`/machineevent/fencereport?${queryString}`)
      .then((response) => {
        setData(response.data || []);
        setIsLoading(false);
      })
      .catch((error) => {
        setData([]);
        setIsLoading(false);
      });
  };

  const handleApplyFilters = () => {
    fetchData(filters);
  };

  const handleClearFilters = () => {
    setSearchParams(new URLSearchParams());
    setData([]);
  };

  const formatMinutes = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    let result = [];
    if (hours > 0) {
      result.push(`${hours}h`);
    }
    if (mins > 0) {
      result.push(`${mins}m`);
    }
    return result.join(" ");
  };

  const hasFilterInQuery = () => {
    return Object.keys(filters).some((key) => filters[key] !== null);
  };

  return (
    <Card>
      <CardHeader>
        <TextSpan apparence="s1">
          <FormattedMessage id="fence.report" defaultMessage="Relatório de Cercas" />
        </TextSpan>
      </CardHeader>
      <CardBodyStyled>
        <FilterContainer style={{ padding: "0 16px" }}>
          <ControlsContainer>
            <FiltersWrapper>
              <FilterField>
                <LabelIcon
                  title={<FormattedMessage id="machine" defaultMessage="Embarcação" />}
                />
                <SelectMachineEnterprise
                  idEnterprise={idEnterprise}
                  value={filters.machine}
                  onChange={(value) => handleFilterChange("machine", value)}
                  placeholder="machine.placeholder"
                  isMulti
                />
              </FilterField>
              <FilterField>
                <LabelIcon
                  title={<FormattedMessage id="fence" defaultMessage="Cerca" />}
                />
                <SelectFence
                  idEnterprise={idEnterprise}
                  value={filters.fence}
                  isMulti
                  justValue
                  onChange={(value) => handleFilterChange("fence", value?.map(x => x.value))}
                  placeholder="fence.placeholder"
                />
              </FilterField>
              <FilterField>
                <LabelIcon
                  title={<FormattedMessage id="fence.type" defaultMessage="Tipo de Cerca" />}
                />
                <SelectFenceType
                  isMulti
                  value={filters.fenceType} onChange={(value) => handleFilterChange("fenceType", value)} />
              </FilterField>

              <FilterField>
                <LabelIcon
                  title={<FormattedMessage id="date.start" defaultMessage="Data Inicial" />}
                />
                <DateTime
                  onlyDate
                  date={filters.dateStart}
                  onChangeDate={(value) => handleFilterChange("dateStart", value)}
                />
              </FilterField>
              <FilterField>
                <LabelIcon
                  title={<FormattedMessage id="date.end" defaultMessage="Data Final" />}
                />
                <DateTime
                  onlyDate
                  date={filters.dateEnd}
                  onChangeDate={(value) => handleFilterChange("dateEnd", value)}
                />
              </FilterField>
            </FiltersWrapper>

            <ActionsWrapper className="ml-3">
              <Button
                className="mb-2 flex-between"
                size="Tiny" status="Primary" onClick={handleApplyFilters}>
                <EvaIcon name="search-outline" className="mr-1" />
                <FormattedMessage id="search" defaultMessage="Buscar" />
              </Button>
              {hasFilterInQuery && <Button
                appearance="ghost"
                className="flex-between"
                size="Tiny" status="Basic" onClick={handleClearFilters}>
                <EvaIcon name="close-outline" className="mr-1" />
                <FormattedMessage id="clear" defaultMessage="Limpar" />
              </Button>}
            </ActionsWrapper>
          </ControlsContainer>

          {isLoading && (
            <LoadingContainer>
              <FormattedMessage id="loading" defaultMessage="Carregando..." />
            </LoadingContainer>
          )}

          {!isLoading && data.length === 0 && (
            <EmptyContainer>
              <FormattedMessage
                id="no.data.found"
                defaultMessage="Nenhum dado encontrado. Aplique os filtros para visualizar os resultados."
              />
            </EmptyContainer>
          )}

          {!isLoading && data.length > 0 && (
            <TableContainer>
              <TABLE>
                <THEAD>
                  <TRH>
                    <TH>
                      <TextSpan apparence="p2" hint>
                        <FormattedMessage id="machine" defaultMessage="Embarcação" />
                      </TextSpan>
                    </TH>
                    <TH>
                      <TextSpan apparence="p2" hint>
                        <FormattedMessage id="fence" defaultMessage="Cerca" />
                      </TextSpan>
                    </TH>
                    <TH>
                      <TextSpan apparence="p2" hint>
                        <FormattedMessage id="fence.type" defaultMessage="Tipo" />
                      </TextSpan>
                    </TH>

                    <TH textAlign="center">
                      <TextSpan apparence="p2" hint>
                        <FormattedMessage id="start" defaultMessage="Primeira Visita" />
                      </TextSpan>
                    </TH>
                    <TH textAlign="center">
                      <TextSpan apparence="p2" hint>
                        <FormattedMessage id="end" defaultMessage="Última Visita" />
                      </TextSpan>
                    </TH>
                    <TH textAlign="center">
                      <TextSpan apparence="p2" hint>
                        <FormattedMessage id="total.time" defaultMessage="Tempo Total" />
                      </TextSpan>
                    </TH>
                  </TRH>
                </THEAD>
                <TBODY>
                  {data.map((item, index) => (
                    <TR
                      isEvenColor={index % 2 === 0}
                      key={index}>
                      <TD>
                        <TextSpan apparence="p2">
                          {item.machine?.name || ""}
                        </TextSpan>
                      </TD>
                      <TD>
                        <TextSpan apparence="p2">
                          {item.fence?.description || ""}
                        </TextSpan>
                      </TD>
                      <TD>
                        <TextSpan apparence="s2">
                          {item.fence?.type?.label || item.fence?.type?.value || ""}
                        </TextSpan>
                      </TD>

                      <TD textAlign="center">
                        <TextSpan apparence="p2">
                          {item.dateTimeStart ? moment(item.dateTimeStart).format("DD MMM HH:mm") : ""}
                        </TextSpan>
                      </TD>
                      <TD textAlign="center">
                        <TextSpan apparence="p2">
                          {item.dateTimeEnd ? moment(item.dateTimeEnd).format("DD MMM HH:mm") : ""}
                        </TextSpan>
                      </TD>
                      <TD textAlign="center">
                        <TextSpan apparence="s2">
                          {formatMinutes(
                            (new Date(item.dateTimeEnd).getTime() - new Date(item.dateTimeStart).getTime()) / 60000,
                          )}
                        </TextSpan>
                      </TD>
                    </TR>
                  ))}
                </TBODY>
              </TABLE>
            </TableContainer>
          )}
        </FilterContainer>
      </CardBodyStyled>
      <CardFooter>
        <div style={{ display: "flex", justifyContent: "flex-start" }}>
          <DownloadCSV listData={data} />
        </div>
      </CardFooter>
    </Card>
  );
};

const mapStateToProps = (state) => ({
  enterprises: state.enterpriseFilter.enterprises,
  isReady: state.enterpriseFilter.isReady,
});

export default connect(mapStateToProps, undefined)(FenceReport);
