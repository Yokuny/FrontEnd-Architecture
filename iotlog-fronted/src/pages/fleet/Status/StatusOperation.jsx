import { CardBody } from "@paljs/ui";
import { CardContainerStyled, ColStyled, IconStyled, RowStyled } from "./styles";
import { getIconStatusOperation } from "./Utils";
import { TextSpan } from "../../../components";

export function StatusOperation({ data, item: itemData, ...rest }) {
  const item = data?.find((y) => y.status === itemData);

  if (!item) {
    return null;
  }

  const icon = getIconStatusOperation(itemData);

  return (
    <CardContainerStyled size="Tiny" {...rest}>
      <CardBody className="mb-0" style={{ padding: 0 }}>
        <RowStyled>
          <ColStyled>
            <IconStyled>{icon?.icon}</IconStyled>
          </ColStyled>
          <ColStyled
            style={{
              width: "100%",
              justifyContent: "center",
              marginLeft: "-1.5rem",
              paddingTop: "0.5rem",
            }}
          >
            <TextSpan apparence="h4">{item?.total}</TextSpan>

            <TextSpan apparence="p2" className="mt-1" hint>
              {icon?.label}
            </TextSpan>
          </ColStyled>
        </RowStyled>
      </CardBody>
    </CardContainerStyled>
  );
}
