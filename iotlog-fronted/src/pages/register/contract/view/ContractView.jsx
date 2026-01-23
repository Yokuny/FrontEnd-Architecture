import { useEffect, useMemo, useState } from "react";
import { Button, Card, CardHeader, Col, EvaIcon, InputGroup, Row } from "@paljs/ui";
import { FormattedMessage, useIntl } from "react-intl";
import { Fetch, SpinnerFull, TextSpan } from "../../../../components";
import { ContainerRow } from "../../../../components/Inputs";
import { useNavigate, useSearchParams } from "react-router-dom";
import { TABLE, TBODY, TD, TH, THEAD, TR, TRH } from "../../../../components/Table";
import { floatToStringExtendDot } from "../../../../components/Utils";

const ContractView = () => {
  const navigate = useNavigate();
  const intl = useIntl();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({});
  const [searchParams] = useSearchParams();
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const id = searchParams.get("id");
    if (id) {
      getContractOperations(id);
    }
  }, []);

  const getContractOperations = (id) => {
    setIsLoading(true);
    Fetch.get(`/contract/operations?id=${id}`)
      .then((response) => {
        if (response.data) {
          setData(response.data);
        }
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const totalByGroupConsumption = (groupCode) => {
    return data
      .operations
      .filter(x => x.idGroupConsumption === groupCode)
      .length;
  }

  const filteredOperations = useMemo(() => {
    if (!data?.operations) return [];
    if (!filter.trim()) return data.operations;

    const searchTerm = filter.toLowerCase().trim();
    return data.operations.filter((op) => {
      const groupConsumption = data?.groupConsumption?.find(
        (x) => x.code === op?.idGroupConsumption
      );
      return (
        op?.idOperation?.toString().toLowerCase().includes(searchTerm) ||
        op?.name?.toLowerCase().includes(searchTerm) ||
        op?.description?.toLowerCase().includes(searchTerm) ||
        op?.idGroupConsumption?.toString().toLowerCase().includes(searchTerm) ||
        groupConsumption?.description?.toLowerCase().includes(searchTerm)
      );
    });
  }, [data, filter]);

  return (
    <>
      <ContainerRow>
        <Col breakPoint={{ xs: 12, md: 12 }}>
          <Card className="pl-4 pr-4">
            <CardHeader>
              <Row middle="xs" between="xs">
                <Row middle="xs">
                  <Button size="Tiny"
                    appearance="ghost"
                    className="flex-between"
                    status="Basic" onClick={() => navigate(-1)}>
                    <EvaIcon name="arrow-ios-back-outline" className="mr-1" />
                    <FormattedMessage id="back" />
                  </Button>
                  <TextSpan apparence="h6" className="ml-4">{data?.description}</TextSpan>
                </Row>
                <InputGroup fullWidth={false}>
                  <input
                    type="text"
                    placeholder={intl.formatMessage({ id: "filter" })}
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    style={{ minWidth: 250 }}
                  />
                </InputGroup>
              </Row>
            </CardHeader>
            <Row style={{ margin: 0 }} className="mt-2 mb-4">
              <Col breakPoint={{ md: 12 }}>
                <Row center="xs">
                  <TABLE>
                    {!!filteredOperations?.length && (
                      <THEAD>
                        <TRH>
                          <TH>
                            <TextSpan apparence="p2" hint>
                              <FormattedMessage id="code" />
                            </TextSpan>
                          </TH>
                          <TH>
                            <TextSpan apparence="p2" hint>
                              <FormattedMessage id="name" />
                            </TextSpan>
                          </TH>
                          <TH>
                            <TextSpan apparence="p2" hint>
                              <FormattedMessage id="description" />
                            </TextSpan>
                          </TH>
                          <TH style={{ width: 120 }} textAlign="center">
                            <TextSpan apparence="p2" hint>
                              <FormattedMessage id="group.consumption" />
                            </TextSpan>
                          </TH>
                          <TH style={{ width: 120 }} textAlign="center">
                            <TextSpan apparence="p2" hint>
                              <FormattedMessage id="consumption" /> (m³/dia)
                            </TextSpan>
                          </TH>
                          <TH>
                            <TextSpan apparence="p2" hint>
                              <FormattedMessage id="consumption" /> <FormattedMessage id="description" />
                            </TextSpan>
                          </TH>
                        </TRH>
                      </THEAD>
                    )}
                    <TBODY>
                      {filteredOperations?.map((operationItem, i) => {
                        return (
                          <TR key={`${i}-c`} isEvenColor={i % 2 === 0}>
                            <TD>
                              <TextSpan apparence="s2">{operationItem?.idOperation}</TextSpan>
                            </TD>
                            <TD>
                              <TextSpan apparence="s2">{operationItem?.name}</TextSpan>
                            </TD>
                            <TD>
                              <TextSpan apparence="p2">{operationItem?.description}</TextSpan>
                            </TD>
                            <TD textAlign="center">
                              <TextSpan apparence="p2">{operationItem?.idGroupConsumption}</TextSpan>
                            </TD>
                            <TD textAlign="center">
                              <TextSpan apparence="p2">{
                                floatToStringExtendDot(data
                                  ?.groupConsumption
                                  ?.find(x => x.code === operationItem?.idGroupConsumption)
                                  ?.consumption
                                  , 2)
                              }</TextSpan>
                            </TD>
                            <TD>
                              <TextSpan apparence="p2">{data
                                ?.groupConsumption
                                ?.find(x => x.code === operationItem?.idGroupConsumption)
                                ?.description}</TextSpan>
                            </TD>
                          </TR>
                        )
                      })}
                    </TBODY>
                  </TABLE>
                  {!filteredOperations?.length && !isLoading && (
                    <p className="mt-4">
                      <FormattedMessage id="no.operations" />
                    </p>
                  )}
                </Row>
              </Col>
            </Row>
          </Card>
        </Col>
      </ContainerRow>
      <SpinnerFull isLoading={isLoading} />
    </>
  );
};

export default ContractView;
