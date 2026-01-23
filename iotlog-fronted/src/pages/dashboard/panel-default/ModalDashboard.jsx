import React from "react";
import RGL, { WidthProvider } from "react-grid-layout";
import { useTheme } from "styled-components";
import { Fetch, Modal, SpinnerFull } from "../../../components";
import ListOptionsCharts from "../../../components/ChartEditor/ListOptionsCharts";
import { ContentChart } from "../../../components/ChartEditor/Utils";


const ResponsiveLayout = WidthProvider(RGL);

function ModalDashboardDefault(props) {

  const {
    filterModal,
    onClose
  } = props;

  const { id,
    idMachine,
    idSensors, } = filterModal || {};

  const [isLoading, setIsLoading] = React.useState(false);
  const [data, setData] = React.useState();
  const [dataLayout, setDataLayout] = React.useState();

  const theme = useTheme();

  const DASHBOARDS_DEFAULTS = [
    {
      idMachine: "cbo_wiser",
      idDashboard: "e1e22541-aaea-4c94-98ea-d6a3c0c2e45b"
    }
  ]

  React.useEffect(() => {
    if (idMachine) {
      getData({ machine: { value: idMachine } });
    }
    else {
      setData();
      setDataLayout();
    }
  }, [idMachine]);

  const getData = (filter) => {
    const idToSearch = id
      ? id
      : (DASHBOARDS_DEFAULTS
        .find(x => x.idMachine === filter?.machine?.value)
        ?.idDashboard || "c008e6b5-3966-4db2-ba0b-50e11ccb0389");

    setIsLoading(true);
    Fetch.get(`/chart/list?idDashboard=${idToSearch}`)
      .then((response) => {
        setIsLoading(false);

        if (response.data?.data?.length) {
          setData(takeCareData({ ...response.data }, filter?.machine));
          setDataLayout({
            layouts: response.data?.dashboard?.layouts,
            layout: response.data?.dashboard?.layout,
          });
        }
      })
      .catch((e) => {
        setIsLoading(false);
      });
  }

  const takeCareData = (dataToChange, machine) => {
    if (dataToChange?.dashboard?.idEnterprise)
      dataToChange.dashboard.idEnterprise = props.enterprises?.length ? props.enterprises[0].id : localStorage.getItem("id_enterprise_filter");
    dataToChange.data.forEach(chart => {
      if (chart?.options?.machine) {
        chart.options.machine = machine;
      }
      if (chart?.options?.machines?.length) {
        chart.options.machines.forEach(machineConfig => {
          if (machineConfig?.machine) {
            machineConfig.machine = machine;
          }
        });
      }
    });
    return dataToChange;
  }


  const getLayout = () => {
    const screenWidth = window.screen.width;
    let layout = dataLayout?.layout || [];
    if (!layout?.length) {
      if (dataLayout?.layouts?.lg?.length) {
        layout = dataLayout?.layouts?.lg;
      }
      else if (dataLayout?.layouts?.md?.length) {
        layout = dataLayout?.layouts?.md;
      }
    }

    if (screenWidth < 498)
      return layout?.map(x => ({ ...x, w: 12 }));
    if (screenWidth < 798)
      return layout?.map(x => ({ ...x, w: 6 }));
    return layout
  }

  const itemsMenu = ListOptionsCharts.map((x) => x.items).flat();

  return (
    <>
      <Modal
        show={true}
        onClose={onClose}
        size="ExtraLarge"
        textTitle="Data"
        styleContent={{
          overflowY: "auto",
          maxHeight: "calc(100vh - 100px)"
        }}
      >
        <ResponsiveLayout
          layout={getLayout()}
          isDraggable={false}
          isResizable={false}
          style={{
            backgroundColor: theme.backgroundBasicColor1,
          }}
        >
          {data?.data?.map((itemChart, i) => {
            const componentItem = itemsMenu.find(
              (x) => x.chart === itemChart.type
            );
            if (!componentItem) return <></>;
            const ComponentWrapper = componentItem.componentWrapper;
            return (
              <ContentChart
                noShowMarker
                noBorder
                key={itemChart.id}
              >
                {!isLoading && <ComponentWrapper
                  id={itemChart.id}
                  component={componentItem.component}
                  data={{ ...(itemChart?.options || {}), idEnterprise: data.dashboard.idEnterprise }}
                  activeEdit={false}
                  filterDashboard={props.filterDashboard}
                  filterByMachine={true}
                  idMachine={idMachine}
                  idSensors={[idSensors]}
                />}
              </ContentChart>
            );
          })}
        </ResponsiveLayout>
        <SpinnerFull isLoading={isLoading} />
      </Modal>
    </>
  )
}

export default ModalDashboardDefault;
