import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  EvaIcon,
  Row,
} from "@paljs/ui";
import { nanoid } from "nanoid";
import { PrimeReactProvider } from "primereact/api";
import { Tree } from "primereact/tree";
import React, { useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTheme } from "styled-components";
import { toast } from "react-toastify";
import { Fetch, Modal, SpinnerFull, TextSpan } from "../../../components";
import { TreeSensorsForm } from "./TreeSensorsForm";

export default function MachineTreeSensors() {
  const [data, setData] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [payload, setPayload] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [lastKey, setLastKey] = useState({});

  const [searchParams] = useSearchParams();

  const idMachine = searchParams.get("idMachine");
  const name = searchParams.get("name");

  const intl = useIntl();
  const theme = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const getData = () => {
      setIsLoading(true);

      Fetch.get(`/treesensors/${idMachine}`)
        .then((response) => {
          setData(response.data.tree);
          setPayload({
            id: response.data.id,
            idMachine: response.data.idMachine,
          });
          setIsEdit(true);
          setIsLoading(false);
        })
        .catch(() => {
          setIsLoading(false);
        });
    };

    if (idMachine) {
      getData();
    }

    return () => {
      setData([]);
    };
  }, [idMachine]);

  const addChild = (parentId, level) => {
    const addNewChildRecursively = (items) => {
      return items.map((item) => {
        if (item.key === parentId) {
          const newChild = {
            key: nanoid(8),
            title: "",
            sensors: [],
            children: [],
            level: level + 1,
          };

          setSelectedItem(newChild);

          return {
            ...item,
            children: [...item.children, newChild],
          };
        }

        if (item.children && item.children.length > 0) {
          return {
            ...item,
            children: addNewChildRecursively(item.children),
          };
        }

        return item;
      });
    };

    setData((prevData) => addNewChildRecursively(prevData));
    setLastKey((prevData) => ({
      ...prevData,
      [parentId]: true,
    }));
  };

  const handleSave = () => {
    if (!idMachine) {
      return toast.warn(intl.formatMessage({ id: "machine.required" }));
    }

    const existsDataWithoutTitle = data.flatMap((item) => validateData(item))
    if (existsDataWithoutTitle.some((item) => item === false)) {
      return toast.warn(intl.formatMessage({ id: "title.required" }));
    }

    setIsLoading(true);

    if (isEdit) {
      Fetch.put(`/treesensors/${payload.id}`, {
        id: payload.id,
        idMachine: payload.idMachine,
        tree: data,
      })
        .then((response) => {
          if (response.status === 200) {
            toast.success(
              intl.formatMessage({ id: "sensor.tree.saved.successfully" })
            );
            setIsLoading(false);
            navigate(-1);
          }
        })
        .catch(() => {
          setIsLoading(false);
          toast.error(intl.formatMessage({ id: "error.saving.sensor.tree" }));
        });
    } else {
      Fetch.post(`/treesensors/${idMachine}`, {
        idMachine,
        tree: data,
      })
        .then((response) => {
          if (response.status === 201) {
            toast.success(
              intl.formatMessage({ id: "sensor.tree.saved.successfully" })
            );
            setIsLoading(false);
          }
        })
        .catch(() => {
          setIsLoading(false);
          toast.error(intl.formatMessage({ id: "error.saving.sensor.tree" }));
        });
    }
  };

  const removeChild = (parentId) => {
    const removeItemById = (items, idToRemove) => {
      return items.reduce((acc, item) => {
        const newItem = { ...item };

        if (newItem.key === idToRemove) {
          return acc;
        }

        if (newItem.children) {
          newItem.children = removeItemById(newItem.children, idToRemove);
        }

        return [...acc, newItem];
      }, []);
    };

    setData((prevData) => removeItemById(prevData, parentId));
  };

  const changeItem = (data) => {
    setSelectedItem(data);
  };

  const handleSaveItem = (data) => {
    const updateItemRecursively = (items) => {
      return items.map((item) => {
        if (item.key === data.key) {
          return {
            ...item,
            ...data,
          };
        }

        if (item.children && item.children.length > 0) {
          return {
            ...item,
            children: updateItemRecursively(item.children),
          };
        }

        return item;
      });
    };

    setData((prevData) => updateItemRecursively(prevData));
    setSelectedItem(null);
  };

  const handleAddGroup = () => {
    const node = {
      key: nanoid(8),
      title: "",
      sensors: [],
      children: [],
      level: 0,
    };
    setData((prevData) => prevData.concat(node));
    setSelectedItem(node);
  };

  const handleCloseModal = () => {
    if (!selectedItem.title) {
      removeChild(selectedItem.key);
    }

    setSelectedItem(null);
  };

  const handleEdit = (node) => {
    setSelectedItem(node);
  };

  const validateData = (data) => {
    if (!data.title) {
      return false;
    }

    if (data.children && data.children.length) {
      return data.children.map((child) => validateData(child));
    }

    return true;
  }

  return (
    <>
      <Card>
        <CardHeader>
          <TextSpan apparence="s1" key={nanoid(5)}>
            {name ? `${name} - ` : ""}
            <FormattedMessage id="tree.sensors" />
          </TextSpan>
        </CardHeader>
        <CardBody>
          <PrimeReactProvider>
            {!!data?.length && (
              <Tree
                style={{
                  border: "none",
                  background: theme.backgroundBasicColor1,
                }}
                key={nanoid(5)}
                value={data}
                onExpand={(event) => {
                  setLastKey((prevData) => ({
                    ...prevData,
                    [event?.node?.key]: true,
                  }));
                }}
                expandedKeys={lastKey}
                emptyMessage={" "}
                nodeTemplate={(node, option) => {
                  return (
                    <>
                      <Row
                        between="md"
                        middle="md"
                        style={{
                          width: "95%",
                          marginBottom: node.level
                            ? `${node.level / 10 + 0.2}rem`
                            : `0.5rem`,
                        }}
                        key={node.key}
                      >
                        <Col breakPoint={{ md: 10 }}>
                          <TextSpan apparence="s2">{node.title}</TextSpan>
                        </Col>
                        <Col breakPoint={{ md: 2 }}>
                          <Row end="xs">
                            <Button
                              onClick={() => handleEdit(node)}
                              size="Tiny"
                              appearance="ghost"
                              status="Basic"
                            >
                              <EvaIcon name={"edit-2-outline"} />
                            </Button>
                            <Button
                              onClick={() => removeChild(node.key)}
                              size="Tiny"
                              status="Primary"
                              className="ml-2"
                              appearance="ghost"
                            >
                              <EvaIcon
                                name={"trash-2-outline"}
                                status="Danger"
                              />
                            </Button>
                          </Row>
                        </Col>
                        {!!node?.sensors?.length ? (
                          <Col breakPoint={{ md: 12 }} className="mb-3">
                            {node.sensors.map((sensor) => (
                              <Button
                                size="Tiny"
                                status="Info"
                                appearance="outline"
                                className="mr-1"
                                style={{ border: "0px" }}
                              >
                                {sensor.label}
                              </Button>
                            ))}
                          </Col>
                        ) : null}
                        <Col>
                          <Button
                            onClick={() => addChild(node.key, node.level)}
                            size="Tiny"
                            appearance="ghost"
                            status="Basic"
                            className="flex-between"
                          >
                            <EvaIcon name={"plus-outline"} className="mr-1" />
                            {`${intl.formatMessage({ id: "add.in" })} ${
                              node.title
                            }`}
                          </Button>
                        </Col>
                      </Row>
                    </>
                  );
                }}
              />
            )}
          </PrimeReactProvider>
          <Row start="md" className={data?.length ? "ml-4" : "ml-1"}>
            <Button
              appearance="ghost"
              status={data?.length ? "Basic" : "Info"}
              size="Tiny"
              className="flex-between"
              onClick={() => handleAddGroup()}
            >
              <EvaIcon name={"plus-circle-outline"} className="mr-1" />
              <FormattedMessage id="new.group" />
            </Button>
          </Row>
        </CardBody>

        <CardFooter>
          <Row end="md" className="mr-4">
            <Button
              status={"Success"}
              size="Small"
              onClick={handleSave}
            >
              <FormattedMessage id="save" />
            </Button>
          </Row>
        </CardFooter>
      </Card>

      <Modal
        show={!!selectedItem}
        title={intl.formatMessage({ id: "tree.sensors" })}
        onClose={handleCloseModal}
        size="Large"
        renderFooter={() => (
          <CardFooter>
            <Row end="md" className="mr-4">
              <Button
                status="Success"
                size="Small"
                onClick={() => handleSaveItem(selectedItem)}
                disabled={!selectedItem.title}
              >
                <FormattedMessage id="save" />
              </Button>
            </Row>
          </CardFooter>
        )}
      >
        {!!selectedItem && (
          <TreeSensorsForm onChangeItem={changeItem} item={selectedItem} />
        )}
      </Modal>

      <SpinnerFull isLoading={isLoading} />
    </>
  );
}
