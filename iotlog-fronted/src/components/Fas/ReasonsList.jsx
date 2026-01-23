import {
  LabelIcon,
  TextSpan,
} from "../";
import { FormattedMessage } from "react-intl";
import styled from "styled-components";
import Col from "@paljs/ui/Col";

const ColStyle = styled(Col)`
  display: flex;
  width: 100%;
  flex-direction: column;
`

const ReasonsList = ({data, title}) => {
    return (
        <ColStyle className="mb-4">
            <LabelIcon
                title={<FormattedMessage id={title} />}
            />
            <ol style={{ marginTop: 0 }}>
                {[...(data || [])].reverse().map((reason, i) => (
                <li key={i} className="mb-1">
                    <TextSpan apparence="s1">
                    {reason}
                    </TextSpan>
                </li>
                ))}
            </ol>
        </ColStyle>
    )
}

export default ReasonsList;
