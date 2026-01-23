import { useTheme } from "styled-components";
import { CardBody } from "@paljs/ui";
import { FormattedMessage } from "react-intl";
import { TextSpan } from "../../../components";
import { getIcon } from "../Details/StatusAsset/TimelineStatus/IconTimelineStatus";
import { CardContainerStyled, ColStyled, IconStyled, RowStyled } from "./styles";

export function StatusNavigation({ data, item, ...rest }) {
  const theme = useTheme();

  const statusInternal = data.find((x) =>
    item.accept.includes(x.status?.toLowerCase())
  );

  if (!statusInternal) {
    return null;
  }

  const icon = getIcon(item.value, theme, true);

  return (
    <CardContainerStyled size="Tiny" {...rest}>
      <CardBody className="mb-0" style={{ padding: 0 }}>
        <RowStyled>
          <ColStyled>
            <IconStyled>{icon?.component}</IconStyled>
          </ColStyled>
          <ColStyled
            style={{
              width: "100%",
              justifyContent: "center",
              marginLeft: "-1.5rem",
              paddingTop: "0.5rem",
            }}
          >
            <TextSpan apparence="h4">{statusInternal?.total}</TextSpan>

            <TextSpan apparence="p2" className="mt-1" hint>
              {icon?.text && <FormattedMessage id={icon.text} />}
            </TextSpan>
          </ColStyled>
        </RowStyled>
      </CardBody>
    </CardContainerStyled>
  );
}
