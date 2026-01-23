import { Spinner } from "@paljs/ui";
import React from "react";
import { useIntl } from "react-intl";
import { toast } from "react-toastify";
import { css, styled } from "styled-components";
import { Fetch, Modal } from "../../../components";
import ListDashboardHeatmap from "./List";

const ContentLoading = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 150px;
`

const SpinnerThemed = styled(Spinner)`
  ${({ theme }) => css`
    background-color: ${theme.backgroundBasicColor1};
  `}
`;

export default function ModalListDashboard(props) {

  const [data, setData] = React.useState();
  const [isLoading, setIsLoading] = React.useState(false);
  const [heatmapAlerts, setHeatmapAlerts] = React.useState([]);

  React.useEffect(() => {
    if (props.itemSelected) {
      getDetails(props.itemSelected);
      //fetchMachineHeatmapAlerts(props.itemSelected);
    }
    return () => {
      setData(undefined);
    }
  }, [props.itemSelected])

  const getDetails = (filter) => {
    setIsLoading(true);
    Fetch.get(`/machineheatmap/dashboard?idMachine=${filter?.fleet?.machine?.id}&equipment=${props.itemSelected?.equipment?.name}&indexSubgroup=${props.itemSelected?.index}`)
      .then((response) => {
        setData(response.data);
        setIsLoading(false);
      })
      .catch(response => {
        setIsLoading(false);
      })
  }

  function fetchMachineHeatmapAlerts(itemSelected) {
    Fetch.get(`/heatmap-alerts/${itemSelected?.fleet?.machine?.id}`)
      .then((response) => {
        if (response.data?.alerts)
          setHeatmapAlerts(response.data?.alerts)
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      })
  };

  return <><Modal
    onClose={props.onClose}
    show={props.show}
    title={`${props.itemSelected?.fleet?.machine?.name} - ${props.itemSelected?.equipment?.name} ${props.itemSelected?.index + 1}`}
    size="ExtraLarge"
    styleContent={{ maxHeight: "calc(100vh - 150px)", overflowX: "hidden" }}
  >
    {isLoading
      ? <ContentLoading>
        <SpinnerThemed status="Primary" size="Large" />
      </ContentLoading>
      : <>{!!data?.length && <ListDashboardHeatmap data={data} heatmapAlerts={heatmapAlerts} />}</>
    }
  </Modal>
  </>
}
