import { Col, Row, Select } from "@paljs/ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { SelectUserSamePermission } from "../Select";
import TextSpan from "../Text/TextSpan";
import { LabelIcon } from "../Label";

const VISIBILITY = {
  LIMITED: "limited",
  PRIVATE: "private",
  PUBLIC: "public",
};

export default function ArchivePermissionVisible(props) {
  const {
    onChangeUsers,
    users,
    visible,
    onChangeVisible,
  } = props;

  const intl = useIntl();

  const optionsVisible = [
    {
      label: intl.formatMessage({ id: "private.placeholder" }),
      value: VISIBILITY.PRIVATE,
    },
    {
      label: intl.formatMessage({ id: "limited.placeholder" }),
      value: VISIBILITY.LIMITED,
    },
    {
      label: intl.formatMessage({ id: "public.placeholder" }),
      value: VISIBILITY.PUBLIC,
    },
  ];

  return (
    <>
      <Col breakPoint={{ md: 6, lg: 6 }} className="mb-2">
        <LabelIcon
          iconName="eye-outline"
          title={`${intl.formatMessage({ id: "visible.placeholder" })} *`}
        />
        <Select
          isClearable
          options={optionsVisible}
          menuPosition="fixed"
          placeholder={intl.formatMessage({
            id: "visible.placeholder",
          })}
          onChange={(value) => onChangeVisible(value?.value)}
          value={optionsVisible?.find((x) => x.value == visible)}
        />
      </Col>
      {visible == VISIBILITY.LIMITED && (
        <Col breakPoint={{ md: 12 }}  className="mb-2">
          <LabelIcon
          iconName="people-outline"
          title={`${intl.formatMessage({ id: "users" })} *`}
        />
          <SelectUserSamePermission
            isClearable
            isMulti
            className="mt-1"
            onChange={(value) => onChangeUsers(value)}
            value={users}
          />
        </Col>
      )}
    </>
  );
}
