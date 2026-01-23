import React from "react";
import { Button, CardFooter, EvaIcon, Row } from "@paljs/ui";
import { FormattedMessage, useIntl } from "react-intl";
import { toast } from "react-toastify";
import { Fetch, TextSpan } from "../../../components";
import { SkeletonThemed } from "../../../components/Skeleton";

export default function RVEConsumptionConsider({
  formData,
  formSelected,
}) {
  const [isLoadingConsumption, setIsLoadingConsumption] = React.useState(false);
  const [isConsumingConsidered, setIsConsumingConsidered] =
    React.useState(false);

  const intl = useIntl();

  React.useEffect(() => {
    const checkAndCallINCode = async () => {
      const value = formData?.codigoOperacional?.value;
      if (value?.startsWith("IN") && formSelected?.idForm && formSelected?.id) {
        try {
          setIsLoadingConsumption(true);
          const response = await Fetch.get(
            `/formdata/isconsiderconsumptionrve?idForm=${formSelected.idForm}&id=${formSelected.id}`
          );
          setIsConsumingConsidered(
            response?.data?.considerConsumption === true
          );
          setIsLoadingConsumption(false);
        } catch (error) {
          setIsLoadingConsumption(false);
        }
      }
    };

    checkAndCallINCode();
  }, [
    formData?.codigoOperacional?.value,
    formSelected?.idForm,
    formSelected?.id,
  ]);

  const activateConsiderConsumption = async () => {
    if (formSelected?.idForm && formSelected?.id) {
      try {
        setIsLoadingConsumption(true);
        const response = await Fetch.patch(
          `/formdata/consumptionconsiderrve?idForm=${formSelected.idForm}&id=${formSelected.id}`
        );

        if (response.data?.considerConsumption) {
          setIsConsumingConsidered(true);
          toast.success(
            intl.formatMessage({
              id: "fillform.consideration.activated",
            })
          );
        }
        setIsLoadingConsumption(false);
      } catch (error) {
        toast.error(
          intl.formatMessage({
            id: "fillform.consideration.error",
          })
        );
        setIsLoadingConsumption(false);
      }
    }
  };

  return <>
    {isLoadingConsumption
      ? <CardFooter><SkeletonThemed height={20} width={150} /></CardFooter>
      : formData?.codigoOperacional?.value?.startsWith("IN") &&
      formSelected.id &&
      (
        <CardFooter>
          <div style={{ flex: 1 }}>
            {!isConsumingConsidered ? (
              <Button
                size="Tiny"
                status="Info"
                appearance="ghost"
                className="flex-between"
                onClick={activateConsiderConsumption}
              >
                <EvaIcon
                  className="mr-1"
                  name={"droplet-outline"}
                />
                <FormattedMessage
                  id="fillform.consider.consumption"
                />
              </Button>
            ) : (
              <Row middle="xs" className="m-0">
                <EvaIcon
                  name="info-outline"
                  status="Warning"
                  className="mr-1"
                />
                <TextSpan apparence="p2" hint>
                  <FormattedMessage
                    id="fillform.considering.consumption"
                  />
                </TextSpan>
              </Row>
            )}
          </div>
        </CardFooter>
      )}
  </>
}
