import React from 'react';
import { Button, Tooltip, EvaIcon } from "@paljs/ui";
import { FormattedMessage, useIntl } from 'react-intl';
import { TextSpan } from '../../../components';
import { Fetch } from '../../../components';
import { toast } from "react-toastify";
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const SpinningEvaIcon = styled(EvaIcon)`
  animation: ${spin} 1.5s linear infinite;
`;

const ConsumptionButton = ({ itemData, idForm }) => {
  const [loading, setLoading] = React.useState(false);
  const intl = useIntl();

  const [currentConsumptionState, setCurrentConsumptionState] = React.useState(() => {
    const codigoOperacional = itemData?.data?.codigoOperacional?.value;
    const considerConsumption = itemData?.data?.considerConsumption;
    const dateDisconsiderConsumption = itemData?.data?.dateDisconsiderConsumption;

    return !codigoOperacional?.startsWith('IN')
      ? considerConsumption !== false || !dateDisconsiderConsumption
      : considerConsumption === true;
  });

  React.useEffect(() => {
    const codigoOperacional = itemData?.data?.codigoOperacional?.value;
    const considerConsumption = itemData?.data?.considerConsumption;
    const dateDisconsiderConsumption = itemData?.data?.dateDisconsiderConsumption;

    setCurrentConsumptionState(
      !codigoOperacional?.startsWith('IN')
        ? considerConsumption !== false || !dateDisconsiderConsumption
        : considerConsumption === true
    );
  }, [itemData]);

  const handleToggleConsumption = async () => {
    try {
      setLoading(true);
      const endpoint = currentConsumptionState
        ? `/formdata/consumptiondisconsiderrve?idForm=${idForm}&id=${itemData.id}`
        : `/formdata/consumptionconsiderrve?idForm=${idForm}&id=${itemData.id}`;

      await Fetch.patch(endpoint);

      setCurrentConsumptionState(!currentConsumptionState);

      toast.success(
        intl.formatMessage({
          id: currentConsumptionState
            ? "fillform.disregard.activated"
            : "fillform.consideration.activated",
        })
      );

    } catch (error) {
      toast.error(
        intl.formatMessage({
          id: currentConsumptionState
            ? "consumption.disconsidered.error"
            : "consumption.considered.error",
        })
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Tooltip
      placement="top"
      content={
        <>
          <TextSpan apparence="s2">
            <FormattedMessage
              id={currentConsumptionState ? "fillform.disregard.consumption" : "fillform.consider.consumption"}
            />
          </TextSpan>
        </>
      }
      trigger="hint"
    >
      <Button
        size="Tiny"
        appearance="ghost"
        status={currentConsumptionState ? "Info" : "Danger"}
        style={{ padding: 1 }}
        onClick={handleToggleConsumption}
        disabled={loading}
      >
        {loading ? (
          <SpinningEvaIcon name="loader-outline" />
        ) : (
          <EvaIcon name={currentConsumptionState ? "droplet" : "droplet-off-outline"} />
        )}
      </Button>
    </Tooltip>
  );
};

export default ConsumptionButton;
