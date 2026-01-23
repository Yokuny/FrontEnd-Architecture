import React from "react";
import Row from "@paljs/ui/Row";
import { Button } from "@paljs/ui/Button";
import Col from "@paljs/ui/Col";
import { useTheme } from "styled-components";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { Fetch, LabelIcon } from "../../../../components";
import { Vessel } from "../../../../components/Icons";
import { SkeletonThemed } from "../../../../components/Skeleton";
import { setFilterPortActivity, setIsShowList } from "../../../../actions";
import TrackingService from "../../../../services/TrackingService";

function ActivitiesPort(props) {
  const [isLoading, setIsLoading] = React.useState(false)
  const [data, setData] = React.useState()

  const theme = useTheme();

  React.useEffect(() => {
    if (props.fence) {
      getData(props.fence)
      saveTracking(props.fence)
    }
  }, [])

  const saveTracking = (fence) => {
    const code = fence?.code?.toUpperCase()?.replaceAll(' ', '').replaceAll('-', '');
    TrackingService.saveTracking({
      pathfull: "/port-activity",
      pathname: "/port-activity",
      search: `?code=${code}`,
    }).then(() => {});
  }

  const saveTrackingClick = (code, type) => {
    TrackingService.saveTracking({
      pathfull: `/activity/${type}`,
      pathname: `/activity/${type}`,
      search: `?code=${code}`,
    }).then(() => {});
  }

  const getData = (fence) => {
    setIsLoading(true)
    const code = fence?.code?.toUpperCase()?.replaceAll(' ', '').replaceAll('-', '');
    Fetch
      .get(`/integrationthird/ais/port/activity?code=${code}`)
      .then(res => {
        if (res.data)
          setData({ ...res.data, code })
        setIsLoading(false)
      })
      .catch(err => {
        setIsLoading(false)
      })
  }

  const openListVessels = ({ type, code }) => {
    saveTrackingClick(code, type)
    props.setFilterPortActivity({
      code,
      type
    })
    props.setIsShowList(true)
  }

  if (isLoading) {
    return (
      <div className="mt-2 ml-2">
        <SkeletonThemed height={15} count={4} />
      </div>
    )
  }

  if (!data) return null

  return (
    <>
      <div className="mt-2 ml-2">
        <LabelIcon
          title={<FormattedMessage id="vessels" />}
          renderIcon={() => <Vessel
            style={{
              height: 13,
              width: 13,
              color: theme.textHintColor,
              marginRight: 5,
              marginTop: 2,
              marginBottom: 2,
            }}
          />}
        />
      </div>

      <Row className="m-0 pt-3 pr-2">

        {!!data?.numVesselsInPort && <Col breakPoint={{ md: 6 }} className="mb-4">
          <Button size="Small" status="Basic" onClick={() => openListVessels({
            type: "in.port",
            code: data?.code
          })}>
            {data?.numVesselsInPort} <FormattedMessage id="in.port" />
          </Button>
        </Col>}

        {!!data?.numIncomingVessels && <Col breakPoint={{ md: 6 }} className="mb-4">
          <Button size="Small" status="Basic" onClick={() => openListVessels({
            type: "incoming",
            code: data?.code
          })}>
            {data?.numIncomingVessels} <FormattedMessage id="incoming" />
          </Button>
        </Col>}

        {!!data?.numVesselsAtAnchor && <Col breakPoint={{ md: 6 }} className="mb-2">
          <Button size="Small" status="Basic" onClick={() => openListVessels({
            type: "at.anchor",
            code: data?.code
          })}>
            {data?.numVesselsAtAnchor} <FormattedMessage id="at.anchor" />
          </Button>
        </Col>}
      </Row>
    </>
  );
}

const mapStateToProps = (state) => ({
  showCode: state.map.showCode,
});

const mapDispatchToProps = (dispatch) => ({
  setFilterPortActivity: (filter) => {
    dispatch(setFilterPortActivity(filter));
  },
  setIsShowList: (isShow) => {
    dispatch(setIsShowList(isShow));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ActivitiesPort);
