import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Checkbox,
  Col,
  EvaIcon,
  Row,
} from "@paljs/ui";
import moment from "moment";
import { useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useTheme } from "styled-components";
import {
  DeleteConfirmation,
  Fetch,
  LabelIcon,
  Modal,
  SelectMachine,
  SpinnerFull,
  TextSpan,
} from "../../components";
import { Vessel } from "../../components/Icons";
import FormGoal from "./FormGoal";
import { GoalTable } from "./GoalTable";

function AddGoal() {
  const [data, setData] = useState([]);
  const [payload, setPayload] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [searchParms] = useSearchParams();
  const [isFleet, setIsFleet] = useState(false);
  const id = searchParms.get("id");

  const navigate = useNavigate();

  useEffect(() => {
    function getData() {
      setIsLoading(true);

      Fetch.get(`goals/${id}`)
        .then((response) => {
          setData(response.data);
          setIsEdit(true);

          const payload = response.data.find((item) => item.id === id);

          if (payload) {
            setPayload({
              id: payload.id,
              idEnterprise: payload.idEnterprise,
              name: payload.name,
              type: payload.type,
              year: payload.year,
            });
          }

          setIsLoading(false);
        })
        .catch((error) => {
          setIsLoading(false);
        });
    }

    if (id) {
      getData();
    }

    return () => {
      setData([]);
      setPayload({
        idEnterprise: localStorage.getItem("id_enterprise_filter"),
        name: "",
        type: "",
        year: "",
      });
      setIsEdit(false);
    };
  }, [id]);

  function handleSave() {
    const raw = data.map((item) => {
      return item.goals.map((goal) => ({
        idMachine: item.machine?.id || null,
        date: goal.date,
        value: Number(goal.value),
        isFleet: item.isFleet || false,
      }));
    });

    const goals = raw.flat().filter((item) => item.value > 0);

    if (goals.length === 0) {
      return toast.warn(intl.formatMessage({ id: "fill.goals" }));
    }

    if (!payload.name) {
      return toast.warn(intl.formatMessage({ id: "fill.required.fields" }));
    }

    if (!payload.type) {
      return toast.warn(intl.formatMessage({ id: "fill.required.fields" }));
    }

    setIsLoading(true);

    if (isEdit) {
      return Fetch.put(`goals`, {
        ...payload,
        year: payload.year ? Number(payload.year) : null,
        goals,
      })
        .then(() => {
          toast.success(intl.formatMessage({ id: "save.successfull" }));
          setIsLoading(false);
          navigate(-1);
        })
        .catch((error) => {
          setIsLoading(false);
        });
    }

    Fetch.post(`goals`, {
      ...payload,
      year: payload.year ? Number(payload.year) : null,
      goals,
    })
      .then(() => {
        toast.success(intl.formatMessage({ id: "save.successfull" }));
        setIsLoading(false);
        navigate(-1);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  }

  function handleChange(itemGoal, date, value) {
    const goal = data.find((item) =>
      itemGoal.isFleet
        ? item.isFleet === itemGoal.isFleet
        : item.machine?.id === itemGoal.machine?.id
    );

    if (!goal) {
      return;
    }

    const index = goal.goals.findIndex(
      (item) => formatDate(item.date) === formatDate(moment().month(date))
    );

    if (index === -1) {
      goal.goals.push({
        date: moment().month(date).utc(true),
        value: value,
      });
    } else {
      goal.goals[index].value = value;
    }

    setData([...data]);
  }

  function handleChangePayload(event, value) {
    setPayload({ ...payload, [event]: value });
  }

  function formatDate(date) {
    return moment(date).format("MMM");
  }

  function onDeleteRow(itemGoal) {
    const goal = data.filter((item) =>
      itemGoal.isFleet
        ? item.isFleet !== true
        : item.machine?.id !== itemGoal.machine?.id
    );

    if (!goal) {
      return;
    }

    setData(goal);
  }

  function handleDelete(id) {
    setIsLoading(true);
    Fetch.delete(`goals/${id}`)
      .then(() => {
        setIsLoading(false);
        toast.success(intl.formatMessage({ id: "delete.successfull" }));
        navigate(-1);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  }

  function handleAdd() {
    if (!selectedMachine && !isFleet) {
      return toast.warn(intl.formatMessage({ id: "fill.required.fields" }));
    }

    const goal = data.find(
      (item) =>
        item.machine?.id === selectedMachine?.value || item.isFleet === isFleet
    );

    if (goal) {
      return toast.warn(intl.formatMessage({ id: "machine.already.added" }));
    }

    setData([
      ...data,
      {
        machine:
          {
            id: selectedMachine?.value,
            name: selectedMachine?.label,
          } || null,
        goals: Array(13)
          .fill(null)
          .map((_, index) => ({
            date: index === 12 ? null : moment().month(index).format("YYYY-MM-DD"),
            value: 0,
          })),
        isFleet,
      },
    ]);

    handleModal();
  }

  function handleModal() {
    setIsOpenModal(!isOpenModal);
    setSelectedMachine(null);
    setIsFleet(false);
  }

  function handleSelectMachine(e) {
    setSelectedMachine(e);
  }

  function handleChangeTotal(item, value) {
    setData((state) => {
      state.find((goal) =>
        item.isFleet ? goal.isFleet : goal.machine?.id === item.machine?.id
      ).goals[12] = {
        date: null,
        value,
      };

      return state;
    });
  }

  const intl = useIntl();
  const theme = useTheme();

  return (
    <>
      <Card>
        <CardHeader>
          <FormattedMessage id="goal" />
        </CardHeader>

        <CardBody
          style={{
            overflowX: "hidden",
          }}
        >
          <Row center="xs">
            <FormGoal data={payload} handleChange={handleChangePayload} />
            <GoalTable
              data={data}
              handleChange={handleChange}
              handleDelete={onDeleteRow}
              handleChangeTotal={handleChangeTotal}
            />
            <Button
              size="Tiny"
              status="Info"
              className="flex-between"
              disabled={isLoading}
              onClick={handleModal}
            >
              <EvaIcon name="plus" className="mr-1" />
              {intl.formatMessage({ id: "add" })}
            </Button>
          </Row>
        </CardBody>

        <CardFooter>
          <Row className="m-0" between={id ? "xs" : ""} end={!id ? "md" : ""}>
            {!!id && (
              <DeleteConfirmation
                onConfirmation={() => handleDelete(id)}
                message={intl.formatMessage({
                  id: "delete.message.default",
                })}
              >
                <Button
                  size="Tiny"
                  status="Danger"
                  disabled={isLoading}
                  appearance="ghost"
                  className="flex-between"
                >
                  <EvaIcon name="trash-2-outline" className="mr-1" />
                  <FormattedMessage id="delete" />
                </Button>
              </DeleteConfirmation>
            )}
            <Button
              disabled={isLoading}
              size="Small"
              status="Primary"
              onClick={handleSave}
            >
              {intl.formatMessage({ id: "save" })}
            </Button>
          </Row>
        </CardFooter>
      </Card>

      <Modal
        show={isOpenModal}
        title={intl.formatMessage({ id: "goal" })}
        onClose={handleModal}
        renderFooter={() => (
          <CardFooter>
            <Row className="m-0" end="xs">
              <Button size="Small" status="Success" onClick={handleAdd}>
                {intl.formatMessage({ id: "add" })}
              </Button>
            </Row>
          </CardFooter>
        )}
      >
        <Row>
          <Col breakPoint={{ md: 10 }}>
            <LabelIcon
              renderIcon={() => (
                <Vessel
                  style={{
                    height: 13,
                    width: 13,
                    color: theme.textHintColor,
                    marginRight: 5,
                    marginTop: 2,
                    marginBottom: 2,
                  }}
                />
              )}
              title={intl.formatMessage({ id: "machine" })}
            />
            <SelectMachine
              onChange={(e) => handleSelectMachine(e)}
              value={selectedMachine}
              disabled={isFleet}
            />
          </Col>
          <Col
            breakPoint={{ md: 2 }}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "1rem",
            }}
          >
            <Checkbox
              checked={isFleet}
              onChange={(e) => setIsFleet(e)}
              className="mr-1"
            />
            <TextSpan appearance="s2">
              <FormattedMessage id="fleet" />
            </TextSpan>
          </Col>
        </Row>
      </Modal>

      <SpinnerFull isLoading={isLoading} />
    </>
  );
}

export default AddGoal;
