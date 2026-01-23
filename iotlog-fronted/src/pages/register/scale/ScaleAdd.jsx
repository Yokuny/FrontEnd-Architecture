import React from "react";
import { Card, CardHeader, CardBody, CardFooter } from "@paljs/ui/Card";
import Col from "@paljs/ui/Col";
import Row from "@paljs/ui/Row";
import { Button } from "@paljs/ui/Button";
import { FormattedMessage, injectIntl } from "react-intl";
import {
  Fetch,
  FetchSupport,
  SpinnerFull,
  DeleteConfirmation,
  TextSpan,
} from "../../../components";
import { toast } from "react-toastify";
import { InputGroup } from "@paljs/ui/Input";
import { SelectEnterprise } from "../../../components/Select";
import LevelList from "./LevelList";
import { useNavigate } from "react-router-dom";

const ScaleAdd = (props) => {
  const { intl } = props;
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isEdit, setIsEdit] = React.useState(false);
  const [data, setData] = React.useState({
    description: "",
    enterprise: undefined,
    levels: [],
  });

  React.useLayoutEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const idEdit = new URL(window.location.href).searchParams.get("id");

    if (idEdit) {
      setIsEdit(true);
      setIsLoading(true);
      Fetch.get(`scale/find?id=${idEdit}`)
        .then((response) => {
          setData(response.data);
          setIsLoading(false);
        })
        .catch((e) => {
          setIsLoading(false);
        });
    }
  };

  const onSave = async () => {
    if (!data?.description) {
      toast.warn(intl.formatMessage({ id: "scale.description.required" }));
      return;
    }

    if (!data?.levels.length) {
      toast.warn(intl.formatMessage({ id: "scale.levels.required" }));
      return;
    }

    let message = "";
    for (const level of data.levels) {
      if (!level?.level) {
        message = "scale.level.required";
      }

      if (!level?.alertType?.length) {
        message = "scale.alertType.required";
      }

      if (!level?.responsible?.length) {
        message = "scale.responsible.required";
      }

      if (!level?.time) {
        message = "scale.time.required";
      }

      const duplicate = data.levels?.filter((filter) => {
        return filter.level == level.level;
      });

      if (duplicate?.length > 1) {
        message = "scale.level.equals";
      }

      const previousLevel = data.levels?.find((filter) => {
        return filter.level == level.level - 1;
      });

      if (previousLevel) {
        const previousMinutes = convertTimeOnMinute(previousLevel?.time);
        const atualMinutes = convertTimeOnMinute(level.time);
        if (previousMinutes >= atualMinutes) {
          message = "scale.levels.time.greater.than";
        }
      }

      const nextLevel = data.levels?.find((filter) => {
        return filter.level == level.level + 1;
      });

      if (nextLevel) {
        const nextMinutes = convertTimeOnMinute(nextLevel?.time);
        const atualMinutes = convertTimeOnMinute(level.time);
        if (atualMinutes >= nextMinutes) {
          message = "scale.levels.time.less.than";
        }
      }

      if (message?.length) {
        break;
      }
    }

    if (message?.length) {
      toast.warn(intl.formatMessage({ id: message }));
      return;
    }

    const newData = {
      id: data?.id,
      description: data?.description,
      enterprise: data?.enterprise,
      levels: data?.levels,
    };
    setIsLoading(true);
    try {
      if (isEdit) {
        await Fetch.put("/scale", newData);
      } else {
        await Fetch.post("/scale", newData);
      }
      toast.success(intl.formatMessage({ id: "save.successfull" }));
      setIsLoading(false);
      navigate("/scale-list");
    } catch (e) {
      setIsLoading(false);
      toast.error(intl.formatMessage({ id: "error.save" }));
    }
  };

  const convertTimeOnMinute = (time) => {
    return Number(time.split(":")[0]) + Number(time.split(":")[1]);
  };

  const onRemoveLevel = (indexRemove) => {
    setData({
      ...data,
      levels: [
        ...data.levels.slice(0, indexRemove),
        ...data.levels.slice(indexRemove + 1),
      ],
    });
  };

  const onAddLevel = () => {
    setData({
      ...data,
      levels: [
        ...data.levels,
        {
          level: (data.levels?.length ?? 0) + 1,
          time: "",
          alertType: [],
          responsible: [],
        },
      ],
    });
  };

  const onChangeItem = (index, propName, value) => {
    setData({
      ...data,
      levels: [
        ...data.levels.slice(0, index),
        {
          ...data.levels[index],
          [propName]: value,
        },
        ...data.levels.slice(index + 1),
      ],
    });
  };

  const onChange = (propName, value) => {
    setData({
      ...data,
      [propName]: value,
    });
  };

  const onDelete = async () => {
    setIsLoading(true);
    const response = await FetchSupport.get(
      `scale/?scale=${data.id}&enterprise=${data.enterprise.value}`
    );

    if (response.data.scaleConfiguration.length > 0) {
      toast.error(
        intl.formatMessage({ id: "check.scale.configuration" }).replace(
          "{0}",
          response.data.scaleConfiguration.map((y) =>
            y.configurations.map((x) => x.idEnterprise)
          )
        )
      );
      setIsLoading(false);
      return;
    }

    if (response.data.scaleTypeProblem.length > 0) {
      toast.error(
        intl.formatMessage({ id: "check.scale.typeproblem" }).replace(
          "{0}",
          response.data.scaleTypeProblem.map((y) =>
            y.typeProblems.map((x) => x.description)
          )
        )
      );
      setIsLoading(false);
      return;
    }

    Fetch.put("/scale/remove", data)
      .then((r) => {
        toast.success(intl.formatMessage({ id: "delete.successfull" }));
        setIsLoading(false);
        navigate(-1);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  return (
    <>
      <Card>
        <CardHeader>
          <Col>
            <Row between>
              {isEdit ? (
                <FormattedMessage id="editor.scale" />
              ) : (
                <FormattedMessage id="new.scale" />
              )}
            </Row>
          </Col>
        </CardHeader>
        <CardBody>
          <Row>
            <Col breakPoint={{ md: 12 }} className="mb-4">
              <TextSpan className="ml-1 mb-1" apparence="s2">
                <FormattedMessage id="enterprise" />
              </TextSpan>
              <div className="mt-1"></div>
              <SelectEnterprise
                onChange={(value) => onChange("enterprise", value)}
                value={data?.enterprise}
                oneBlocked
                required
              />
            </Col>
          </Row>
          <Row>
            <Col breakPoint={{ md: 12 }} className="mb-2">
              <TextSpan className="ml-1" apparence="s2">
                <FormattedMessage id="description" />
              </TextSpan>
              <InputGroup fullWidth className="mt-1">
                <input
                  type="text"
                  placeholder={intl.formatMessage({
                    id: "scale.description",
                  })}
                  onChange={(text) =>
                    onChange("description", text.target.value)
                  }
                  value={data.description}
                  maxLength={150}
                  required
                />
              </InputGroup>
            </Col>
          </Row>
          <Row>
            <LevelList
              onAddLevel={onAddLevel}
              levels={data?.levels}
              onRemoveLevel={onRemoveLevel}
              onChangeItem={onChangeItem}
              enterprise={data?.enterprise}
            />
          </Row>
        </CardBody>
        <CardFooter>
          <Row between className="ml-1 mr-1">
            {!!isEdit ? (
              <DeleteConfirmation
                message={intl.formatMessage({ id: "delete.message.default" })}
                onConfirmation={onDelete}
              />
            ) : (
              <div></div>
            )}

            <Button size="Small" onClick={onSave}>
              <FormattedMessage id="save" />
            </Button>
          </Row>
        </CardFooter>
        <SpinnerFull isLoading={isLoading} />
      </Card>
    </>
  );
};
export default injectIntl(ScaleAdd);
