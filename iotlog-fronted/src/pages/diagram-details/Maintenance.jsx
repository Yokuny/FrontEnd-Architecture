import { Button, Card, Tooltip } from "@paljs/ui";
import styled from "styled-components";
import { TextSpan } from "../../components";
import { useState } from "react";
import ModalMaintenanceDetails from "./ModalMaintenanceDetails";

const ContentStyled = styled.div`
  .rotate-on {
    transform: rotate(-45deg);
    border-radius: 50%;
    border: none;
  }

  .rotate-off {
    transform: rotate(45deg);
    border-radius: 50%;
    border: none;
  }
`;

/**
 * Componente Maintenance com 3 status diferentes:
 * - state = 'success' ou true: Status de sucesso (verde) com ícone checkmark-circle-2-outline
 * - state = 'warning': Status de alerta (amarelo) com ícone alert-triangle-outline
 * - state = 'error' ou 'danger': Status de falha (vermelho) com ícone close-circle-outline
 * - state = qualquer outro valor: Default para sucesso (verde) com ícone checkmark-circle-2-outline
 *
 * Exemplo de uso:
 * <Maintenance state="success" label="Manutenção" handleClick={handleClick} />
 * <Maintenance state="warning" label="Alerta" handleClick={handleClick} />
 * <Maintenance state="error" label="Falha" handleClick={handleClick} />
 * <Maintenance state="success" label="Manutenção" handleClick={handleClick} useTooltip={true} machineId="123" equipment="Motor" />
 */
export function Maintenance({ state, label, isEditting = false, handleClick, useTooltip = false, machineId, equipment }) {
  const [showModal, setShowModal] = useState(false);
  // Função para determinar o status e ícone baseado no state
  const getStatusAndIcon = (state) => {
    if (state === "success" || state === true) {
      return {
        status: "Success",
        icon: "🟢",
      };
    } else if (state === "warning") {
      return {
        status: "Warning",
        icon: "🟡",
      };
    } else if (state === "error" || state === "danger") {
      return {
        status: "Danger",
        icon: "🔴",
      };
    } else {
      // Default: sucesso
      return {
        status: "Success",
        icon: "🔵",
      };
    }
  };

  const { status, icon } = getStatusAndIcon(state);

  const handleButtonClick = () => {
    if (machineId && equipment) {
      setShowModal(true);
    } else if (handleClick) {
      handleClick();
    }
  };

  const buttonComponent = (
    <Button onClick={handleButtonClick}
    style={{ padding: 3, border: "none" }} size="Medium" appearance="outline">
      {icon}
    </Button>
  );

  return (
    <Button  style={{ padding: "8px", border: "none" }} size="Tiny" appearance="ghost">
      <ContentStyled>
        {!label && buttonComponent}
        {!!label && !useTooltip && (
          <>
            <TextSpan apparence="p2" hint className={"mr-1"}>
              {label}:
            </TextSpan>
            {buttonComponent}
          </>
        )}
        {!!label && useTooltip && (
          <Tooltip placement="top" content={label} trigger="hint">
            {buttonComponent}
          </Tooltip>
        )}
      </ContentStyled>
      {!isEditting &&
        <ModalMaintenanceDetails
          show={showModal}
          onClose={() => setShowModal(false)}
          machineId={machineId}
          equipment={equipment}
        />
      }
    </Button>
  );
}
