import Col from "@paljs/ui/Col";
import styled from "styled-components";
import { InputGroup } from "@paljs/ui/Input";
import { Button } from "@paljs/ui/Button";
import { EvaIcon } from "@paljs/ui/Icon"
import {
    LabelIcon,
} from "../";
import { FormattedMessage, useIntl } from "react-intl";

const ColStyle = styled(Col)`
  display: flex;
  width: 100%;
  flex-direction: column;
`

const RefusalReasonField = ({ onChange, onRefuse, onCancel, ...rest }) => {
    const intl = useIntl();

    return (
        <ColStyle breakPoint={{ lg: 12, md: 12 }} className="mb-4">
            <LabelIcon
                title={<FormattedMessage id={!rest?.delete ? "refuse" : "cancel.reason"} />}
            />
            <div className="flex-row mb-4 mt-2" style={{ alignItems: "center" }}>
                <InputGroup fullWidth className="flex-row">
                    <textarea
                        type="text"
                        placeholder={intl.formatMessage({
                            id: "reason",
                        })}
                        rows={3}
                        onChange={(text) => onChange(text.target.value)}
                    />
                </InputGroup>
                <div className="ml-4">
                    <Button className="flex-between"
                        status="Danger"
                        size="Tiny"
                        onClick={onRefuse}>
                        <EvaIcon name="file-remove-outline" className="mr-1" />
                        <FormattedMessage id={!rest?.delete ? "refuse" : "delete"} />
                    </Button>

                    <Button className="mt-3 flex-between"
                        status="Basic"
                        size="Tiny"
                        appearance="ghost"
                        onClick={() => onCancel()}>
                        <EvaIcon name="close-outline" className="mr-1" />
                        <FormattedMessage id="cancel" />
                    </Button>
                </div>
            </div>
        </ColStyle>
    )
}

export default RefusalReasonField;