import { Button, Card, CardBody, CardFooter, CardHeader, EvaIcon, Row } from "@paljs/ui";
import { DeleteConfirmation, Fetch, SpinnerFull, TextSpan } from "../../../../components";
import { FormattedMessage, useIntl } from "react-intl";
import { useEffect, useState } from "react";
import { getFields } from "./FieldsData";
import ContentItem from "../../../forms/Item";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

export default function Crew() {

  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({});
  const [searchParams] = useSearchParams();
  const intl = useIntl();
  const navigate = useNavigate();

  const idAsset = searchParams.get("idAsset");
  const idEnterprise = searchParams.get("idEnterprise");

  useEffect(() => {
    if (idAsset && idEnterprise)
      onGetData(idAsset, idEnterprise);
  }, [idAsset, idEnterprise]);


  const onChange = (prop, value) => {
    setData(prev => ({ ...prev, [prop]: value }));
  }

  const fields = getFields({ intl });

  const onGetData = (idAsset, idEnterprise) => {
    setIsLoading(true);
    Fetch.get(`/crew?idMachine=${idAsset}&idEnterprise=${idEnterprise}`)
      .then((res) => {
        if (res.data)
          setData(res.data);
        setIsLoading(false)
      })
      .catch((err) => setIsLoading(false))
  }

  const onSave = () => {
    setIsLoading(true);
    Fetch.post("/crew", {
      people: data.people || [],
      totalOnBoard: parseInt(data.totalOnBoard || 0),
      idMachine: idAsset,
      idEnterprise
    })
      .then((res) => {
        setIsLoading(false)
        toast.success(intl.formatMessage({ id: "save.successfully" }));
        navigate(-1)
      })
      .catch((err) => setIsLoading(false))
  }

  return (
    <>
      <Card>
        <CardHeader>
          <TextSpan apparence="s1">
            <FormattedMessage id="crew" />
          </TextSpan>
        </CardHeader>
        <CardBody>
          <Row>
            {fields
              .map((x, i) => {
                return (
                  <ContentItem
                    key={`${i}-${x.name}`}
                    data={data}
                    field={x}
                    onChange={onChange}
                  />
                );
              })}
          </Row>
        </CardBody>
        <CardFooter>
          <Row between="xs" className="m-0">
            <DeleteConfirmation>
              <Button size="Tiny"
                appearance="ghost"
                className="flex-between"
                disabled={isLoading}
                status="Danger">
                <EvaIcon name="trash-2-outline" className="mr-1" />
                <FormattedMessage id="delete" />
              </Button>
            </DeleteConfirmation>
            <Button size="Tiny"
              disabled={isLoading}
              onClick={onSave}
              className="flex-between">
              <EvaIcon name="checkmark-outline" className="mr-1" />
              <FormattedMessage id="save" />
            </Button>
          </Row>
        </CardFooter>
      </Card>
      <SpinnerFull isLoading={isLoading} />
    </>
  );
}
