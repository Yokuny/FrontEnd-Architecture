import React from "react";
import { useIntl } from "react-intl";
import Select from "@paljs/ui/Select";
import Fetch from "../Fetch/Fetch";
import LabelIcon from "../Label/LabelIcon";



const SelectSupplier = ({
  onChange,
  value,
  oneBlocked = false,
  isDisabled = false,
}) => {
  const [isLoading, setIsLoading] = React.useState();
  const [data, setData] = React.useState();
  const [filter, setFilter] = React.useState();

  const intl = useIntl();

  React.useLayoutEffect(() => {
    getData();
  }, []);

  const getData = () => {
    setIsLoading(true);
    Fetch.get(`/fas/suricatta-supplier/fornecedores`)
      .then((response) => {
        if (response.data?.length) {
          let dataTake = response?.data?.map((x) => ({
            value: x,
            label: x.razao,
            disabled: x.status !== "Aprovado",
            atividades: x.atividades,
          }))?.sort((a, b) => a.label.localeCompare(b.label));
          setData(dataTake);
          const selectOne = !!oneBlocked && response.data?.length == 1;
          if (selectOne && !value) {
            onChange(dataTake[0]);
          }
        }
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const atividades = [...new Set(data?.flatMap((x) => x?.atividades) || [])]
    ?.sort((a, b) => a.localeCompare(b));

  const dataFiltered = filter
    ? data?.filter((x) => x?.atividades?.includes(filter?.value))
    : data;

  return (
    <>
      <Select
        options={
          atividades?.map((x) => ({
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
        className="mb-2"
      />

      <LabelIcon title="Fornecedor" />
      <Select
        options={(dataFiltered || [])}
        noOptionsMessage={() => intl.formatMessage({ id: "nooptions.message" })}
        placeholder={"Fornecedor"}
        isLoading={isLoading}
        onChange={onChange}
        isOptionDisabled={(option) => option.disabled}
        isSearchable
        value={value}
        isDisabled={(!!oneBlocked && data?.length == 1) || isDisabled}
        menuPosition="fixed"
      />
    </>
  );
};

export default SelectSupplier;
