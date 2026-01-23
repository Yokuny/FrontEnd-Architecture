import { useState, useEffect } from "react";
import { CardFooter } from "@paljs/ui/Card";
import { FormattedMessage, useIntl } from "react-intl";
import Col from "@paljs/ui/Col";
import Row from "@paljs/ui/Row";
import { InputGroup } from "@paljs/ui/Input";
import { Button } from "@paljs/ui/Button";
import { Checkbox, EvaIcon, Tab, Tabs } from "@paljs/ui";
import { toast } from "react-toastify";
import InputMask from "react-input-mask"
import {
  Fetch,
  LabelIcon,
  TextSpan,
  Modal,
  SelectOsOption,
  AddSupplierBody
} from "../";
import AddOsAttachment from "./AddOsAttachement"
import { translate } from "../language";
import FasAddRating from "./FasRatingBody";
import styled from "styled-components";
import { isDockingRegularizationHeader, isRegularizationHeader } from "./Utils/Types";

const ColFlex = styled.div`
display: flex;
flex-direction: column;
width: 100%;
padding: 0 36px;
margin-bottom: 20px;
`

const ORDER_DESCRIPTION_TEMPLATE =
  `- Resumo:
- Equipamento:
- Modelo:
- Ações Realizadas:
- Ações Necessárias:
- Material e/ou ferramental Necessário:
- Informações pertinentes:\n- Inclusão de anexos (Fotos, vídeos, página de manual etc.):
- Necessário TST ou Equipe de Resgate? (S/N)`

