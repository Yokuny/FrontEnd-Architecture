import { Button } from "@paljs/ui/Button";
import Col from "@paljs/ui/Col";
import { InputGroup } from "@paljs/ui/Input";
import Row from "@paljs/ui/Row";
import React from "react";
import { FormattedMessage, injectIntl } from "react-intl";
import { toast } from "react-toastify";
import styled from "styled-components";
import {
  DateTime,
  SelectUsers,
  SpinnerFull,
  TextSpan,
} from "../../../../components";
import Fetch from "../../../../components/Fetch/Fetch";
import moment from "moment";

const ContainerRow = styled(Row)`
  margin-top: 15px !important;

  input {
    line-height: 0.5rem;
  }

  input[type="date"] {
    line-height: 1.1rem;
  }

  svg {
    margin-top: -4px;
  }
`;

const SaveMaintenance = ({ idEnterprise, idMachine, idMaintenance, intl }) => {
  const [doneAt, setDoneAt] = React.useState(moment().format("YYYY-MM-DD"));
  const [user, setUser] = React.useState();
  const [isSaving, setIsSaving] = React.useState(false);
  const [description, setDescription] = React.useState();

  const onSave = () => {
    setIsSaving(true);
    const data = {
      idMachine,
      idMaintenancePlan: idMaintenance,
      doneAt,
      doneBy: user?.map((x) => x.value),
      description,
    };
    Fetch.post("/maintenancemachine", data)
      .then((response) => {
        toast.success(intl.formatMessage({ id: "save.successfull" }));
        setIsSaving(false);
      })
      .catch((e) => {
        setIsSaving(false);
      });
  };

  return (
    <>
      <TextSpan apparence="s1">
        <FormattedMessage id="save.maintenance.done" />
      </TextSpan>
      <ContainerRow>
        <Col breakPoint={{ md: 9 }} className="mb-4">
          <SelectUsers
            idEnterprise={idEnterprise}
            onChange={setUser}
            value={user}
            placeholder={"action.by"}
            isMulti
          />
        </Col>
        <Col breakPoint={{ md: 3 }} className="mb-4">
          <DateTime onChangeDate={setDoneAt} date={doneAt} onlyDate />
        </Col>
        <Col breakPoint={{ md: 12 }} className="mb-4">
          <InputGroup fullWidth>
            <textarea
              type="text"
              placeholder={intl.formatMessage({
                id: "description",
              })}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col breakPoint={{ md: 12 }} className="pr-2">
          <Row end className="pr-4">
            <Button size="Small" className="ml-2 mb-2" onClick={onSave}>
              <FormattedMessage id="save" />
            </Button>
          </Row>
        </Col>
      </ContainerRow>
      <SpinnerFull isLoading={isSaving} />
    </>
  );
};

export default injectIntl(SaveMaintenance);
