import { Spinner } from '@paljs/ui';
import React from 'react';
import RGL, { WidthProvider } from "react-grid-layout";
import { useIntl } from 'react-intl';
import { connect } from "react-redux";
import { toast } from 'react-toastify';
import styled, { css, useTheme } from "styled-components";
import { Fetch } from '../../../../components';
import ActionsChart from "../../../../components/ChartEditor/Actions/ActionsChart";

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


const SpinnerThemed = styled(Spinner)`
  ${({ theme }) => css`
    background-color: ${theme.backgroundBasicColor1};
  `}
`;

const DivChartLoading = styled.div`
  min-height: 200px;
`

const ResponsiveLayout = WidthProvider(RGL);

function LayoutCharts(props) {

  const { id, chartsList, itemGroup, idDashboard, dragEnabled } = props;

  const [isLoading, setIsLoading] = React.useState(false);
  const [isLoadingRemove, setIsLoadingRemove] = React.useState();
  const [isMounted, setIsMounted] = React.useState(false);
  const [charts, setCharts] = React.useState([]);
  const [dataLayout, setDataLayout] = React.useState();

  const theme = useTheme();
  const intl = useIntl();

  React.useLayoutEffect(() => {
    getLoadingCharts(idDashboard, itemGroup.id);
  }, []);

  React.useLayoutEffect(() => {
    if (isMounted) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 1000)
    }
  }, [props.stateViewer]);

  React.useLayoutEffect(() => {
    if (props.newChart?.idGroup) {
      const indexChart = charts?.findIndex(x => x.id === props.newChart.id);
      if (indexChart < 0) {
        setCharts(prevState => [
          ...prevState,
          props.newChart
        ])
      } else {
        setCharts(prevState => [
          ...prevState.slice(0, indexChart),
          props.newChart,
          ...prevState.slice(indexChart + 1),
        ])
      }
    }
  }, [props.newChart]);

  const getLoadingCharts = (idDashboard, idGroup) => {
    if (idDashboard) {
      setIsLoading(true);
      Fetch.get(`/chart/group/list?idDashboard=${idDashboard}&idGroup=${idGroup}`)
        .then((response) => {
          setCharts(response.data?.charts);
          setDataLayout(response.data.dataGroup)
          setIsLoading(false);
          setTimeout(() => {
            setIsMounted(true)
          }, 1000)
        })
        .catch((e) => {
          setIsLoading(false);
        });
    }
  };

  const onLayoutChange = (current, layouts) => {
    if (isMounted) {
      onUpdateLayout(current, layouts);
    }
  };

  const onUpdateLayout = (layout, layouts) => {
    Fetch.patch("/dashboard/group/layout", {
      idDashboard: idDashboard,
      id: itemGroup.id,
      layout,
      // layouts
    })
      .then(r => {
      })
      .catch((e) =>
        toast.error(intl.formatMessage({ id: "error.group.save" }).replace('{0}', itemGroup.description))
      );
  };


  const onRemove = (chart) => {
    setIsLoadingRemove(chart.id);
    Fetch.delete(`/chart?id=${chart.id}`)
      .then((_) => {
        setCharts(prevState => prevState?.filter((x) => x.id !== chart.id));
        setIsLoadingRemove(undefined);
      })
      .catch((_) => {
        setIsLoadingRemove(undefined);
      });
  }

  if (isLoading) {
    return (
      <>
        <DivChartLoading>
          <SpinnerThemed />
        </DivChartLoading>
      </>
    )
  }

  return (
    <>
      <ResponsiveLayout
        layout={dataLayout?.layout}
        // layouts={dataLayout.layouts}
        // breakpoints={{ lg: 1360, md: 1024, sm: 640, xs: 480 }}
        // cols={{ lg: 12, md: 10, sm: 6, xs: 4 }}
        onLayoutChange={onLayoutChange}
        isDraggable={dragEnabled}
        isResizable={dragEnabled}
        useCSSTransforms
        style={{
          backgroundColor: theme.backgroundBasicColor1,
        }}
        key={id}
      >
        {charts?.map((itemChart, i) => {
          const componentItem = chartsList.find(
            (x) => x?.chart === itemChart.type
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
                activeEdit={dragEnabled && isLoadingRemove !== itemChart.id}
                onRemove={() => onRemove(itemChart)}
                data={itemChart}
              >
                {isLoadingRemove === itemChart.id
                  ? <SpinnerThemed />
                  : <ComponentWrapper
                    key={itemChart.id}
                    id={itemChart.id}
                    component={componentItem.component}
                    data={{ ...(itemChart?.options || {}), idEnterprise: itemChart?.dashboard?.idEnterprise }}
                    activeEdit={dragEnabled}
                    filterDashboard={props.filterDashboard}
                  />}
              </ActionsChart>
            </ContentChart>
          );
        })}
      </ResponsiveLayout>
    </>)
}

const mapStateToProps = (state) => ({
  dragEnabled: state.dashboard.dragEnabled,
  newChart: state.dashboard.newChart,
  stateViewer: state.menu.stateViewer,
});

export default connect(mapStateToProps, undefined)(LayoutCharts);
