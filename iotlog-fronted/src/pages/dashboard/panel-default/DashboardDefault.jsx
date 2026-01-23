import React from "react";
import RGL, { WidthProvider } from "react-grid-layout";
import { useTheme } from "styled-components";
import { connect } from "react-redux";
import { Fetch, SpinnerFull } from "../../../components";
import { getLastStatesSensorByMachines } from "../../../actions";
import ListOptionsCharts from "../../../components/ChartEditor/ListOptionsCharts";
import { ContentChart } from "../../../components/ChartEditor/Utils";
import { useSearchParams } from "react-router-dom";
import ModalDashboard from "./ModalDashboard";


const ResponsiveLayout = WidthProvider(RGL);

function DashboardDefault(props) {

  const { filter } = props;

  const [isLoading, setIsLoading] = React.useState(false);
  const [data, setData] = React.useState();
  const [dataLayout, setDataLayout] = React.useState();
  const [searchParams, setSearchParams] = useSearchParams();
  const [dataModal, setDataModal] = React.useState();

  const theme = useTheme();

  const idDashboard = searchParams.get("id");
  const idMachine = searchParams.get("idMachine");
  const idSensors = searchParams.get("idSensors");

  const DASHBOARDS_DEFAULTS = [
    {
      idMachine: "cbo_wiser",
      idDashboard: "e1e22541-aaea-4c94-98ea-d6a3c0c2e45b"
    }
  ]

  React.useEffect(() => {
    if (filter?.machine?.value)
      getData(filter);
    else if (idMachine) {
      getData({ machine: { value: idMachine } });
    }
    else {
      setData();
      setDataLayout();
    }
  }, [filter, idMachine]);

  const getData = (filter) => {
    const id = idDashboard
      ? idDashboard
      : (DASHBOARDS_DEFAULTS
        .find(x => x.idMachine === filter?.machine?.value)
        ?.idDashboard || "c008e6b5-3966-4db2-ba0b-50e11ccb0389");

    setIsLoading(true);
    Fetch.get(`/chart/list?idDashboard=${id}`)
      .then((response) => {
        setIsLoading(false);

        if (response.data?.data?.length) {
          setData(takeCareData({ ...response.data }, filter?.machine));
          setDataLayout({
            layouts: response.data?.dashboard?.layouts,
            layout: response.data?.dashboard?.layout,
          });

          const idMachines = [
            ...new Set(
              response.data?.data?.map((y) => y.options?.machine?.value)
            ),
          ];
          if (idMachines?.length) {
            props.getLastStatesSensorByMachines(idMachines);
          }
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

  const handleOpen = (linkQuery) => {
    const query = [`id=3b375181-f32a-4d60-9d28-3800de81fd15`]
    if (linkQuery) {
      Object.keys(linkQuery).forEach(key => {
        query.push(`${key}=${Array.isArray(linkQuery[key])
          ? [...new Set(linkQuery[key])].join(",")
          : linkQuery[key]}`)
      })
    }
    const objectQuery = query.reduce((acc, x) => {
      const [key, value] = x.split("=");
      acc[key] = value;
      return acc;
    }, {});
    setDataModal(objectQuery);
    //window.open(`/panel-default-view?${query.join("&")}`, "_blank");
  }

  const itemsMenu = ListOptionsCharts.map((x) => x.items).flat();

  return (
    <>
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
                idMachine={filter?.machine?.value || idMachine}
                idSensors={idSensors}
                onHandleOpen={handleOpen}
              />}
            </ContentChart>
          );
        })}
      </ResponsiveLayout>
      <SpinnerFull isLoading={isLoading} />
      {dataModal && <ModalDashboard
        filterModal={dataModal}
        onClose={() => setDataModal(null)}
        enterprises={props.enterprises}
      />}
    </>
  )
}

const mapDispatchToProps = (dispatch) => ({
  getLastStatesSensorByMachines: (machines) => {
    dispatch(getLastStatesSensorByMachines(machines));
  },
});

const mapStateToProps = (state) => ({
  enterprises: state.enterpriseFilter.enterprises,
});

export default connect(mapStateToProps, mapDispatchToProps)(DashboardDefault);
