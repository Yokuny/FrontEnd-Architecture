import React from "react";
import Row from "@paljs/ui/Row";
import Col from "@paljs/ui/Col";
import moment from "moment";
import { InputGroup } from "@paljs/ui/Input";
import { Button } from "@paljs/ui/Button";
import { EvaIcon } from "@paljs/ui/Icon";
import { injectIntl, FormattedMessage } from "react-intl";
import { DateTime, TextSpan } from "../../../components";

const HolidaysAdd = ({ holiday, onChangeItem, onRemoveHoliday, intl }) => {
  return (
    <>
      <Row middle>
        <Col breakPoint={{ md: 12 }}>
          <Row className="ml-1 mr-1 mb-2">
            <Col breakPoint={{ lg: 3, md: 3 }} className="mb-2">
              <TextSpan apparence="s2">
                <FormattedMessage id="holidays.day" />
              </TextSpan>
              <DateTime
                date={moment(holiday?.day).format("YYYY-MM-DD")}
                onChangeDate={(value) =>
                  onChangeItem("day", moment(value).format("YYYY-MM-DD"))
                }
                onlyDate
              />
            </Col>
            <Col breakPoint={{ lg: 8, md: 8 }} className="mb-2">
              <TextSpan apparence="s2">
                <FormattedMessage id="holidays.description" />
              </TextSpan>
              <InputGroup fullWidth>
                <input
                  type="text"
                  placeholder={intl.formatMessage({
                    id: "holidays.description",
                  })}
                  onChange={(text) =>
                    onChangeItem("description", text.target.value)
                  }
                  value={holiday.description}
                  maxLength={150}
                />
              </InputGroup>
            </Col>
            <Col breakPoint={{ md: 1 }} className="col-flex-center">
              <Button status="Danger" className="mt-2" size="Tiny" onClick={onRemoveHoliday}>
                <EvaIcon name="trash-2" />
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
};

export default injectIntl(HolidaysAdd);
