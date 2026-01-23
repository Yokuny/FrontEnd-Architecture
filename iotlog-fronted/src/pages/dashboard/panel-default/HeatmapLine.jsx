import { FormattedMessage } from "react-intl";
import styled from "styled-components";
import { CardNoShadow, Fetch, SpinnerFull, TextSpan, Tracker } from "../../../components";
import {
  TABLE,
  TBODY,
  TD,
  TH,
  THEAD,
  TR,
  TRH,
} from "../../../components/Table";
import { Equipments, getAvailableEquipments } from "../../heatmap/Equipments";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import moment from "moment";
import ModalListDashboard from "../../heatmap/dashboard/ModalListDashboard";
import { CardBody } from "@paljs/ui";
import { useLocation } from "react-router-dom";

const THFirst = styled(TH)`
  position: sticky;
  left: -1.5rem;
  z-index: 1;
  background: ${(props) =>
    props.isEvenColor
      ? props.theme.backgroundBasicColor1
      : props.theme.backgroundBasicColor2};
  padding-left: 1rem;
  border-right-width: 1px;
  border-right-color: ${(props) => props.theme.backgroundBasicColor4};
  border-right-style: solid;
`;

function HeatmapLine(props) {
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState();
  const [filterShowModal, setFilterShowModal] = useState();
  const [availableEquipments, setAvailableEquipments] = useState([]);

  const { enterprises, isReady, idMachine } = props;

  const columns = [
    ...availableEquipments.map((eqp) => ({
      label: eqp.name,
      code: eqp.code,
      options: eqp.options,
      index: eqp.index,
    })),
  ];

  const isPanelDefault = useLocation().pathname.includes('panel-default-view');

  useEffect(() => {
    if (isReady && idMachine) {
      onGet();
    }
  }, [enterprises, isReady, idMachine]);

  const onGet = () => {
    let query = [`idMachine=${idMachine}`];
    const idEnterpriseFilter = props.enterprises?.length
      ? props.enterprises[0].id
      : "";
    if (idEnterpriseFilter) {
      query.push(`idEnterprise=${idEnterpriseFilter}`);
    }

    setIsLoading(true);
    Fetch.get(`/machineheatmap?${query.join("&")}`)
      .then((response) => {


        const filteredEquipments = getAvailableEquipments(response.data);
        setAvailableEquipments(filteredEquipments);
        setData(response.data);
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  return (
    <>
      {!!data?.length &&
        <>
          <CardNoShadow style={{ marginBottom: 0, marginLeft: 10, marginRight: 10 }}>
            <CardBody>
              <TABLE>
                <THEAD>
                  <TRH>
                    {columns.map((col, index) => {
                      if (col.id)
                        return (
                          <THFirst textAlign="center" isEvenColor={index % 2 === 0}>
                            <TextSpan apparence="p2" hint>
                              <FormattedMessage id={col.id} />
                            </TextSpan>
                          </THFirst>
                        );
                      else
                        return (
                          <TH
                            textAlign="center"
                            style={{
                              minWidth: 50,
                              maxWidth: 90,
                            }}
                          >
                            <TextSpan
                              apparence="p2"
                              hint
                              style={{
                                wordSpacing: "100vw",
                              }}
                            >
                              {col.label}
                            </TextSpan>
                            <br />
                            {!isPanelDefault && (
                              <TextSpan apparence="s2" hint>
                                {col.options ? (
                                  col.options.map((x, i) => (
                                    <>
                                      {x}
                                      {i < col.options?.length - 1 && <>, &nbsp;</>}
                                    </>
                                  ))
                                ) : (
                                  <>1, &nbsp;2, &nbsp;3, &nbsp;4</>
                                )}
                              </TextSpan>
                            )}
                          </TH>
                        );
                    })}
                  </TRH>
                </THEAD>
                <TBODY>
                  {data
                    ?.map((fleet, i) => (
                      <TR key={i} isEvenColor={i % 2 === 0}>
                        {columns.map((col) => {
                          let equipment = fleet.equipments.find((eqp) => {
                            if (eqp.code === col.code) return eqp;
                          });
                          if (equipment) {
                            let subgroups = equipment.subgroups.sort((a, b) =>
                              a.subgroupName.localeCompare(b.subgroupName)
                            );
                            return (
                              <TD textAlign="center">
                                <Tracker
                                  onClick={(item, index) =>
                                    setFilterShowModal({
                                      fleet,
                                      equipment,
                                      item,
                                      index,
                                    })
                                  }
                                  itens={subgroups.map((subg) => {
                                    let status = "Success";
                                    if (!subg.idSensorOnOff) return {};
                                    else if (subg.isDanger) status = "Danger";
                                    else if (subg.isWarning) status = "Warning";
                                    else if (
                                      fleet.lastUpdate &&
                                      moment().diff(moment(fleet.lastUpdate), "hours") >
                                      48
                                    )
                                      status = "Basic";

                                    if (subg.isOn)
                                      return { status, tooltip: subg.subgroupName };
                                    return {
                                      status,
                                      tooltip: subg.subgroupName,
                                      onlyBorder: true,
                                    };
                                  })}
                                />
                              </TD>
                            );
                          } else return <TD textAlign="center"></TD>;
                        })}
                      </TR>
                    ))}
                </TBODY>
              </TABLE>
            </CardBody>
          </CardNoShadow>

          <ModalListDashboard
            show={!!filterShowModal}
            onClose={() => setFilterShowModal(undefined)}
            itemSelected={filterShowModal}
          />
        </>
      }
    </>
  );
}

const mapStateToProps = (state) => ({
  enterprises: state.enterpriseFilter.enterprises,
  isReady: state.enterpriseFilter.isReady,
  items: state.menu.items,
  itemsByEnterprise: state.menu.itemsByEnterprise,
});

export default connect(mapStateToProps, undefined)(HeatmapLine);
