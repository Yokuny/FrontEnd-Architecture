import { Button, EvaIcon, Row, Tooltip } from "@paljs/ui";
import { FormattedMessage } from "react-intl";
import {
  TextSpan,
} from "../../";
import { QRCodeIcon } from "../../Icons";
import { TD } from "../../Table";

export const RenderFolder = (folder, document, onRefresh = undefined, onOpenQRCode = undefined) => {
  return <>
    <TD rowspan={document?.empty ? 1 : folder?.documents?.length}
      onClick={() => onRefresh(folder)}
    >
      <Row
        className="m-0 pl-4 pt-2 pb-2"
        middle="xs"
        style={{ display: "flex", flexWrap: "nowrap" }}>
        <EvaIcon name="folder" status="Warning" />
        <div className="ml-2">
          <TextSpan apparence="s2">
            {folder?.name}
          </TextSpan>
        </div>
      </Row>
    </TD>
    <TD textAlign="center" rowspan={document?.empty ? 1 : folder?.documents?.length}>
      <TextSpan apparence="p2">
        {folder?.visibility ? <FormattedMessage id={folder?.visibility} /> : "N/A"}
      </TextSpan>
    </TD>
    <TD rowspan={folder?.empty ? 1 : folder?.documents?.length}
      onClick={() => onRefresh(folder)}
    >
      <Row className="m-0">
        <Tooltip placement="top"
          content={"Abrir Pasta"}
          trigger="hint"
        >
          <Button size="Tiny"
          style={{ padding: 3 }}
            onClick={() => onRefresh(folder)}
            status="Basic">
            <EvaIcon name="eye-outline" />
          </Button>
        </Tooltip>
        <Tooltip placement="top"
          content={"QR Code"}
          trigger="hint"
        >
          <Button size="Tiny"
            className="ml-3"
            style={{
              padding: 3,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
            onClick={() => onOpenQRCode(folder)}
            status="Info">
            <QRCodeIcon
              style={{ width: 20, height: 20, fill: '#fff' }}
            />
          </Button>
        </Tooltip>
      </Row>
    </TD>
  </>;
}
