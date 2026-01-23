import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  EvaIcon,
  Row,
  Select,
} from "@paljs/ui";
import React from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { addDataVoyage, setFormFields } from "../../../../actions";
import {
  DeleteConfirmation,
  Fetch,
  LabelIcon,
  TextSpan,
} from "../../../../components";
import InputUserLocal from "../../../../components/Inputs/InputUserLocal";
import { convertFormTOSelect } from "../../../../components/Select/SelectForm";
import MountFormFields from "../../../forms/MountFormFields";

const FormsData = (props) => {
  const [isLoading, setIsLoading] = React.useState();
  const [formsRegisteredList, setFormRegisteredList] = React.useState([]);

  const { data, addDataVoyage, propNameForm } = props;

  React.useEffect(() => {
    return () => {
      props.setFormFields([]);
    }
  }, [])

  React.useEffect(() => {
    getData(data?.machine?.id);
    return () => {
      setFormRegisteredList([]);
    };
  }, [data?.machine?.id]);

  const getData = (idMachine) => {
    if (!idMachine) return;
    setIsLoading(true);
    Fetch.get(`/form/list/travelconfig?idMachine=${idMachine}&type=${propNameForm}`)
      .then((response) => {
        setFormRegisteredList(response.data);
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const onChange = (prop, value) => {
    addDataVoyage({
      [prop]: value,
    });
  };

  const onChangeItemForm = (index, prop, value) => {
    const formToEdit = data?.[propNameForm][index];
    formToEdit[prop] = value;
    formToEdit.isEdit = true;
    formToEdit.dateModified = new Date();
    addDataVoyage({
      [propNameForm]: [
        ...data?.[propNameForm]?.slice(0, index),
        formToEdit,
        ...data?.[propNameForm]?.slice(index + 1),
      ],
    });
  };

  const options = formsRegisteredList?.map((x) => convertFormTOSelect(x));

  return (
    <>
      <Col breakPoint={{ md: 12 }} className="mt-4 mb-2">
        {data?.[propNameForm]?.map((formData, i) => (
          <Card>
            <CardHeader>
              <Row>
                <Col breakPoint={{ md: 6, xs: 10, sm: 10 }}>
                  <LabelIcon
                    iconName="file-text-outline"
                    title={<FormattedMessage id="form" />}
                  />
                  {formData?.isDisabledChoose ? (
                    <TextSpan className="ml-1" apparence="s1">
                      {formData?.formChoose?.label}
                    </TextSpan>
                  ) : (
                    <Select
                      options={options}
                      menuPosition="fixed"
                      className="mt-1"
                      isLoading={isLoading}
                      onChange={(choose) =>
                        onChangeItemForm(i, "formChoose", choose)
                      }
                      noOptionsMessage={() => (
                        <FormattedMessage id="nooptions.message" />
                      )}
                      placeholder={<FormattedMessage id="form" />}
                      value={formData?.formChoose}
                    />
                  )}
                </Col>
                {formData?.isEdit && (
                  <Col breakPoint={{ md: 6, xs: 2, sm: 2 }}>
                    <Row style={{ margin: 0 }} end="xs" className="pt-4">
                      <DeleteConfirmation
                        message={
                          <FormattedMessage id="delete.message.default" />
                        }
                        onConfirmation={() =>
                          onChange(
                            propNameForm,
                            data?.[propNameForm]?.filter((x, z) => z !== i)
                          )
                        }
                      >
                        <Button
                          className="mt-2"
                          status="Danger"
                          size="Tiny"
                          appearance="ghost"
                        >
                          <EvaIcon name="trash-2" />
                        </Button>
                      </DeleteConfirmation>
                    </Row>
                  </Col>
                )}
              </Row>
            </CardHeader>
            <CardBody style={{ overflowX: 'hidden' }}>
              <Row>
                {formData?.formChoose?.value && (
                  <MountFormFields
                    idForm={formData?.formChoose?.value}
                    onChange={(prop, value) => onChangeItemForm(i, prop, value)}
                    data={formData}
                  />
                )}
              </Row>
            </CardBody>
            <CardFooter>
              <Row end="xs">
                <Col breakPoint={{ md: 3 }}>
                  <InputUserLocal
                    title={
                      !!formData?.userLastModified && !formData?.isEdit ? (
                        <FormattedMessage id="filled.user" />
                      ) : (
                        <FormattedMessage id="fill.now" />
                      )
                    }
                    isDisabled={
                      !!formData?.userLastModified && !formData?.isEdit
                    }
                    user={
                      formData?.userLastModified && !formData?.isEdit
                        ? {
                            name: formData.userLastModified,
                          }
                        : undefined
                    }
                  />
                </Col>
              </Row>
            </CardFooter>
          </Card>
        ))}

        <Button
          size="Tiny"
          status="Success"
          className="flex-between"
          onClick={() => {
            if (data?.[propNameForm]?.length) {
              onChange(propNameForm, [...data?.[propNameForm], {}]);
              return;
            }
            onChange(propNameForm, [{}]);
          }}
        >
          <EvaIcon className="mr-1" name="file-add-outline" />
          <FormattedMessage id="add.form" />
        </Button>
      </Col>
    </>
  );
};

const mapStateToProps = (state) => ({
  data: state.voyage.data,
});

const mapDispatchToProps = (dispatch) => ({
  addDataVoyage: (item) => {
    dispatch(addDataVoyage(item));
  },
  setFormFields: (fields) => {
    dispatch(setFormFields(fields));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(FormsData);
