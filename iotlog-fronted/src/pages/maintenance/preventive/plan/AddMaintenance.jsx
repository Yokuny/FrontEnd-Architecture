import { Button } from "@paljs/ui/Button";
import { Card, CardBody, CardFooter, CardHeader } from "@paljs/ui/Card";
import Col from "@paljs/ui/Col";
import { InputGroup } from "@paljs/ui/Input";
import Row from "@paljs/ui/Row";
import React from "react";
import { FormattedMessage, injectIntl } from "react-intl";
import { toast } from "react-toastify";
import styled from "styled-components";
import {
  DateTime,
  IconRounded,
  MachineHeader,
  SelectUsers,
  SpinnerFull,
  TextSpan,
} from "../../../../components";
import Fetch, { useFetch } from "../../../../components/Fetch/Fetch";
import moment from "moment";
import {
  TABLE,
  TBODY,
  TH,
  THEAD,
  TR,
  TRH,
  TD,
} from "../../../../components/Table";
import { Checkbox } from "@paljs/ui/Checkbox";
import { EvaIcon } from "@paljs/ui";
import { useNavigate } from "react-router-dom";

const ContainerHeaderRow = styled(Row)`
  input {
    line-height: 0.5rem;
  }
`;

const ContainerRow = styled(Row)`
  input {
    line-height: 0.5rem;
  }

  input[type="date"] {
    line-height: 1.1rem;
  }

  #icondate {
    margin-top: -4px;
  }
`;

