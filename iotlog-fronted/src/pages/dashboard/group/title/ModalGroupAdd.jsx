import React from 'react'
import { Button, CardFooter, Col, InputGroup, Row } from "@paljs/ui";
import { FormattedMessage, useIntl } from "react-intl";
import { LabelIcon, Modal } from "../../../../components"

export default function ModalGroupAdd(props) {
  const { show, onClose, onSave, description } = props;
  const [descriptionInternal, setDescription] = React.useState(description);

  const intl = useIntl();

  const renderFooter = () => {
    return (
      <>
        <CardFooter>
          <Row className="mr-1 ml-1" end="xs">
            <Button
              disabled={!descriptionInternal || (!!description && description === descriptionInternal)}
              size="Small" onClick={() => onSave({ description: descriptionInternal })}>
              <FormattedMessage id="save" />
            </Button>
          </Row>
        </CardFooter>
      </>
    )
  };

  return (
    <Modal
      show={show}
      onClose={onClose}
      size="Small"
      title="add.group"
      renderFooter={renderFooter}
    >
      <Row>
        <Col breakPoint={{ md: 12 }} className="mb-4">
          <LabelIcon
            title={<FormattedMessage id="description" />}
            iconName="text-outline"
          />
          <InputGroup fullWidth>
            <input
              type="text"
              value={descriptionInternal}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={50}
              placeholder={intl.formatMessage({ id: "description" })} />
          </InputGroup>
        </Col>
      </Row>
    </Modal>
  )
}
