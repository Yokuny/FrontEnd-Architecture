import { FormattedMessage, useIntl } from "react-intl";
import { Button, CardFooter, Col, EvaIcon, InputGroup, Row } from "@paljs/ui";
import React from "react";
import { toast } from "react-toastify";
import { InputDecimal, LabelIcon, Modal } from "../../../../components";


export default function ModalGroupConsumption(props) {
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
    if (!data?.code) {
      toast.warn(intl.formatMessage({ id: "fill.required.fields" }));
      return;
    }

    onSave(data);
  }

  return <>
    <Modal
      size="Large"
      show={show}
      title={intl.formatMessage({ id: "group.consumption" })}
      onClose={handleClose}
      renderFooter={() => (
        <CardFooter>
          <Row end="xs" className="m-0">
            <Button
              size="Tiny"
              status="Success"
              disabled={!data?.code}
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
            title={`${intl.formatMessage({ id: "code" })} *`}
          />
          <InputGroup fullWidth className="mt-1">
            <input
              type="code"
              onChange={(e) => onChange("code", e.target.value)}
              maxLength={200}
              value={data?.code}
            />
          </InputGroup>
        </Col>
        <Col breakPoint={{ md: 6, xs: 12 }} className="mb-2">
          <LabelIcon
            title={`${intl.formatMessage({ id: "consumption" })} (m³) *`}
          />
          <InputGroup fullWidth className="mt-1">
            <InputDecimal
              onChange={(e) => onChange("consumption", e)}
              value={data?.consumption}
              sizeDecimals={2}
            />
          </InputGroup>
        </Col>
        <Col breakPoint={{ md: 12, xs: 12 }} className="mb-2">
          <LabelIcon
            title={<FormattedMessage id="description" />}
          />
          <InputGroup fullWidth className="mt-1">
            <textarea
              type="text"
              onChange={(e) => onChange("description", e.target.value)}
              maxLength={200}
              value={data?.description}
            />
          </InputGroup>
        </Col>
      </Row>
    </Modal>
  </>;
}
