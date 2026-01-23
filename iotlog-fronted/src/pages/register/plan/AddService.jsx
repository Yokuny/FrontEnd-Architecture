import React from "react";
import Row from "@paljs/ui/Row";
import Col from "@paljs/ui/Col";
import { InputGroup } from "@paljs/ui/Input";
import { FormattedMessage, injectIntl } from "react-intl";
import { Button } from "@paljs/ui/Button";
import { EvaIcon } from "@paljs/ui/Icon";
import { SelectTypeServiceMaintenance, TextSpan } from "../../../components";

const AddService = ({ service, onChangeItem, onRemove, intl }) => {
  return (
    <>
      <Row className="ml-1 mr-1 mb-2">
        <Col breakPoint={{ md: 5 }}>
          <TextSpan apparence="s2">
            <FormattedMessage id="description" />
          </TextSpan>
          <InputGroup fullWidth className="mt-1">
            <input
              type="text"
              placeholder={intl.formatMessage({
                id: "description",
              })}
              value={service?.description}
              onChange={(e) => onChangeItem("description", e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col breakPoint={{ md: 3 }}>
        <TextSpan apparence="s2">
            <FormattedMessage id="type" />
          </TextSpan>
          <div className="mt-1"></div>
          <SelectTypeServiceMaintenance
            onChange={(value) => onChangeItem("typeService", value)}
            value={service?.typeService}
          />
        </Col>
        <Col breakPoint={{ md: 3 }}>
        <TextSpan apparence="s2">
            <FormattedMessage id="observation" />
          </TextSpan>
          <InputGroup fullWidth className="mt-1">
            <textarea
              type="text"
              rows={1}
              placeholder={intl.formatMessage({
                id: "observation.optional",
              })}
              value={service?.observation}
              onChange={(e) => onChangeItem("observation", e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col breakPoint={{ md: 1 }} className="col-flex-center pt-2">
          <Button status="Danger" appearance="ghost" size="Tiny" onClick={onRemove} className="mt-4">
            <EvaIcon name="trash-2" />
          </Button>
        </Col>
      </Row>
    </>
  );
};

export default injectIntl(AddService);
