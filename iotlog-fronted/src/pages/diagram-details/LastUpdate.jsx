import { Card } from "@paljs/ui";
import { useIntl } from "react-intl";
import moment from "moment";
import { TextSpan } from "../../components";

export default function LastUpdate({ date }) {
  const intl = useIntl();
  return (
    <Card
      style={{
        position: "absolute",
        bottom: -20,
        right: 7,
        padding: 2
      }}
    >
      <TextSpan apparence="s3">
        <TextSpan apparence="p3" hint>
          {intl.formatMessage({ id: "last.date.acronym" })}:
        </TextSpan>
        {moment(date).format("DD/MM/YYYY HH:mm:ss")}
      </TextSpan>
    </Card>
  );
}
