import { Col, Select } from "@paljs/ui";
import React from "react";
import { useIntl } from "react-intl";
import { SelectUserSamePermission } from "../Select";
import { LabelIcon } from "../Label";

const EDIT_PERMISSION = {
  LIMITED: "limited",
  PRIVATE: "private",
  PUBLIC: "public",
};

export default function ArchivePermissionEdit(props) {
  const {
    onChangeEditUsers,
    editUsers,
    editPermission,
    onChangeEditPermission,
  } = props;

  const intl = useIntl();

  const optionsEditPermission = [
    {
      label: intl.formatMessage({ id: "private.placeholder" }),
      value: EDIT_PERMISSION.PRIVATE,
    },
    {
      label: intl.formatMessage({ id: "limited.placeholder" }),
      value: EDIT_PERMISSION.LIMITED,
    },
    {
      label: intl.formatMessage({ id: "public.placeholder" }),
      value: EDIT_PERMISSION.PUBLIC,
    },
  ];

  return (
    <>
      <Col breakPoint={{ md: 6, lg: 6 }} className="mb-2">
        <LabelIcon
          iconName="edit-outline"
          title={`${intl.formatMessage({ id: "edit.permission" })} *`}
        />
        <Select
          isClearable
          options={optionsEditPermission}
          menuPosition="fixed"
          placeholder={intl.formatMessage({
            id: "edit.permission",
          })}
          onChange={(value) => onChangeEditPermission(value?.value)}
          value={optionsEditPermission?.find((x) => x.value === editPermission)}
        />
      </Col>
      {editPermission === EDIT_PERMISSION.LIMITED && (
        <Col breakPoint={{ md: 12 }} className="mb-2">
          <LabelIcon
            iconName="people-outline"
            title={`${intl.formatMessage({ id: "users.with.edit.permission" })} *`}
          />
          <SelectUserSamePermission
            isClearable
            isMulti
            className="mt-1"
            onChange={(value) => onChangeEditUsers(value)}
            value={editUsers}
          />
        </Col>
      )}
    </>
  );
}

