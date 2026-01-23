import React from "react";
import { Card, CardBody, CardHeader } from "@paljs/ui/Card";
import TextSpan from "../Text/TextSpan";
import Col from "@paljs/ui/Col";
import Row from "@paljs/ui/Row";
import styled from "styled-components";
import { EvaIcon } from "@paljs/ui/Icon";
import { formatterMbKb } from "../Utils";
import { canDeleteAttachment } from "../Fas/Utils/FasPermissions"
import { toast } from "react-toastify";
import { translate } from "../language";
import Fetch from "../Fetch/Fetch"
import StatusFas from "../../pages/forms/fas/StatusFas";
import { FormattedMessage, useIntl } from "react-intl";
import { Button, Checkbox } from "@paljs/ui";
import DeleteConfirmation from "../Delete/DeleteConfirmation";
import { getFormatFromName } from "../Fas/Utils/Attachments";
import { CardNoShadow } from "../Cards/CardNoShadow";

const ColFlex = styled(Col)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const RowFlex = styled(Row)`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const TextSpanStyled = styled(TextSpan)`
  word-wrap: break-word;
  word-break: break-all;
  text-align: center;
  text-align-last: left;
`;

const ALink = styled.a`
  text-align: justify;
  text-justify: inter-word;
`;

const CardS3File = ({ file, presignedEndpoint, onDelete, orderState, onView, onSelect, selected, ...rest }) => {
  const intl = useIntl();

  const getPresignedUrl = async () => {
    try {
      const response = await Fetch.get(`${presignedEndpoint}?location=${file.url}`);
      if (response.data.invoiceUrl) {
        window.open(response.data.invoiceUrl);
      } else {
        toast.error(translate("error.download"));
      }
    } catch (error) {
      toast.error(translate("error.download"));
    }
  };

  return (
    <React.Fragment>
      <CardNoShadow {...rest}>
        <CardHeader style={{ "padding-top": "0.5rem", "padding-bottom": "0.5rem" }}>
          <Row style={{ "justify-content": "end" }}>
            <div style={{ display: 'flex', flex: 1 }}>
              <Checkbox checked={selected} onChange={() => onSelect(file.location)} />
            </div>
            {["png", "jpg", "jpeg"].includes(
              getFormatFromName(file.name)
            ) &&
              <Button
                size="Tiny"
                status="Basic"
                appearance="ghost"
                className="flex-between"
                onClick={() => onView(file)}>
                <EvaIcon name="eye-outline" className="mr-1" />
              </Button>}
            {canDeleteAttachment({ state: orderState }) &&
              <DeleteConfirmation
                onConfirmation={() => onDelete(file)}
                placement="bottom"
                message={<FormattedMessage id="delete.confirmation.file" />}>
                <Button
                  size="Tiny"
                  status="Info"
                  appearance="ghost">
                  <EvaIcon status="Danger" name="trash-2-outline" />
                </Button>
              </DeleteConfirmation>
            }
          </Row>
        </CardHeader>
        <CardBody>
          <ColFlex>
            <div className="mt-2"></div>
            <EvaIcon status="Basic" name="file" />
            <RowFlex className="mt-2">
              <ALink onClick={getPresignedUrl} target="_blank" className="ml-1 mr-2">
                <TextSpanStyled
                  style={{ textAlign: "center", cursor: "pointer" }}
                  className="mt-1 text-break" apparence="c2">
                  {file?.originalname || file?.name}
                </TextSpanStyled>
              </ALink>
              <span style={{ fontSize: 11 }}>
                {formatterMbKb(file.size)}
              </span>
            </RowFlex>
            <TextSpan className="mr-2 mt-1" apparence="p2" hint>
              <FormattedMessage id="uploaded.state" />:
            </TextSpan>
            <StatusFas
              styleText={{ textAlign: "center", lineHeight: "1.4", marginTop: 5, marginBottom: 5 }}
              status={file.uploadedState} />
            {file.uploadedBy &&
              <>
                <RowFlex className="mt-3">
                  <TextSpan className="mr-2"
                    style={{ marginBottom: 0 }}
                    apparence="p2" hint>
                    <FormattedMessage id="uploaded.by" />:
                  </TextSpan>
                  {file?.uploadedBy?.supplier ?
                    <TextSpan className="mr-2"
                      style={{ textAlign: "center" }}
                      apparence="c2" hint>
                      ({intl.formatMessage({ id: "suppliers" })}) {file.uploadedBy.email}
                    </TextSpan>
                    :
                    <TextSpan
                      style={{ textAlign: "center" }}
                      className="mr-2" apparence="c2" hint>
                      {file.uploadedBy.userId?.name}
                    </TextSpan>
                  }
                </RowFlex>
              </>
            }
          </ColFlex>
        </CardBody>
      </CardNoShadow>
    </React.Fragment>
  );
};
export { CardS3File };
