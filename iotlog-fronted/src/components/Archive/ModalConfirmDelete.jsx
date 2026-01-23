import { CardFooter } from "@paljs/ui/Card";
import { Button } from "@paljs/ui/Button";
import Row from "@paljs/ui/Row";

import { EvaIcon } from "@paljs/ui";
import { FormattedMessage, useIntl } from "react-intl";
import { Modal, TextSpan } from "../";

const ConfirmDeleteModal = ({
  show,
  onClose,
  onConfirm,
  title = "confirm.delete",
  message,
}) => {
  const intl = useIntl();

  return (
    <Modal
      size="Medium"
      show={show}
      title={intl.formatMessage({ id: title })}
      onClose={onClose}
      styleContent={{ maxHeight: "calc(100vh - 250px)" }}
      renderFooter={() => (
        <CardFooter>
          <Row className="m-0" between="xs">
            <Button
              size="Tiny"
              status="Basic"
              className="flex-between"
              onClick={onClose}
            >
              <EvaIcon name="close-outline" className="mr-1" />
              <FormattedMessage
                id="not"
                defaultMessage={intl.formatMessage({
                  id: "not",
                })}
              />
            </Button>
            <Button
              size="Tiny"
              status="Danger"
              appearance="ghost"
              className="flex-between"
              onClick={onConfirm}
            >
              <EvaIcon name="checkmark-outline" className="mr-1" />
              <FormattedMessage
                id="yes"
                defaultMessage={intl.formatMessage({
                  id: "yes",
                })}
              />
            </Button>
          </Row>
        </CardFooter>
      )}
    >
      <Row className="m-0 pt-2 pb-2">
        <TextSpan appearance="p1">{message}?</TextSpan>
      </Row>
    </Modal>
  );
};

export default ConfirmDeleteModal;
