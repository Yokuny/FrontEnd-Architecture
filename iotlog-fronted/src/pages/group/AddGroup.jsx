import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  EvaIcon,
  InputGroup,
  Row,
} from "@paljs/ui";
import { useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  DeleteConfirmation,
  Fetch,
  LabelIcon,
  SelectEnterprise,
  SpinnerFull,
} from "../../components";
import { connect } from "react-redux";

function AddGroup(props) {
  const [enterprise, setEnterprise] = useState("");
  const [group, setGroup] = useState({
    id: crypto.randomUUID(),
    name: "",
  });
  const [subgroup, setSubgroup] = useState([
    {
      name: "",
      details: [],
      description: "",
    },
  ]);
  const [isEdit, setIsEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();

  const intl = useIntl();
  const navigate = useNavigate();

  const id = searchParams.get("id");

  const hasPermissionDelete = props.items?.some((x) => x === "/group-delete");

  useEffect(() => {
    fetchData(id);

    return () => {
      setEnterprise("");
      setGroup({
        id: crypto.randomUUID(),
        name: "",
      });
      setSubgroup([
        {
          name: "",
          details: [],
          description: "",
        },
      ]);
      setIsEdit(false);
    };
  }, [id]);

  function fetchData(id) {
    if (id) {
      setIsLoading(true);
      Fetch.get(`/assetstatus/group/${id}`).then((response) => {
        setEnterprise({
          value: response.data.enterprise.id,
          label: `${response.data.enterprise.name} - ${response.data.enterprise.city} ${response.data.enterprise.state}`,
        });
        setGroup({
          id: response.data.id,
          name: response.data.name,
        });
        setSubgroup(response.data.subgroup);
        setIsEdit(true);
      })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }


  function handleSubgroupChange(key, value, index) {
    const newSubgroup = [...subgroup];

    newSubgroup[index] = { ...newSubgroup[index], [key]: value };

    setSubgroup(newSubgroup);
  }

  function handleAddSubgroup() {
    setSubgroup([
      ...subgroup,
      {
        name: "",
        details: [],
        description: "",
      },
    ]);
  }

  function handleRemoveSubgroup(index) {
    setSubgroup((subgroup) => subgroup.filter((_, i) => i !== index));
  }

  function handleChangeEnterprise(value) {
    setEnterprise(value);
  }

  function handleChangeGroup(value) {
    setGroup((prev) => ({ ...prev, name: value }));
  }

  function handleSave() {
    const raw = {
      id: group.id,
      idEnterprise: enterprise?.value,
      name: group.name,
      subgroup: subgroup.map((subgroup) => ({
        name: subgroup.name,
        details: subgroup.details,
        description: subgroup.description,
      })),
    };

    if (!raw.idEnterprise) {
      toast.info(intl.formatMessage({ id: "enterprise.required" }));

      return;
    }

    if (!raw.name) {
      toast.info(intl.formatMessage({ id: "group.required" }));

      return;
    }

    if (!raw.subgroup.length) {
      toast.info(intl.formatMessage({ id: "subgroup.required" }));

      return;
    }

    if (!isEdit) {
      Fetch.post("/assetstatus/group/", raw)
        .then((response) => {
          if (response.status === 201) {
            toast.success(intl.formatMessage({ id: "save.successfull" }));

            return;
          }
        })
        .catch((e) => {
          toast.error(intl.formatMessage({ id: "save.error" }));
        });
    } else {
      Fetch.put(`/assetstatus/group/${raw.id}`, raw)
        .then((response) => {
          if (response.status === 200) {
            toast.success(intl.formatMessage({ id: "save.successfull" }));

            return;
          }
        })
        .catch((e) => {
          toast.error(intl.formatMessage({ id: "save.error" }));
        });
    }

    navigate(-1);
  }

  function handleDelete(id) {
    Fetch.delete(`/assetstatus/group/${id}`)
      .then((response) => {
        if (response.status === 204) {
          toast.success(intl.formatMessage({ id: "delete.successfull" }));
        }
      })
      .catch((e) => {
        toast.error(intl.formatMessage({ id: "delete.error" }));
      });

    navigate(-1);
  }

  return (
    <>
      <Card>
        <CardHeader>
          <FormattedMessage id="group" />
        </CardHeader>

        <CardBody>
          <Col breakPoint={{ xs: 12, md: 12 }}>
            <LabelIcon
              iconName="home-outline"
              title={intl.formatMessage({ id: "enterprise" })}
            />
            <SelectEnterprise
              onChange={handleChangeEnterprise}
              value={enterprise}
              placeholder={intl.formatMessage({ id: "group" })}
              disabled={false}
              isOnlyValue={false}
              oneBlocked
            />
          </Col>
          <Col breakPoint={{ xs: 12, md: 12 }} className="mt-4">
            <LabelIcon
              iconName="at-outline"
              title={intl.formatMessage({ id: "group" })}
            />
            <InputGroup fullWidth>
              <input
                type="text"
                value={group.name}
                onChange={(e) => handleChangeGroup(e.target.value)}
                placeholder={intl.formatMessage({ id: "group" })}
              />
            </InputGroup>
          </Col>
          {subgroup?.map((subgroup, index) => (
            <Col breakPoint={{ xs: 12, md: 12 }} className="mt-4">
              <Row between="md" bottom="md" className="m-0 pl-2">
                <Col breakPoint={{ xs: 10, md: 11 }}>
                  <LabelIcon
                    iconName="text-outline"
                    title={intl.formatMessage({ id: "subgroup" })}
                  />
                  <InputGroup fullWidth>
                    <input
                      type="text"
                      value={subgroup.name}
                      onChange={(e) =>
                        handleSubgroupChange("name", e.target.value, index)
                      }
                      placeholder={intl.formatMessage({ id: "name" })}
                    />
                  </InputGroup>
                </Col>
                {/* <Col breakPoint={{ xs: 6, md: 7 }}>
                  <LabelIcon
                    iconName="text-outline"
                    title={intl.formatMessage({ id: "description" })}
                  />
                  <InputGroup fullWidth>
                    <input
                      type="text"
                      value={subgroup.description}
                      onChange={(e) =>
                        handleSubgroupChange(
                          "description",
                          e.target.value,
                          index
                        )
                      }
                      placeholder={intl.formatMessage({ id: "description" })}
                    />
                  </InputGroup>
                </Col> */}
                <Col breakPoint={{ xs: 2, md: 1 }}>
                  <Button
                    status="Danger"
                    type="button"
                    appearance="ghost"
                    size="Small"
                    disabled={isLoading}
                    onClick={() => handleRemoveSubgroup(index)}
                  >
                    <EvaIcon name="trash-2-outline" />
                  </Button>
                </Col>
              </Row>
            </Col>
          ))}
          <Col breakPoint={{ xs: 12, md: 12 }} className="mt-4">
            <Row center="md">
              <Button
                status="Info"
                type="button"
                size="Small"
                appearance="ghost"
                disabled={isLoading}
                onClick={handleAddSubgroup}
                style={{ display: "flex", alignItems: "center" }}
              >
                <EvaIcon name="plus-square-outline" />
                <FormattedMessage id="add" />
              </Button>
            </Row>
          </Col>
        </CardBody>

        <CardFooter>
          <Row between={hasPermissionDelete ? "md" : ""}
            end={!hasPermissionDelete ? "md" : ""}
            className="pl-4 pr-4">
            {hasPermissionDelete && <DeleteConfirmation
              onConfirmation={() => handleDelete(group.id)}
              placement="bottom"
              message={<FormattedMessage id="delete.confirmation" />}
            >
              <Button
                disabled={isLoading}
                size="Small" status="Danger" appearance="ghost">
                <FormattedMessage id="delete" />
              </Button>
            </DeleteConfirmation>}
            <Button
              status="Primary"
              type="button"
              size="Small"
              onClick={handleSave}
              disabled={isLoading}
            >
              <FormattedMessage id="save" />
            </Button>
          </Row>
        </CardFooter>
      </Card>
      <SpinnerFull isLoading={isLoading} />
    </>
  );
}

const mapStateToProps = (state) => ({
  items: state.menu.items,
});

export default connect(mapStateToProps, undefined)(AddGroup);
