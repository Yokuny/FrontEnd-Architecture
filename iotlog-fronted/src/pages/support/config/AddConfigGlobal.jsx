import * as React from "react";
import { Card, CardHeader, CardBody, CardFooter } from "@paljs/ui/Card";
import { FormattedMessage, injectIntl } from "react-intl";
import Col from "@paljs/ui/Col";
import Row from "@paljs/ui/Row";
import {
  SelectEnterprise,
  SpinnerFull,
  FetchSupport,
  TextSpan,
  SelectScale,
  DeleteConfirmation,
} from "../../../components";
import { Button } from "@paljs/ui/Button";
import { InputGroup } from "@paljs/ui/Input";
import { toast } from "react-toastify";
import { verifyTime } from "../../../components/Utils";
import { useNavigate } from "react-router-dom";

const AddConfigGlobal = (props) => {
  const { intl } = props;
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isEdit, setIsEdit] = React.useState(false);
  const [data, setData] = React.useState(undefined);

  React.useLayoutEffect(() => {
    verifyEdit();
  }, []);

  const verifyEdit = () => {
    const id = new URL(window.location.href).searchParams.get("id");
    if (!!id) {
      getEditEntity(id);
    }
  };

  const getEditEntity = (id) => {
    setIsLoading(true);
    FetchSupport.get(`/configuration?id=${id}`)
      .then((response) => {
        if (response.data) {
          const {
            idEnterprise,
            nameEnterprise,
            timeFirstAttendance,
            timeSolution,
            scale,
            id,
          } = response.data;

          const listScale = scale.map((x) => ({
            value: x.idScale,
            label: x.scaleDescription,
            id: x.idScale,
          }));

          setData({
            enterprise: {
              value: idEnterprise,
              label: nameEnterprise,
            },
            scale: listScale,
            timeFirstAttendance: timeFirstAttendance,
            timeSolution: timeSolution,
            id: id,
          });

          setIsEdit(true);
        }
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const onSave = () => {
    const dataToSave = {
      enterprise: data?.enterprise,
      timeFirstAttendance: data.timeFirstAttendance,
      timeSolution: data.timeSolution,
      scale: data.scale,
      id: data.id,
    };
    if (!dataToSave?.enterprise?.value) {
      toast.warn(intl.formatMessage({ id: "enterprise.required" }));
      return;
    }
    setIsLoading(true);
    FetchSupport.post("/configuration", dataToSave)
      .then((response) => {
        toast.success(intl.formatMessage({ id: "save.successfull" }));
        setIsLoading(false);
        navigate(-1);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const onChange = (prop, value) => {
    setData({
      ...data,
      [prop]: value,
    });
  };

  const onDeletePermission = () => {
    setIsLoading(true);
    FetchSupport.delete(`/configuration?id=${data?.id}`)
      .then((response) => {
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
          <FormattedMessage id={"setup.sla.support"} />
        </CardHeader>
        <CardBody>
          <Row>
            <Col breakPoint={{ lg: 12, md: 12 }} className="mb-4">
              <SelectEnterprise
                onChange={(value) => onChange("enterprise", value)}
                value={data?.enterprise}
                isDisabled={isEdit}
                oneBlocked
              />
            </Col>
            <Col breakPoint={{ lg: 12, md: 12 }} className="mb-4">
              <SelectScale
                onChange={(value) => onChange("scale", value)}
                value={data?.scale}
              />
            </Col>

            <Col breakPoint={{ lg: 3, md: 3 }} className="mb-4">
              <TextSpan className="ml-1" apparence="s2">
                <FormattedMessage id="support.time.first.label" />
              </TextSpan>

              <InputGroup fullWidth>
                <input
                  type="text"
                  placeholder={intl.formatMessage({
                    id: "support.time.first.label.placeholder",
                  })}
                  className="mt-1"
                  pattern="([01][0-9]|2[0-3]):[0-5][0-9]"
                  onChange={(text) =>
                    onChange(
                      "timeFirstAttendance",
                      verifyTime(text.target.value)
                    )
                  }
                  value={data?.timeFirstAttendance}
                  maxLength={6}
                />
              </InputGroup>
            </Col>

            <Col breakPoint={{ lg: 3, md: 3 }} className="mb-4">
              <TextSpan className="ml-1" apparence="s2">
                <FormattedMessage id="support.time.solution.label" />
              </TextSpan>

              <InputGroup fullWidth>
                <input
                  type="text"
                  placeholder={intl.formatMessage({
                    id: "support.time.solution.label.placeholder",
                  })}
                  className="mt-1"
                  pattern="([01][0-9]|2[0-3]):[0-5][0-9]"
                  onChange={(text) =>
                    onChange("timeSolution", verifyTime(text.target.value))
                  }
                  value={data?.timeSolution}
                  maxLength={6}
                />
              </InputGroup>
            </Col>
          </Row>
        </CardBody>
        <CardFooter>
          <Row between className="ml-1 mr-1">
            {!!data?.id ? (
              <DeleteConfirmation
                message={props.intl.formatMessage({
                  id: "delete.message.default",
                })}
                onConfirmation={onDeletePermission}
              />
            ) : (
              <div></div>
            )}
            <Button size="Small" onClick={onSave}>
              <FormattedMessage id="save" />
            </Button>
          </Row>
        </CardFooter>
      </Card>
      <SpinnerFull isLoading={isLoading} />
    </>
  );
};

export default injectIntl(AddConfigGlobal);
