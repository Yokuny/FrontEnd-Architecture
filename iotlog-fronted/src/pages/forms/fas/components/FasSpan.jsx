import Col from "@paljs/ui/Col";
import { FormattedMessage } from "react-intl";
import { TextSpan, LabelIcon } from "../../../../components";

const FasSpan = ({ breakPoint = { lg: 4, md: 4 }, apparence = "s1", title, text, titleText = "", ...rest }) => {
  return (
    <Col breakPoint={breakPoint} className={`mb-4 ${rest.className}`} {...rest} >
      <LabelIcon
        title={titleText || <FormattedMessage id={title} />}
      />
      <TextSpan apparence={apparence} className="pl-1">
        {text}
      </TextSpan>
    </Col>
  );
}

export { FasSpan }
