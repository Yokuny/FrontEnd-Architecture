import React from "react";
import { Fetch, UploadImage, SpinnerFull, TextSpan } from "../../../components";
import { toast } from "react-toastify";
import Col from "@paljs/ui/Col";
import Row from "@paljs/ui/Row";
import { Card, CardBody, CardHeader, CardFooter } from "@paljs/ui/Card";
import { FormattedMessage, injectIntl, useIntl } from "react-intl";
import { Button } from "@paljs/ui/Button";
import { InputGroup } from "@paljs/ui/Input";
import Axios from "axios";
import styled from "styled-components";
import { EvaIcon } from "@paljs/ui/Icon";
import { useNavigate } from "react-router-dom";

const ContainerIcon = styled.a`
  position: absolute;
  right: 10px;
  top: 6px;
  cursor: pointer;
`;

const SensorAdd = (props) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const [isLoading, setIsloading] = React.useState(false);
  const [isEdit, setIsEdit] = React.useState(false);
  const [image, setImage] = React.useState(undefined);
  const [imagePreview, setImagePreview] = React.useState(undefined);
  const [imageDark, setImageDark] = React.useState(undefined);
  const [imagePreviewDark, setImagePreviewDark] = React.useState(undefined);
  const [lat, setLat] = React.useState(undefined);
  const [lon, setLon] = React.useState(undefined);
  const [enterprise, setEnterprise] = React.useState({
    name: "",
    description: "",
    address: "",
    number: "",
    district: "",
    city: "",
    zipCode: "",
    state: "",
    country: "",
    complement: "",
  });
  const [showToken, setShowToken] = React.useState(false);
  const [publicKey, setPublicKey] = React.useState("");

  const id = new URL(window.location.href).searchParams.get("id");

  React.useEffect(() => {
    if (!!id) {
      getEditEntity();
    }
  }, []);

  const getEditEntity = () => {
    setIsloading(true);
    Fetch.get(`/enterprise/find?id=${id}`)
      .then((response) => {
        if (response.data) {
          setEnterprise({
            ...response.data,
          });
          setLat(response.data.coordinate?.latitude);
          setLon(response.data.coordinate?.longitude);
          setImage(
            response.data.logo
              ? { url: response.data.logo }
              : response.data.image
          );
          setImageDark(response.data.imageDark);
          setPublicKey(response.data.publicKey);
          setIsEdit(true);
        }
        setIsloading(false);
      })
      .catch((e) => {
        setIsloading(false);
      });
  };

  const onSave = async () => {
    if (!enterprise?.name) {
      toast.warn(intl.formatMessage({ id: "name.required" }));
      return;
    }
    setIsloading(true);

    const data = {
      name: enterprise.name,
      description: enterprise.description,
      address: enterprise.address,
      number: enterprise.number,
      district: enterprise.district,
      city: enterprise.city,
      zipCode: enterprise.zipCode,
      state: enterprise.state,
      country: enterprise.country,
      complement: enterprise.complement,
      coordinate: {
        latitude: parseFloat(lat),
        longitude: parseFloat(lon),
      },
    };

    try {
      let idEnterprise;

      if (isEdit) {
        idEnterprise = id;
        await Fetch.put("/enterprise", { id, ...data });
      } else {
        const response = await Fetch.post("/enterprise", data);
        idEnterprise = response.data?.data?.id;
      }
      await saveImageAsync(idEnterprise);
    } catch (e) {
      setIsloading(false);
    }
  };

  const saveImageAsync = async (idEnterprise) => {
    try {
      if (!!imagePreview) {
        const data = new FormData();
        data.append("file", image);
        await Fetch.post(
          `/upload/enterprise?id=${idEnterprise}`,
          data
        );
      }

      if (!!imagePreviewDark) {
        const data = new FormData();
        data.append("file", imageDark);
        await Fetch.post(
          `/upload/enterprise?id=${idEnterprise}&type=dark`,
          data
        );
      }

      toast.success(intl.formatMessage({ id: "save.successfull" }));
    } catch (e) {
    } finally {
      setIsloading(false);
      navigate(-1);
    }
  };

  const onChange = (prop, value) => {
    setEnterprise({
      ...enterprise,
      [prop]: value,
    });
    if (prop == "zipCode" && value?.length >= 8) {
      getCep(value);
    }
  };

  const onChangeImage = (imageAdd) => {
    setImage(imageAdd);
    const reader = new FileReader();
    reader.readAsDataURL(imageAdd);
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
  };

  const onChangeImageDark = (imageAdd) => {
    setImageDark(imageAdd);
    const reader = new FileReader();
    reader.readAsDataURL(imageAdd);
    reader.onloadend = () => {
      setImagePreviewDark(reader.result);
    };
  };

  const getCep = (cep) => {
    setIsloading(true);
    Axios.get(`https://viacep.com.br/ws/${cep}/json/`)
      .then((response) => {
        if (response.data && !response.data.erro) {
          setEnterprise({
            ...enterprise,
            zipCode: cep,
            address: response.data.logradouro,
            state: response.data.uf,
            city: response.data.localidade,
            district: response.data.bairro,
            country: "Brasil",
          });
        }
        setIsloading(false);
      })
      .catch((e) => {
        setIsloading(false);
      });
  };

  return (
    <>
      <Row>
        <Col breakPoint={{ xs: 12, md: 12 }}>
          <Card>
            <CardHeader>
              <FormattedMessage
                id={isEdit ? "enterprise.edit" : "enterprise.new"}
              />
            </CardHeader>
            <CardBody>
              <Row>
                <Col breakPoint={{ md: 3 }}>
                  <UploadImage
                    onAddFile={onChangeImage}
                    value={image}
                    maxSize={10485760}
                    imagePreview={imagePreview}
                    height={153}
                    textAdd="drag.image.white"
                  />
                  <div className="mt-4"></div>
                  <UploadImage
                    onAddFile={onChangeImageDark}
                    value={imageDark}
                    maxSize={10485760}
                    imagePreview={imagePreviewDark}
                    height={153}
                    textAdd="drag.image.dark"
                  />
                </Col>

                <Col breakPoint={{ md: 9 }}>
                  <Row>
                    <Col breakPoint={{ md: 12 }} className="mb-4">
                      <InputGroup fullWidth>
                        <input
                          type="text"
                          placeholder={intl.formatMessage({
                            id: "name.enterprise.label",
                          })}
                          onChange={(text) =>
                            onChange("name", text.target.value)
                          }
                          value={enterprise?.name}
                          maxLength={150}
                        />
                      </InputGroup>
                    </Col>
                    <Col breakPoint={{ md: 3 }} className="mb-4">
                      <InputGroup fullWidth>
                        <input
                          type="text"
                          placeholder={intl.formatMessage({
                            id: "zip.label",
                          })}
                          onChange={(text) =>
                            onChange("zipCode", text.target.value)
                          }
                          value={enterprise?.zipCode}
                          maxLength={8}
                        />
                      </InputGroup>
                    </Col>
                    <Col breakPoint={{ md: 9 }} className="mb-4">
                      <InputGroup fullWidth>
                        <input
                          type="text"
                          placeholder={intl.formatMessage({
                            id: "address.label",
                          })}
                          onChange={(text) =>
                            onChange("address", text.target.value)
                          }
                          value={enterprise?.address}
                          maxLength={150}
                        />
                      </InputGroup>
                    </Col>
                    <Col breakPoint={{ md: 3 }} className="mb-4">
                      <InputGroup fullWidth>
                        <input
                          type="text"
                          placeholder={intl.formatMessage({
                            id: "number.label",
                          })}
                          onChange={(text) =>
                            onChange("number", text.target.value)
                          }
                          value={enterprise?.number}
                          maxLength={7}
                        />
                      </InputGroup>
                    </Col>
                    <Col breakPoint={{ md: 9 }} className="mb-4">
                      <InputGroup fullWidth>
                        <input
                          type="text"
                          placeholder={intl.formatMessage({
                            id: "complement.label",
                          })}
                          onChange={(text) =>
                            onChange("complement", text.target.value)
                          }
                          value={enterprise?.complement}
                          maxLength={150}
                        />
                      </InputGroup>
                    </Col>
                    <Col breakPoint={{ md: 6 }} className="mb-4">
                      <InputGroup fullWidth>
                        <input
                          type="text"
                          placeholder={intl.formatMessage({
                            id: "district.label",
                          })}
                          onChange={(text) =>
                            onChange("district", text.target.value)
                          }
                          value={enterprise?.district}
                          maxLength={150}
                        />
                      </InputGroup>
                    </Col>
                    <Col breakPoint={{ md: 6 }} className="mb-4">
                      <InputGroup fullWidth>
                        <input
                          type="text"
                          placeholder={intl.formatMessage({
                            id: "city.label",
                          })}
                          onChange={(text) =>
                            onChange("city", text.target.value)
                          }
                          value={enterprise?.city}
                          maxLength={150}
                        />
                      </InputGroup>
                    </Col>
                    <Col breakPoint={{ md: 3 }} className="mb-4">
                      <InputGroup fullWidth>
                        <input
                          type="text"
                          placeholder={intl.formatMessage({
                            id: "state.label",
                          })}
                          onChange={(text) =>
                            onChange("state", text.target.value)
                          }
                          value={enterprise?.state}
                          maxLength={150}
                        />
                      </InputGroup>
                    </Col>
                    <Col breakPoint={{ md: 3 }} className="mb-4">
                      <InputGroup fullWidth>
                        <input
                          type="text"
                          placeholder={intl.formatMessage({
                            id: "country.label",
                          })}
                          onChange={(text) =>
                            onChange("country", text.target.value)
                          }
                          value={enterprise?.country}
                          maxLength={150}
                        />
                      </InputGroup>
                    </Col>
                    <Col breakPoint={{ md: 3 }} className="mb-4">
                      <InputGroup fullWidth>
                        <input
                          type="text"
                          placeholder={intl.formatMessage({
                            id: "lon.label",
                          })}
                          onChange={(text) =>
                            setLat(
                              text.target?.value.replace(
                                /[^(\-)(\d+)\.(\d+)]/g,
                                ""
                              )
                            )
                          }
                          value={lat}
                        />
                      </InputGroup>
                    </Col>
                    <Col breakPoint={{ md: 3 }} className="mb-4">
                      <InputGroup fullWidth>
                        <input
                          type="text"
                          placeholder={intl.formatMessage({
                            id: "lat.label",
                          })}
                          onChange={(text) =>
                            setLon(
                              text.target?.value.replace(
                                /[^(\-)(\d+)\.(\d+)]/g,
                                ""
                              )
                            )
                          }
                          value={lon}
                        />
                      </InputGroup>
                    </Col>

                    <Col breakPoint={{ md: 12 }} className="mb-4">
                      <InputGroup fullWidth>
                        <textarea
                          type="text"
                          placeholder={intl.formatMessage({
                            id: "description",
                          })}
                          onChange={(text) =>
                            onChange("description", text.target.value)
                          }
                          value={enterprise?.description}
                          rows={1}
                        />
                      </InputGroup>
                    </Col>
                    {!!publicKey && (
                      <Col breakPoint={{ md: 12 }}>
                        <InputGroup fullWidth size="Small">
                          <input
                            type={showToken ? "text" : "password"}
                            value={publicKey}
                            disabled
                          />
                          <ContainerIcon
                            onClick={() => setShowToken(!showToken)}
                          >
                            <EvaIcon
                              name={
                                showToken ? "eye-outline" : "eye-off-outline"
                              }
                              status="Basic"
                            />
                          </ContainerIcon>
                        </InputGroup>
                        <TextSpan apparence="c2" className="ml-2">
                          <FormattedMessage id="machine.token.label" />
                        </TextSpan>
                      </Col>
                    )}
                  </Row>
                </Col>
              </Row>
            </CardBody>
            <CardFooter>
              <Button size="Small" onClick={onSave}>
                <FormattedMessage id="save" />
              </Button>
            </CardFooter>
          </Card>
        </Col>
      </Row>
      <SpinnerFull isLoading={isLoading} />
    </>
  );
};

export default SensorAdd;
