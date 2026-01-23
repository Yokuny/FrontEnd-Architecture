import React from "react";
import { Button } from "@paljs/ui/Button";
import { FormattedMessage } from "react-intl";
import { SpinnerFull, FetchSupport } from "../../../../components";
import { STATUS_ORDER_SUPPORT } from "../../../../constants";

export default function InitAttendace(props) {
  const [isLoading, setIsLoading] = React.useState(false);

  const onStart = () => {
    const data = {
      description: "",
      status: STATUS_ORDER_SUPPORT.ATTENDANCE,
      idOrderSupport: props.order.id,
      idTypeProblem: props.order.idTypeProblem,
      idEnterprise: props.order.idEnterprise,
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
        <FormattedMessage id="init.support" />
      </Button>
      <SpinnerFull isLoading={isLoading}/>
    </>
  );
}
