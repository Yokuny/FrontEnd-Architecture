import { Button, Col, EvaIcon, InputGroup, Row, Select } from "@paljs/ui";
import { FormattedMessage, useIntl } from "react-intl";
import { LabelIcon } from "../../../../components";

export function Notification({
  notifications,
  handleAdd,
  handleChange,
  handleRemove,
}) {
  const intl = useIntl();

  return (
    <>
      {notifications?.length &&
        notifications?.map((notification, index) => (
          <Row key={index}>
            <Col breakPoint={{ md: 3 }} className="mb-4">
              <LabelIcon title={<FormattedMessage id="notify" />} />
              <InputGroup fullWidth>
                <input
                  type="number"
                  min={1}
                  onChange={(e) => handleChange("value", index, e.target.value)}
                  value={notification.value}
                />
              </InputGroup>
            </Col>

            <Col breakPoint={{ md: 3 }} className="mb-4">
              <LabelIcon title={<FormattedMessage id="period" />} />
              <Select
                options={[
                  {
                    value: "minutes",
                    label: intl.formatMessage({ id: "minutes" }),
                  },
                  {
                    value: "hours",
                    label: intl.formatMessage({ id: "hours" }),
                  },
                  {
                    value: "days",
                    label: intl.formatMessage({ id: "days" }),
                  },
                ]}
                placeholder={intl.formatMessage({ id: "period" })}
                menuPosition="fixed"
                onChange={(e) => handleChange("period", index, e.value)}
                value={{
                  value: notification.period,
                  label: intl.formatMessage({ id: notification.period }),
                }}
              />
            </Col>
            <Col breakPoint={{ md: 2 }} style={{ marginTop: "1.2rem" }}>
              <Button
                status="Danger"
                size="Small"
                appearance="ghost"
                onClick={() => handleRemove(index)}
              >
                <EvaIcon name="trash-2-outline" />
              </Button>
            </Col>
          </Row>
        ))}
      <Row>
        <Col>
          <Button
            status="Info"
            size="Tiny"
            appearance="ghost"
            className="flex-between"
            onClick={handleAdd}
          >
            <EvaIcon name="bell-outline" className="mr-1" />
            <FormattedMessage id="add" />
          </Button>
        </Col>
      </Row>
    </>
  );
}
