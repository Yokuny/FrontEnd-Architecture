import { useState } from "react"
import styled from "styled-components";
import { Card, CardBody, EvaIcon, Popover, Button } from "@paljs/ui";
import { FormattedMessage } from "react-intl";
import { TextSpan } from "../";

const MenuItem = styled.div`
border-bottom: 1px solid #edf1f7;
padding: 0.25rem !important;

&: last-child {
  border-bottom: none;
}
`

const TextSpanStyled = styled(TextSpan)`
  word-wrap: break-word;
  word-break: break-all;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between
`;

export default function OverlayExportFas({
    exportFasPdf,
    exportFasCsv
}) {

    const [show, setShow] = useState(false);
    return (
        <div style={{
            position: "relative"
        }}>
            <Button
                size="Tiny"
                className="flex-between"
                status="Basic"
                appearance="ghost"
                onClick={() => setShow(!show)}
            >
                <EvaIcon className="mr-1" name="download-outline" />
                <FormattedMessage id="export" />
            </Button>

            {show && <Popover
                trigger="click"
                style={{
                    width: "60%",
                    position: "absolute",
                    bottom: "20%",
                    left: "50%",
                    zIndex: 1000,
                    transform: 'translate("-60px")'
                }}
            >
                <Card>
                    <CardBody style={{
                        padding: 0,
                    }}>
                        <MenuItem
                            className="m-2"
                            onClick={() => {
                                setShow(false)
                                exportFasPdf()

                            }}>
                            <TextSpanStyled apparence="s2">
                                PDF
                            </TextSpanStyled>
                        </MenuItem>

                        <MenuItem
                            className="m-2"
                            onClick={() => {
                                setShow(false)
                                exportFasCsv()

                            }}>
                            <TextSpanStyled apparence="s2">
                                <FormattedMessage id="export.sheet" />
                            </TextSpanStyled>
                        </MenuItem>
                    </CardBody>
                </Card>
            </Popover >}
        </div>
    )
}
