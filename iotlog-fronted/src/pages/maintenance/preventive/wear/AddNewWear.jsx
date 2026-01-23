import React from "react";
import Row from "@paljs/ui/Row";
import Col from "@paljs/ui/Col";
import { InputGroup } from "@paljs/ui/Input";
import { FormattedMessage, injectIntl } from "react-intl";
import { Button } from "@paljs/ui/Button";
import { EvaIcon } from "@paljs/ui/Icon";
import { SelectPartByMachine, TextSpan } from "../../../../components";
import FindWearSaved from "./FindWearSaved";
import styled from "styled-components";

const ColFlex = styled(Col)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const AddNewWear = ({
  wearItem,
  onChangeItem,
  onRemove,
  idMachine,
  items,
  intl,
}) => {
  return (
    <>
      <Row>
        <Col breakPoint={{ md: 11 }}>
          <Row>
            <Col breakPoint={{ md: 6 }} className="mb-4">
              <TextSpan apparence="s2">
                <FormattedMessage id="part" />
              </TextSpan>
              <div className="mt-1"></div>
              <SelectPartByMachine
                onChange={(value) => onChangeItem("part", value)}
                value={wearItem?.part}
                placeholder="select.part"
                idMachine={idMachine}
                filterItems={items
                  ?.filter((x) => !!x?.part?.value)
                  ?.map((x) => x?.part?.value)}
              />
            </Col>
            <Col breakPoint={{ md: 3 }} className="mb-4">
              <TextSpan apparence="s2">
                <FormattedMessage id="wear.actual" />
              </TextSpan>
              <div className="mt-1"></div>
              <FindWearSaved
                idMachine={idMachine}
                idPart={wearItem?.part?.value}
              />
            </Col>
            <Col breakPoint={{ md: 3 }} className="mb-4">
              <TextSpan apparence="s2">
                <FormattedMessage id="wear.new" />
              </TextSpan>
              <div className="mt-1"></div>
              <InputGroup fullWidth>
                <input
                  type="number"
                  placeholder={intl.formatMessage({
                    id: "wear.new",
                  })}
                  min={0}
                  value={wearItem?.wear}
                  onChange={(e) => onChangeItem("wear", e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col breakPoint={{ md: 12 }} className="mb-4">
              <TextSpan apparence="s2">
                <FormattedMessage id="reason" />
              </TextSpan>
              <div className="mt-1"></div>

              <InputGroup fullWidth>
                <textarea
                  rows={1}
                  type="text"
                  placeholder={intl.formatMessage({
                    id: "reason",
                  })}
                  value={wearItem?.reason}
                  onChange={(e) => onChangeItem("reason", e.target.value)}
                />
              </InputGroup>
            </Col>
          </Row>
        </Col>
        <ColFlex breakPoint={{ md: 1 }}>
          <Button status="Danger" size="Tiny" onClick={onRemove}>
            <EvaIcon name="trash-2" />
          </Button>
        </ColFlex>
      </Row>
    </>
  );
};

export default injectIntl(AddNewWear);
