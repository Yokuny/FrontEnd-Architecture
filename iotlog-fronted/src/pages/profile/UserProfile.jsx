import { Button } from "@paljs/ui/Button";
import { Card, CardBody, CardFooter, CardHeader } from "@paljs/ui/Card";
import Col from "@paljs/ui/Col";
import { EvaIcon } from "@paljs/ui/Icon";
import { InputGroup } from "@paljs/ui/Input";
import Row from "@paljs/ui/Row";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { toast } from "react-toastify";
import styled from "styled-components";
import {
  Fetch,
  LabelIcon,
  SelectEnterprisePreferred,
  SpinnerFull,
  TextSpan,
  UploadImage,
} from "../../components";
import InputWhatsapp from "../../components/Inputs/InputWhatsapp";

const ContainerIcon = styled.a`
  position: absolute;
  right: 25px;
  top: 10px;
  cursor: pointer;
`;

const ContainerRow = styled(Row)`
  input {
    line-height: 0.5rem;
  }
`;

const UserProfile = (props) => {
  const intl = useIntl();

  const [isLoading, setIsLoading] = React.useState(false);
  const [imagePreview, setImagePreview] = React.useState(undefined);
  const [image, setImage] = React.useState(undefined);
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [changePassword, setChangePassword] = React.useState(false);
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [oldPassword, setOldPassword] = React.useState("");

  const [showPass, setShowPass] = React.useState("");

  React.useEffect(() => {
    findInfo();
  }, []);

  const findInfo = () => {
    setIsLoading(true);
    Fetch.get("/user/me")
      .then((response) => {
        setEmail(response.data?.email);
        setName(response.data?.name);
        setImage(response.data?.image);
        setPhone(response.data?.phone);
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const saveImageAsync = async () => {
    try {
      const data = new FormData();
      data.append("file", image);
      let response = await Fetch.post(`/upload/user`, data);

      localStorage.setItem(
        "user",
        JSON.stringify({
          image: { url: response?.data?.url },
          name,
        })
      );

      toast.success(intl.formatMessage({ id: "save.successfull" }));
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (e) {
    } finally {
      setIsLoading(false);
    }
  };

  const onSave = async () => {
    if (!name) {
      toast.warn(intl.formatMessage({ id: "name.required" }));
      return;
    }

    let data = {
      name,
      phone
    };

    if (changePassword) {
      if (!oldPassword) {
        toast.warn(intl.formatMessage({ id: "old.password.required" }));
        return;
      }
      if (!newPassword) {
        toast.warn(intl.formatMessage({ id: "new.password.required" }));
        return;
      }
      if (!confirmPassword) {
        toast.warn(intl.formatMessage({ id: "confirm.password.required" }));
        return;
      }

      if (newPassword != confirmPassword) {
        toast.warn(intl.formatMessage({ id: "passwords.different" }));
        return;
      }

      data = {
        ...data,
        changePassword: true,
        oldPassword,
        newPassword,
      };
    }

    setIsLoading(true);
    try {
      await Fetch.put("/user", data);
    } catch (e) {
      setIsLoading(false);
      return;
    }

    if (!!imagePreview) await saveImageAsync();
    else {
      toast.success(intl.formatMessage({ id: "save.successfull" }));
      setIsLoading(false);
      localStorage.setItem(
        "user",
        JSON.stringify({
          image: { url: image?.url },
          name,
        })
      );
      setTimeout(() => {
        window.location.reload();
      }, 2000);
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

  const changeShowPass = (showing) => {
    if (showing == showPass) {
      setShowPass("");
      return;
    }
    setShowPass(showing);
  };

  return (
    <>
      <Row>
        <Col breakPoint={{ xs: 12, md: 12 }}>
          <Card>
            <CardHeader>
              <FormattedMessage id={"profile"} />
            </CardHeader>
            <CardBody>
              <ContainerRow>
                <Col breakPoint={{ lg: 4 }} className="mb-4">
                  <UploadImage
                    onAddFile={onChangeImage}
                    value={image}
                    maxSize={10485760}
                    imagePreview={imagePreview}
                    height={265}
                  />
                </Col>
                <Col breakPoint={{ lg: 8, md: 6 }}>
                  <Row>
                    <Col breakPoint={{ md: 12 }} className="mb-4">
                      <LabelIcon
                        iconName={"person-outline"}
                        title={intl.formatMessage({
                          id: "name.placeholder",
                        })}
                        mandatory
                      />
                      <InputGroup fullWidth className="mt-1">
                        <input
                          type="text"
                          placeholder={intl.formatMessage({
                            id: "name.placeholder",
                          })}
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </InputGroup>
                    </Col>
                    <Col breakPoint={{ md: 6 }} className="mb-4">
                      <LabelIcon
                        iconName={"email-outline"}
                        title={intl.formatMessage({
                          id: "email",
                        })}
                        mandatory
                      />
                      <InputGroup fullWidth className="mt-1">
                        <input type="text" value={email} disabled />
                      </InputGroup>
                    </Col>
                    <Col breakPoint={{ md: 6 }} className="mb-4">
                      <LabelIcon
                        iconName={"phone-outline"}
                        title={'WhatsApp'}
                      />
                      <InputWhatsapp
                        value={phone}
                        className="pl-1 mt-1"
                        onChange={(value) => setPhone(value)}
                      />
                    </Col>
                    <Col breakPoint={{ md: 12 }} className="mb-4">
                      <LabelIcon
                        iconName={"home-outline"}
                        title={intl.formatMessage({
                          id: "my.enterprise",
                        })}
                      />
                      <div className="mt-1"></div>
                      <SelectEnterprisePreferred />
                    </Col>
                    {changePassword && (
                      <>
                        <Col breakPoint={{ md: 12 }} className="mb-4">
                          <LabelIcon
                            iconName={"unlock-outline"}
                            title={intl.formatMessage({
                              id: "old.password.placeholder",
                            })}
                            mandatory
                          />
                          <InputGroup fullWidth className="mt-1">
                            <input
                              type={showPass == "old" ? "text" : "password"}
                              placeholder={intl.formatMessage({
                                id: "old.password.placeholder",
                              })}
                              value={oldPassword}
                              onChange={(e) => setOldPassword(e.target.value)}
                            />
                          </InputGroup>
                          <ContainerIcon
                            className="mt-2 pt-4"
                            onClick={() => changeShowPass("old")}
                          >
                            <EvaIcon
                              name={
                                showPass == "old"
                                  ? "eye-outline"
                                  : "eye-off-outline"
                              }
                              status="Basic"
                            />
                          </ContainerIcon>
                        </Col>
                        <Col breakPoint={{ md: 6 }} className="mb-4">
                          <LabelIcon
                            iconName={"lock-outline"}
                            title={intl.formatMessage({
                              id: "new.password",
                            })}
                            mandatory
                          />
                          <InputGroup fullWidth className="mt-1">
                            <input
                              type={showPass == "new" ? "text" : "password"}
                              placeholder={intl.formatMessage({
                                id: "new.password",
                              })}
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                            />
                          </InputGroup>
                          <ContainerIcon
                            className="mt-2 pt-4"
                            onClick={() => changeShowPass("new")}
                          >
                            <EvaIcon
                              name={
                                showPass == "new"
                                  ? "eye-outline"
                                  : "eye-off-outline"
                              }
                              status="Basic"
                            />
                          </ContainerIcon>
                        </Col>
                        <Col breakPoint={{ md: 6 }} className="mb-4">
                          <LabelIcon
                            iconName={"lock"}
                            title={intl.formatMessage({
                              id: "account.confirm.password",
                            })}
                            mandatory
                          />
                          <InputGroup fullWidth className="mt-1">
                            <input
                              type={showPass == "confirm" ? "text" : "password"}
                              placeholder={intl.formatMessage({
                                id: "account.confirm.password",
                              })}
                              value={confirmPassword}
                              onChange={(e) =>
                                setConfirmPassword(e.target.value)
                              }
                            />
                          </InputGroup>
                          <ContainerIcon
                            onClick={() => changeShowPass("confirm")}
                            className="mt-2 pt-4"
                          >
                            <EvaIcon
                              name={
                                showPass == "confirm"
                                  ? "eye-outline"
                                  : "eye-off-outline"
                              }
                              status="Basic"
                            />
                          </ContainerIcon>
                        </Col>
                      </>
                    )}
                  </Row>
                </Col>
              </ContainerRow>
            </CardBody>
            <CardFooter>
              <Row between="xs" className="m-0">
                <Button
                  status={changePassword ? "Basic" : "Danger"}
                  size="Tiny"
                  onClick={() => setChangePassword(!changePassword)}
                  className="flex-between"
                  appearance="ghost"
                >
                  <EvaIcon
                    name={
                      changePassword ? "close-outline" : "lock-outline"
                    }
                    className="mr-1"
                  />
                  <FormattedMessage
                    id={changePassword ? "cancel" : "change.password"}
                  />
                </Button>
                <Button size="Tiny"
                  className="flex-between"
                  disabled={isLoading}
                  onClick={onSave}>
                  <EvaIcon name="checkmark-outline" className="mr-1" />
                  <FormattedMessage id="save" />
                </Button>
              </Row>
            </CardFooter>
          </Card>
        </Col>
      </Row>
      <SpinnerFull isLoading={isLoading} />
    </>
  );
};

export default UserProfile;
