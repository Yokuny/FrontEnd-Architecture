import React from "react";
import {
  Fetch,
  FormGenerator,
  SelectEnterprise,
  SpinnerFull,
  TextSpan,
  UploadImage,
} from "../../../components";
import { toast } from "react-toastify";
import Col from "@paljs/ui/Col";
import Row from "@paljs/ui/Row";
import { Card, CardBody, CardHeader, CardFooter } from "@paljs/ui/Card";
import { FormattedMessage, injectIntl } from "react-intl";
import { Button } from "@paljs/ui/Button";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const ContainerRow = styled(Row)`
  input {
    line-height: 0.5rem;
  }
`;

const dataMap = [
  [
    {
      name: "name",
      label: "part.name.label",
      placeholder: "part.name.placeholder",
      md: 12,
      typeComponent: "text",
    },
  ],
  [
    {
      name: "sku",
      label: "part.sku.label",
      placeholder: "part.sku.label",
      md: 12,
      typeComponent: "text",
      className: "mt-4",
    },
  ],
  [
    {
      className: "mt-4",
      name: "description",
      label: "part.description.label",
      placeholder: "part.description.placeholder",
      md: 12,
      typeComponent: "texteditor",
      rows: 4,
    },
  ],
];

const PartAdd = (props) => {
  const { intl } = props;
  const navigate = useNavigate();
  const [isEdit, setIsEdit] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [enterprise, setEnterprise] = React.useState();
  const [image, setImage] = React.useState(undefined);
  const [imagePreview, setImagePreview] = React.useState(undefined);

  const [data, setData] = React.useState({
    name: "",
    sku: "",
    description: "",
    id: "",
  });

  React.useEffect(() => {
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
    Fetch.get(`/part/find?id=${id}`)
      .then((response) => {
        if (response.data) {
          setData({
            name: response.data.name,
            sku: response.data.sku,
            id: response.data.id,
            description: response.data.description,
          });
          setEnterprise({
            value: response.data?.enterprise?.id,
            label: response.data?.enterprise?.name,
          });
          setImage(response.data?.image);
          setIsEdit(true);
        }
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const onSave = async () => {
    const { name, description, sku, id } = data;
    if (!name) {
      toast.warn(intl.formatMessage({ id: "part.name.placeholder" }));
      return;
    }

    if (!sku) {
      toast.warn(intl.formatMessage({ id: "sku.required" }));
      return;
    }

    if (!enterprise?.value) {
      toast.warn(intl.formatMessage({ id: "enterprise.required" }));
      return;
    }

    setIsLoading(true);
    let idSaved = id;
    try {
      const response = await Fetch.post("/part", {
        id,
        name,
        description,
        sku,
        idEnterprise: enterprise?.value,
      });
      if (response.data.id) idSaved = response.data.id;
    } catch (e) {
      setIsLoading(false);
      return;
    }

    if (!!imagePreview && idSaved) await saveImageAsync(idSaved);

    toast.success(intl.formatMessage({ id: "save.successfull" }));
    setIsLoading(false);
    navigate(-1);
  };

  const saveImageAsync = async (idPart) => {
    try {
      const data = new FormData();
      data.append("file", image);
      await Fetch.post(`/file/upload/part?id=${idPart}&directory=part`, data);
    } catch (e) {}
  };
  const onChangeImage = (imageAdd) => {
    setImage(imageAdd);
    const reader = new FileReader();
    reader.readAsDataURL(imageAdd);
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
  };

  return (
    <>
      <ContainerRow>
        <Col breakPoint={{ xs: 12, md: 12 }}>
          <Card>
            <CardHeader>
              <FormattedMessage id={isEdit ? "part.edit" : "part.new"} />
            </CardHeader>
            <CardBody>
              <Row>
                <Col breakPoint={{ md: 8 }}>
                  <Row>
                    <Col breakPoint={{ md: 12 }} className="mb-4">
                      <TextSpan apparence="s2">
                        <FormattedMessage id="enterprise" />
                      </TextSpan>
                      <div className="mt-1"></div>
                      <SelectEnterprise
                        onChange={(value) => setEnterprise(value)}
                        value={enterprise}
                        oneBlocked
                      />
                    </Col>
                  </Row>
                  <FormGenerator
                    dataMap={dataMap}
                    onChange={(name, value) =>
                      setData({ ...data, [name]: value })
                    }
                    data={data}
                  />
                </Col>
                <Col breakPoint={{ md: 4 }} className="mb-4">
                  <UploadImage
                    onAddFile={onChangeImage}
                    value={image}
                    maxSize={5485760}
                    imagePreview={imagePreview}
                    height={270}
                  />
                </Col>
              </Row>
            </CardBody>
            <CardFooter>
              <Row end>
                <Button size="Small" onClick={onSave}>
                  <FormattedMessage id="save" />
                </Button>
              </Row>
            </CardFooter>
          </Card>
        </Col>
      </ContainerRow>
      <SpinnerFull isLoading={isLoading} />
    </>
  );
};

export default injectIntl(PartAdd);
