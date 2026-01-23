import { Card, CardBody } from "@paljs/ui";
import { TextSpan } from "../../components";
import { floatToStringExtendDot } from "../../components/Utils";

export function Label({ state, unit, label, handleClick }) {
  return (
    <Card onClick={() => handleClick()}>
      <CardBody style={{ padding: "0.4rem 0.6rem" }}>
        <TextSpan apparence="s2">
          <TextSpan apparence="p2" className={"mr-1"} hint>
            {label}:
          </TextSpan>
          {floatToStringExtendDot(state, 1)}
          <TextSpan apparence="p3" className={"ml-1"} hint>
            {unit}
          </TextSpan>
        </TextSpan>
      </CardBody>
    </Card>
  );
}
