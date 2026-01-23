import { Button, CardFooter, Col, EvaIcon, InputGroup, Row, Spinner } from "@paljs/ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { toast } from "react-toastify";
import styledComponents from "styled-components";
import { Fetch, LabelIcon, Modal, SelectMachine } from "../../components";

const SpinnerStyled = styledComponents(Spinner)`
    background-color: transparent;
    position: relative;
`;

export default function DuplicateModal(props) {
  const { showModal, setShowModal, onSuccess, idDashboard } = props;

  const [machine, setMachine] = React.useState();
  const [description, setDescription] = React.useState();
  const [isLoading, setIsLoading] = React.useState();

  const intl = useIntl();

  const onDuplicate = () => {
    if (!description) {
      toast.warn(intl.formatMessage({ id: "description.required" }));
      return;
    }

    if (!machine?.value) {
      toast.warn(intl.formatMessage({ id: "machine.required" }));
      return;
    }
    setIsLoading(true);
    Fetch.post('/dashboard/duplicate', {
      machine,
      description,
      idDashboard
    })
      .then(response => {
        toast.success(intl.formatMessage({ id: "save.successfull" }));
        setIsLoading(false);
        onSuccess();
      })
      .catch(e => {
        setIsLoading(false)
      })
  }

  return (
    <>
      <Modal
        size="Medium"
        show={showModal}
        title={intl.formatMessage({ id: "duplicate" })}
        onClose={() => !isLoading && setShowModal(false)}
        styleContent={{ maxHeight: "calc(100vh - 150px)" }}
        renderFooter={() => (
          <CardFooter>
            <Row end="xs">
              <Button
                onClick={onDuplicate}
                size="Small"
                status="Success"
                className="mr-1 flex-between"
                disabled={isLoading || !description || !machine?.value}
              >
                <EvaIcon name="save-outline" className="mr-1" />
                <FormattedMessage id="create.new" />
              </Button>
            </Row>
          </CardFooter>
        )}
      >
        <Row>
          {isLoading
            ?
              <Row center="xs" middle="xs" style={{ width: '100%', margin: 0, height: 150 }}><SpinnerStyled /></Row>
            : <>
              <Col breakPoint={{ md: 12 }} className="mb-4">
                <LabelIcon
                  title={<FormattedMessage id="description" />}
                  iconName="message-circle-outline"
                />
                <InputGroup fullWidth className="mt-1">
                  <input
                    style={{ lineHeight: "0.5rem" }}
                    type="text"
                    placeholder={intl.formatMessage({
                      id: "description.placeholder",
                    })}
                    onChange={(text) => setDescription(text.target.value)}
                    value={description}
                    maxLength={150}
                  />
                </InputGroup>
              </Col>
              <Col breakPoint={{ md: 12 }}>
                <LabelIcon
                  title={<FormattedMessage id="machine" />}
                  iconName="wifi-outline"
                />
                <SelectMachine
                  value={machine}
                  onChange={(value) => setMachine(value)}
                  placeholder={"machine"}
                />
              </Col></>}
        </Row>
      </Modal>
    </>
  )
}
