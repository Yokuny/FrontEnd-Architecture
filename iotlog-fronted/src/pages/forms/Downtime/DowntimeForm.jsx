import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  EvaIcon,
  Tab,
  Tabs,
} from "@paljs/ui";
import Row from "@paljs/ui/Row";
import { useEffect, useRef, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { toast } from "react-toastify";
import { Fetch, SpinnerFull, TextSpan, UploadFile } from "../../../components";
import { floatToStringExtendDot } from "../../../components/Utils";
import ContentItem from "../Item";
import { getFields } from "./FieldsForms";
import { OthersTable } from "./OthersTable";

const DowntimeForm = (props) => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState(false);
  const [others, setOthers] = useState([]);
  const [files, setFiles] = useState([]);

  const currency = useRef("");
  const eventsRef = useRef([]);
  const isReadyRef = useRef(false);

  const intl = useIntl();

  const { idEnterprise, hasPermissionViewFinancial } = props;

  const fields = getFields({
    eventsRef,
    group: props.group,
    data,
    status: data.status,
    hasPermissionViewFinancial,
  });

  useEffect(() => {
    if (props.data?.id) {
      getData();
    } else {
      isReadyRef.current = true;
      setData({});
      setEdit(false);
    }
  }, [props.data]);

  const getData = () => {
    const raw = {
      embarcacao: props.data?.idMachine,
      typeAsset: props.data?.contract?.typeAsset,
      enterpriseName: props.data?.contract?.enterprise,
      customer: props.data?.contract?.customer,
      price: props.data?.contract?.price,
      priceFormatted: props.data?.contract
        ? `${floatToStringExtendDot(
          props.data?.contract?.price,
          2
        )} ${currency}`
        : "",
      status: props.data?.status,
      inicio: props.data?.startedAtOriginal || props.data?.startedAt,
      fim: props.data?.endedAtOriginal || props.data?.endedAt,
      grupo: props.data?.group,
      idContract: props.data?.idContract,
      subgrupo: props.data?.subgroup,
      evento: props.data?.event,
      local: props.data?.local,
      observacao: props.data?.observation,
      description: props.data?.description,
      carta: props.data?.letter,
      recebido: props.data?.consumption?.received,
      fornecido: props.data?.consumption?.provided,
      consumido: `${floatToStringExtendDot(
        props.data?.consumption?.consumed,
        3
      )} m3`,
      estoqueInicial: props.data?.consumption?.stock?.initial,
      estoqueFinal: props.data?.consumption?.stock?.final,
      volume: props.data?.consumption?.volume,
      consumptionPrice: props.data?.consumption?.price,
      id: props.data?.id,
      _id: props.data?._id,
      value: 0,
      otherDescription: "",
      factor: props.data?.factor,
      consumptionTotal: `${floatToStringExtendDot(
        props.data?.consumption?.volume * props.data?.consumption?.price,
        2
      )} R$`,
    };
    isReadyRef.current = true;
    setData(raw);
    setOthers(props.data?.others || []);

    const files =
      props.data?.files.map((file) => ({
        name: file.name,
        size: file.size,
        location: file.location,
        url: file.url,
        uploaded: true,
      })) || [];

    setFiles(files);
    setEdit(true);
    if (raw.embarcacao) {
      checkContract({ idMachine: raw.embarcacao });
    }
  };

  const onChange = (name, value) => {
    if (name === "grupo") {
      setData((prevState) => ({
        ...prevState,
        grupo: value,
        subgrupo: null,
      }));
      return;
    }
    setData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    const nameInConsumo = [
      "estoqueInicial",
      "estoqueFinal",
      "recebido",
      "fornecido",
    ];

    if (nameInConsumo.includes(name)) {
      setData((prevState) => ({
        ...prevState,
        consumido: getValueConsumidoFormatted(prevState),
      }));
    }

    const consumption = ["volume", "consumptionPrice"];

    if (consumption.includes(name)) {
      setData((prevState) => ({
        ...prevState,
        consumptionTotal: getTotalValueFormatted(prevState),
      }));
    }

    if (name === "embarcacao") {
      checkContract({ idMachine: value });
    }
  };

  const getValueConsumidoFormatted = (data) => {
    return `${floatToStringExtendDot(getValueConsumido(data), 3)} m³`;
  };

  const getValueConsumido = (data) => {
    return (
      (data?.estoqueInicial || 0) -
      (data?.estoqueFinal || 0) +
      (data?.recebido || 0) -
      (data?.fornecido || 0)
    );
  };

  const getTotalValue = (data) => {
    return (data?.volume || 0) * (data?.consumptionPrice || 0);
  };

  const getTotalValueFormatted = (data) => {
    return `R$ ${floatToStringExtendDot(getTotalValue(data), 2)}`;
  };

  const checkContract = ({ idMachine }) => {
    if (!idMachine) {
      eventsRef.current = [];
      setData((prevState) => ({
        ...prevState,
        typeAsset: "",
        enterpriseName: "",
        customer: "",
        price: "",
        embarcacao: idMachine,
        priceFormatted: "",
        evento: null,
      }));
      return;
    }

    setLoading(true);

    Fetch.get(`/contract-asset/details/${idMachine}`).then((response) => {
      try {
        if (response?.data) {
          eventsRef.current = response?.data?.events || [];

          currency.current = response?.data?.daily?.currency;

          const pricesDaily = [];
          if (response?.data?.daily?.USD) {
            pricesDaily.push(
              `USD ${floatToStringExtendDot(response?.data?.daily?.BRL, 2)}`
            );
          }
          if (response?.data?.daily?.BRL) {
            pricesDaily.push(
              `BRL ${floatToStringExtendDot(response?.data?.daily?.BRL, 2)}`
            );
          }

          setData((prev) => ({
            ...prev,
            typeAsset: response?.data?.typeAsset
              ? intl.formatMessage({
                id: response?.data?.typeAsset?.toLowerCase(),
              })
              : "",
            enterpriseName: response?.data?.enterpriseName,
            customer: response?.data?.customer,
            priceFormatted: pricesDaily.join(" + ") || "",
            embarcacao: idMachine,
            idContract: response?.data?.idContract,
          }));
        } else {
          eventsRef.current = [];
          setData((prev) => ({
            ...prev,
            typeAsset: "",
            enterpriseName: "",
            customer: "",
            embarcacao: idMachine,
            price: "",
            priceFormatted: "",
            evento: null,
          }));
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const raw = {
      idEnterprise,
      idMachine: data.embarcacao,
      idContract: data.idContract || null,
      status: data.status || null,
      startedAt: data.inicio,
      endedAt: data.fim || null,
      group: data.grupo || null,
      subgroup: data.subgrupo || null,
      event: data.evento || null,
      local: data.local || null,
      description: data.description || null,
      observation: data.observacao || null,
      factor: data.factor || null,
      letter: data.carta || null,
      consumption: {
        received: data.recebido || 0,
        provided: data.fornecido || 0,
        consumed: getValueConsumido(data),
        stock: {
          initial: data.estoqueInicial || 0,
          final: data.estoqueFinal || 0,
        },
        volume: data.volume || 0,
        price: data.consumptionPrice || 0,
      },
      others,
      files: files.map((file) => ({
        name: file.name,
        size: file.size,
        location: file.location,
        url: file.url,
      })),
    };

    if (!raw.idMachine) {
      toast.warn(intl.formatMessage({ id: "machine.required" }));
      return;
    }

    if (!raw.startedAt) {
      toast.warn(intl.formatMessage({ id: "date.init.required" }));
      return;
    }

    if (raw.endedAt && new Date(raw.endedAt) < new Date(raw.startedAt)) {
      toast.warn(intl.formatMessage({ id: "date.end.is.before.date.start" }));
      return;
    }

    setLoading(true);
    try {
      if (!edit) {
        await Fetch.post("/assetstatus", raw);
      } else {
        await Fetch.put("/assetstatus", {
          _id: data._id,
          id: data.id,
          ...raw,
        });
      }
      toast.success(intl.formatMessage({ id: "save.successfull" }));
      props.onClose({ isNeedReload: true });
    } catch (error) {
      toast.error(intl.formatMessage({ id: "save.error" }));
    } finally {
      setLoading(false);
    }
  };

  function handleAddOther() {
    if (!data?.otherDescription) {
      toast.warn(intl.formatMessage({ id: "fill.required.fields" }));
      return;
    }

    setOthers((prev) => [
      ...prev,
      {
        description: data?.otherDescription,
        valueBRL: data?.valueBRL,
        valueUSD: data?.valueUSD,
      },
    ]);
    setData((prev) => ({
      ...prev,
      otherDescription: "",
      valueBRL: "",
      valueUSD: "",
    }));
  }

  function handleRemoveOther(index) {
    setOthers((prev) => prev.filter((x, i) => i !== index));
  }

  function handleEditOther(index) {
    handleRemoveOther(index);
    setData((prev) => ({
      ...prev,
      otherDescription: others[index].description,
      valueBRL: others[index].valueBRL,
      valueUSD: others[index].valueUSD,
    }));
  }

  function uploadFile(filesToUpload) {
    const data = new FormData();

    filesToUpload.map((file) => data.append("files", file.file, file.name));

    Fetch.post(`/file/upload/assets/`, data).then((response) => {
      const files = response.data.map((file) => ({
        name: file.name,
        size: file.size,
        location: file.location,
        url: file.url,
        uploaded: true,
      }));

      setFiles((uploadedFiles) =>
        uploadedFiles.filter((file) => file.uploaded).concat(files)
      );
    });
  }

  function handleUpload(files) {
    const filterFiles = files.filter((file) => !file.uploaded);
    const filesToUpload = filterFiles.map((file) => ({
      file,
      name: file.name,
      size: file.size,
      location: null,
      url: null,
      uploaded: false,
    }));

    setFiles((uploadedFiles) => uploadedFiles.concat(filesToUpload));

    uploadFile(filesToUpload);
  }

  function handleRemoveFile(index) {
    const file = files[index];

    Fetch.delete(`/file/assets/${file.location}`);

    setFiles((prev) => prev.filter((x, i) => i !== index));
  }

  if (!isReadyRef.current) {
    return <></>;
  }

  return (
    <>
      <Row center="xs">
        <form id="form" onSubmit={(e) => handleSave(e)}>
          <Tabs fullWidth>
            <Tab responsive title={intl.formatMessage({ id: "event" })}>
              {fields
                .filter((group) => group.name === "eventGroup")
                .map((x, i) => {
                  return (
                    <ContentItem
                      key={`${i}-${x.name}`}
                      data={data}
                      field={x}
                      onChange={onChange}
                    />
                  );
                })}

              <Col breakPoint={{ xs: 12 }}>
                <Card>
                  <CardHeader>
                    <FormattedMessage id="files" />
                  </CardHeader>
                  <CardBody>
                    <UploadFile
                      onAddFiles={handleUpload}
                      onRemoveFile={handleRemoveFile}
                      files={files}
                      onSave={false}
                    />
                    <Row>
                      <TextSpan apparence="p2" hint={true} className="ml-2">
                        <FormattedMessage id="attachments.doc.allowed" />
                      </TextSpan>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            </Tab>
            <Tab responsive title={intl.formatMessage({ id: "consume" })}>
              {fields
                .filter((group) => group.name === "consumo")
                .map((x, i) => {
                  return (
                    <ContentItem
                      key={`${i}-${x.name}`}
                      data={data}
                      field={x}
                      onChange={onChange}
                    />
                  );
                })}
            </Tab>

            <Tab responsive title={intl.formatMessage({ id: "others" })}>
              {!!fields?.some((group) => group?.name === "others") &&
                <>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      width: "87vw",
                    }}
                  >
                    {fields
                      .filter((group) => group.name === "others")
                      .map((x, i) => {
                        return (
                          <ContentItem
                            key={`${i}-${x.name}`}
                            data={data}
                            field={x}
                            onChange={onChange}
                          />
                        );
                      })}
                    <Row center="xs" style={{ marginTop: -16 }}>
                      <Button
                        size="Tiny"
                        status="Info"
                        className={`flex-between`}
                        onClick={handleAddOther}
                        type="button"
                      >
                        <EvaIcon name="plus-circle-outline" className="mr-1" />
                        <FormattedMessage id="add" />
                      </Button>
                    </Row>

                    <OthersTable
                      data={others}
                      onRemove={handleRemoveOther}
                      onEdit={handleEditOther}
                    />
                  </div>
                </>}
            </Tab>
          </Tabs>
        </form>
        <SpinnerFull isLoading={loading} />
      </Row>
    </>
  );
};

export default DowntimeForm;
