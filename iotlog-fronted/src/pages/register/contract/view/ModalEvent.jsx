import { FormattedMessage, useIntl } from "react-intl";
import { Button, CardFooter, EvaIcon, Row } from "@paljs/ui";
import React from "react";
import { toast } from "react-toastify";
import { Modal } from "../../../../components";
import AddEvent from "./AddEvent";

export default function ModalEvent(props) {
  const { show, handleClose, dataInitial, onSave } = props;

  const intl = useIntl();
  const [data, setData] = React.useState(dataInitial);

  React.useEffect(() => {
    if (show) {
      setData(dataInitial);
    }
    else {
      setData({});
    }
  }, [show]);

  const onChange = (field, value) => {
    setData(prevState => ({
      ...prevState,
      [field]: value
    }));
  }

  const handleSave = () => {
    if (!data?.description) {
      toast.warn(intl.formatMessage({ id: "fill.required.fields" }));
      return;
    }

    onSave(data);
  }

  return <>
    <Modal
      size="Large"
      show={show}
      title={intl.formatMessage({ id: "events" })}
      onClose={handleClose}
      renderFooter={() => (
        <CardFooter>
          <Row end="xs" className="m-0">
            <Button
              size="Tiny"
              status="Success"
              disabled={!data?.description}
              className="flex-between" onClick={handleSave}>
              <EvaIcon name="checkmark-outline" className="mr-1" />
              <FormattedMessage id="save" />
            </Button>
          </Row>
        </CardFooter>
      )}
    >
      <AddEvent
        data={data}
        onChange={onChange}
      />
    </Modal>
  </>;
}