const ModalAddFasService = ({
  onAdd,
  addedOrders,
  onClose,
  show,
  enterprise,
  setIsLoading,
  items = undefined,
  requestOrderField = false,
  orderData = undefined,
  headerData = undefined,
  edition = false
}) => {
  const intl = useIntl();
  const [activeIndex, setActiveIndex] = useState(0);
  const [internalOrder, setInternalOrder] = useState(
    {
      "name": "",
      "job": "",
      "jobRequired": true,
      "description": ORDER_DESCRIPTION_TEMPLATE,
      "materialFas": "",
      "materialFasCode": "",
      "onboardMaterial": "",
      "rmrb": "",
      "rmrbCode": "",
      "requestOrder": "",
    });
  const [type, setType] = useState();
  const [supplierQueryCache, setSupplierQueryCache] = useState();
  const [rating, setRating] = useState();
  const [attatchments, setAttachments] = useState();

  useEffect(() => {
    if (orderData) {
      const { lastModified, lastModifiedBy, ...orderDataRest } = orderData;

      setInternalOrder({
        ...orderDataRest,
        jobRequired: orderDataRest.hasOwnProperty("jobRequired") ? orderDataRest.jobRequired : true,
      });
      setType(orderDataRest?.fasHeader?.type);
      setRating({
        rating: orderData?.rating,
        ratingDescription: orderData?.ratingDescription,
        questions: orderData?.questions,
        partial: orderData?.partial
      });
    }

    if (headerData) {
      setType(headerData?.type);
    }
  }, [orderData, headerData, items, show])

  const onChange = (prop, value) => {
    const oldOrder = internalOrder;
    if (prop === "materialFas" && ["Não", "N/A"].includes(value)) {
      oldOrder.materialFasCode = "";
    }

    if (prop === "rmrb" && ["Não", "N/A"].includes(value)) {
      oldOrder.rmrbCode = "";
    }

    oldOrder[prop] = value;
    setInternalOrder({ ...oldOrder });
  }

  const onAttachmentFileChange = (file) => {
    setAttachments({ ...file });
  }

  const handleRatingChange = (value) => {
    /* Ideally, this should only send to the backend the fields to update.
    But for now, we are sending all fields to the backend.
    value is an object with only the fields to update.
    */
    setRating({
      ...rating,
      ...(value?.rating && { rating: value.rating }),
      ...(value?.ratingDescription && { ratingDescription: value.ratingDescription }),
      ...(value?.questions && { questions: value.questions }),
      ...(value?.partial && { partial: value.partial }),
    });
  }

  const handleSupplierChange = (value) => {
    setInternalOrder({
      ...internalOrder,
      requestOrder: value.requestOrder,
      supplierData: value.supplierData,
      vor: value.vor
    })
    setSupplierQueryCache({
      search: value.search,
      filter: value.filter
    })
  }
  const handleClose = () => {
    setInternalOrder({
      "name": "",
      "job": "",
      "jobRequired": true,
      "description": ORDER_DESCRIPTION_TEMPLATE,
      "materialFas": "",
      "materialFasCode": "",
      "onboardMaterial": "",
      "rmrb": "",
      "rmrbCode": ""
    });
    setRating(undefined);
    onClose();
  }

  const isFirstPartFull = () => {
    const isRegularizationHeaderValue = isRegularizationHeader(type);
    const isDockingRegularizationHeaderValue = isDockingRegularizationHeader(type);

    // 1. Validações de campos obrigatórios básicos
    const hasBasicRequiredFields = !internalOrder.name ||
      !internalOrder.description ||
      !internalOrder.materialFas ||
      !internalOrder.onboardMaterial ||
      !internalOrder.rmrb;

    if (hasBasicRequiredFields) {
      return false; // Falta um dos campos básicos obrigatórios
    }

    // Verifica mascara do input do codigo OS
    const nameLength = internalOrder?.name?.length;
    if (nameLength < 8) {
      return false;
    }

    const jobLength = internalOrder?.job?.length;
    if (jobLength < 4 && internalOrder.jobRequired) {
      return false;
    }

    // 2. Validações condicionais
    const isRmrbCodeRequired = (internalOrder.rmrb === "Sim") && !internalOrder.rmrbCode;
    if (isRmrbCodeRequired) {
      return false; // RMRB é 'Sim' mas o código está faltando
    }

    const isMaterialFasCodeRequired = (internalOrder.materialFas === "Sim") && !internalOrder.materialFasCode;
    if (isMaterialFasCodeRequired) {
      return false; // Material FAS é 'Sim' mas o código está faltando
    }

    // 3. Validações de Fornecedor / Ordem de Pedido
    const hasSupplierDataWithoutRequestOrder = !internalOrder.requestOrder && !!internalOrder?.supplierData?.codigoFornecedor;
    if (hasSupplierDataWithoutRequestOrder) {
      return false; // Código do fornecedor existe sem uma ordem de pedido
    }

    // 4. Validação de Regularização
    const isRegularizationMissingSupplierData = isRegularizationHeaderValue && !internalOrder.supplierData;
    if (isRegularizationMissingSupplierData) {
      return false; // É regularização mas os dados do fornecedor estão faltando
    }

    // 5. Validação de Ordem de Pedido e Dados do Fornecedor em conjunto com requestOrderField
    const isRequestOrderAndSupplierDataMissing = (!internalOrder.requestOrder && !internalOrder.supplierData) && requestOrderField;
    if (isRequestOrderAndSupplierDataMissing) {
      return false; // Ordem de pedido e dados do fornecedor estão faltando, e requestOrderField é verdadeiro
    }

    // 6. Validação de Regularização de Doca
    const isDockingRegularizationMissingVor = isDockingRegularizationHeaderValue && !internalOrder.vor;
    if (isDockingRegularizationMissingVor) {
      return false; // É regularização de doca mas o VOR está faltando
    }

    return true;
  }

  const isSecondPartNotFull = () => {
    if (!requestOrderField) {
      return ["", false]
    }
    if (!rating?.rating || rating?.rating === "") {
      return ["rating.required", true];
    }

    if (!rating?.ratingDescription) {
      return ["ratingDescription.required", true];
    }
    if (rating?.questions) {
      for (const [key, value] of Object.entries(rating?.questions)) {
        if (!value.value) {
          return ["questions.required", true];
        }
      }
    }
    return ["", false]
  }

  const checkForOsWithSameName = async (internalOrder, enterprise) => {
    const nameOS = internalOrder.name?.slice(-1) === "/"
    ? internalOrder.name?.slice(0, -1)
    : internalOrder.name
    const response = await Fetch.get(`/fas/list/filter-os-create-validation?search=${nameOS}&idEnterprise=${enterprise}&notId=${internalOrder.id}`);
    const hasSameNameOnInternalOrders = addedOrders.filter((order) => order.name === nameOS);
    return !!response?.data?.osExists || !!hasSameNameOnInternalOrders.length;
  }

  const handleChangeName = (value) => {
    setInternalOrder({
      ...internalOrder,
      name: value?.target?.value?.toUpperCase()
    })
  }

  const handleSave = async () => {
    if (!isFirstPartFull()) {
      toast.error(intl.formatMessage({ id: "service.missing.fields" }));
      return;
    }

    const [message, missingField] = isSecondPartNotFull()
    if (missingField) {
      toast.error(intl.formatMessage({ id: message }));
      return;
    }

    setIsLoading(true);
    const osWithSameName = await checkForOsWithSameName(internalOrder, enterprise)
    setIsLoading(false);

    if (osWithSameName) {
      toast.error(intl.formatMessage({ id: "order.with.same.name.exists" }));
      return;
    }

    const added = await onAdd({
      ...attatchments ? attatchments : null,
      ...internalOrder,
      ...rating ? rating : null,
      materialFasCode: internalOrder?.materialFasCode || "N/A",
      rmrbCode: internalOrder?.rmrbCode || "N/A",
    });

    if (added) {
      setAttachments({
        files: [],
        suppliercanView: false,
      })

      setInternalOrder({
        "name": "",
        "job": "",
        "jobRequired": true,
        "description": ORDER_DESCRIPTION_TEMPLATE,
        "materialFas": "",
        "materialFasCode": "",
        "onboardMaterial": "",
        "rmrb": "",
        "rmrbCode": "",
        "requestOrder": "",
      });

      setRating(null);
      setActiveIndex(0)
      onClose(true);
    }
  }

  return (
    <Modal
      size="Large"
      show={show}
      title={intl.formatMessage({ id: "add.service" })}
      onClose={handleClose}
      styleContent={{ maxHeight: "calc(100vh - 250px)" }}
      renderFooter={() => (
        <CardFooter>
          <Row end="xs" className="m-0">
            {isRegularizationHeader(type) && activeIndex !== 1 &&
              <Button
                size="Small"
                status="Info"
                disabled={!isFirstPartFull() || !isSecondPartNotFull()}
                className="flex-between mr-2"
                onClick={() => setActiveIndex(activeIndex + 1)}>
                <EvaIcon name="arrow-forward-outline" className="mr-1" />
                <FormattedMessage id="next" />
              </Button>
            }
            <Button size="Small"
              disabled={(!isFirstPartFull()) || (isSecondPartNotFull()[1] && isRegularizationHeader(type))}
              className="flex-between" onClick={handleSave}>
              <EvaIcon name="checkmark-outline" className="mr-1" />
              <FormattedMessage id="save" />
            </Button>
          </Row>
        </CardFooter>
      )}
    >
      <Row>
        <Tabs onSelect={(i) => setActiveIndex(i)} activeIndex={activeIndex}>
          <Tab title={`1. ${translate("os")}`}>
            <Row>
              <Col breakPoint={{ lg: 6, md: 6 }} className="mb-4">
                <LabelIcon
                  title={<TextSpan apparence='p2' hint>
                    JOB{internalOrder.jobRequired && "*"}
                  </TextSpan>}
                />
                <Row className="m-0">
                  <Checkbox
                    className={!internalOrder?.jobRequired ? "mt-2" : ""}
                    checked={!internalOrder?.jobRequired}
                    onChange={() => setInternalOrder((prevState) => {
                      return {
                        ...prevState,
                        jobRequired: !prevState?.jobRequired
                      }
                    })}
                  >
                    <TextSpan apparence='p2' hint>
                      Sem JOB
                    </TextSpan>
                  </Checkbox>
                  {!!internalOrder?.jobRequired && <InputGroup fullWidth className="ml-4">
                    <InputMask
                      mask="ABC999999999999"
                      maskChar={null}
                      formatChars={{ '9': '[0-9]', 'A': '[A-Za-z]', 'B': '[A-Za-z]', 'C': '[A-Za-z]' }}
                      value={internalOrder?.job}
                      onChange={(e) => onChange("job", e.target.value)}
                      placeholder={internalOrder?.job || "JOB66666"}
                    />
                  </InputGroup>}

                </Row>
              </Col>
              <Col breakPoint={{ lg: 6, md: 6 }} className="mb-4">
                <LabelIcon
                  title={<TextSpan apparence='p2' hint>
                    <FormattedMessage id="os" /> (Ex: ABC9999-99/D)*
                  </TextSpan>}
                />
                <InputGroup fullWidth>
                  <InputMask
                    mask="ABC9999-99/*"
                    maskChar={null}
                    formatChars={{ '9': '[0-9]', 'A': '[A-Za-z]', 'B': '[A-Za-z]', 'C': '[A-Za-z]', '*': '[A-Za-z0-9]' }}
                    value={internalOrder?.name}
                    onChange={handleChangeName}
                    placeholder={internalOrder?.name || "ABC1235-45/D"}
                  />
                </InputGroup>
              </Col>
              <Col breakPoint={{ lg: 12, md: 12 }} className="mb-4">
                <LabelIcon
                  title={<><FormattedMessage id="description" />*</>}
                />
                <InputGroup fullWidth>
                  <textarea
                    rows={6}
                    placeholder={intl.formatMessage({ id: "description" })}
                    value={internalOrder?.description}
                    onChange={(e) => onChange("description", e.target.value)} />
                </InputGroup>
              </Col>
              <Col breakPoint={{ lg: 3, md: 3 }} className="mb-4">
                <LabelIcon
                  title={<FormattedMessage id="onboardMaterialFas.label" />}
                />
                <SelectOsOption
                  value={internalOrder?.onboardMaterial}
                  onChange={(e) => onChange("onboardMaterial", e.value)}
                />
              </Col>

              <Col breakPoint={{ lg: 3, md: 3 }} className="mb-4">
                <LabelIcon
                  title={<FormattedMessage id="materialFas.label" />}
                />
                <SelectOsOption
                  value={internalOrder?.materialFas}
                  onChange={(e) => onChange("materialFas", e.value)}
                />
              </Col>
              <Col breakPoint={{ lg: 6, md: 6 }} className="mb-4">
                <LabelIcon
                  title={<FormattedMessage id="materialFas.code.label" />}
                />
                <InputGroup fullWidth>
                  <input type="text"
                    disabled={internalOrder?.materialFas !== "Sim"}
                    placeholder={intl.formatMessage({
                      id: "materialFas.code.label",
                    })}
                    value={internalOrder?.materialFasCode}
                    onChange={(e) => onChange("materialFasCode", e.target.value)} />
                </InputGroup>
              </Col>

              <Col breakPoint={{ lg: 6, md: 6 }} className="mb-4">
                <LabelIcon
                  title={<FormattedMessage id="rmrbFas.label" />}
                />
                <SelectOsOption
                  value={internalOrder?.rmrb}
                  onChange={(e) => onChange("rmrb", e.value)}
                />
              </Col>
              <Col breakPoint={{ lg: 6, md: 6 }} className="mb-4">
                <LabelIcon
                  title={<FormattedMessage id="rmrbFas.code.label" />}
                />
                <InputGroup fullWidth>
                  <input type="text"
                    disabled={internalOrder?.rmrb !== "Sim"}
                    placeholder={intl.formatMessage({
                      id: "rmrbFas.code.label",
                    })}
                    value={internalOrder?.rmrbCode}
                    onChange={(e) => onChange("rmrbCode", e.target.value)} />
                </InputGroup>
              </Col>

              <AddSupplierBody
                onChange={handleSupplierChange}
                requestOrderField={isRegularizationHeader(type)}
                preloadData={{
                  supplierData: internalOrder?.supplierData,
                  requestOrder: internalOrder?.requestOrder,
                  vor: internalOrder?.vor,
                  ...supplierQueryCache
                }}
              />
            </Row>
          </Tab>
          <Tab title={`2. ${translate("rating")}`} disabled={!isFirstPartFull()}>
            <FasAddRating onChange={handleRatingChange} data={rating} />
          </Tab>
        </Tabs>

        <ColFlex>
          <LabelIcon
            className="mb-2"
            title={<FormattedMessage id="attachments" />}
          />
          <AddOsAttachment
            onFileChange={onAttachmentFileChange} />
        </ColFlex>
      </Row>
    </Modal>
  )
}

export default ModalAddFasService;
