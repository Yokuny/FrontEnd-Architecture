import React from "react";
import { Card, CardHeader, CardBody, CardFooter } from "@paljs/ui/Card";
import Col from "@paljs/ui/Col";
import Row from "@paljs/ui/Row";
import { Button } from "@paljs/ui/Button";
import { FormattedMessage, useIntl } from "react-intl";
import { toast } from "react-toastify";
import { InputGroup } from "@paljs/ui/Input";
import styled from "styled-components";
import moment from "moment";
import {
  DeleteConfirmation,
  FetchSupport,
  SpinnerFull,
  TextSpan,
} from "../../../components";
import { SelectEnterprise } from "../../../components/Select";
import HolidaysList from "./HolidaysList";
import { useNavigate } from "react-router-dom";

const ContainerRow = styled(Row)`
  input {
    line-height: 0.5rem;
  }

  input[type="date"] {
    line-height: 1.1rem;
  }

  a svg {
    margin-top: -4px;
  }
`;

const HolidaysYearAdd = (props) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isEdit, setIsEdit] = React.useState(false);
  const [enterprise, setEnterprise] = React.useState(undefined);
  const [data, setData] = React.useState({
    year: 0,
    holidays: [],
  });

  React.useLayoutEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const yearEdit = new URL(window.location.href).searchParams.get("year");
    const enterpriseParam = new URL(window.location.href).searchParams.get(
      "enterprise"
    );

    if (yearEdit) {
      setIsEdit(true);
      setIsLoading(true);
      FetchSupport.get(
        `holidays?year=${yearEdit}&enterprise=${enterpriseParam}`
      )
        .then((response) => {
          setData(response.data);
          setEnterprise({
            value: response.data.idEnterprise,
            label: response.data.nameEnterprise,
          });

          setIsLoading(false);
        })
        .catch((e) => {
          setIsLoading(false);
        });
    }
  };

  const onSave = async () => {
    if (!data?.year) {
      toast.warn(intl.formatMessage({ id: "holidays.year.required" }));
      return;
    }

    let message = "";
    for (const holiday of data.holidays) {
      if (!holiday?.day) {
        message = "holidays.day.required";
      }

      if (
        parseInt(moment(holiday?.day).format("YYYY")) !== parseInt(data?.year)
      ) {
        message = "holidays.day.different.year";
      }

      if (!holiday?.description) {
        message = "holidays.description.required";
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
      year: data?.year,
      holidays: data?.holidays,
      idEnterprise: enterprise.value,
      nameEnterprise: enterprise.label,
    };
    setIsLoading(true);
    try {
      if (isEdit) {
        await FetchSupport.put("/holidays", newData);
      } else {
        await FetchSupport.post("/holidays", newData);
      }
      toast.success(intl.formatMessage({ id: "save.successfull" }));
      setIsLoading(false);
      navigate("/holidays-list");
    } catch (e) {
      setIsLoading(false);
    }
  };

  const onRemoveHoliday = (indexRemove) => {
    setData({
      ...data,
      holidays: [
        ...data.holidays.slice(0, indexRemove),
        ...data.holidays.slice(indexRemove + 1),
      ],
    });
  };

  const onAddHoliday = () => {
    setData({
      ...data,
      holidays: [
        ...data.holidays,
        {
          holidays: (data.holidays?.length ?? 0) + 1,
          day: null,
          description: "",
          year: data.year,
        },
      ],
    });
  };

  const onChangeItem = (index, propName, value) => {
    setData({
      ...data,
      holidays: [
        ...data.holidays.slice(0, index),
        {
          ...data.holidays[index],
          [propName]: value,
        },
        ...data.holidays.slice(index + 1),
      ],
    });
  };

  const onChange = (propName, value) => {
    setData({
      ...data,
      [propName]: value,
    });
  };

  const onDelete = () => {
    setIsLoading(true);

    FetchSupport.put("/holidays/remove", data)
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
                <FormattedMessage id="editor.holidays" />
              ) : (
                <FormattedMessage id="new.holidays" />
              )}
            </Row>
          </Col>
        </CardHeader>
        <CardBody>
          <ContainerRow>
            <Col breakPoint={{ md: 8 }} className="mb-4">
              <TextSpan apparence="s2">
                <FormattedMessage id="enterprise" />
              </TextSpan>
              <SelectEnterprise
                onChange={(value) => setEnterprise(value)}
                value={enterprise}
                oneBlocked
              />
            </Col>

            <Col breakPoint={{ md: 4 }} className="mb-2">
              <TextSpan apparence="s2">
                <FormattedMessage id="holidays.year" />
              </TextSpan>
              <InputGroup fullWidth>
                <input
                  type="number"
                  placeholder={intl.formatMessage({
                    id: "holidays.year",
                  })}
                  onChange={(text) => onChange("year", text.target?.value)}
                  value={data.year ? data.year : ""}
                  readOnly={isEdit}
                />
              </InputGroup>
            </Col>
            <HolidaysList
              onAddHoliday={onAddHoliday}
              holidays={data?.holidays}
              onRemoveHoliday={onRemoveHoliday}
              onChangeItem={onChangeItem}
            />
          </ContainerRow>
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
export default HolidaysYearAdd;
