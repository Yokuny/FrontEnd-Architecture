import { Button, Card, EvaIcon } from "@paljs/ui";
import { TextSpan } from "../../components";

export function OnOff({ state, label, handleClick }) {
  const clickIntersect = () => {
    if (state) {
      handleClick();
    }
  };
  return (
    <Card onClick={clickIntersect}>
      {!label && (
        <div
          style={{
            width: "30px",
            height: "30px",
            position: "relative",
            overflow: "visible",
          }}>
          <Button
            style={{
              padding: 0,
              height: "0px",
              width: "0px",
              position: "absolute",
              top: "4px",
              left: "4px",
              pointerEvents: "none",
            }}
            status={"Basic"}
            appearance="ghost">
            <EvaIcon name="compass-outline" />
          </Button>
        </div>
      )}
      {!!label && (
        <div style={{ padding: "2px 8px", display: "flex", alignItems: "center", gap: "1px" }}>
          <TextSpan apparence="p2" hint className={"mr-1"}>
            {label}:
          </TextSpan>

          <Button
            style={{
              padding: 3,
            }}
            size="Tiny"
            status={state ? "Success" : "Basic"}
            className={`${state ? "rotate-on" : "rotate-off"}`}
            appearance="ghost">
            <EvaIcon name="compass-outline" />
          </Button>
          <TextSpan apparence="s2">{state ? "ON" : "OFF"}</TextSpan>
        </div>
      )}
    </Card>
  );
}
