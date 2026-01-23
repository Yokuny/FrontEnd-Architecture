import { useState } from "react";
import { toast } from "react-toastify";
import Col from "@paljs/ui/Col";
import styled from "styled-components";
import { InputGroup } from "@paljs/ui/Input";
import { Button } from "@paljs/ui/Button";
import { EvaIcon } from "@paljs/ui/Icon";
import { Modal, Fetch } from "../../../../components";
import { FormattedMessage, useIntl } from "react-intl";
import { SpinnerFull } from "../../../../components";

const ColStyle = styled(Col)`
  display: flex;
  width: 100%;
  flex-direction: column;
`;

const ModalRVEJustification = ({ show, onClose, data }) => {
  const intl = useIntl();
  const [internalJustificative, setInternalJustificative] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!data?.current) return;

  const onJustify = () => {
    setIsLoading(true);
    if (!internalJustificative) {
      toast.error(intl.formatMessage({ id: "justificative.required" }));
      return;
    }

    Fetch.post(`/formdata/justifyrve?`, {
      id: data.current.formDataId,
      idForm: data.current.formId,
      justificative: internalJustificative,
    })
      .then((_) => handleClose())
      .catch((_) => handleClose())
      .finally((_) => setIsLoading(false));
  };

  const handleClose = () => {
    setInternalJustificative("");
    onClose();
  };

  return (
    <Modal
      size="Large"
      show={show}
      title={intl.formatMessage({ id: "justify.divergencie" })}
      onClose={handleClose}
    >
      <ColStyle breakPoint={{ lg: 12, md: 12 }} className="mb-4">
        <div className="flex-row mb-4 mt-2" style={{ alignItems: "center" }}>
          <InputGroup fullWidth className="flex-row">
            <textarea
              type="text"
              placeholder={intl.formatMessage({
                id: "justificative",
              })}
              rows={3}
              onChange={(text) => setInternalJustificative(text.target.value)}
            />
          </InputGroup>
          <div className="ml-4">
            <Button
              className="flex-between"
              status="Warning"
              size="Tiny"
              onClick={onJustify}
            >
              <EvaIcon name="bell-off" className="mr-1" />
              <FormattedMessage id={"justify"} />
            </Button>

            <Button
              className="mt-3 flex-between"
              status="Basic"
              size="Tiny"
              appearance="ghost"
              onClick={onClose}
            >
              <EvaIcon name="close-outline" className="mr-1" />
              <FormattedMessage id="cancel" />
            </Button>
          </div>
        </div>
      </ColStyle>
      <SpinnerFull isLoading={isLoading} />
    </Modal>
  );
};

export default ModalRVEJustification;
