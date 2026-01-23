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
} from "../../../components";
import { Button } from "@paljs/ui/Button";
import { Checkbox } from "@paljs/ui/Checkbox";
import { InputGroup } from "@paljs/ui/Input";
import { toast } from "react-toastify";
import { verifyTime } from "../../../components/Utils";
import { useNavigate } from "react-router-dom";

const AddTypeProblem = (props) => {
  const { intl } = props;
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isEdit, setIsEdit] = React.useState(false);

  const [enterprise, setEnterprise] = React.useState(undefined);
  const [description, setDescription] = React.useState("");
  const [codeLanguage, setCodeLanguage] = React.useState("");
  const [hourAttendance, setHourAttendance] = React.useState();
  const [hourSolution, setHourSolution] = React.useState();
  const [active, setActive] = React.useState(true);
  const [scale, setScale] = React.useState([]);
  const [dontUsesScale, setDontUsesScale] = React.useState(true);

  const searchparams = new URL(window.location.href).searchParams;
  const id = searchparams.get("id");

  React.useEffect(() => {
    if (!!id) {
      loadingEdit();
    }
  }, []);

  const loadingEdit = () => {
    setIsLoading(true);
    FetchSupport.get(`/typeproblem?id=${id}`)
      .then((response) => {
        const {
          description,
          codeLanguage,
          idEnterprise,
          nameEnterprise,
          active,
          hourAttendance,
          hourSolution,
          scale,
          dontUsesScale
        } = response.data;

        setDescription(description);
        setCodeLanguage(codeLanguage);
        setActive(active);
        setHourAttendance(hourAttendance);
        setHourSolution(hourSolution);
        setEnterprise({ value: idEnterprise, label: nameEnterprise });
        setDontUsesScale(dontUsesScale);

        const listScale = scale.map((x) => ({
          value: x.idScale,
          label: x.scaleDescription,
          id: x.idScale,
        }));
        setScale(listScale);

        setIsEdit(true);
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const onSave = () => {
    setIsLoading(true);
    const data = {
      idEnterprise: enterprise?.value,
      nameEnterprise: enterprise?.label,
      description,
      codeLanguage,
      active,
      hourAttendance,
      hourSolution,
      scale,
      dontUsesScale,
      id: id || undefined,
    };
    FetchSupport.post("/typeproblem", data)
      .then((response) => {
        setIsLoading(false);
        toast.success(intl.formatMessage({ id: "save.successfull" }));
        navigate(-1);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  return (
    <React.Fragment>
      <Card>
        <CardHeader>
          <FormattedMessage id={isEdit ? "edit.type" : "new.type"} />
        </CardHeader>
        <CardBody>
          <Row>
            <Col breakPoint={{ lg: 12, md: 12 }} className="mb-4">
              <SelectEnterprise
                onChange={(value) => setEnterprise(value)}
                value={enterprise}
                oneBlocked
              />
            </Col>

            <Col breakPoint={{ lg: 12, md: 12 }} className="mb-4">
              <InputGroup fullWidth>
                <input
                  type="text"
                  placeholder={intl.formatMessage({
                    id: "message.description.placeholder",
                  })}
                  onChange={(text) => setDescription(text.target.value)}
                  value={description}
                  maxLength={150}
                />
              </InputGroup>
            </Col>

            <Col breakPoint={{ lg: 12, md: 12 }} className="mb-2">
              <SelectScale
                onChange={(value) => setScale(value)}
                value={scale}
              />
            </Col>

            <Col breakPoint={{ lg: 4, md: 4 }} className="mb-4">
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
                      setHourAttendance(verifyTime(text.target.value))
                  }
                  value={hourAttendance}
                  maxLength={6}
                />
              </InputGroup>
            </Col>

            <Col breakPoint={{ lg: 4, md: 4 }} className="mb-4">
              <TextSpan className="ml-1" apparence="s2">
                <FormattedMessage id="support.time.solution.label" />
              </TextSpan>
              <InputGroup fullWidth>
                <input
                  type="text"
                  placeholder={intl.formatMessage({
                    id: "support.time.solution.label.placeholder",
                  })}
                  pattern="([01][0-9]|2[0-3]):[0-5][0-9]"
                  className="mt-1"
                  onChange={(text) =>
                    setHourSolution(verifyTime(text.target.value))
                  }
                  value={hourSolution}
                  maxLength={6}
                />
              </InputGroup>
            </Col>

            <Col breakPoint={{ lg: 4, md: 4 }} className="mb-4 pt-2">
              {/* <InputGroup fullWidth>
                <input
                  type="text"
                  placeholder={intl.formatMessage({
                    id: "code.language.placeholder",
                  })}
                  className="mt-4"
                  onChange={(text) => setCodeLanguage(text.target.value)}
                  value={codeLanguage}
                  maxLength={150}
                />
              </InputGroup> */}
            </Col>
            <Col breakPoint={{ lg: 4, md: 4 }}>
              <Checkbox checked={!!active} onChange={() => setActive(!active)}>
                <FormattedMessage id="active.check" />
              </Checkbox>
            </Col>
            <Col breakPoint={{ lg: 4, md: 4 }}>
              <Checkbox checked={!!dontUsesScale} onChange={() => setDontUsesScale(!dontUsesScale)}>
                <FormattedMessage id="usesScale.check" />
              </Checkbox>
            </Col>
          </Row>
        </CardBody>
        <CardFooter>
          <Row between className="ml-1 mr-1">
            <Button size="Small" onClick={onSave}>
              <FormattedMessage id="save" />
            </Button>
          </Row>
        </CardFooter>
      </Card>
      <SpinnerFull isLoading={isLoading} />
    </React.Fragment>
  );
};

export default injectIntl(AddTypeProblem);
