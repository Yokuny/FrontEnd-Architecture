import React from "react";
import { useIntl } from "react-intl";
import Select from "@paljs/ui/Select";
import { EvaIcon } from "@paljs/ui";
import Fetch from "../Fetch/Fetch";
import styled from "styled-components";
import TextSpan from "../Text/TextSpan";

const Content = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
`;

export const convertTypeUserTOSelect = (x) => ({
  value: x.id,
  label: (
    <Content>
      <EvaIcon name="person-outline" className="mt-1" options={{ height: 18, fill: x.color }} />
      <TextSpan className="ml-1" style={{ color: x.color }} apparence="c2">
        {x.description}
      </TextSpan>
    </Content>
  ),
})

const SelectTypeUser = ({
  idEnterprise,
  onChange,
  value,
  isDisabled = false,
  isClearable = false,
  isMulti = false,
  placeholder = "type.user",
  className = "",
}) => {
  const intl = useIntl();
  const [isLoading, setIsLoading] = React.useState();
  const [data, setData] = React.useState();

  React.useLayoutEffect(() => {
    getData(idEnterprise);
  }, [idEnterprise]);

  const getData = (idEnterprise) => {
    setIsLoading(true);
    Fetch.get(
      `/typeuser/list/all${idEnterprise ? `?idEnterprise=${idEnterprise}` : ""}`
    )
      .then((response) => {
        setData(response.data);
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const options = data?.map((x) => convertTypeUserTOSelect(x));

  return (
    <>
      <Select
        options={options}
        placeholder={intl.formatMessage({
          id: placeholder,
        })}
        className={className}
        isLoading={isLoading}
        onChange={onChange}
        value={value}
        noOptionsMessage={() =>
          intl.formatMessage({
            id: "nooptions.message",
          })
        }
        isClearable={isClearable}
        isMulti={isMulti}
        menuPosition="fixed"
        isDisabled={isDisabled}
      />
    </>
  );
};
export default SelectTypeUser;
