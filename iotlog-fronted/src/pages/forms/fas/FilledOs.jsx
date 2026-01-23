import * as React from "react";
import { connect } from "react-redux";
import { InputGroup } from "@paljs/ui/Input";
import { Card, CardBody, CardFooter } from "@paljs/ui/Card";
import { FormattedMessage, useIntl } from "react-intl";
import { EvaIcon } from "@paljs/ui/Icon"
import Col from "@paljs/ui/Col";
import Row from "@paljs/ui/Row";
import moment from "moment";
import { toast } from "react-toastify";
import { Button } from "@paljs/ui/Button";
import styled from "styled-components";
import { useNavigate, useSearchParams } from "react-router-dom";
import { pdf } from '@react-pdf/renderer';
import FasTimesheetPDF from "../../../components/Fas/FasTimesheetPDF";
import {
  Fetch,
  SpinnerFull,
  LabelIcon,
  Modal,
  ModalAddFasService,
  ModalTransferService,
} from "../../../components";
import ListS3File from "../../../components/Cards/ListS3File";
import AddOsAttachment from "../../../components/Fas/AddOsAttachement"
import { FasSpan } from "./components/FasSpan";
import InputDateTime from "../../../components/Inputs/InputDateTime";
import AddSupplierBody from "../../../components/Fas/AddSupplierBody";
import MainExpensesBMS from "./details/MainExpensesBMS";
import OtherExpensesBMS from "./details/OtherExpensesBMS";
import OSDetails from "./details/OSDetails";
import CollaboratorsList from "./details/CollaboratorsList";
import OSHeader from "./header/OSHeader";
import RatingData from "./details/RatingData";
import ReasonsList from "../../../components/Fas/ReasonsList";
import RefusalReasonField from "../../../components/Fas/RefusalReasonField";
import {
  canRate,
  canEditOsRequestOrder,
  canAddRecommendedSupplier,
  canBeNotRealizied,
  canConfirmOs
} from "../../../components/Fas/Utils/FasPermissions";
import { getExpensesTotalValue } from "../../../components/Fas/Utils/Bms";
import BackButton from "../../../components/Button/BackButton";
import { ConfirmButton } from "../../../components/Button/ConfirmButton";
import { isRegularizationHeader } from "../../../components/Fas/Utils/Types";
import { Select } from "@paljs/ui";

const ColStyle = styled(Col)`
  display: flex;
  width: 100%;
  flex-direction: column;
`

