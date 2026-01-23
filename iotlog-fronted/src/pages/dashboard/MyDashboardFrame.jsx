import React, { useState } from "react";
import { Card, CardBody } from "@paljs/ui/Card";
import { connect } from "react-redux";
import { Responsive as ResponsiveLayout } from "react-grid-layout";
import { useLocation } from "react-router-dom";
import { Button, Col, EvaIcon, Row } from "@paljs/ui";
import styled, { useTheme } from "styled-components";
import ActionsChart from "../../components/ChartEditor/Actions/ActionsChart";
import { SpinnerFull, Fetch, TextSpan } from "../../components";
import {
  getLastStatesSensorByMachines,
  setDataChart,
  setEditorItem,
  setTheme,
} from "../../actions";
import ListOptionsCharts from "../../components/ChartEditor/ListOptionsCharts";
import Editor from "./editor";

const ContentChart = styled.div`
  ${({ noShow }) => `
    ${
      noShow &&
      `.react-resizable-handle {
        display: none;
      }`
    }
  `}

  width: 100%;
  height: 100%;
`;

const RowNoWrap = styled(Row)`
  flex-wrap: nowrap;
`;

const MyDashboardFrame = (props) => {
  const location = useLocation();
  const theme = useTheme();

  const [layout, setLayout] = React.useState([]);
  const [dragEnabled, setDragEnabled] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const [data, setData] = React.useState({
    isCanEdit: false,
    dashboard: { description: "", layout: [] },
    data: [],
  });
  const [isLoading, setIsLoading] = useState(false);

  const [idDashboard, setIdDashboard] = useState();

  React.useLayoutEffect(() => {
    const idFinded = new URL(window.location.href).searchParams.get("id");
    setIdDashboard(idFinded);
    setData(undefined);
    setMounted(false);
    loadingData(idFinded);
  }, [location]);

  React.useLayoutEffect(() => {
    const theme = new URL(window.location.href).searchParams.get("theme");
    if (theme) props.setTheme(theme);
  }, []);

  const loadingData = (id) => {
    if (id) {
      setIsLoading(true);
      Fetch.get(`/chart/list?idDashboard=${id}`)
        .then((response) => {
          setIsLoading(false);
          setData(response.data);
          setLayout(response.data?.dashboard?.layouts);
          setMounted(true);
          const idMachines = [
            ...new Set(
              response.data?.data?.map((y) => y.options?.machine?.value)
            ),
          ];
          if (idMachines?.length) {
            props.getLastStatesSensorByMachines(idMachines);
          }
        })
        .catch((e) => {
          setIsLoading(false);
        });
    }
  };

  const widthFrameOriginal =
    parseInt(new URL(window.location.href).searchParams.get("width")) - 40;

  const onLayoutChange = async (layoutNew, layoutsNew) => {
    if (mounted) {
      await updateLayoutDashboardAsync(layoutsNew);
    }
    setLayout(layoutsNew);
  };

  const updateLayoutDashboardAsync = async (newLayouts) => {
    try {
      await Fetch.patch("/dashboard/layouts", {
        id: idDashboard,
        layouts: newLayouts,
      });
    } catch (e) {}
  };

  const onPressEdit = () => {
    setDragEnabled((prevState) => !prevState);
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

  const itemsMenu = ListOptionsCharts.map((x) => x.items).flat();

  return (
    <>
      <Card style={{ minHeight: "100vh" }}>
        <CardBody>
          <Row>
            <Col breakPoint={{ md: 9, sm: 8, xs: 8 }} className="mb-4">
              <TextSpan apparence={"h6"}>
                {data?.dashboard?.description}
              </TextSpan>
            </Col>
            <Col breakPoint={{ md: 3, sm: 4, xs: 4 }} className="mb-4">
              <RowNoWrap end="xs" className="mr-1">
                {data?.isCanEdit && (
                  <Button
                    onClick={onPressEdit}
                    className="mr-4"
                    size="Tiny"
                    status={dragEnabled ? "Success" : "Basic"}
                  >
                    <EvaIcon name="settings-outline" />
                  </Button>
                )}
              </RowNoWrap>
            </Col>
          </Row>

          <ResponsiveLayout
            layouts={layout}
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
            onLayoutChange={onLayoutChange}
            isDraggable={!!dragEnabled}
            isResizable={!!dragEnabled}
            width={widthFrameOriginal}
            useCSSTransforms
            style={{
              backgroundColor: theme.backgroundBasicColor1,
              padding: 0,
            }}
            key={idDashboard}
          >
            {data?.data?.map((itemChart, i) => {
              const componentItem = itemsMenu.find(
                (x) => x.chart == itemChart.type
              );
              const ComponentWrapper = componentItem.componentWrapper;
              return (
                <ContentChart noShow={!dragEnabled} key={itemChart.id}>
                  <ActionsChart
                    key={itemChart.id}
                    onRemove={() => onRemove(itemChart)}
                    activeEdit={dragEnabled}
                    data={itemChart}
                  >
                    <ComponentWrapper
                      key={itemChart.id}
                      id={itemChart.id}
                      component={componentItem.component}
                      data={{ ...(itemChart?.options || {}), idEnterprise: data.dashboard.idEnterprise }}
                      activeEdit={dragEnabled}
                    />
                  </ActionsChart>
                </ContentChart>
              );
            })}
          </ResponsiveLayout>
        </CardBody>
      </Card>
      <Editor idEnterprise={data?.dashboard?.idEnterprise} />
      <SpinnerFull isLoading={isLoading} />
    </>
  );
};

const mapDispatchToProps = (dispatch) => ({
  setOptionsData: (data) => {
    dispatch(setDataChart(data));
  },
  getLastStatesSensorByMachines: (machines) => {
    dispatch(getLastStatesSensorByMachines(machines));
  },
  setTheme: (theme) => {
    dispatch(setTheme(theme));
  },
  setEditorItem: (data) => {
    dispatch(setEditorItem(data));
  },
});

export default connect(undefined, mapDispatchToProps)(MyDashboardFrame);
