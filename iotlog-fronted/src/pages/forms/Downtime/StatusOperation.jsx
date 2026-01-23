import { Badge } from "@paljs/ui";
import { optionsOperation } from "./Options";
import { useTheme } from "styled-components";

export default function StatusOperation(props) {
  const { status } = props;

  const theme = useTheme();

  const statusItem = optionsOperation.find((item) => item.value === status);

  if (!statusItem) return null;

  return (<>
    <Badge style={{
      backgroundColor:
      statusItem?.value === 'off-hire' ?
      theme.backgroundBasicColor3 : statusItem?.color,
      color: statusItem?.value === 'off-hire'
      ? theme.textBasicColor
      : theme.textAlternateColor,
      position: "relative",
    }}>
      {statusItem?.label}
    </Badge>
  </>
  );
}
