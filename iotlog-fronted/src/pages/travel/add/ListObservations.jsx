import React from "react";
import { Button, CardBody, CardFooter, CardHeader, Checkbox, Col, EvaIcon, InputGroup, Row } from "@paljs/ui";
import { FormattedMessage, useIntl } from "react-intl";
import { CardNoShadow, InputDecimal, LabelIcon, Modal, TextSpan } from "../../../components";
import { TABLE, TBODY, TD, TH, THEAD, TR, TRH } from "../../../components/Table";
import { floatToStringExtendDot } from "../../../components/Utils";

export default function ListObservations({ formData, onChange }) {

  const [showModal, setShowModal] = React.useState(false)
  const [data, setData] = React.useState()

  const indexUpdate = React.useRef(null)

  const intl = useIntl()

  const onChangeItem = (data, i) => {
    onChange("listObservations", [
      ...(formData?.listObservations || [])?.slice(0, i),
      {
        ...(formData?.listObservations[i] || {}),
        ...(data || {})
      },
      ...(formData?.listObservations || [])?.slice(i + 1),
    ])
  }

  const onDelete = (i) => {
    onChange("listObservations", [
      ...(formData?.listObservations || [])?.slice(0, i),
      ...(formData?.listObservations || [])?.slice(i + 1),
    ])
  }

  const onAdd = () => {
    setShowModal(true)
  }

  const changeEditIndex = (i) => {
    indexUpdate.current = i
    setData(formData?.listObservations[i])
    setShowModal(true)
  }

  const onChangeInternalData = (prop, value) => {
    setData(prev => ({
      ...prev,
      [prop]: value
    })
    )
  }

  const onSave = () => {
    if (indexUpdate.current !== null) {
      onChangeItem(data, indexUpdate.current)
      indexUpdate.current = null;
    } else {
      onChange("listObservations", [
        ...(formData?.listObservations || []),
        data
      ])
    }
    setData(null)
    setShowModal(false)
  }

  return (
    <>
      <CardNoShadow>
        <CardHeader>
          <EvaIcon name="file-text-outline"
            className="mr-2"
            status="Basic" />
          <FormattedMessage id="observation" />
        </CardHeader>
        <CardBody>
          <Row>
            {!!formData?.listObservations?.length &&
              <TABLE>
                <THEAD>
                  <TRH>
                    <TH>
                      <TextSpan apparence="p2" hint>
                        <FormattedMessage id="observation" />
                      </TextSpan>
                    </TH>
                    <TH textAlign="end" style={{ width: 160 }}>
                      <TextSpan apparence="p2" hint>
                        <FormattedMessage id="value" /> $
                      </TextSpan>
                    </TH>
                    <TH textAlign="center" style={{ width: 120 }}>
                      <TextSpan apparence="p2" hint>
                        <FormattedMessage id="display" /> BOT
                      </TextSpan>
                    </TH>
                    <TH textAlign="center" style={{ width: 80 }}>
                      <TextSpan apparence="p2" hint>
                        <FormattedMessage id="actions" />
                      </TextSpan>
                    </TH>
                  </TRH>
                </THEAD>
                <TBODY>
                  {formData?.listObservations.map((item, i) => (
                    <>
                      <TR key={i}>
                        <TD>
                          <TextSpan apparence="p2">
                            {item?.observation}
                          </TextSpan>
                        </TD>
                        <TD textAlign="end">
                          <TextSpan apparence="p2">
                            {item?.value !== null || item?.value !== undefined
                              ? floatToStringExtendDot(item?.value)
                              : ""}
                          </TextSpan>
                        </TD>
                        <TD textAlign="center">
                          <TextSpan apparence="p2">
                            {item?.showBot ? "Sim" : "Não"}
                          </TextSpan>
                        </TD>
                        <TD textAlign="center">
                          <Row className="m-0" around="xs">
                            <Button
                              size="Tiny"
                              status="Info"
                              appearance="ghost"
                              disabled={formData?.isFinishVoyage}
                              style={{ padding: 2 }}
                              onClick={() => changeEditIndex(i)}
                            >
                              <EvaIcon name="edit-2-outline" />
                            </Button>
                            <Button
                              size="Tiny"
                              status="Danger"
                              appearance="ghost"
                              className="ml-1"
                              style={{ padding: 2 }}
                              disabled={formData?.isFinishVoyage}
                              onClick={() => onDelete(i)}
                            >
                              <EvaIcon name="trash-2-outline" />
                            </Button>
                          </Row>
                        </TD>
                      </TR>
                    </>
                  ))}
                </TBODY>
              </TABLE>
            }
          </Row>
          <Row className="m-0" middle="xs" center="xs">
            <Button
              size="Tiny"
              appearance="ghost"
              status="Basic"
              className="flex-between mt-2"
              onClick={onAdd}
              disabled={formData?.isFinishVoyage}
            >
              <EvaIcon name="file-add-outline" className="mr-1" />
              {`${intl.formatMessage({ id: 'add' })} ${intl.formatMessage({ id: 'observation' })}`}
            </Button>
          </Row>
        </CardBody>
      </CardNoShadow>
      <Modal
        size="Large"
        show={showModal}
        title={`${intl.formatMessage({ id: 'observation' })}`}
        onClose={() => setShowModal(false)}
        styleContent={{
          overflowX: 'hidden',
          padding: '1.5rem 0.8rem',
          maxHeight: "calc(100vh - 250px)"
        }}
        renderFooter={() => (
          <CardFooter>
            <Row className="m-0" end="xs">
              <Button status="Success"
                onClick={onSave}
                size="Small">
                <FormattedMessage
                  id="save"
                />
              </Button>
            </Row>
          </CardFooter>
        )}>
        <Row className="m-0">
          <Col breakPoint={{ md: 9 }}>
            <LabelIcon
              title={<FormattedMessage id="observation" />}
              iconName="text-outline"
            />
            <InputGroup fullWidth>
              <textarea
                rows={4}
                value={data?.observation}
                placeholder={intl.formatMessage({ id: 'observation' })}
                onChange={(e) => onChangeInternalData("observation", e.target.value)}
              />
            </InputGroup>
          </Col>
          <Col breakPoint={{ md: 3 }}>
            <LabelIcon
              title={<FormattedMessage id="value" />}
              iconName="hash-outline"
            />
            <InputGroup fullWidth className="mb-4">
              <InputDecimal
                value={data?.value}
                sizeDecimals={2}
                onChange={(e) => onChangeInternalData("value", e)}
              />
            </InputGroup>
            <LabelIcon
              title={<FormattedMessage id="display" />}
              iconName="eye-outline"
            />
            <Checkbox
              checked={!!data?.showBot}
              className="ml-2"
              onChange={(e) => onChangeInternalData(`showBot`, !data.showBot)}
            >
              <TextSpan apparence="p2" hint>BOT</TextSpan>
            </Checkbox>
          </Col>
        </Row>
      </Modal >
    </>
  );
}
