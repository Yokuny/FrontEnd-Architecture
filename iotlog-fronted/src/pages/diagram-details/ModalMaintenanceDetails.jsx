import React, { useState, useEffect } from "react";
import Modal from "../../components/Modal";
import { TABLE, TBODY, TH, THEAD, TRH, TR, TD } from "../../components/Table";
import { TextSpan } from "../../components";
import { FormattedMessage } from "react-intl";
import { Fetch } from "../../components";

const ModalMaintenanceDetails = ({ show, onClose, machineId, equipment }) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      try {
        const query = [];
        query.push(`idMachines=${machineId}`);
        query.push(`idEnterprise=${localStorage.getItem("id_enterprise_filter")}`);

        const responseCMMS = await Fetch.get(
          `/formdata/data/cad37398-1a88-4538-ae6c-2be7ce4377f8?fieldDate=dataAbertura&${query.join("&")}`
        );

        const filteredData = (responseCMMS?.data || [])
          .filter((item) => item.equipamento === equipment || item.grupoFuncional === equipment)
          .map((x) => ({
            ...x,
            tipoManutencao: x.tipoManutencao || "Indefinido",
          }));

        setData(filteredData);
      } catch (error) {
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (show && machineId && equipment) {
      getData();
    }
  }, [show, machineId, equipment]);

  return (
    <Modal
      show={show}
      onClose={onClose}
      title="maintenance.details"
      size="ExtraLarge"
      styleContent={{
        maxHeight: "calc(90vh - 220px)",
        overflowX: "hidden",
        overflowY: "auto",
      }}>
      {isLoading ? (
        <div style={{ padding: "20px", textAlign: "center" }}>
          <TextSpan apparence="p2">
            <FormattedMessage id="loading" />
          </TextSpan>
        </div>
      ) : (
        <TABLE>
          <THEAD>
            <TRH>
              <TH textAlign="center">
                <TextSpan apparence="p2" hint>
                  <FormattedMessage id="vessel" />
                </TextSpan>
              </TH>
              <TH textAlign="center">
                <TextSpan apparence="p2" hint>
                  <FormattedMessage id="code" />
                </TextSpan>
              </TH>
              <TH textAlign="center">
                <TextSpan apparence="p2" hint>
                  <FormattedMessage id="type" />
                </TextSpan>
              </TH>
              <TH textAlign="center">
                <TextSpan apparence="p2" hint>
                  <FormattedMessage id="equipment.maintenance" />
                </TextSpan>
              </TH>
              <TH textAlign="center" style={{ width: "40%" }}>
                <TextSpan apparence="p2" hint>
                  <FormattedMessage id="order.scope" />
                </TextSpan>
              </TH>
              <TH textAlign="center">
                <TextSpan apparence="p2" hint>
                  <FormattedMessage id="status" />
                </TextSpan>
              </TH>
            </TRH>
          </THEAD>
          <TBODY>
            {data?.length > 0 ? (
              data.map((item, index) => (
                <TR key={`maintenance-item-${index}`} isEvenColor={index % 2 === 0} isEvenBorder={index % 2 === 0}>
                  <TD textAlign="center">
                    <TextSpan apparence="p2">{item.assetName || item.embarcacao || "-"}</TextSpan>
                  </TD>
                  <TD textAlign="center">
                    <TextSpan apparence="p2">{item.codigoOS || "-"}</TextSpan>
                  </TD>
                  <TD textAlign="center">
                    <TextSpan apparence="p2">{item.tipoManutencao || "-"}</TextSpan>
                  </TD>
                  <TD textAlign="center">
                    <TextSpan apparence="p2">{item.equipamento || item.grupoFuncional || "-"}</TextSpan>
                  </TD>
                  <TD textAlign="center">
                    <TextSpan apparence="p2">{item.escopodoservico || "-"}</TextSpan>
                  </TD>
                  <TD textAlign="center">
                    <TextSpan apparence="p2">
                      <FormattedMessage id={item.dataConclusao ? "completed" : "open"} />
                    </TextSpan>
                  </TD>
                </TR>
              ))
            ) : (
              <TR>
                <TD textAlign="center" colSpan="6">
                  <TextSpan apparence="p2" hint>
                    <FormattedMessage id="no.maintenance.records" />
                  </TextSpan>
                </TD>
              </TR>
            )}
          </TBODY>
        </TABLE>
      )}
    </Modal>
  );
};

export default ModalMaintenanceDetails;
