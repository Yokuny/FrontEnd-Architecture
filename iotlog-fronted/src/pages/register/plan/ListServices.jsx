import React from "react";
import Col from "@paljs/ui/Col";
import AddService from "./AddService";
import { Button } from "@paljs/ui/Button";
import { FormattedMessage } from "react-intl";
import styled from "styled-components";

const Column = styled(Col)`
  display: flex;
  flex-direction: column;
`;

export default function ListServices({
  services,
  onRemove,
  onAdd,
  onChangeItem,
  index
}) {
  const verifyEmpty = (itemService) => {
    return !itemService.description;
  };

  return (
    <>
      <Column>
        {services?.map((service, i) => {
            return (
              <AddService
                key={`idx-${index}-${i}`}
                onRemove={() => onRemove(i)}
                service={service}
                onChangeItem={(name, value) => onChangeItem(i, name, value)}
              />
            );
          })}
        <div className="pl-4 mb-4">
          <Button
            disabled={
              !!(services?.length && verifyEmpty(services[services.length - 1]))
            }
            size="Tiny"
            status="Info"
            onClick={onAdd}
          >
            <FormattedMessage id="add.service" />
          </Button>
        </div>
      </Column>
    </>
  );
}
