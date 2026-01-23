import { Card, CardBody, CardFooter, CardHeader, EvaIcon, InputGroup } from "@paljs/ui";
import { Button } from "@paljs/ui/Button";
import Col from "@paljs/ui/Col";
import Row from "@paljs/ui/Row";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useNavigate } from 'react-router-dom';
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { Fetch, InputDecimal, LabelIcon, SpinnerFull, TextSpan } from "../../../../components";
import { translate } from "../../../../components/language";
import { ContainerColor, InputColorControl } from "../../../../components/Inputs";

const uuid = require('uuid').v4;

function BuoyForm(props) {

  const navigate = useNavigate();
  const intl = useIntl();

  const [formData, setFormData] = React.useState();
  const [isEditing, setIsEditing] = React.useState();
  const [buoyObjectId, setBuoyObjectId] = React.useState();
  const [isLoading, setIsLoading] = React.useState(true);
  const [idEnterprise, setIdEnterprise] = React.useState();

  const id = new URL(window.location.href).searchParams.get("id");

  React.useLayoutEffect(() => {
    if (props.enterprises?.length) {
      setIdEnterprise(props.enterprises[0].id);
    }
  }, [props.enterprises]);

  React.useEffect(() => {

    if (id) {
      setIsEditing(true)
      findBuoyData()

    } else {
      setIsEditing(false)
      generateBuoyFormData()
    }

  }, [id])

  function findBuoyData() {
    Fetch.get(`/buoy/${id}`)
      .then((response) => {
        generateBuoyFormData(response.data)
      })
      .catch(() => toast.error(translate("error.get")))
  }

  function generateBuoyFormData(existing) {
    let delimitations;
    let coordinates;


    if (existing) {

      setBuoyObjectId(existing._id)

      if (!!existing.location.type) {
        delimitations = [{
          name: '',
          radius: existing.location.properties.radius,
          color: existing.color,
          idDelimitation: uuid()
        }]

        coordinates = [existing.location.geometry.coordinates[1], existing.location.geometry.coordinates[0]]

      } else {
        delimitations = existing.location.map((_location, index) => ({
          name: _location.name,
          radius: _location.properties.radius,
          color: _location.color,
          idDelimitation: _location[index]?.idDelimitation || uuid()
        }));

        coordinates = [existing.location[0].geometry.coordinates[1], existing.location[0].geometry.coordinates[0]]
      }

    } else { coordinates = ['', ''] }

    const newFormData = {
      name: existing?.name || '',
      proximity: existing?.proximity || '',
      delimitations: delimitations || [{ name: '', radius: '', color: '' }],
      latitude: coordinates[0],
      longitude: coordinates[1]
    }

    setIsLoading(false);
    setFormData(newFormData);
  }

  function addDelimitation() {
    setFormData((prevFormData) => ({
      ...prevFormData,
      delimitations: [
        ...prevFormData.delimitations,
        { name: '', radius: '', color: '' },
      ],
    }));
  };

  function removeDelimitation(index) {
    setFormData((prevFormData) => {
      const updatedDelimitations = [...prevFormData.delimitations];
      updatedDelimitations.splice(index, 1);

      return {
        ...prevFormData,
        delimitations: updatedDelimitations,
      };
    });
  }

  function onChange(prop, value, index) {

    if (prop.startsWith("delimitations")) {
      const updatedDelimitations = [...formData.delimitations];
      const nestedProp = prop.split('.')[1];
      updatedDelimitations[index] = {
        ...updatedDelimitations[index],
        [nestedProp]: value,
      };

      setFormData({
        ...formData,
        delimitations: updatedDelimitations,
      });

    } else {
      setFormData({
        ...formData,
        [prop]: value,
      });
    }
  }

  function onRemove() {
    setIsLoading(true)
    Fetch.delete(`/buoy/${buoyObjectId}`)
      .then(() => {
        toast.success(translate('success.remove'));
      })
      .catch((e) => {
        return toast.error(translate('error.remove'));
      })
      .finally(() => {
        onClose();
      });
  }

  function onSave() {
    setIsLoading(true)
    const location = formData.delimitations
      .map(delimitation => ({
        type: "Polygon",
        properties: { radius: parseInt(delimitation.radius) },
        geometry: {
          type: "Point",
          coordinates: [parseFloat(formData.longitude), parseFloat(formData.latitude)]
        },
        name: delimitation.name,
        color: delimitation.color,
        idDelimitation: uuid()
      }))
      .sort((a, b) => a.properties.radius - b.properties.radius);

    const payload = {
      proximity: formData.proximity,
      color: '',
      name: formData.name,
      idEnterprise,
      location,
    }

    Fetch.post('/buoy', payload)
      .then(() => {
        toast.success(translate('success.save'))
      })
      .catch((e) => {
        return toast.error(translate('error.save'));
      })
      .finally(() => {
        onClose();
      })
  }

  function onUpdate() {
    setIsLoading(true)

    const location = formData.delimitations
      .map((delimitation, index) => ({
        type: "Polygon",
        properties: { radius: parseInt(delimitation.radius) },
        geometry: {
          type: "Point",
          coordinates: [parseFloat(formData.longitude), parseFloat(formData.latitude)]
        },
        name: delimitation.name,
        color: delimitation.color,
        idDelimitation: formData.delimitations[index].idDelimitation
      }))
      .sort((a, b) => a.properties.radius - b.properties.radius);

    const payload = {
      proximity: formData.proximity,
      color: '',
      name: formData.name,
      idEnterprise,
      location,
    }

    Fetch.put(`/buoy/${buoyObjectId}`, payload)
      .then(() => {
        toast.success(translate('success.update'));
      })
      .catch((e) => {
        return toast.error(translate('error.update'));
      })
      .finally(() => {
        onClose();
      });
  }

  function onClose() {
    setIsLoading(false)
    setFormData()
    navigate(-1)
  }

  function renderFooter() {
    let disabled =
      !formData?.name
      || !formData?.proximity
      || !formData?.delimitations
      || !formData?.delimitations[0].name
      || !formData?.delimitations[0].color
      || !formData?.delimitations[0].radius
      || !formData?.latitude || !formData?.longitude

    return (
      <Row between="xs" className="m-0">
        {isEditing ? (
          <Button
            appearance="ghost"
            size="Small"
            onClick={onRemove}
            status="Danger"
          >
            <FormattedMessage id="delete" />
          </Button>
        ) : (<div />)}

        {isEditing ? (
          <Button
            size="Small"
            onClick={onUpdate}
            disabled={disabled}
          >
            <FormattedMessage id="save" />
          </Button>
        ) : (
          <Button
            size="Small"
            onClick={onSave}
            disabled={disabled}
          >
            <FormattedMessage id="save" />
          </Button>
        )}
      </Row>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <FormattedMessage id="buoy.form" />
        </CardHeader>
        <CardBody>

              <Row>
                <Col breakPoint={{ md: 4 }} className="mb-4" style={{ width: '100%' }}>
                  <LabelIcon mandatory title={<FormattedMessage id="name" />} fullWidth />
                  <InputGroup fullWidth>
                    <input
                      value={formData?.name}
                      onChange={(e) => onChange("name", e.target.value)}
                    />
                  </InputGroup>
                </Col>
                <Col breakPoint={{ md: 8 }} className="mb-4" style={{ width: '100%' }}>
                  <LabelIcon mandatory title={<FormattedMessage id="proximity" />} fullWidth />
                  <InputGroup fullWidth>
                    <input
                      value={formData?.proximity}
                      onChange={(e) => onChange("proximity", e.target.value)}
                    />
                  </InputGroup>
                </Col>
              </Row>

              <Row>
                <Col breakPoint={{ md: 6 }} className="mb-4" style={{ width: '100%' }}>
                  <LabelIcon mandatory title={<FormattedMessage id="latitude" />} fullWidth />
                  <InputGroup fullWidth>
                    <InputDecimal
                      type="text"
                      placeholder={intl.formatMessage({ id: "latitude" })}
                      onChange={(e) => onChange("latitude", e)}
                      value={formData?.latitude}
                    />
                  </InputGroup>
                </Col>
                <Col breakPoint={{ md: 6 }} className="mb-4" style={{ width: '100%' }}>
                  <LabelIcon mandatory title={<FormattedMessage id="longitude" />} fullWidth />
                  <InputGroup fullWidth>
                    <InputDecimal
                      type="text"
                      placeholder={intl.formatMessage({ id: "longitude" })}
                      onChange={(e) => onChange("longitude", e)}
                      value={formData?.longitude}
                    />
                  </InputGroup>
                </Col>
              </Row>

              <Card style={{ marginBottom: 0 }}>
                <CardHeader>
                  <TextSpan apparence="p2" hint>
                    <FormattedMessage id="radius" />
                  </TextSpan>
                </CardHeader>
                <CardBody>
                  {formData?.delimitations?.map((_, index) => {
                    return (
                      <Row middle="xs">
                        <Col breakPoint={{ md: 1 }} className="mb-4" >
                          <LabelIcon mandatory title={<FormattedMessage id="color" />} fullWidth />
                          <ContainerColor>
                          <InputColorControl
                            onChange={(value) => onChange(`delimitations[${index}].color`, value, index)}
                            value={formData?.delimitations[index].color}
                          />
                          </ContainerColor>
                        </Col>
                        <Col breakPoint={{ md: 6 }} className="mb-4" >
                          <LabelIcon mandatory title={<FormattedMessage id="name" />} fullWidth />
                          <InputGroup fullWidth>
                            <input
                              value={formData?.delimitations[index].name}
                              onChange={(e) => onChange(`delimitations[${index}].name`, e.target.value, index)}
                            />
                          </InputGroup>
                        </Col>

                        <Col breakPoint={{ md: 4 }} className="mb-4" >
                          <LabelIcon mandatory title={<FormattedMessage id="radius" />} fullWidth />
                          <InputGroup fullWidth>
                            <input
                              value={formData?.delimitations[index].radius}
                              type="number"
                              onChange={(e) => onChange(`delimitations[${index}].radius`, e.target.value, index)}
                            />
                          </InputGroup>
                        </Col>

                        <Col breakPoint={{ md: 1 }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                          {formData.delimitations.length > 1 && (
                            <Button
                              size="Tiny"
                              appearance="ghost"
                              className="flex-between"
                              status="Danger"
                              onClick={() => removeDelimitation(index)}
                            >
                              <EvaIcon name="trash-outline" className="mr-1" />
                            </Button>
                          )}
                        </Col>

                      </Row>
                    )
                  })}

                  <Row center="xs" >
                    <Button
                      size="Tiny"
                      appearance="ghost"
                      className="flex-between"
                      onClick={() => addDelimitation()}
                    >
                      <EvaIcon name="plus-square-outline" className="mr-1" />
                      <FormattedMessage id="buoy.delimitations.add" />
                    </Button>
                  </Row>

                </CardBody>
              </Card>
        </CardBody>
        <CardFooter>
          {renderFooter()}
        </CardFooter>
        <SpinnerFull isLoading={isLoading} />
      </Card >
    </>
  );
}

const mapStateToProps = (state) => ({ enterprises: state.enterpriseFilter.enterprises });

export default connect(mapStateToProps)(BuoyForm);
