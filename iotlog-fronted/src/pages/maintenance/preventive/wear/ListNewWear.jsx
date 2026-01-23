import React from "react";
import Col from "@paljs/ui/Col";
import { Button } from "@paljs/ui/Button";
import { FormattedMessage } from "react-intl";
import styled from "styled-components";
import AddNewWear from "./AddNewWear";

const Column = styled(Col)`
  display: flex;
  flex-direction: column;
`;

export default function ListNewWear({
  wearItems,
  onRemove,
  onAdd,
  onChangeItem,
  idMachine,
}) {
  const verifyEmpty = (partService) => {
    return (
      !partService?.part?.value || !partService?.wear || !partService?.reason
    );
  };

  return (
    <>
      <Column>
        {wearItems?.map((wearItem, i) => {
          return (
            <AddNewWear
              key={i}
              onRemove={() => onRemove(i)}
              wearItem={wearItem}
              onChangeItem={(name, value) => onChangeItem(i, name, value)}
              idMachine={idMachine}
              items={wearItems}
            />
          );
        })}
        <div>
          <Button
            disabled={
              !!(
                wearItems?.length &&
                verifyEmpty(wearItems[wearItems.length - 1])
              )
            }
            size="Tiny"
            status="Info"
            onClick={onAdd}
          >
            <FormattedMessage id="add.part" />
          </Button>
        </div>
      </Column>
    </>
  );
}
