import React from "react";
import Col from "@paljs/ui/Col";
import AddPartCycle from "./AddPartCycle";
import { Button } from "@paljs/ui/Button";
import { FormattedMessage } from "react-intl";
import styled from "styled-components";

const Column = styled(Col)`
  display: flex;
  flex-direction: column;
`;

export default function ListPartsCycle({
  partsCycle,
  onRemove,
  onAdd,
  onChangeItem,
  enterprise
}) {
  const verifyEmpty = (partService) => {
    return !partService.part?.value || !partService.typeService?.value;
  };

  return (
    <>
      <Column>
        {!!partsCycle?.length &&
          partsCycle.map((partCycle, i) => {
            return (
              <AddPartCycle
                key={i}
                onRemove={() => onRemove(i)}
                partCycle={partCycle}
                onChangeItem={(name, value) => onChangeItem(i, name, value)}
                enterprise={enterprise}
              />
            );
          })}
        <div className="">
          <Button
            disabled={
              !!(partsCycle?.length && verifyEmpty(partsCycle[partsCycle.length - 1]))
            }
            size="Tiny"
            status="Info"
            onClick={onAdd}
          >
            <FormattedMessage id="add.item" />
          </Button>
        </div>
      </Column>
    </>
  );
}
