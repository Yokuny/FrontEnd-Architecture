import React from "react";
import Row from "@paljs/ui/Row";
import Col from "@paljs/ui/Col";
import { InputGroup } from "@paljs/ui/Input";
import { Button } from "@paljs/ui/Button";
import { EvaIcon } from "@paljs/ui/Icon";
import { FormattedMessage, injectIntl } from "react-intl";
import { TextSpan } from "../../../components";
import { SelectUsers, SelectAlertType } from "../../../components/Select";
import { verifyTime } from "../../../utilities";

const LevelAdd = ({ level, onChangeItem, removeLevel, enterprise, intl }) => {
  return (
    <>
      <Row middle>
        <Col breakPoint={{ md: 11 }}>
          <Row className="ml-1 mr-1 mb-2">
            <Col breakPoint={{ lg: 4, md: 4 }} className="mb-2">
              <TextSpan className="ml-1 mb-1" apparence="s2">
                <FormattedMessage id="scale.level" />
              </TextSpan>
              <InputGroup fullWidth>
                <input
                  type="number"
                  placeholder={intl.formatMessage({
                    id: "scale.level",
                  })}
                  className="mt-1"
                  onChange={(text) => onChangeItem("level", text.target.value)}
                  value={level.level}
                  min={1.0}
                />
              </InputGroup>
            </Col>
            <Col breakPoint={{ lg: 4, md: 4 }} className="mb-2">
              <TextSpan className="ml-1" apparence="s2">
                <FormattedMessage id="scale.time" />
              </TextSpan>

              <InputGroup fullWidth>
                <input
                  type="time"
                  placeholder={intl.formatMessage({
                    id: "scale.time",
                  })}
                  className="mt-1"
                  onChange={(text) =>
                    onChangeItem("time", verifyTime(text.target.value))
                  }
                  value={level.time}
                />
              </InputGroup>
            </Col>
            <Col breakPoint={{ lg: 4, md: 4 }} className="mb-4">
              <TextSpan className="ml-1" apparence="s2">
                <FormattedMessage id="scale.alert.type" />
              </TextSpan>
              <SelectAlertType
                onChange={(value) => onChangeItem("alertType", value)}
                value={level.alertType}
                className="mt-1"
              />
            </Col>
            <Col breakPoint={{ md: 12 }} className="mb-4">
              <TextSpan className="ml-1" apparence="s2">
                <FormattedMessage id="users" />
              </TextSpan>
              <SelectUsers
                className="mt-1"
                onChange={(responsible) =>
                  onChangeItem("responsible", responsible)
                }
                value={level.responsible}
                idEnterprise={enterprise?.value}
                isMulti
                isMoreDetails
              />
            </Col>
          </Row>
        </Col>
        <Col breakPoint={{ md: 1 }}>
          <Button status="Danger" size="Tiny" onClick={removeLevel}>
            <EvaIcon name="trash-2" />
          </Button>
        </Col>
      </Row>
    </>
  );
};

export default injectIntl(LevelAdd);
