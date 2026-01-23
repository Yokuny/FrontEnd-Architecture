import { EvaIcon, Row } from "@paljs/ui";
import { FormattedMessage } from "react-intl";
import { LabelIcon } from "../Label";
import TextSpan from "../Text/TextSpan";

export default function InputUserLocal(props) {
  const { user, isDisabled } = props;

  const getUserLocal = () => {
    let userInternal = {};
    try {
      userInternal = JSON.parse(localStorage.getItem("user"));
    } catch {}
    return userInternal;
  };

  const userToShow = user || getUserLocal();

  return (
    <>
      <Row style={{ margin: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
        <LabelIcon
          iconName="edit-outline"
          title={props.title || <FormattedMessage id="user" />}
        />
        <Row style={{ margin: 0 }} className="mt-1" middle>
          <EvaIcon
            name="person-outline"
            status={isDisabled ? "Basic" : "Primary"}
          />
          <TextSpan apparence="s2" hint={isDisabled} className="ml-1">
            {userToShow?.name ?? "-"}
          </TextSpan>
        </Row>
      </Row>
    </>
  );
}
