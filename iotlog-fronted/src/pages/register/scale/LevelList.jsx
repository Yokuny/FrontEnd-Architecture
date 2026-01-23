import React from "react";
import Col from "@paljs/ui/Col";
import LevelAdd from "./LevelAdd";
import { Button } from "@paljs/ui/Button";
import { FormattedMessage } from "react-intl";
import styled from "styled-components";

const Column = styled(Col)`
  display: flex;
  flex-direction: column;
`;

export default function LevelList({
  levels,
  onRemoveLevel,
  onAddLevel,
  onChangeItem,
  enterprise
}) {
  const verifyEmpty = (level) => {
    return Object.keys(level)
      .filter((x) => x === "id" || x === "level")
      .some((x) => !level[x]);
  };

  return (
    <>
      <Column className="mt-4">
        {levels?.map((level, i) => {
          return (
            <LevelAdd
              key={i}
              removeLevel={() => onRemoveLevel(i)}
              level={level}
              onChangeItem={(name, value) => onChangeItem(i, name, value)}
              enterprise={enterprise}
            />
          );
        })}
        <div className="mb-1">
          <Button
            disabled={
              !!(levels?.length && verifyEmpty(levels[levels.length - 1]))
            }
            size="Tiny"
            status="Info"
            onClick={onAddLevel}
          >
            <FormattedMessage id="new.scale.level" />
          </Button>
        </div>
      </Column>
    </>
  );
}