const FilledOs = (props) => {
  const [data, setData] = React.useState([])
  const [confirmBMSField, setConfirmBMSField] = React.useState(false);
  const [refuseBMSField, setRefuseBMSField] = React.useState(false);
  const [addOrderBuyRequestField, setOrderBuyRequestField] = React.useState(false);
  const [paymentDateField, setPaymentDateField] = React.useState(false);
  const [buyRequest, setBuyRequest] = React.useState();
  const [refusalReason, setRefusalReason] = React.useState();
  const [paymentDate, setPaymentDate] = React.useState();
  const [isLoading, setIsLoading] = React.useState(false);
  const [addSupplier, setAddSupplier] = React.useState(false);
  const [supplierData, setSupplierData] = React.useState({});
  const [showAddAttachmentModal, setShowAddAttachmentModal] = React.useState(false);
  const [dropzoneFiles, setDropzoneFiles] = React.useState([]);
  const [recommendedSupplier, setRecommendedSupplier] = React.useState('');
  const [recommendedSupplierCount, setRecommendedSupplierCount] = React.useState('');
  const [showEditOrderModal, setShowEditOrderModal] = React.useState(false);
  const [showTransferOrderModal, setShowTransferOrderModal] = React.useState(false);
  const [showRefusalReasonField, setShowRefusalReasonField] = React.useState(false);
  const [osRefusalReason, setOsRefusalReason] = React.useState();
  const [supplierCanView, setSupplierCanView] = React.useState(false);
  const [showReturnReason, setShowReturnReason] = React.useState(false);
  const [returnReason, setReturnReason] = React.useState("");
  const [showRejectInvoiceField, setShowRejectInvoiceField] = React.useState(false);
  const [showRejectSapField, setShowRejectSapField] = React.useState(false);
  const [rejectSapReason, setRejectSapReason] = React.useState("");
  const [rejectInvoiceReason, setRejectInvoiceReason] = React.useState("");
  const [notRealizedReason, setNotRealizedReason] = React.useState("");
  const [showNotRealizedReasonField, setShowNotRealizedReasonField] = React.useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [cancelOrderReason, setCancelOrderReason] = React.useState("");
  const [cancelOrderReasonField, setCancelOrderReasonField] = React.useState(false);
  const [showRejectContractField, setRejectContractField] = React.useState(false);
  const [rejectContractReason, setRejectContractReason] = React.useState("");
  const firstRun = React.useRef(true)
  const orderId = searchParams.get("id");
  const queryEditRecommendedSupplier = searchParams.get("edit-rec-sup");
  const [stateEditRecommendedSupplier, setStateEditRecommendedSupplier] = React.useState(queryEditRecommendedSupplier);
  const [stateEditRecommendedSupplierCount, setStateEditRecommendedSupplierCount] = React.useState(false);
  const [confirmObservation, setConfirmObservation] = React.useState("");
  const permanentOrderId = React.useRef("");
  const [osInsurance, setOsInsurance] = React.useState();
  const [osDowntime, setOsDowntime] = React.useState()

  const intl = useIntl();
  const navigate = useNavigate();

  React.useEffect(() => {
    getData();
    if (firstRun) {
      permanentOrderId.current = searchParams.get("id");
      if (searchParams.get("edit")) {
        setShowEditOrderModal(true)
      } else if (searchParams.get("transfer")) {
        setShowTransferOrderModal(true);
      }
      firstRun.current = false;
    }
  }, [])

  // ------- Modal Attachments ------
  const addOrderAttachment = async () => {

    if (!dropzoneFiles.length) {
      toast.warn(intl.formatMessage({ id: "file.required" }));
      return;
    }

    try {
      setIsLoading(true);
      const form = new FormData();
      form.append("id", orderId);
      dropzoneFiles.forEach((file) => {
        form.append("files", file);
      });
      form.append("supplierCanView", supplierCanView);
      const response = await Fetch.post("/fas/add-order-attachment", form);
      if (response.status === 200) {
        toast.success(intl.formatMessage({ id: "save.successfull" }));
        setDropzoneFiles([]);
        setShowAddAttachmentModal(false);
        setSupplierCanView(false);
        await getData(false);
      }
    } catch (error) {
      toast.error(intl.formatMessage({ id: "error.save" }));
    } finally {
      setIsLoading(false);
    }
  }
  const onCloseAttatchmentModal = () => {
    setShowAddAttachmentModal(false);
    setDropzoneFiles([]);
    setSupplierCanView(false);
  }

  const onDelete = async (file) => {
    try {
      setIsLoading(true);
      const response = await Fetch.post("/fas/delete-order-attachment", { id: orderId, fileName: file.name });
      if (response.status === 200) {
        toast.success(intl.formatMessage({ id: "delete.successfull" }));
        await getData(true);
      }
    } catch (error) {
      toast.error(intl.formatMessage({ id: "error.delete" }));
    } finally {
      setIsLoading(false);
    }
  }

  const saveSupplierButtonDisabled = () => {
    return !supplierData.supplierData ||
      (!supplierData.requestOrder && !data?.requestOrder);
  }

  const showBuyRequestEditField = () => {
    setBuyRequest(data?.buyRequest);
    setOrderBuyRequestField(true);
  }

  const handleSupplierChange = (supplier) => {
    setSupplierData(supplier);
  }

  const onSaveSupplier = async () => {
    if (!supplierData.supplierData) {
      toast.error(intl.formatMessage({ id: "supplier.required" }));
    }

    if (!supplierData.requestOrder && !data?.requestOrder) {
      toast.error(intl.formatMessage({ id: "request.order.required" }));
    }

    setIsLoading(true);
    const requestPayload = {
      id: orderId,
      requestOrder: supplierData.requestOrder,
      vor: supplierData.vor,
      supplierData: supplierData.supplierData,
      reason: null,
      returnOrder: false,
    }
    try {
      const response = await Fetch.post("/fas/request-fas-order", requestPayload);
      if (response.status === 200) {
        toast.success(intl.formatMessage({ id: "save.successfull" }));
        setAddSupplier(false);
        await getData(false);
      }
    } catch (error) {
      toast.error(intl.formatMessage({ id: "error.save" }));
    }
    finally {
      searchParams.delete("edit");
      setSearchParams(searchParams);
      setIsLoading(false);
    }
  }

  const onRefuseOrder = async () => {
    if (!returnReason) {
      toast.error(intl.formatMessage({ id: "supplier.required" }));
      return;
    }

    setIsLoading(true);
    const requestPayload = {
      id: orderId,
      reason: returnReason,
      returnOrder: true,
      requestOrder: null,
      supplierData: {},
    }
    try {
      const response = await Fetch.post("/fas/request-fas-order", requestPayload);
      if (response.status === 200) {
        toast.success(intl.formatMessage({ id: "save.successfull" }));
        resetReturnOrder();
        await getData(false);
      }
    }
    catch (error) {
      toast.error(intl.formatMessage({ id: "error.save" }));
    }
    finally {
      setIsLoading(false);
    }
  }

  const onBack = () => {
    navigate(-1)
  }

  const onFileChange = (file) => {
    setSupplierCanView(file.supplierCanView);
    setDropzoneFiles([...dropzoneFiles, ...file.files])
  }

  const onEditRecommendedSupplier = () => {
    if (!recommendedSupplier) {
      toast.error(intl.formatMessage({ id: "recommended.supplier.required" }));
      return;
    }
    setIsLoading(true);
    Fetch.post(`/fas/edit-recommended-supplier`, {
      id: orderId,
      recommendedSupplier: recommendedSupplier,
      recommendedSupplierCount: recommendedSupplierCount,
    })
      .then(response => {
        setIsLoading(false);
        toast.success(intl.formatMessage({ id: "save.successfull" }));

        // Se estiver em supplier.canceled (modo de edição especial), navega de volta
        // Se estiver em awaiting.create.confirm ou awaiting.collaborators, apenas recarrega os dados
        if (data?.state === "supplier.canceled") {
          navigate(-1);
        } else {
          getData(false);
        }
      })
      .catch(e => {
        setIsLoading(false);
        toast.error(intl.formatMessage({ id: "error.save" }));
      })
  }

  const onCancelEditRecommendedSupplier = () => {
    setStateEditRecommendedSupplier(false);
    // Recarrega os dados originais
    getData(false);
  }

  const onEditRecommendedSupplierCount = () => {
    if (!recommendedSupplierCount) {
      toast.error(intl.formatMessage({ id: "recommended.supplier.count.required" }));
      return;
    }
    setIsLoading(true);
    Fetch.post(`/fas/edit-recommended-supplier-count`, {
      id: orderId,
      recommendedSupplierCount: recommendedSupplierCount,
    })
      .then(response => {
        setIsLoading(false);
        toast.success(intl.formatMessage({ id: "save.successfull" }));
        setStateEditRecommendedSupplierCount(false);
        getData(false);
      })
      .catch(e => {
        setIsLoading(false);
        toast.error(intl.formatMessage({ id: "error.save" }));
      })
  }

  const onCancelEditRecommendedSupplierCount = () => {
    setStateEditRecommendedSupplierCount(false);
    // Recarrega os dados originais
    getData(false);
  }

  const downloadInvoice = async () => {
    setIsLoading(true);
    Fetch.get(`/fas/invoice?id=${orderId}`)
      .then(response => {
        setIsLoading(false);
        window.open(response.data?.invoiceUrl)
      })
      .catch(e => {
        setIsLoading(false);
      })
  }

  const downloadTimesheetPDF = async () => {
    try {
      setIsLoading(true);
      const eventsResponse = await Fetch.get(`/fas/order-events/find?id=${orderId}`);
      data.events = eventsResponse.data || data.events;

      // Gerar PDF usando @react-pdf/renderer
      const blob = await pdf(<FasTimesheetPDF orderData={data} />).toBlob();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `timesheet_${data?.name || orderId}_${moment().format('YYYYMMDD')}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success(intl.formatMessage({ id: "download.successful" }));
    } catch (error) {
      toast.error(intl.formatMessage({ id: "error.download" }));
    } finally {
      setIsLoading(false);
    }
  }

  const openEditOrderModal = () => {
    setShowEditOrderModal(true);
  }

  const editOrder = async (order) => {
    let returnOrder = false;
    try {
      if (!order.id) {
        return returnOrder;
      }

      setIsLoading(true);

      const response = await Fetch.post(`/fas/edit-order`, { ...order });
      if (response.status === 200) {
        toast.success(intl.formatMessage({ id: "save.successfull" }));
        searchParams.delete("edit");
        setSearchParams(searchParams);
        returnOrder = true;
      }
    } catch (e) {
      toast.error(intl.formatMessage({ id: "service.add.error" }));
      returnOrder = false;
    }
    finally {
      setIsLoading(false);
    }
    return returnOrder;
  }

  const transferOrder = async (destinationHeaderId, transferReason) => {
    if (!destinationHeaderId || !transferReason) {
      return;
    }

    if (!data?.fasHeader?.id) {
      toast.warn(intl.formatMessage({ id: "warning.missing.id.fas" }));
      return;
    }

    setIsLoading(true);
    try {
      await Fetch.post("/fas/transfer-order", {
        orderId: permanentOrderId.current,
        transferReason,
        destinationHeaderId
      });
      navigate(`/filled-fas?id=${data?.fasHeader?.id}`);
    }
    catch (e) {
      toast.error(intl.formatMessage({ id: "error.transfer" }));
    }
    finally {
      setIsLoading(false);
    }
  }

  const getData = async (showLoading = true) => {
    if (!orderId) {
      return;
    }
    if (showLoading) {
      setIsLoading(true);
    }
    try {
      const response = await Fetch.get(`/fas/find-fas-order?id=${orderId}`);
      setData(response.data ? response.data : []);
      setRecommendedSupplier(response?.data?.recommendedSupplier);
      setRecommendedSupplierCount(response?.data?.recommendedSupplierCount);
      setConfirmObservation(response?.data?.confirmObservation || "");
    }
    catch (e) {
    } finally {
      if (showLoading) {
        setIsLoading(false);
      }
    }
  }

  const handleRefuseClick = () => {
    if (!osRefusalReason) {
      if (!showRefusalReasonField) {
        setShowRefusalReasonField(true);
      } else {
        toast.error(intl.formatMessage({ id: "refusal.reason.required" }))
      }
    } else {
      confirmOrder(false);
      setShowRefusalReasonField(false);
    }
  }

  const confirmOrder = (confirmed) => {
    if (!orderId) {
      toast.warn(intl.formatMessage({ id: "os.empty" }));
      return;
    }

    if (!recommendedSupplierCount || recommendedSupplier < 1) {
      toast.warn(intl.formatMessage({ id: "limit.collaborators.required" }));
      return;
    }

    if (osInsurance === undefined || osDowntime === undefined) {
      toast.warn(intl.formatMessage({ id: "os.insurance.downtime.required" }));
      return;
    }

    setIsLoading(true);
    Fetch.post(`/fas/confirm-fas-order`, { id: orderId, confirmed, recommendedSupplier, recommendedSupplierCount, osRefusalReason, osInsurance, osDowntime, confirmObservation })
      .then(response => {
        if (response.status === 200)
          toast.success(intl.formatMessage({ id: "save.successfull" }));
        setIsLoading(false);
        navigate(`/filled-fas?id=${data?.fasHeader?.id}`);
      })
      .catch(e => {
        setIsLoading(false)
      })
  }

  const openConfirmPaymentField = () => {
    setPaymentDateField(true);
    if (data?.paymentDate)
      setPaymentDate(data?.paymentDate);
    onCancelInvoiceRefuse();
  }

  const openRejectContractField = () => {
    setRejectContractField(true);
  }

  const onCancelRejectContract = () => {
    setRejectContractField(false);
    setRejectContractReason('');
  }
  const openRejectSapField = () => {
    setShowRejectSapField(true);
  }

  const onCancelSapRefuse = () => {
    setShowRejectSapField(false);
  }

  const openRejectInvoiceField = () => {
    setShowRejectInvoiceField(true);
    setPaymentDate();
    setPaymentDateField(false)
  }

  const onCancelInvoiceRefuse = () => {
    setRejectInvoiceReason('');
    setShowRejectInvoiceField(false);
  }

  const onCancelDeleteOrder = () => {
    setCancelOrderReason('');
    setCancelOrderReasonField(false);
  }

  const onCancelNotRealized = () => {
    setNotRealizedReason('');
    setShowNotRealizedReasonField(false);
  }

  const confirmPayment = ({ confirm = true }) => {
    if (!orderId) {
      toast.error(intl.formatMessage({ id: "error.update" }));
      return;
    }
    if (!paymentDate && confirm) {
      toast.error(intl.formatMessage({ id: "date.of.payment.required" }));
      return;
    }

    if (!confirm && !rejectInvoiceReason) {
      toast.error(intl.formatMessage({ id: "refusal.reason.required" }));
      return;
    }

    setIsLoading(true);
    Fetch.post(`/fas/confirm-payment`, { id: orderId, paymentDate, confirm, rejectInvoiceReason })
      .then(response => {
        setIsLoading(false)
        window.location.reload(false);
      })
      .catch(e => {
        setIsLoading(false)
      })
  }

  const confirmBMS = () => {
    if (!orderId) {
      toast.error(intl.formatMessage({ id: "error.update" }));
      return;
    }
    setIsLoading(true);
    Fetch.get(`/fas/confirm-order-bms?id=${orderId}`)
      .then(response => {
        setIsLoading(false)
        window.location.reload(false);
      })
      .catch(e => {
        setIsLoading(false)
      })
  }

  const confirmContract = (confirm) => {
    if (!orderId) {
      toast.error(intl.formatMessage({ id: "error.update" }));
      return;
    }
    setIsLoading(true);
    Fetch.post(`/fas/confirm-contract`,
      {
        id: orderId,
        ...(rejectContractReason && { rejectContractReason }),
        confirmed: confirm
      }
    )
      .then(response => {
        setIsLoading(false)
        window.location.reload(false);
      })
      .catch(e => {
        setIsLoading(false)
      });
  }

  const addOrderBuyRequest = () => {
    if (!orderId) {
      toast.error(intl.formatMessage({ id: "error.update" }));
      return;
    }

    if (!buyRequest) {
      toast.error(intl.formatMessage({ id: "buy.request.required" }));
      return;
    }

    setIsLoading(true);
    Fetch.post(`/fas/add-order-buyreq`, { id: orderId, buyRequest })
      .then(response => {
        setIsLoading(false)
        window.location.reload(false);
      })
      .catch(e => {
        setIsLoading(false)
      })
  }

  const confirmBmsSap = (confirmed) => {
    if (!orderId) {
      toast.error(intl.formatMessage({ id: "error.update" }));
      return;
    }

    setIsLoading(true);
    Fetch.post(`/fas/confirm-bms-sap`, {
      id: orderId,
      ...(rejectSapReason && { rejectSapReason }),
      confirmed
    })
      .then(response => {
        setIsLoading(false)
        window.location.reload(false);
      })
      .catch(e => {
        setIsLoading(false)
      })
  }

  const refuseBMS = () => {
    if (!orderId) {
      toast.error(intl.formatMessage({ id: "error.update" }));
      return;
    }

    if (!refusalReason) {
      toast.error(intl.formatMessage({ id: "refusal.reason.required" }));
      return;
    }

    setIsLoading(true);
    Fetch.post(`/fas/refuse-order-bms`, { id: orderId, refusalReason })
      .then(response => {
        setIsLoading(false)
        window.location.reload(false);
      })
      .catch(e => {
        setIsLoading(false)
      })
  }

  const orderNotRealized = () => {
    setIsLoading(true);
    Fetch.post(
      `/fas/order-not-realized`,
      { id: permanentOrderId.current, notRealizedReason }
    )
      .then(response => {
        setIsLoading(false);
        toast.success(intl.formatMessage({ id: "save.successfull" }));
        window.location.reload(false);
      })
      .catch(e => {
        setIsLoading(false)
      })
  }

  const cancelSupplier = () => {
    setIsLoading(true);
    Fetch.get(`/fas/cancel-order-supplier?id=${orderId}`).then(
      response => {
        setIsLoading(false);
        toast.success(intl.formatMessage({ id: "save.successfull" }));
        window.location.reload(false);
      }
    ).catch(e => {
      setIsLoading(false)
    })
  }

  const canEditOS = (order) => {
    let canEdit = props.items.includes("/fas-add-qsms") && ["not.approved", "awaiting.create.confirm"].includes(order?.state)
    if (isRegularizationHeader(data?.type)) {
      return canEdit;
    }
    else {
      return canEdit && new Date(data?.serviceDate) > new Date();
    }
  }

  const onRefuseBms = () => {
    setRefuseBMSField(true)
    setConfirmBMSField(false)
  }

  const onCancelRefuse = () => {
    setRefuseBMSField(false);
    setConfirmBMSField(false);
    setRefusalReason("");
  }
  const resetReturnOrder = () => {
    setShowReturnReason(false);
    setReturnReason("");
  }

  const onDeleteOs = async () => {
    try {
      if (!cancelOrderReason) {
        toast.error(intl.formatMessage({ id: "reason.required" }));
        return;
      }
      setIsLoading(true);
      await Fetch.post(`/fas/cancel-item`, {
        id: orderId,
        item: "order",
        cancelReason: cancelOrderReason
      });
      setIsLoading(false);
      toast.success(intl.formatMessage({ id: "cancelled.succesfully" }));
      onBack(data?.fasHeader?.id);
    } catch (e) {
      setIsLoading(false);
    }
  }

  const onCloseModalEdit = async (refresh = false) => {
    setShowEditOrderModal(false);
    if (refresh) {
      await getData();
    }
    searchParams.delete("edit");
    setSearchParams(searchParams);
  }

  return (
    <React.Fragment>
      <Card>
        <OSHeader
          navigate={navigate}
          data={data}
          orderId={orderId}
          getData={getData}
        />
        <CardBody>
          <Row>
            {cancelOrderReasonField &&
              <>
                <RefusalReasonField
                  onChange={(reason) => setCancelOrderReason(reason)}
                  onRefuse={onDeleteOs}
                  onCancel={onCancelDeleteOrder}
                  delete={true}
                />
              </>
            }

            <OSDetails
              data={data}
              items={props.items}
              onDelete={() => setCancelOrderReasonField(true)}
              openTransferOrderModal={() => setShowTransferOrderModal(true)}
              openEditOrderModal={() => setShowEditOrderModal(true)}
              onEditRecommendedSupplier={() => setStateEditRecommendedSupplier(true)}
              onEditRecommendedSupplierCount={() => setStateEditRecommendedSupplierCount(true)}
              confirmObservation={confirmObservation}
              setConfirmObservation={setConfirmObservation}
            />
            <CollaboratorsList data={data} />
            {!!data?.cancelReason?.length &&
              <ReasonsList
                data={data?.cancelReason}
                title={intl.formatMessage({ id: "cancel.reason" })} />
            }
            {!!data?.notRealizedReason?.length &&
              <ReasonsList
                data={data?.notRealizedReason}
                title={intl.formatMessage({ id: "not.realized.reason" })} />
            }
            {!!data?.supplierRejectReason?.length &&
              <ReasonsList
                data={data?.supplierRejectReason}
                title={intl.formatMessage({ id: "cancel.reason" })} />
            }
            {!!data?.transferReason?.length &&
              <ReasonsList
                data={data?.transferReason}
                title={intl.formatMessage({ id: "transfer.reason" })} />
            }

            {(!!data?.oldBMSRefusalReason?.length || data?.bms?.refusalReason) &&
              <ReasonsList
                data={data?.bms?.refusalReason && data?.bms?.refusalReason != null ? [
                  ...(data?.oldBMSRefusalReason || []),
                  data?.bms?.refusalReason
                ] :
                  [...(data?.oldBMSRefusalReason || [])]
                }
                title={intl.formatMessage({ id: "bms.refusal.reason" })} />
            }

            <MainExpensesBMS
              data={data}
            />

            <OtherExpensesBMS
              data={data}
            />

            {(!!data?.bms?.other_expenses?.length || !!data?.bms?.main_expenses?.length) &&
              <FasSpan
                breakPoint={{ lg: 12, md: 12 }}
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "end",
                  justifyContent: "center",
                  paddingRight: "1.5rem",
                }}
                title="total.expenses"
                text={`R$ ${getExpensesTotalValue([...data?.bms?.main_expenses, ...data?.bms?.other_expenses])}`}
                className="mb-4"
              />}

            {!!data?.rejectContractReason?.length &&
              <ReasonsList
                data={data?.rejectContractReason}
                title={intl.formatMessage({ id: "reject.contract.reasons" })} />
            }

            {!!data?.rejectSapReason?.length &&
              <ReasonsList
                data={data?.rejectSapReason}
                title={intl.formatMessage({ id: "reject.sap.reasons" })} />
            }
            {!!data?.files?.length &&
              <Col>
                <LabelIcon
                  title={<FormattedMessage id="attachments" />}
                />
                <Row>
                  <ListS3File
                    files={data?.files}
                    onDelete={onDelete}
                    presignedEndpoint={"/fas/presignedbylocation"}
                    orderState={data?.state}
                    allFilesName={`${data.name}-documents`}
                  />
                </Row>

              </Col>}

            <RatingData data={data} />

            {data?.buyRequest && !addOrderBuyRequestField
              ?
              <FasSpan
                breakPoint={{ lg: 12, md: 12 }}
                title="buy.request"
                text={data?.buyRequest}
                className="mb-4"
              /> :
              <>
                {addOrderBuyRequestField &&
                  <Col breakPoint={{ lg: 12, md: 12 }} className="mb-4">
                    <LabelIcon
                      title={<FormattedMessage id="buy.request" />}
                    />
                    <Row style={{ marginLeft: "0px" }} breakPoint={{ lg: 12, md: 12 }}>
                      <InputGroup fullWidth style={{ width: "40%" }} className="mb-4 mt-1">
                        <input
                          type="text"
                          placeholder={intl.formatMessage({
                            id: "add.buy.request",
                          })}
                          onChange={(text) => setBuyRequest(text.target.value)}
                          value={buyRequest}
                          maxLength={75}
                        />
                      </InputGroup>
                      <Button className="ml-4 mb-4 mt-1 flex-between"
                        status="Success"
                        size="Tiny" onClick={addOrderBuyRequest}>
                        <EvaIcon name="checkmark-outline" className="mr-1" />
                        <FormattedMessage id="confirm" />
                      </Button>
                    </Row>
                  </Col>}
              </>}

            {!!data?.rejectInvoiceReason?.length &&
              <ReasonsList
                data={data?.rejectInvoiceReason}
                title={intl.formatMessage({ id: "invoice.reject.reasons" })} />
            }

            {refuseBMSField &&
              <ColStyle breakPoint={{ lg: 12, md: 12 }} className="mb-4">
                <LabelIcon
                  title={<FormattedMessage id="bms.refusal.reason" />}
                />
                <div className="flex-row mb-4 mt-2" style={{ alignItems: "center" }}>
                  <InputGroup fullWidth className="flex-row">
                    <textarea
                      type="text"
                      placeholder={intl.formatMessage({
                        id: "bms.refusal.reason",
                      })}
                      rows={3}
                      onChange={(text) => setRefusalReason(text.target.value)}
                      value={refusalReason}
                    />
                  </InputGroup>
                  <div className="ml-4">
                    <Button className="flex-between"
                      status="Danger"
                      size="Tiny"
                      onClick={refuseBMS}>
                      <EvaIcon name="file-remove-outline" className="mr-1" />
                      <FormattedMessage id="refuse.bms" />
                    </Button>

                    <Button className="mt-3 flex-between"
                      status="Basic"
                      size="Tiny"
                      appearance="ghost"
                      onClick={() => onCancelRefuse()}>
                      <EvaIcon name="close-outline" className="mr-1" />
                      <FormattedMessage id="cancel" />
                    </Button>
                  </div>
                </div>
              </ColStyle>}

            {data?.paymentDate && !paymentDateField ?
              <FasSpan
                breakPoint={{ lg: 12, md: 12 }}
                title="date.of.payment"
                text={moment(data?.paymentDate).format("DD MMM YYYY, HH:mm")}
                className="mb-4"
              /> :
              <>
                {paymentDateField &&
                  <Col breakPoint={{ lg: 12, md: 12 }} className="mb-4">
                    <LabelIcon
                      title={<FormattedMessage id="date.of.payment" />}
                    />
                    <Row style={{ marginLeft: "0px" }} breakPoint={{ lg: 12, md: 12 }}>

                      <InputDateTime onlyDate
                        onChange={(e) => setPaymentDate(moment(e).format('YYYY-MM-DD'))}
                        value={paymentDate}
                      />

                      <Button className="ml-4 mb-4 mt-1 flex-between"
                        size="Tiny" onClick={confirmPayment}>
                        <EvaIcon name="checkmark-outline" className="mr-1" />
                        <FormattedMessage id="fas.confirm.payment" />
                      </Button>

                    </Row>
                  </Col>}
              </>}

            {showNotRealizedReasonField &&
              <>
                <RefusalReasonField
                  onChange={setNotRealizedReason}
                  onRefuse={orderNotRealized}
                  onCancel={onCancelNotRealized}
                />
              </>
            }
            {showRejectContractField &&
              <>
                <RefusalReasonField
                  onChange={setRejectContractReason}
                  onRefuse={() => confirmContract(false)}
                  onCancel={onCancelRejectContract}
                />
              </>
            }
            {showRejectSapField &&
              <>
                <RefusalReasonField
                  onChange={setRejectSapReason}
                  onRefuse={() => confirmBmsSap(false)}
                  onCancel={onCancelSapRefuse}
                />
              </>
            }

            {showRejectInvoiceField &&
              <>
                <RefusalReasonField
                  onChange={setRejectInvoiceReason}
                  onRefuse={() => confirmPayment({ confirm: false })}
                  onCancel={onCancelInvoiceRefuse}
                />
              </>
            }
            {(canAddRecommendedSupplier(props.items, data?.state, showRefusalReasonField, stateEditRecommendedSupplier) || stateEditRecommendedSupplierCount) && (
              <>
                {canAddRecommendedSupplier(props.items, data?.state, showRefusalReasonField, stateEditRecommendedSupplier) && (
                  <FasSpan
                    key={"recommended.supplier"}
                    breakPoint={{ lg: 9, md: 9, xs: 12 }}
                    title={"recommended.supplier"}
                    text={
                      <div>
                        <InputGroup fullWidth>
                          <input
                            style={{ marginTop: -12 }}
                            type="text"
                            value={recommendedSupplier}
                            placeholder={intl.formatMessage({ id: "recommended.supplier" })}
                            onChange={(e) => setRecommendedSupplier(e.target.value)}
                          />
                        </InputGroup>
                      </div>
                    }
                  />
                )}

                <FasSpan
                  key={"recommended.supplier.count"}
                  breakPoint={{ lg: 3, md: 3 }}
                  title={"recommended.supplier.count"}
                  text={
                    <div>
                      <InputGroup fullWidth>
                        <input
                          style={{ marginTop: -12 }}
                          type="number"
                          value={recommendedSupplierCount}
                          placeholder={intl.formatMessage({ id: "recommended.supplier.count" })}
                          onChange={(e) => setRecommendedSupplierCount(e.target.value)}
                        />
                      </InputGroup>
                    </div>
                  }
                />

                {stateEditRecommendedSupplierCount && ["awaiting.collaborators"].includes(data?.state) && (
                  <Col breakPoint={{ lg: 12, md: 12 }} className="ml-3">
                    <div style={{ display: 'flex', gap: '12px', marginTop: '-8px', marginBottom: '16px' }}>
                      <Button
                        className="flex-between"
                        status="Success"
                        size="Small"
                        onClick={onEditRecommendedSupplierCount}
                      >
                        <EvaIcon name="checkmark-outline" className="mr-1" />
                        <FormattedMessage id="confirm" />
                      </Button>

                      <Button
                        className="flex-between"
                        status="Basic"
                        size="Small"
                        appearance="ghost"
                        onClick={onCancelEditRecommendedSupplierCount}
                      >
                        <EvaIcon name="close-outline" className="mr-1" />
                        <FormattedMessage id="cancel" />
                      </Button>
                    </div>
                  </Col>
                )}

                {(stateEditRecommendedSupplier || ["awaiting.create.confirm"].includes(data?.state)) && (
                  <Col breakPoint={{ lg: 9, md: 12 }} className="ml-3">
                    <div style={{ display: 'flex', gap: '12px', marginTop: '-8px', marginBottom: '16px' }}>
                      <Button
                        className="flex-between"
                        status="Success"
                        size="Small"
                        onClick={onEditRecommendedSupplier}
                      >
                        <EvaIcon name="checkmark-outline" className="mr-1" />
                        <FormattedMessage id="confirm" />
                      </Button>

                      <Button
                        className="flex-between"
                        status="Basic"
                        size="Small"
                        appearance="ghost"
                        onClick={onCancelEditRecommendedSupplier}
                      >
                        <EvaIcon name="close-outline" className="mr-1" />
                        <FormattedMessage id="cancel" />
                      </Button>
                    </div>
                  </Col>
                )}
              </>
            )}
            {canConfirmOs(data, props.items) && (
              <>
                <Col breakPoint={{ lg: 3, md: 3, xs: 12 }} className="mb-3">
                  <LabelIcon
                    title={intl.formatMessage({ id: "insurance.work.order" })}
                  />
                  <Select
                    onChange={(e) => setOsInsurance(e.value)}
                    menuPosition="fixed"
                    options={[
                      { value: false, label: intl.formatMessage({ id: "not" }) },
                      { value: true, label: intl.formatMessage({ id: "yes" }) }
                    ]}
                  />
                </Col>
                <Col breakPoint={{ lg: 3, md: 3, xs: 12 }} className="mb-3">
                  <LabelIcon
                    title={intl.formatMessage({ id: "downtime.work.order" })}
                  />

                  <Select
                    menuPosition="fixed"
                    onChange={(e) => setOsDowntime(e.value)}
                    options={[
                      { value: false, label: intl.formatMessage({ id: "not" }) },
                      { value: true, label: intl.formatMessage({ id: "yes" }) }
                    ]}
                  />
                </Col>
              </>
            )}
            {!["awaiting.create.confirm"].includes(data?.state) && (
              <>
                <FasSpan
                  key={"insurance.work.order"}
                  breakPoint={{ lg: 6, md: 6 }}
                  title={"insurance.work.order"}
                  text={intl.formatMessage({ id: data?.osInsurance ? 'yes' : 'not' })}
                  className="mb-4"
                />

                <FasSpan
                  key={"downtime.work.order"}
                  breakPoint={{ lg: 6, md: 6 }}
                  title={"downtime.work.order"}
                  text={intl.formatMessage({ id: data?.osDowntime ? 'yes' : 'not' })}
                  className="mb-4"
                />
              </>
            )}
            {data?.state === "awaiting.create.confirm" ? (
              <Col breakPoint={{ lg: 12, md: 12 }} className="mb-3">
                <LabelIcon title={<FormattedMessage id="observation.optional" />} />
                <InputGroup fullWidth>
                  <textarea
                    rows={2}
                    value={confirmObservation}
                    onChange={(e) => setConfirmObservation(e.target.value)}
                  />
                </InputGroup>
              </Col>
            ) : (
              !!confirmObservation && (
                <FasSpan
                  breakPoint={{ lg: 12, md: 12 }}
                  title="observation"
                  text={confirmObservation}
                  className="mb-3"
                />
              )
            )}
            {showRefusalReasonField && (
              <ColStyle breakPoint={{ lg: 12, md: 12 }} className="mb-4">
                <LabelIcon
                  title={<FormattedMessage id="refusal.reason" />}
                />
                <div className="flex-row mb-4 mt-2" style={{ alignItems: "center" }}>
                  <InputGroup fullWidth className="flex-row">
                    <textarea
                      type="text"
                      rows={3}
                      value={osRefusalReason}
                      placeholder={intl.formatMessage({ id: "refusal.reason" })}
                      onChange={(e) => setOsRefusalReason(e.target.value)}
                    />
                  </InputGroup>
                  <div className="ml-4">
                    <Button
                      className="flex-between mr-2"
                      status="Danger"
                      size="Tiny"
                      onClick={handleRefuseClick}>
                      <EvaIcon name="file-remove-outline" className="mr-1" />
                      <FormattedMessage id="refuse.order" />
                    </Button>

                    <Button
                      size="Tiny"
                      status="Basic"
                      appearance="ghost"
                      className="flex-between mt-3"
                      onClick={() => setShowRefusalReasonField(false)}>
                      <EvaIcon name="close-outline" className="mr-1" />
                      <FormattedMessage id="cancel" />
                    </Button>
                  </div>
                </div>
              </ColStyle>
            )}

            {!stateEditRecommendedSupplier && !stateEditRecommendedSupplierCount && data?.recommendedSupplier && ["awaiting.request", "supplier.canceled", "awaiting.collaborators"].includes(data?.state) && props.items.includes("/fas-add-supplier") && (
              <FasSpan
                key={"recommended.supplier.text"}
                breakPoint={{ lg: 6, md: 6 }}
                title={"recommended.supplier"}
                text={data?.recommendedSupplier}
                className="mb-4"
              />
            )}

            {!stateEditRecommendedSupplier && !stateEditRecommendedSupplierCount && data?.recommendedSupplier && ["awaiting.request", "supplier.canceled", "awaiting.collaborators"].includes(data?.state) && props.items.includes("/fas-add-supplier") && (
              <FasSpan
                key={"recommended.supplier.count.text"}
                breakPoint={{ lg: 6, md: 6 }}
                title={"recommended.supplier.count"}
                text={data?.recommendedSupplierCount}
                className="mb-4"
              />
            )}

            {!!data?.returnReason?.length &&
              <ReasonsList data={data?.returnReason} title="return.history" />
            }

            {data?.osRefusalReason && (
              <ReasonsList data={data?.osRefusalHistory ?
                [...data?.osRefusalHistory, data?.osRefusalReason] :
                [data?.osRefusalReason]} title="refusal.reason" />
            )}
            {showReturnReason && <div className="flex-row mb-4 mt-2" style={{ alignItems: "center" }}>
              <InputGroup fullWidth className="flex-row">
                <textarea
                  type="text"
                  placeholder={intl.formatMessage({
                    id: "return.order.coordinator",
                  })}
                  rows={3}
                  onChange={(text) => setReturnReason(text.target.value)}
                  value={returnReason}
                />
              </InputGroup>
              <div className="ml-4">
                <Button className="flex-between"
                  status="Danger"
                  size="Tiny"
                  onClick={onRefuseOrder}>
                  <EvaIcon name="file-remove-outline" className="mr-1" />
                  <FormattedMessage id="confirm" />
                </Button>

                <Button className="mt-3 flex-between"
                  status="Basic"
                  size="Tiny"
                  appearance="ghost"
                  onClick={() => resetReturnOrder()}>
                  <EvaIcon name="close-outline" className="mr-1" />
                  <FormattedMessage id="cancel" />
                </Button>
              </div>
            </div>}
          </Row>
          <Modal
            size="Medium"
            show={addSupplier}
            title={intl.formatMessage({ id: "add.supplier.fas" })}
            onClose={() => !isLoading && setAddSupplier(false)}
            renderFooter={() => (
              <CardFooter>
                <Row end="xs" className="m-0">
                  <Button
                    disabled={saveSupplierButtonDisabled()}
                    size="Small"
                    className="flex-between" onClick={onSaveSupplier}>
                    <EvaIcon name="checkmark-outline" className="mr-1" />
                    <FormattedMessage id="save" />
                  </Button>
                </Row>
              </CardFooter>
            )}
          >
            <Row style={{ display: "flex", justifyContent: "center" }}>
              <AddSupplierBody
                onChange={handleSupplierChange}
                preloadData={{
                  requestOrder: data?.requestOrder ? data?.requestOrder : "",
                  vor: data?.vor ? data?.vor : ""
                }}
                recommendedSupplier={data?.recommendedSupplier || ''}
                requestOrderField={canEditOsRequestOrder({ state: data?.state })} />
            </Row>
          </Modal>
          {showEditOrderModal && <ModalAddFasService
            show={showEditOrderModal}
            items={props.items}
            setIsLoading={setIsLoading}
            addedOrders={[]}
            enterprise={data?.fasHeader?.enterprise?.id}
            onAdd={editOrder}
            onClose={onCloseModalEdit}
            orderData={data}
            headerData={{
              vesselCode: data.fasHeader?.vessel?.name.toUpperCase()?.replace("CBO", "")?.replaceAll(" ", "").slice(0, 3),
              type: data.fasHeader?.type
            }}
            edition={true}
          />}
          <ModalTransferService
            show={showTransferOrderModal}
            onClose={() => !isLoading && setShowTransferOrderModal(false)}
            onAdd={transferOrder}
            currentFasHeader={data?.fasHeader}
            orderId={permanentOrderId.current}
          />
        </CardBody>
        <CardFooter>
          <Row className="m-0" between="xs">

            <Row middle="xs" className="m-0">
              <BackButton
                onClick={() => onBack()} />
              {canEditOS(data) ?
                <Button
                  style={{ marginRight: -4 }}
                  size="Tiny"
                  className="flex-between"
                  status="Info"
                  appearance="ghost"
                  onClick={() => openEditOrderModal()}
                >
                  <EvaIcon name="edit-outline" className="mr-1" />
                  <FormattedMessage id="edit" />
                </Button> : <></>}
              {!["fas.closed", "awaiting.payment", "cancelled"].includes(data?.state) ?
                <Button
                  size="Tiny"
                  status="Basic"
                  appearance="ghost"
                  className="flex-between ml-2"
                  onClick={() => setShowAddAttachmentModal(true)}>
                  <EvaIcon name="attach-outline" className="mr-1" />
                  <FormattedMessage id="add.attachment" />
                </Button>
                : <></>}
              <Button
                className="flex-between mr-4"
                size="Tiny"
                status="Basic"
                appearance="ghost"
                onClick={downloadTimesheetPDF}>
                <EvaIcon name="cloud-download-outline" className="mr-1" />
                <FormattedMessage id="fas.download.timesheet" />
              </Button>
            </Row>
            <Row className="m-0" between="xs">
              {canBeNotRealizied(data) && !showNotRealizedReasonField ?
                <Button
                  className="flex-between mr-1"
                  size="Tiny"
                  appearance="ghost"
                  status="Warning"
                  onClick={() => setShowNotRealizedReasonField(true)}>
                  <EvaIcon name="minus-circle-outline" className="mr-1" />
                  <FormattedMessage id="not.realized" />
                </Button>
                : <></>}

              {canConfirmOs(data, props.items) &&
                !showRefusalReasonField &&
                <>
                  <Button
                    className="flex-between mr-2"
                    status="Danger"
                    appearance="ghost"
                    size="Tiny"
                    onClick={handleRefuseClick}>
                    <EvaIcon name="close-outline" className="mr-1" />
                    <FormattedMessage id="refuse.order" />
                  </Button>
                  <Button
                    size="Tiny"
                    status="Info"
                    className="flex-between mr-2"
                    onClick={() => confirmOrder(true)}>
                    <EvaIcon name="checkmark-outline" className="mr-1" />
                    <FormattedMessage id="confirm.order" />
                  </Button>
                </>}
              {!showReturnReason && ["awaiting.request", "supplier.canceled"].includes(data?.state) && props.items.includes("/fas-add-supplier") ?
                <>
                  <Button
                    status="Danger"
                    appearance="ghost"
                    size="Tiny"
                    className="flex-between mr-4"
                    onClick={() => setShowReturnReason(true)}>
                    <EvaIcon name="arrow-back-outline" className="mr-1" />
                    <FormattedMessage id="return.order.coordinator" />
                  </Button>
                  <Button
                    status="Info"
                    size="Tiny"
                    className="flex-between"
                    onClick={() => setAddSupplier(true)}>
                    <EvaIcon name="person-add-outline" className="mr-1" />
                    <FormattedMessage id="add.supplier" />
                  </Button>
                </> : <></>}

              {["awaiting.collaborators"].includes(data?.state) && props.items.includes("/fas-add-supplier") ?
                <>
                  <ConfirmButton
                    status={"Danger"}
                    size="Tiny"
                    className="flex-between mr-4"
                    title={intl.formatMessage({ id: "cancel.supplier.details" })}
                    message={""}
                    callback={cancelSupplier}>
                    <EvaIcon name="person-delete-outline" className="mr-1" />
                    <FormattedMessage id="cancel.supplier" />
                  </ConfirmButton>
                </> : <></>}

              {data?.state === "awaiting.bms.confirm"
                && props.items.includes("/fas-add-qsms") ?
                <>
                  {!refuseBMSField ?
                    <Button
                      size="Tiny"
                      status="Danger"
                      className="flex-between mr-4"
                      onClick={() => onRefuseBms()}>
                      <EvaIcon name="file-remove-outline" className="mr-1" />
                      <FormattedMessage id="refuse.bms" />
                    </Button>
                    : <></>}
                  {!confirmBMSField && !refuseBMSField ?
                    <Button
                      size="Tiny"
                      status="Success"
                      className="flex-between mr-2"
                      onClick={() => {
                        confirmBMS()
                        setRefuseBMSField(false)
                      }}>
                      <EvaIcon name="checkmark-outline" className="mr-1" />
                      <FormattedMessage id="confirm.bms" />
                    </Button>
                    : <></>}
                </>
                : <></>}

              {data?.state === "awaiting.contract.validation"
                && props.items.includes("/fas-validate-contract") ?
                <>
                  <Button
                    size="Tiny"
                    status="Danger"
                    appearance="ghost"
                    className="flex-between mr-4"
                    onClick={openRejectContractField}>
                    <EvaIcon name="file-remove-outline" className="mr-1" />
                    <FormattedMessage id="refuse.contract" />
                  </Button>
                  <Button
                    size="Tiny"
                    status="Success"
                    className="flex-between mr-2"
                    disabled={showRejectContractField}
                    onClick={() => {
                      confirmContract(true)
                    }}>
                    <EvaIcon name="checkmark-outline" className="mr-1" />
                    <FormattedMessage id="confirm.contract" />
                  </Button>
                </>
                : <></>}

              {data?.state === "awaiting.sap"
                && props.items.includes("/fas-confirm-sap") ?
                <>
                  <Button
                    size="Tiny"
                    status="Danger"
                    appearance="ghost"
                    className="flex-between mr-4"
                    onClick={openRejectSapField}>
                    <EvaIcon name="file-remove-outline" className="mr-1" />
                    <FormattedMessage id="refuse.sap" />
                  </Button>
                  <Button
                    size="Tiny"
                    status="Success"
                    className="flex-between mr-2"
                    disabled={showRejectSapField}
                    onClick={() => {
                      confirmBmsSap(true)
                    }}>
                    <EvaIcon name="checkmark-outline" className="mr-1" />
                    <FormattedMessage id="confirm.sap" />
                  </Button>
                </>
                : <></>}

              {data?.state === "awaiting.buy.request" && props.items.includes("/fas-add-purchase-order") ?
                <Button
                  size="Tiny"
                  status="Info"
                  disabled={!!addOrderBuyRequestField}
                  className="flex-between mr-2"
                  onClick={() => setOrderBuyRequestField(true)}>
                  <EvaIcon name="plus-square-outline" className="mr-1" />
                  <FormattedMessage id="add.buy.request" />
                </Button>
                : <></>}

              {["awaiting.invoice", "awaiting.payment"].includes(data?.state) && props.items.includes("/fas-add-purchase-order") ?
                <Button
                  size="Tiny"
                  status="Info"
                  appearance="ghost"
                  disabled={!!addOrderBuyRequestField}
                  className="flex-between mr-2"
                  onClick={showBuyRequestEditField}>
                  <EvaIcon name="edit-2-outline" className="mr-1" />
                  <FormattedMessage id="edit.buy.request" />
                </Button>
                : <></>}

              {(data?.state === "awaiting.payment" || data?.state === "fas.closed") && props.items.includes("/fas-confirm-payment") ?
                <Button
                  className="flex-between mr-4"
                  size="Tiny"
                  status="Basic"
                  appearance="ghost"
                  onClick={downloadInvoice}>
                  <EvaIcon name="download-outline" className="mr-1" />
                  <FormattedMessage id="fas.download.invoice" />
                </Button>
                :
                <></>
              }

              {canRate(data, props.items) ?
                <Button
                  className="flex-between mr-4"
                  size="Tiny"
                  status="Info"
                  onClick={() => navigate(`/fas-add-rating?action=new&id=${orderId}`)}>
                  <EvaIcon name="star-outline" className="mr-1" />
                  <FormattedMessage id="fas.rate" />
                </Button>
                : <></>}

              {data?.state === "awaiting.payment" && props.items.includes("/fas-confirm-payment") ?
                <>
                  <Button
                    className="flex-between mr-4"
                    size="Tiny"
                    appearance="ghost"
                    onClick={openRejectInvoiceField}
                    status="Danger"
                    disabled={showRejectInvoiceField}
                  >
                    <EvaIcon name="file-remove-outline" className="mr-1" />
                    <FormattedMessage id="fas.reject.invoice" />
                  </Button>
                  <Button
                    className="flex-between"
                    size="Tiny"
                    status="Success"
                    disabled={!!paymentDateField}
                    onClick={openConfirmPaymentField}>
                    <EvaIcon name="checkmark-outline" className="mr-1" />
                    <FormattedMessage id="fas.confirm.payment" />
                  </Button>
                </>
                : <></>}
            </Row>
          </Row>
        </CardFooter>
      </Card>
      <Modal
        size="Large"
        show={showAddAttachmentModal}
        title={intl.formatMessage({ id: "add.attachment" })}
        styleContent={{ maxHeight: "calc(100vh - 250px)" }}
        onClose={() => !isLoading && onCloseAttatchmentModal()}
        renderFooter={() => (
          <CardFooter>
            <Row end="xs" className="m-0">
              <Button size="Small" className="flex-between" onClick={addOrderAttachment}>
                <EvaIcon name="checkmark-outline" className="mr-1" />
                <FormattedMessage id="save" />
              </Button>
            </Row>
          </CardFooter>
        )}
      >
        <AddOsAttachment
          onFileChange={onFileChange} />
      </Modal>

      <SpinnerFull isLoading={isLoading} />
    </React.Fragment >
  );
};

const mapStateToProps = (state) => ({
  items: state.menu.items,
  enterprises: state.enterpriseFilter.enterprises,
  theme: state.settings.theme,
  locale: state.settings.locale,
});

export default connect(mapStateToProps, undefined)(FilledOs);
