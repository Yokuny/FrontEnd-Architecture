import React from "react";
import { Card, CardBody, CardHeader } from "@paljs/ui/Card";
import TextSpan from "../../Text/TextSpan";
import Col from "@paljs/ui/Col";
import Row from "@paljs/ui/Row";
import styled from "styled-components";
import { EvaIcon } from "@paljs/ui/Icon";
import { formatterMbKb, getDocumentFormat } from "../../Utils";
import { FormattedMessage, useIntl } from "react-intl";
import { Button } from "@paljs/ui";
import DeleteConfirmation from "../../Delete/DeleteConfirmation";
import { downloadDocument } from "../Utils";

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

const ArchiveDocumentCard = ({ file, presignedEndpoint, onDelete, onView }) => {
  const intl = useIntl();

  return (
    <React.Fragment>
      <Card>
        <CardHeader style={{ "padding-top": "0.5rem", "padding-bottom": "0.5rem" }}>
          <Row style={{ "justify-content": "end" }}>
            {/* {getDocumentFormat(file.format) === "Image" &&
              < Button
                size="Tiny"
                status="Basic"
                appearance="ghost"
                className="flex-between"
                onClick={() => onView(file)}>
                <EvaIcon name="eye-outline" className="mr-1" />
              </Button>
            } */}
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
          </Row>
        </CardHeader>
        <CardBody>
          <ColFlex>
            <div className="mt-2"></div>
            <EvaIcon status="Basic" name="file" />
            <RowFlex className="mt-2">
              <ALink onClick={
                () => downloadDocument(
                  file.url,
                  presignedEndpoint
                )}
                target="_blank"
                className="ml-1 mr-2"
              >
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
            {file.addedBy &&
              <>
                <RowFlex className="mt-3">
                  <TextSpan className="mr-2"
                    style={{ marginBottom: 0 }}
                    apparence="p2" hint>
                    <FormattedMessage id="added.by" />:
                  </TextSpan>

                  <TextSpan
                    style={{ textAlign: "center" }}
                    className="mr-2" apparence="c2" hint>
                    {file.addedBy.name}
                  </TextSpan>
                </RowFlex>
              </>
            }
          </ColFlex>
        </CardBody>
      </Card>
    </React.Fragment >
  );
};
export default ArchiveDocumentCard;
