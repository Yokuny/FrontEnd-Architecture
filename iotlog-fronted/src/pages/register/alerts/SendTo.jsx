import { Checkbox, Col, Row } from "@paljs/ui";
import { FormattedMessage } from "react-intl";
import { LabelIcon, TextSpan } from "../../../components";
import {
  SelectAlertType,
  SelectUsers,
  SelectScale,
} from "../../../components/Select";

const SendTo = (props) => {
  const { onChange, data, idEnterprise } = props;

  return (
    <>
      <Row>
        {/* <Col breakPoint={{ md: 12 }} className="mb-4">
          <Checkbox
            className="ml-2"
            checked={data?.useScale}
            onChange={(e) => onChange("useScale", !data?.useScale)}
          >
            <TextSpan apparence="s2">
              <FormattedMessage id="use.scale" />?
            </TextSpan>
          </Checkbox>
        </Col> */}

        {!data?.useScale ? (
          [
            <Col breakPoint={{ md: 12 }} className="mb-4">
              <LabelIcon
                iconName="paper-plane-outline"
                title={<FormattedMessage id="send.by" />}
              />
              <div className="mt-1"></div>
              <SelectAlertType
                onChange={(value) => onChange("sendBy", value)}
                value={data?.sendBy}
                placeholderId="send.by"
              />
            </Col>,
            <Col breakPoint={{ md: 12 }} className="mb-4">
              <LabelIcon
                iconName="people-outline"
                title={<FormattedMessage id="users" />}
              />
              <div className="mt-1"></div>
              <SelectUsers
                onChange={(value) => onChange("users", value)}
                value={data?.users}
                idEnterprise={idEnterprise}
                isMulti
              />
            </Col>,
          ]
        ) : (
          <Col breakPoint={{ md: 12 }}>
            <TextSpan apparence="s2">
              <FormattedMessage id="scale" />
            </TextSpan>
            <div className="mt-1"></div>
            <SelectScale
              onChange={(value) => onChange("scales", value)}
              value={data?.scales}
            />
          </Col>
        )}
      </Row>
    </>
  );
};

export default SendTo;
