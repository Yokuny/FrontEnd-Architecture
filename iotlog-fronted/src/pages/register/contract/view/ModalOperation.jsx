import { FormattedMessage, useIntl } from "react-intl";
import { Button, CardFooter, EvaIcon, Row } from "@paljs/ui";
import React from "react";
import { toast } from "react-toastify";
import { Modal } from "../../../../components";
import AddOperation from "./AddOperation";


export default function ModalOperation(props) {
  const { show,
    listGroupConsumptions,
    handleClose,
     dataInitial,
    onSave } = props;

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
    setData(prevState => ({ ...prevState, [field]: value }));
  }

  const handleSave = () => {
    if (!data?.idOperation || !data.idGroupConsumption || !data?.name) {
      toast.warn(intl.formatMessage({ id: "fill.required.fields" }));
      return;
    }

    onSave(data);
  }

  return <>
    <Modal
      size="Large"
      show={show}
      title={intl.formatMessage({ id: "operations" })}
      onClose={handleClose}
      renderFooter={() => (
        <CardFooter>
          <Row end="xs" className="m-0">
            <Button
              size="Tiny"
              status="Success"
              disabled={!data?.idOperation || !data?.idGroupConsumption || !data?.name}
              className="flex-between" onClick={handleSave}>
              <EvaIcon name="checkmark-outline" className="mr-1" />
              <FormattedMessage id="save" />
            </Button>
          </Row>
        </CardFooter>
      )}
    >
      <AddOperation
        listGroupConsumptions={listGroupConsumptions}
        data={data}
        onChange={onChange}
      />
    </Modal>
  </>;
}
