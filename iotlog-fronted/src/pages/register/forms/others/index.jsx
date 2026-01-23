import { Checkbox, Col, Row, Select } from "@paljs/ui";
import { FormattedMessage, useIntl } from "react-intl";
import {
  LabelIcon,
  SelectCreatable,
  SelectUsers,
} from "../../../../components";

export default function Others(props) {
  const { data, onChange, enterprise } = props;
  const intl = useIntl();

  const optionsTypeForm = [
    {
      value: "RVE",
      label: "RVE",
    },
    {
      value: "EVENT_REPORT",
      label: "Relatório de evento diário",
    },
    {
      value: "FILL_ONBOARD",
      label: intl.formatMessage({ id: "fill.onboard" }),
    },
    {
      value: "OTHER",
      label: intl.formatMessage({ id: "other" }),
    },
    {
      value: "NOON_REPORT",
      label: "Noon Report",
    },
    {
      value: "POLL",
      label: intl.formatMessage({ id: "polling" }),
    },
    {
      value: "RDO",
      label: "RDO",
    },
    {
      value: "EVENT",
      label: intl.formatMessage({ id: "event" }),
    },
    {
      value: "CMMS",
      label: "CMMS",
    },
  ];

  return (
    <>
      <Row>
        <Col className="mb-4">
          <LabelIcon
            iconName="file-outline"
            title={`${intl.formatMessage({ id: "type.form" })}`}
          />
          <Select
            className="mt-1"
            options={optionsTypeForm}
            value={optionsTypeForm?.find((x) => x.value === data?.typeForm)}
            onChange={(value) => onChange("typeForm", value?.value || null)}
            isClearable
            menuPosition="fixed"
            noOptionsMessage={() =>
              intl.formatMessage({ id: "nooptions.message" })
            }
            placeholder={`${intl.formatMessage({ id: "type.form" })}`}
          />
        </Col>
        {data.typeForm === "NOON_REPORT" ? (
          <>
            <Col>
              <Checkbox
                onChange={() => onChange("whatsapp", !data.whatsapp)}
                checked={data.whatsapp}
              >
                Whatsapp
              </Checkbox>
            </Col>
            <Col>
              <Checkbox
                onChange={() => onChange("email", !data.email)}
                checked={data.email}
              >
                Email
              </Checkbox>
            </Col>
            {data.whatsapp ? (
              <Col breakPoint={{ md: 12 }} className="mb-4">
                <LabelIcon
                  iconName="people-outline"
                  title={<FormattedMessage id="users" />}
                />
                <SelectUsers
                  className="mt-1"
                  onChange={(value) => onChange("users", value)}
                  value={data?.users}
                  idEnterprise={enterprise.value}
                  isMulti
                />
              </Col>
            ) : null}
            {data.email ? (
              <Col breakPoint={{ md: 12 }} className="mb-4">
                <LabelIcon
                  iconName="at-outline"
                  title={<FormattedMessage id="email" />}
                />
                <SelectCreatable
                  onChange={(e) => onChange("emails", e)}
                  value={data.emails}
                  isMulti
                  placeholder={intl.formatMessage({ id: "select.email" })}
                  noOptionsMessage={() =>
                    intl.formatMessage({ id: "type.to.create.a.new.option" })
                  }
                />
              </Col>
            ) : null}
          </>
        ) : null}
      </Row>
    </>
  );
}
