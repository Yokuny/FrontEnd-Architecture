import React from "react";
import Col from "@paljs/ui/Col";
import AddService from "./AddService";
import { Button } from "@paljs/ui/Button";
import { FormattedMessage, injectIntl } from "react-intl";
import styled from "styled-components";
import { InputGroup } from "@paljs/ui/Input";
import Row from "@paljs/ui/Row";
import ListServices from "./ListServices";
import { EvaIcon } from "@paljs/ui/Icon";
import { TextSpan } from "../../../components";

const Column = styled(Col)`
  display: flex;
  flex-direction: column;
`;

function ListServicesGrouped({
  servicesGrouped,
  onRemoveGroup,
  onAddGroup,
  onChangeItemGroup,
  onAddService,
  onRemoveService,
  onChangeSubItemService,
  intl,
}) {
  return (
    <>
      <Column>
        {servicesGrouped?.map((serviceGrouped, i) => (
          <Row key={`grp-${i}`} className="pl-2 pr-2">
            <Col breakPoint={{ md: 10 }} className="mb-2">
              <TextSpan apparence="s2">
                <FormattedMessage id="name.group" />
              </TextSpan>
              <InputGroup fullWidth className="mt-1">
                <input
                  type="text"
                  placeholder={intl.formatMessage({
                    id: "name.group",
                  })}
                  value={serviceGrouped?.groupName}
                  onChange={(e) =>
                    onChangeItemGroup(i, "groupName", e.target.value)
                  }
                />
              </InputGroup>
            </Col>
            <Col breakPoint={{ md: 2 }} className="col-flex-center pt-2">
              <Button
                status="Danger"
                size="Small"
                appearance="ghost"
                className="flex-between"
                onClick={() => onRemoveGroup(i)}
              >
                <EvaIcon name="trash" className="mr-1"/>
                <FormattedMessage id="delete.group"/>
              </Button>
            </Col>
            <Col breakPoint={{ md: 12 }} className="mb-2">
              <ListServices
                services={serviceGrouped.itens}
                onAdd={() => onAddService(i)}
                onRemove={(subIndex) => onRemoveService(i, subIndex)}
                onChangeItem={(subIndex, prop, value) =>
                  onChangeSubItemService(i, subIndex, prop, value)
                }
                index={i}
              />
            </Col>
          </Row>
        ))}
        <div className="">
          <Button size="Tiny" status="Success" onClick={onAddGroup}>
            <FormattedMessage id="add.group" />
          </Button>
        </div>
      </Column>
    </>
  );
}

export default injectIntl(ListServicesGrouped);
