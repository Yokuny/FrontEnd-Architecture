import React from "react";
import { Button } from "@paljs/ui/Button";
import { FormattedMessage } from "react-intl";
import { STATUS_ORDER_SUPPORT } from "../../../../constants";
import { FetchSupport, SpinnerFull } from "../../../../components";

export default function InitMaintenance(props) {
  const [isLoading, setIsLoading] = React.useState(false);

  const onStart = () => {
    const data = {
      description: "",
      status: STATUS_ORDER_SUPPORT.MAINTENANCE,
      idOrderSupport: props.order.id,
      start: true,
    };

    setIsLoading(true);
    FetchSupport.post("/historyordersupport", data)
      .then((response) => {
        setIsLoading(false);
        props.onChangeStatus(data.status);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  return (
    <>
      <Button status="Success" size="Small" onClick={onStart}>
        <FormattedMessage id="init.maintenance" />
      </Button>
      <SpinnerFull isLoading={isLoading} />
    </>
  );
}
