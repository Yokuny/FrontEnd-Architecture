import React from "react";
import { injectIntl } from "react-intl";
import { InputGroup } from "@paljs/ui/Input";
import { Fetch } from "../../../../components";

const FindWearSaved = ({ idMachine, idPart }) => {
  const [value, setValue] = React.useState(0);
  React.useEffect(() => {
    if (idMachine && idPart) {
      Fetch.get(
        `/wearpart/findwear?idMachine=${idMachine}&idPart=${idPart}`
      ).then((response) => {
        setValue(response?.data?.wear || 0);
      });
    } else {
      setValue(0);
    }
  }, [idMachine, idPart]);

  return (
    <>
      <InputGroup fullWidth>
        <input type="number" value={value} readOnly />
      </InputGroup>
    </>
  );
};

export default injectIntl(FindWearSaved);
