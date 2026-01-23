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

export default function PermissionVisible(props) {
  const {
    onChangeUsers,
    users,
    visible,
    onChangeVisible,
    whoEdit,
    onChangeWhoEdit,
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

  const optionsEdit = [
    {
      label: intl.formatMessage({ id: "me.edit" }),
      value: "me",
    },
    {
      label: intl.formatMessage({ id: "any.edit" }),
      value: "any",
    },
  ];

  return (
    <>
      <Row>
        <Col breakPoint={{ md: 4 }} className="mb-4">
          <LabelIcon
            iconName="eye-outline"
            title={`${intl.formatMessage({ id: "visible.placeholder" })} *`}
          />
          <Select
            isClearable
            className="mt-1"
            options={optionsVisible}
            menuPosition="fixed"
            placeholder={intl.formatMessage({
              id: "visible.placeholder",
            })}
            onChange={(value) => onChangeVisible(value?.value)}
            value={optionsVisible?.find((x) => x.value == visible)}
          />
        </Col>
        <Col breakPoint={{ md: 8 }} className="mb-4">
          <LabelIcon
            iconName="edit-2-outline"
            title={`${intl.formatMessage({ id: "edit.who.placeholder" })} *`}
          />
          <Select
            isClearable
            className="mt-1"
            options={optionsEdit}
            menuPosition="fixed"
            placeholder={intl.formatMessage({
              id: "edit.who.placeholder",
            })}
            onChange={(value) => onChangeWhoEdit(value?.value)}
            value={optionsEdit?.find((x) => x.value == whoEdit)}
          />
        </Col>

        {visible == VISIBILITY.LIMITED && (
          <Col breakPoint={{ md: 12 }}>
            <TextSpan apparence="s2">
              <FormattedMessage id="users" />
            </TextSpan>
            <SelectUserSamePermission
              isClearable
              isMulti
              className="mt-1"
              onChange={(value) => onChangeUsers(value)}
              value={users}
            />
          </Col>
        )}
      </Row>
    </>
  );
}
