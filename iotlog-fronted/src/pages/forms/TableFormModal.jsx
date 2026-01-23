import { Button, CardFooter, EvaIcon, Row } from "@paljs/ui";
import { FormattedMessage } from "react-intl";
import ContentItem from "./Item";
import { Modal } from "../../components";

export default function TableFormModal({
  showModal,
  handleClose,
  handleSave,
  fields,
  data,
  handleChange,
}) {
  return (
    <Modal
      show={showModal}
      onClose={handleClose}
      title="Editar"
      size="Large"
      styleContent={{
        overflowX: "hidden",
      }}
      renderFooter={() => (
        <CardFooter>
          <Row end="xs" className="m-0">
            <Button
              size="Tiny"
              status="Success"
              className="flex-between"
              onClick={handleSave}
            >
              <EvaIcon name="checkmark-outline" className="mr-1" />
              <FormattedMessage id="save" />
            </Button>
          </Row>
        </CardFooter>
      )}
    >
      <Row className="m-0">
        {fields.map((field, index) => (
          <ContentItem
            key={`${index}-${field.name}`}
            data={data}
            field={field}
            onChange={handleChange}
          />
        ))}
      </Row>
    </Modal>
  );
}
