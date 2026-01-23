import Col from "@paljs/ui/Col";
import { FormattedMessage } from "react-intl";
import { LabelIcon } from "../../../../components";

const FasSpanOrderDescription = ({ breakPoint = { lg: 4, md: 4 }, apparence = "s1", title, text, titleText = "", ...rest }) => {

  return (
    <Col breakPoint={breakPoint} className={`mb-4 ${rest.className}`} {...rest} >
      <LabelIcon
        title={titleText || <FormattedMessage id={title} />}
      />
      <div style={{
        fontWeight: "600",
        fontSize: "0.9rem",
        "white-space": "pre-line"
      }} className="pl-1">
        {text}
      </div>
    </Col>
  );
}

export { FasSpanOrderDescription }
