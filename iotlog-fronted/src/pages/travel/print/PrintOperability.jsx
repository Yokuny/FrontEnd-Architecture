import { useSearchParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { Col, Row } from "@paljs/ui";
import styled from "styled-components";
import { floatToStringExtendDot } from "../../../components/Utils";
import ViewForm from "../../forms/Filled/ViewForm";
import { Fetch, TextSpan } from "../../../components";
import { getFields } from "../../forms/Downtime/FieldsForms";
import { SpinnerStyled } from "../../../components/Inputs/ContainerRow";

const Img = styled.img`
  height: 100px;
  width: 100px;
  object-fit: contain;
`

export default function PrintOperability() {


  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [showPrint, setShowPrint] = useState(false);

  const showRef = useRef(false);

  const [searchParams] = useSearchParams();

  const idEnterprise = localStorage.getItem("id_enterprise_filter");
  const id = searchParams.get("id");

  useEffect(() => {
    getData()
  }, [])

  useEffect(() => {
    if (data?.data && !isLoading && !showRef.current) {
      showRef.current = true;
      setShowPrint(true);
      setTimeout(() => {
        window.print();
      }, 1000)
    }
  }, [data, isLoading])

  const getDetailsMountData = (data) => {
    return {
      embarcacao: data?.machine?.name,
      typeAsset: data?.contract?.typeAsset,
      enterpriseName: data?.contract?.enterprise,
      customer: data?.contract?.customer,
      price: data?.contract?.price,
      priceFormatted: data?.contract
        ? `${floatToStringExtendDot(data?.contract?.price, 2)} USD`
        : "",
      status: data?.status,
      inicio: data?.startedAtOriginal,
      fim: data?.endedAtOriginal,
      grupo: data?.group,
      idContract: data?.idContract,
      subgrupo: data?.subgroup,
      evento: data?.event,
      local: data?.local,
      observacao: data?.observation,
      description: data?.description,
      carta: data?.letter,
      recebido: data?.consumption?.received,
      fornecido: data?.consumption?.provided,
      consumido: `${floatToStringExtendDot(data?.consumption?.consumed, 3)} m3`,
      estoqueInicial: data?.consumption?.stock?.initial,
      estoqueFinal: data?.consumption?.stock?.final,
      volume: data?.consumption?.volume,
      consumptionPrice: data?.consumption?.price,
      id: data?.id,
      _id: data?._id,
      value: 0,
      otherDescription: "",
      factor: data?.factor,
      consumptionTotal: `${floatToStringExtendDot(
        data?.consumption?.volume * data?.consumption?.price,
        2
      )} R$`,
      others: data?.others?.map((x) => ({
        ...x,
        otherDescription: x.description,
      })),
    };
  };

  const getData = async () => {
    setIsLoading(true)
    try {
      const responseEnterprise = await Fetch.get(`/enterprise/find?id=${idEnterprise}`)
      const responseGroup = await Fetch.get(`/assetstatus/group/enterprise/${idEnterprise}`)
      const responseOperability = await Fetch.get(`/assetstatus/find/${id}?idEnterprise=${idEnterprise}`)
      setData({
        group: responseGroup.data,
        data: responseOperability.data,
        enterprise: responseEnterprise.data
      })
    } catch (error) {
    } finally {
      setIsLoading(false)
    }
  }


  if (isLoading) {
    return <>
      <SpinnerStyled size="Giant" />
    </>
  }

  return (
    <>

      {data?.data && data?.group && (
        <>
          <Row middle="xs" className="m-0">
            <Col breakPoint={{ xs: 4, md: 4 }} style={{ marginTop: -20 }}>
              <Row className="ml-0" start="xs" middle="xs">
                <Img
                  src={data?.enterprise?.image?.url}
                  alt={data?.enterprise?.name}
                />
              </Row>
            </Col>
            <Col breakPoint={{ xs: 4, md: 4 }}>
              <Row center="xs">
                <TextSpan apparence="s1">Relatório de Operacionalidade</TextSpan>
              </Row>
              <Row center="xs">
                <TextSpan apparence="p2" hint>{data?.voyage?.customer?.label}</TextSpan>
              </Row>
            </Col>
            <Col breakPoint={{ xs: 4, md: 4 }}>

            </Col>
          </Row>
          <ViewForm
            values={{ data: getDetailsMountData(data.data) }}
            isPrint={true}
            fields={getFields({
              eventsRef: { current: [] },
              group: data.group,
              data: {},
              status: "",
              hasPermissionViewFinancial: true,
            })}
          />
        </>
      )}
    </>
  );
}
