import React, { useMemo } from "react";
import { List, ListItem } from "@paljs/ui/List";
import { FormattedMessage, useIntl } from "react-intl";
import { InputGroup, Checkbox } from "@paljs/ui";
import styled from "styled-components";
import { EvaIcon } from "@paljs/ui/Icon";
import Row from "@paljs/ui/Row";
import Col from "@paljs/ui/Col";
import { debounce } from "underscore";
import Select from "@paljs/ui/Select";
import LabelIcon from "../Label/LabelIcon";
import { Fetch } from "../Fetch";
import { LoadingCard } from "../Loading";
import StatusSupplier from "./StatusSupplier";
import TextSpan from "../Text/TextSpan";

const ContainerIcon = styled.a`
  position: absolute;
  right: 15px;
  top: 10px;
  cursor: pointer;
`;

const AddSupplierBody = ({
  onChange = undefined,
  recommendedSupplier = undefined,
  requestOrderField = true,
  preloadData = undefined
}) => {
  const intl = useIntl();
  const first = React.useRef(true);
  const [isLoading, setIsLoading] = React.useState();
  const [data, setData] = React.useState();
  const [filter, setFilter] = React.useState();
  const [selectedSupplier, setSelectedSupplier] = React.useState();
  const [requestOrder, setRequestOrder] = React.useState();
  const [hasRequestOrder, setHasRequestOrder] = React.useState(false);
  const [vor, setVor] = React.useState();
  const [selectedIndex, setSelectedIndex] = React.useState();
  const [activities, setActivities] = React.useState([]);

  const searchTextRef = React.useRef("");

  React.useEffect(() => {
    if (requestOrderField) {
      getData({});
    }
  }, [filter, requestOrderField]);

  React.useEffect(() => {
    if (first.current && preloadData?.requestOrder) {
      first.current = false;
      setSelectedSupplier(preloadData.supplierData);
      if (preloadData.requestOrder)
        setHasRequestOrder(true);
      searchTextRef.current = preloadData.searchText;
      setRequestOrder(preloadData.requestOrder);
      setVor(preloadData.vor)
      setFilter(preloadData.filter);
    }
    loadActivities();
  }, []);

  const loadActivities = () => {
    Fetch.get('/fas/suricatta-supplier/atividades')
      .then((response) => {
        setActivities((response.data || []).sort((a, b) => a.localeCompare(b)));
      })
      .catch(() => setActivities([]));
  }

  const getData = ({ search = "" }) => {
    setIsLoading(true);
    let query = [];
    if (search && search !== "undefined") {
      query.push(`razao=${search}`);
    }

    if (filter?.value) {
      query.push(`atividade=${filter.value}`);
    }

    Fetch.get(`/fas/suricatta-supplier/fornecedores?${query.join("&")}`)
      .then((response) => {
        if (response.data?.length) {
          let dataTake = response?.data?.map((x) => ({
            value: x,
            label: x.razao,
            disabled: x.status?.toUpperCase()?.trim() !== "APROVADO",
            isSuspense: x.atividade?.toUpperCase()?.trim() === "SUSPENSO",
            atividades: x.atividades,
          }))?.sort((a, b) => a.label.localeCompare(b.label));

          // Carrega um fornecedor informado?
          if (preloadData?.supplierData?.codigoFornecedor) {
            const preloadedIndex = dataTake?.findIndex((supplier) => (supplier.value.codigoFornecedor === Number(preloadData?.supplierData?.codigoFornecedor)))
            setSelectedSupplier(dataTake?.[preloadedIndex]?.value);
          }

          setData(dataTake);
        }

        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const changeSearch = (e) => {
    searchTextRef.current = e.target.value;
    changeValueDebounced(e.target.value)
  }

  const handleClick = (e, index) => {
    const selection = data[index]
    if (!selection.disabled && !selection.isSuspense) {
      setSelectedSupplier(selection.value);
      setSelectedIndex(index);
      if (onChange) {
        onChange({ supplierData: selection.value, requestOrder, vor, filter, search: searchTextRef.current });
      }
    }
    return
  }

  const handleInputChange = (e, prop) => {
    const value = e.target.value;

    if (prop === "vor") {
      setVor(value);
    } else if (prop === "requestOrder") {
      setRequestOrder(value);
    }


    if (onChange) {
      const dataPayload = {
        requestOrder,
        supplierData: selectedSupplier,
        filter,
        search: searchTextRef.current,
        vor,
      };
      dataPayload[prop] = value;
      onChange(dataPayload);
    }
  }

  const changeValueDebounced = debounce((search) => {
    getData({ search })
  }, 500);

  return (
    <>
      <Col breakPoint={{ xs: 12, md: 12 }}>
        {(requestOrderField || hasRequestOrder) && <>
          <LabelIcon
            title={`${intl.formatMessage({ id: "add.request" })} *`}
          />
          <InputGroup className="mb-4" fullWidth>
            <input
              type="text"
              placeholder={intl.formatMessage({
                id: "add.request",
              })}
              onChange={(e) => handleInputChange(e, "requestOrder")}
              value={requestOrder}
              maxLength={150}
            />
          </InputGroup>
        </>
        }
        {requestOrderField && <>
          <>
            <LabelIcon
              title="VOR"
            />
            <InputGroup className="mb-4" fullWidth>
              <input
                type="text"
                placeholder="VOR"
                onChange={(e) => handleInputChange(e, "vor")}
                value={vor}
                maxLength={150}
              />
            </InputGroup>
          </>

          <LabelIcon
            title={<FormattedMessage id="activities" />}
          />
          <Select
            options={
              activities?.map((x) => ({
                value: x,
                label: x,
              })) || []
            }
            noOptionsMessage={() => intl.formatMessage({ id: "nooptions.message" })}
            placeholder={"Filtrar pela atividade (Opcional)"}
            isLoading={isLoading}
            onChange={setFilter}
            isSearchable
            value={filter}
            isClearable
            menuPosition="fixed"
            className="mb-4"
          />

          <LabelIcon
            title={`${intl.formatMessage({ id: "suppliers" })} *`}
          />
          <InputGroup fullWidth>
            <input
              // ref={refSearch}
              placeholder={intl.formatMessage({ id: "search.placeholder" })}
              type="text"
              onChange={changeSearch}
              //value={searchTextRef.current}
            />
            <ContainerIcon onClick={() => { }}>
              <EvaIcon name="search-outline" status="Basic" />
            </ContainerIcon>
          </InputGroup>
          {
            recommendedSupplier && (
              <div style={{ marginTop: '1rem' }}>
                <TextSpan apparence="s3" hint className="mr-4">
                  <FormattedMessage id="recommended.supplier" />:
                </TextSpan>
                <TextSpan apparence="s3" hint>
                  {recommendedSupplier}
                </TextSpan>
              </div>
            )
          }
          <List style={{ maxHeight: "40vh" }} className="mt-4">
            {!isLoading && data?.map((supplier, index) => (
              <ListItem
                key={supplier.value?.codigoFornecedor}
                isValid={!supplier.disabled}
                onClick={(e) => handleClick(e, index)}
              >
                <Row style={{ margin: 0, width: "100%", "align-items": "center", "justify-content": "between" }}>
                  <Col breakPoint={{ xs: 1, md: 1, lg: 1 }}>
                    <Checkbox
                      disabled={supplier.disabled || supplier.isSuspense}
                      checked={supplier.value?.codigoFornecedor === Number(selectedSupplier?.codigoFornecedor)}
                      onChange={(e) => handleClick(e, index)}
                    />
                  </Col>
                  <Col breakPoint={{ xs: 7, md: 7, lg: 8 }}>
                    <TextSpan apparence="p2" hint={supplier.disabled || supplier.isSuspense}>
                      {supplier.label}
                    </TextSpan>
                  </Col>
                  <Col breakPoint={{ xs: 3, md: 3, lg: 3 }}>
                    <StatusSupplier status={
                      supplier.isSuspense
                        ? "SUSPENSO"
                        : supplier?.value?.status?.toString()} end />
                  </Col>
                </Row>
              </ListItem>
            ))}
            <LoadingCard isLoading={isLoading} />
          </List>
        </>}
      </Col>
    </>
  )
}

export default AddSupplierBody;
