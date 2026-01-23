import { FormattedMessage, useIntl } from "react-intl";
import { Button, CardFooter, Col, EvaIcon, InputGroup, Row } from "@paljs/ui";
import React from "react";
import { toast } from "react-toastify";
import { LabelIcon, Modal } from "../../../components";


export default function ItemParamsModal(props) {
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
    if (!data?.label || !data?.value) {
      toast.warn(intl.formatMessage({ id: "fill.required.fields" }));
      return;
    }

    onSave(data);
  }

  return <>
    <Modal
      size="Large"
      show={show}
      title={intl.formatMessage({ id: "options" })}
      onClose={handleClose}
      renderFooter={() => (
        <CardFooter>
          <Row end="xs" className="m-0">
            <Button
              size="Tiny"
              status="Success"
              disabled={!data?.label || !data?.value}
              className="flex-between" onClick={handleSave}>
              <EvaIcon name="checkmark-outline" className="mr-1" />
              <FormattedMessage id="save" />
            </Button>
          </Row>
        </CardFooter>
      )}
    >
      <Row>
        <Col breakPoint={{ md: 6, xs: 12 }} className="mb-2">
          <LabelIcon
            title={`${intl.formatMessage({ id: "value" })} *`}
          />
          <InputGroup fullWidth className="mt-1">
            <input
              type="text"
              onChange={(e) => onChange("value", e.target.value)}
              maxLength={200}
              value={data?.value}
            />
          </InputGroup>
        </Col>
        <Col breakPoint={{ md: 6, xs: 12 }} className="mb-2">
          <LabelIcon
            title={`${intl.formatMessage({ id: "label" })} *`}
          />
          <InputGroup fullWidth className="mt-1">
            <input
              type="text"
              onChange={(e) => onChange("label", e.target.value)}
              maxLength={200}
              value={data?.label}
            />
          </InputGroup>
        </Col>

      </Row>
    </Modal>
  </>;
}
