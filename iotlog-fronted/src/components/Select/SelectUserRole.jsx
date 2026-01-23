/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import Select from "@paljs/ui/Select";
import { Fetch } from "../Fetch";

const SelectUserRole = ({
  onChange,
  value = [],
  placeholderID = "",
  idRole,
  setSelectUser,
  idEnterprises
}) => {
  const intl = useIntl();
  const [options, setOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsersRoles = async () => {
      setIsLoading(true);
      try {
        const idEnterprise =
          idEnterprises?.[0] || localStorage.getItem("id_enterprise_filter");
        const roleResponse = await Fetch.get(
          `/role/list/usersid-and-identerprise?idRole=${idRole}&idEnterprise=${idEnterprise}`
        );

        const usersWithRole = roleResponse.data.users || [];
        const usersWithRoleIds = usersWithRole.map((user) => user.id);

        const enterpriseResponse = await Fetch.get(
          `user/list/enterprise?id=${idEnterprise}`
        );
        const usersInEnterprise = enterpriseResponse.data || [];
        const optionsData = usersInEnterprise
        ?.filter((user) => !usersWithRoleIds.includes(user.id))
        ?.map((user) => ({
          value: user.id,
          label: user.name,
          isSelected: usersWithRoleIds.includes(user.id),
        }));

        setOptions(optionsData);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    };

    if (idRole) {
      fetchUsersRoles();
    }
  }, [idRole, onChange]);

  const handleOnChange = async (selectedOptions) => {
    setIsLoading(true);

    onChange(selectedOptions);
    setSelectUser(selectedOptions);
    setIsLoading(false);
  };

  const optionsSorted = options
    .sort((a, b) => a.label.localeCompare(b.label));

  return (
    <React.Fragment>
      <Select
        options={optionsSorted}
        noOptionsMessage={() => intl.formatMessage({ id: "nooptions.message" })}
        placeholder={intl.formatMessage({
          id: placeholderID || "roles.placeholder",
        })}
        isLoading={isLoading}
        onChange={handleOnChange}
        value={value}
        isMulti
        menuPosition="fixed"
      />
    </React.Fragment>
  );
};

export default SelectUserRole;
