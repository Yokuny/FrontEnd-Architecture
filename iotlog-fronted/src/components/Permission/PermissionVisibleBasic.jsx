import { Col, Row, Select } from "@paljs/ui";
import React from "react";
import { useIntl } from "react-intl";
import { SelectUsers } from "../Select";

const VISIBILITY = {
  LIMITED: "limited",
  PRIVATE: "private",
  PUBLIC: "public",
};

export default function PermissionVisibleBasic(props) {
  const { onChangeUsers, users, visible, onChangeVisible, idEnterprise, placeholderId } = props;
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
      <Row>
        <Col breakPoint={{ md: 3 }} className="mb-4">
          <Select
            isClearable
            options={optionsVisible}
            menuPosition="fixed"
            placeholder={intl.formatMessage({
              id: placeholderId || "visible.placeholder",
            })}
            onChange={(value) => onChangeVisible(value?.value)}
            value={optionsVisible?.find((x) => x.value === visible)}
          />
        </Col>
        {visible === VISIBILITY.LIMITED && (
          <Col breakPoint={{ md: 8 }}>
            <SelectUsers
              idEnterprise={idEnterprise}
              isClearable
              isMulti
              isDisabled={visible !== VISIBILITY.LIMITED}
              onChange={(value) => onChangeUsers(value)}
              value={users}
            />
          </Col>
        )}
      </Row>
    </>
  );
}
