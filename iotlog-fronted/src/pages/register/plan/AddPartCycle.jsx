import React from "react";
import Row from "@paljs/ui/Row";
import Col from "@paljs/ui/Col";
import { InputGroup } from "@paljs/ui/Input";
import { injectIntl } from "react-intl";
import { Button } from "@paljs/ui/Button";
import { EvaIcon } from "@paljs/ui/Icon";
import { SelectPart, SelectTypeServiceMaintenance } from "../../../components";

const AddPartCycle = ({ partCycle, enterprise, onChangeItem, onRemove, intl }) => {
  return (
    <>
      <Row className="ml-1 mr-1 mb-4">
        <Col breakPoint={{ md: 4 }}>
          <SelectPart
            onChange={(value) => onChangeItem("part", value)}
            value={partCycle?.part}
            placeholder="select.part"
            idEnterprise={enterprise?.value}
          />
        </Col>
        <Col breakPoint={{ md: 4 }}>
          <SelectTypeServiceMaintenance
            onChange={(value) => onChangeItem("typeService", value)}
            value={partCycle?.typeService}
          />
        </Col>
        <Col breakPoint={{ md: 3 }}>
          <InputGroup fullWidth>
            <input
              type="text"
              placeholder={intl.formatMessage({
                id: "observation.optional",
              })}
              value={partCycle?.observation}
              onChange={(e) => onChangeItem("observation", e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col breakPoint={{ md: 1 }}>
          <Button status="Danger" size="Tiny" onClick={onRemove}>
            <EvaIcon name="trash" />
          </Button>
        </Col>
      </Row>
    </>
  );
};

export default injectIntl(AddPartCycle);
