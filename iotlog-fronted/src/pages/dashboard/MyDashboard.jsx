import React from "react";
import { Card, CardBody } from "@paljs/ui/Card";
import RGL, { WidthProvider } from "react-grid-layout";
import { connect } from "react-redux";
import styled, { useTheme } from "styled-components";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { toast } from "react-toastify";
import { useIntl } from "react-intl";
import { SpinnerFull, Fetch } from "../../components";
import ListOptionsCharts from "../../components/ChartEditor/ListOptionsCharts";
import ActionsChart from "../../components/ChartEditor/Actions/ActionsChart";
import {
  getLastStatesSensorByMachines,
  setDataChart,
  setEditorItem,
} from "../../actions";
import AddImportChart from "./editor/AddImportChart";
import HeaderDashboard from "./HeaderDashboard";
import Editor from "./editor";

const ContentChart = styled.div`
  ${({ noShow, fullView }) => `
    ${noShow &&
    `.react-resizable-handle {
        display: none;
      }`
    }

    ${fullView &&
    `position: fixed !important;
       top: 0px;
       left: 0px;
       z-index: 9999;
       width: 100% !important;
       height: 95% !important;
       padding: 10px;
      `
    }
  `}

  width: 100%;
  height: 100%;
`;

const ResponsiveLayout = WidthProvider(RGL);

const DATA_DEFAULT = {
  isCanEdit: false,
  dashboard: { description: "", layout: [] },
  data: [],
}

const MyDashboard = (props) => {

  const handle = useFullScreenHandle();
  const theme = useTheme();
  const intl = useIntl();

  const updateChartRef = React.useRef(false)
  const timeRef = React.useRef();

  const [isLoading, setIsLoading] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const [dataLayout, setDataLayout] = React.useState({});
  const [data, setData] = React.useState(DATA_DEFAULT);
  const [dragEnabled, setDragEnabled] = React.useState(false);

  const idDashboard = new URL(window.location.href).searchParams.get("id");

  React.useEffect(() => {
    getLoadingCharts();

    return () => {
      if (timeRef.current) {
        clearTimeout(timeRef.current);
      }
    };
  }, []);

  React.useEffect(() => {
    if (props.newChart) {
      updateChartRef.current = false;
      getLoadingCharts(true);
    }
  }, [props.newChart]);

  React.useEffect(() => {
    localStorage.setItem("editingChart", dragEnabled);
  }, [dragEnabled]);

  const getLoadingCharts = (isNewChart = false) => {
    if (idDashboard) {
      setIsLoading(true);
      Fetch.get(`/chart/list?idDashboard=${idDashboard}`)
        .then((response) => {
          setIsLoading(false);
          setData(response.data);
          setDataLayout({
            layouts: response.data?.dashboard?.layouts,
            layout: response.data?.dashboard?.layout,
          });
          setMounted(true);
          const idMachines = [
            ...new Set(
              response.data?.data?.map((y) => y.options?.machine?.value)
            ),
          ].filter((x) => !!x);
          if (idMachines?.length) {
            props.getLastStatesSensorByMachines(idMachines);
          }
          if (isNewChart)
            updateChartRef.current = true;
        })
        .catch((e) => {
          setIsLoading(false);
        });
    }
  };

  const onLayoutChange = (current, layoutsNew) => {
    if (mounted && dragEnabled && !!updateChartRef.current) {
      updateLayoutDashboardAsync(current);
    } else if (mounted && dragEnabled) {
      toast.warn(intl.formatMessage({ id: "dashboard.saveLayout" }));
      if (timeRef.current) {
        clearTimeout(timeRef.current);
      }

      timeRef.current = setTimeout(() => {
        try {
          window.location.reload();
        } catch { }
      }, 1000)
    }
  };

  const updateLayoutDashboardAsync = (layout, layouts) => {
    Fetch.patch("/dashboard/layout", {
      id: idDashboard,
      layout
    }).catch(e => {

    })
  };

  const onPressEdit = () => {
    updateChartRef.current = !dragEnabled;
    setDragEnabled(!dragEnabled);
  };

  const onAdd = (item) => {
    props.setEditorItem(item);
    props.setOptionsData(undefined);
  };

  const onRemove = (item) => {
    setIsLoading(true);
    Fetch.delete(`/chart?id=${item.id}`)
      .then((_) => {
        setIsLoading(false);
        setData({
          ...data,
          data: data?.data?.filter((x) => x.id !== item.id),
        });
      })
      .catch((_) => {
        setIsLoading(false);
      });
  };

  const onPressFullScreen = () => {
    if (handle.active) handle.exit();
    else {
      handle.enter();
    }
  };

  const itemsMenu = ListOptionsCharts.map((x) => x.items).flat();

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

  return (
    <>
      <FullScreen handle={handle}>
        <Card style={{ height: "100%", marginBottom: 0 }}>
          <CardBody>
            <HeaderDashboard
              data={data}
              onPressEdit={onPressEdit}
              onPressFullScreen={onPressFullScreen}
              handle={handle}
              dragEnabled={dragEnabled}
              idDashboard={idDashboard}
            />
            <ResponsiveLayout
              layout={getLayout()}
              onLayoutChange={onLayoutChange}
              isDraggable={dragEnabled}
              isResizable={dragEnabled}
              useCSSTransforms={mounted}
              measureBeforeMount={mounted}
              compactType="vertical"
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
                    noShow={!dragEnabled}
                    key={itemChart.id}
                  >
                    <ActionsChart
                      key={itemChart.id}
                      activeEdit={dragEnabled}
                      onRemove={onRemove}
                      data={itemChart}
                    >
                      {!isLoading && <ComponentWrapper
                        key={itemChart.id}
                        id={itemChart.id}
                        component={componentItem.component}
                        data={{ ...(itemChart?.options || {}), idEnterprise: data.dashboard.idEnterprise }}
                        activeEdit={dragEnabled}
                        filterDashboard={props.filterDashboard}
                      />}
                    </ActionsChart>
                  </ContentChart>
                );
              })}
            </ResponsiveLayout>
            <AddImportChart
              visible={dragEnabled}
              onAdd={() => onAdd({ idDashboard })}
            />
            <SpinnerFull isLoading={isLoading} />
          </CardBody>
        </Card>
        <Editor idEnterprise={data?.dashboard?.idEnterprise} />
      </FullScreen>
    </>
  );
};

const mapStateToProps = (state) => ({
  newChart: state.dashboard.newChart,
  stateViewer: state.menu.stateViewer,
  filterDashboard: state.dashboard.filter,
});

const mapDispatchToProps = (dispatch) => ({
  setOptionsData: (data) => {
    dispatch(setDataChart(data));
  },
  getLastStatesSensorByMachines: (machines) => {
    dispatch(getLastStatesSensorByMachines(machines));
  },
  setEditorItem: (data) => {
    dispatch(setEditorItem(data));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(MyDashboard);