const AddMaintenance = (props) => {
  const params = new URL(window.location.href).searchParams;
  const idMachine = params.get("idMachine");
  const idMaintenance = params.get("idMaintenance");
  const navigate = useNavigate()
  const { data, isLoading } = useFetch(
    `/maintenanceplan/order?idMaintenancePlan=${idMaintenance}&idMachine=${idMachine}`
  );

  const [doneAt, setDoneAt] = React.useState(moment().format("YYYY-MM-DD"));
  const [user, setUser] = React.useState();
  const [newWear, setNewWear] = React.useState(0);
  const [isSaving, setIsSaving] = React.useState(false);
  const [description, setDescription] = React.useState();
  const [checklistDone, setChecklistDone] = React.useState([]);
  const [isRestartCounter, setIsRestartCounter] = React.useState(false);

  const onSave = () => {
    if (!description) {
      toast.warn(props.intl.formatMessage({ id: "description.required" }));
      return;
    }

    if (!user?.length) {
      toast.warn(
        props.intl.formatMessage({ id: "users.required.when.limited" })
      );
      return;
    }

    const services = data?.servicesGrouped
      ?.map((x) =>
        x.itens?.map((y) => ({
          ...y,
          groupName: x.groupName,
          done: checklistDone.includes(y.id),
        }))
      )
      .flat();

    setIsSaving(true);
    const toSave = {
      idMachine,
      idMaintenancePlan: idMaintenance,
      doneAt,
      doneBy: user?.map((x) => x.value),
      description,
      services,
      wear: newWear,
      order: data.order,
      isRestartCounter
    };
    Fetch.post("/maintenancemachine", toSave)
      .then((response) => {
        toast.success(
          props.intl
            .formatMessage({ id: "order.created" })
            .replace("{0}", response.data.order)
        );
        setIsSaving(false);
        navigate(-1);
      })
      .catch((e) => {
        setIsSaving(false);
      });
  };

  const onChangeCheck = (idItemCheck) => {
    if (checklistDone.includes(idItemCheck)) {
      setChecklistDone(checklistDone.filter((x) => x !== idItemCheck));
      return;
    }

    setChecklistDone([...checklistDone, idItemCheck]);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <MachineHeader idMachine={idMachine} />
        </CardHeader>
        <CardBody style={{ overflowX: "hidden" }}>
          <ContainerHeaderRow className="mb-4">
            <Col breakPoint={{ md: 12 }} className="mb-4">
              <Row between="xs" middle="xs">
                <Col breakPoint={{ md: 12 }}>
                  <TextSpan apparence="s2">
                    <FormattedMessage id="maintenance.plan" />
                  </TextSpan>
                  <div className="mt-1"></div>
                  <InputGroup fullWidth>
                    <input value={data?.description} readOnly />
                  </InputGroup>
                </Col>
                {/* <Col breakPoint={{ md: 3 }}>
                  <TextSpan apparence="s2">
                    <FormattedMessage id="order.service" />
                  </TextSpan>
                  <div className="mt-1"></div>
                  <InputGroup fullWidth>
                    <input
                      value={data?.order}
                      readOnly
                      style={{ textAlign: "right" }}
                    />
                  </InputGroup>
                </Col> */}
              </Row>
            </Col>
            <Col breakPoint={{ md: 12, sm: 12 }}>
              <TextSpan apparence="s2">
                <FormattedMessage id="checklist" />
              </TextSpan>
              <div className="mt-1"></div>
              <TABLE>
                <THEAD>
                  <TRH>
                    <TH></TH>
                    <TH>
                      <FormattedMessage id="description" />
                    </TH>
                    <TH>
                      <FormattedMessage id="group" />
                    </TH>
                    <TH>
                      <FormattedMessage id="select.type.service.placeholder" />
                    </TH>
                    <TH>
                      <FormattedMessage id="observation" />
                    </TH>
                  </TRH>
                </THEAD>

                <TBODY>
                  {data?.servicesGrouped
                    ?.map((x) =>
                      x.itens?.map((y) => ({
                        ...y,
                        groupName: x.groupName,
                      }))
                    )
                    .flat()
                    .map((item, i) => (
                      <TR key={i} isEvenColor={i % 2 === 0}>
                        <TD textAlign="center">
                          <Checkbox
                            checked={checklistDone.includes(item.id)}
                            onChange={() => onChangeCheck(item.id)}
                          />
                        </TD>

                        <TD>
                          <TextSpan apparence="s2">{item.description}</TextSpan>
                        </TD>
                        <TD>
                          <TextSpan apparence="s2">{item.groupName}</TextSpan>
                        </TD>
                        <TD>
                          <TextSpan apparence="s2">
                            {item?.typeService?.label ?? ""}
                          </TextSpan>
                        </TD>
                        <TD>
                          <TextSpan apparence="s2">
                            {item?.observation ?? ""}
                          </TextSpan>
                        </TD>
                      </TR>
                    ))}
                </TBODY>
              </TABLE>
            </Col>
          </ContainerHeaderRow>

          <ContainerRow className="mt-4 pt-2">
            <Col breakPoint={{ md: 9 }} className="mb-4">
              <TextSpan apparence="s2">
                <FormattedMessage id="action.by" />
              </TextSpan>
              <div className="mt-1"></div>
              <SelectUsers
                idEnterprise={data?.enterprise?.id}
                onChange={setUser}
                value={user}
                placeholder={"action.by"}
                isMulti
              />
            </Col>
            <Col breakPoint={{ md: 3 }} className="mb-4">
              <TextSpan apparence="s2">
                <FormattedMessage id="date" />
              </TextSpan>
              <div className="mt-1"></div>
              <DateTime onChangeDate={setDoneAt} date={doneAt} onlyDate />
            </Col>

            <Col breakPoint={{ md: 12 }}>
              <TextSpan apparence="s2">
                <FormattedMessage id="description" />
              </TextSpan>
              <div className="mt-1"></div>
              <InputGroup fullWidth>
                <textarea
                  type="text"
                  placeholder={props.intl.formatMessage({
                    id: "description",
                  })}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </InputGroup>
            </Col>
            {data?.typeMaintenance?.toUpperCase()?.includes("WEAR") && (
              <>
                <Col breakPoint={{ md: 3 }} className="mt-4">
                  <TextSpan apparence="s2">
                    <FormattedMessage id="wear.new" />
                  </TextSpan>
                  <div className="mt-1"></div>
                  <InputGroup fullWidth>
                    <input
                      type="number"
                      placeholder={props.intl.formatMessage({
                        id: "wear.new",
                      })}
                      min={0}
                      value={newWear}
                      onChange={(e) => setNewWear(parseInt(e.target.value))}
                    />
                  </InputGroup>
                </Col>
                <Col breakPoint={{ md: 9 }} className="mt-4 pt-4">
                  <Checkbox
                    checked={isRestartCounter}
                    onChange={() => setIsRestartCounter(!isRestartCounter)}
                  >
                    <TextSpan apparence="s2">
                      <FormattedMessage id="sensor.restart.to.zero" />
                    </TextSpan>
                  </Checkbox>
                </Col>
              </>
            )}
          </ContainerRow>
        </CardBody>

        <CardFooter>
          <Button size="Small" className="ml-2 mb-2" onClick={onSave}>
            <FormattedMessage id="save" />
          </Button>
        </CardFooter>
      </Card>
      <SpinnerFull isLoading={isLoading || isSaving} />
    </>
  );
};

export default injectIntl(AddMaintenance);
