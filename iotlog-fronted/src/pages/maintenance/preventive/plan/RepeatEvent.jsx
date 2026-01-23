import { Col, InputGroup, Radio, Row, Select } from "@paljs/ui";
import moment from "moment";
import { FormattedMessage, useIntl } from "react-intl";
import { LabelIcon } from "../../../../components";
import InputDateTime from "../../../../components/Inputs/InputDateTime";
import { ColFlex } from "./styles";

export function RepeatEvent({ data, onChange, onChangeUpdate }) {
  const intl = useIntl();

  return (
    <>
      <ColFlex breakPoint={{ md: 12 }} className="mb-4">
        <Row>
          <Col breakPoint={{ md: 3 }} className="mb-4">
            <LabelIcon title={<FormattedMessage id="repeat.every" />} />
            <InputGroup fullWidth>
              <input
                type="number"
                min={1}
                defaultValue={1}
                onChange={(e) => onChange("value", e.target.value)}
                value={data?.repeat?.value}
              />
            </InputGroup>
          </Col>

          <Col breakPoint={{ md: 3 }} className="mb-4">
            <LabelIcon title={<FormattedMessage id="period" />} />
            <Select
              options={[
                { value: "day", label: intl.formatMessage({ id: "day" }) },
                {
                  value: "week",
                  label: intl.formatMessage({ id: "week" }),
                },
                {
                  value: "month",
                  label: intl.formatMessage({ id: "month" }),
                },
                {
                  value: "year",
                  label: intl.formatMessage({ id: "year" }),
                },
              ]}
              placeholder={intl.formatMessage({ id: "period" })}
              menuPosition="fixed"
              onChange={(e) => onChange("period", e)}
              value={data?.repeat?.period}
            />
          </Col>

          <Col breakPoint={{ md: 6 }}>
            <LabelIcon title={<FormattedMessage id="ends.in" />} />
            <InputDateTime
              onlyDate
              min={moment.utc()}
              max={moment().add(2, "years").utc()}
              onChange={(e) => onChange("endAt", e)}
              value={data?.repeat?.endAt}
            />
          </Col>
        </Row>
      </ColFlex>
      {data?.id ? (
        <ColFlex>
          <LabelIcon
            title={<FormattedMessage id="apply.to" />}
          />
          <Radio
            name="radio"
            onChange={(e) => onChangeUpdate(e)}
            options={[
              {
                value: "none",
                label: intl.formatMessage({ id: "only.this" }),
                checked: true,
              },
              {
                value: "next",
                label: intl.formatMessage({ id: "this.and.the.next.ones" }),
              },
              {
                value: "all",
                label: intl.formatMessage({ id: "all" }),
              },
            ]}
          />
        </ColFlex>
      ) : null}
    </>
  );
}
