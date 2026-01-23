import {
  Button,
  Card,
  CardHeader,
  Col,
  EvaIcon,
  Row,
} from "@paljs/ui";
import moment from "moment";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { connect } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Fetch,
  SpinnerFull,
  TextSpan,
} from "../../components";
import { JustifyModal } from "./JustifyModal";
import ListPaginatedNotifications from "./ListPaginatedNotifications";
import ItemRowNotification from "./ItemRowNotification";

const ListMyNotifications = (props) => {
  const [data, setData] = React.useState();
  const [isLoading, setIsLoading] = React.useState(false);
  const [currentPageControl, setCurrentPageControl] = React.useState(1);
  const [ready, setReady] = React.useState(false);
  const [listToResolve, setListResolve] = React.useState([]);
  const [searchParms] = useSearchParams();
  const [itemSelected, setItemSelected] = React.useState(null);

  const intl = useIntl();

  const isShowSolutionRef = React.useRef(false);

  React.useEffect(() => {
    if (ready) onPageChanged({ currentPage: 1, pageLimit: 5 });
  }, [props.enterprises]);

  React.useEffect(() => {
    if (!!props.listNew?.length && currentPageControl === 1) {
      setData({
        pageInfo: [
          { count: (data?.pageInfo[0]?.count || 0) + props.listNew?.length },
        ],
        data: [...props.listNew, ...(data?.data || [])],
      });
      updateStatus(props.listNew);
    }
  }, [props.listNew]);

  const onChangeCheck = (id) => {
    isShowSolutionRef.current = true;

    if (listToResolve?.some((x) => x === id)) {
      setListResolve(listToResolve?.filter((x) => x !== id));
    } else {
      setListResolve([...listToResolve, id]);
    }
  };

  const markAll = () => {
    setListResolve(data?.data?.filter((x) => !x.resolvedAt)?.map((x) => x.id));
  };

  const handleSaveJustify = (justifyData) => {
    setItemSelected(null);
    updateResolvedStatus(justifyData);
  };

  const renderItem = ({ item }) => {

    return (<>
      <ItemRowNotification
        item={item}
        listToResolve={listToResolve}
        onChangeCheck={onChangeCheck}
        isShowSolution={isShowSolutionRef.current}
        setItemSelected={setItemSelected}
      />
    </>
    );
  };

  const onCancel = () => {
    isShowSolutionRef.current = false;
    setListResolve([]);
  }

  const onPageChanged = ({ currentPage, pageLimit, text = "" }) => {
    if (!currentPage) return;
    let url = `/notification/my/list?page=${currentPage - 1}&size=${pageLimit}`;
    if (text) {
      url += `&search=${text}`;
    }
    const idEnterpriseFilter = localStorage.getItem("id_enterprise_filter");
    if (idEnterpriseFilter) {
      url += `&idEnterprise=${idEnterpriseFilter}`;
    }

    setCurrentPageControl(currentPage);
    setIsLoading(true);
    Fetch.get(url)
      .then((response) => {
        setData(response.data);
        updateStatus(response.data?.data);
        setIsLoading(false);
        setReady(true);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const updateStatus = (notifications) => {
    const notificationsOnlyUnread = notifications
      .filter((x) => !x.readAt)
      .map((x) => x.id);
    if (notificationsOnlyUnread?.length)
      Fetch.put("/notification/many", notificationsOnlyUnread).then(
        (response) => { }
      );
  };

  const updateResolvedStatus = (justify = null) => {
    if (listToResolve?.length) {
      setIsLoading(true);
      const justifyToSave = {
        ids: listToResolve,
        justify
      }
      Fetch.put("/notification/resolve/many", justifyToSave)
        .then((response) => {
          setIsLoading(false);
          onPageChanged({
            currentPage: searchParms.get("page") || 1,
            pageLimit: searchParms.get("size") || 5,
          });
          setListResolve([])
        })
        .catch((e) => {
          setIsLoading(false);
        });
    }
  };

  const onViewAll = () => {
    setIsLoading(true);
    Fetch.put("/notification/view/all")
      .then((response) => {
        setIsLoading(false);
        toast.success(intl.formatMessage({ id: "save.successfull" }));
        onPageChanged({
          currentPage: searchParms.get("page") || 1,
          pageLimit: searchParms.get("size") || 5,
        });
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  return (
    <>
      <Row>
        <Col breakPoint={{ xs: 12, md: 12 }}>
          <Card>
            <CardHeader>
              <Row between className="pr-4 pl-4">
                <FormattedMessage id="notifications" />
                {isShowSolutionRef.current &&
                  <Row className="m-0">
                    <Button
                      size="Tiny"
                      status="Danger"
                      appearance="ghost"
                      className="flex-between"
                      onClick={() => onCancel()}
                    >
                      <EvaIcon name="close-outline" className="mr-1" />
                      <FormattedMessage id="cancel" />
                    </Button>
                    <Button
                      size="Tiny"
                      status="Info"
                      appearance="ghost"
                      className="ml-4 flex-between"
                      disabled={data?.data?.every((x) => !!x.resolvedAt)}
                      onClick={markAll}
                    >
                      <EvaIcon name="done-all-outline" className="mr-1" />
                      <FormattedMessage id="mark.all" />
                    </Button>
                    <Button
                      size="Tiny"
                      status="Success"
                      className="ml-4 flex-between"
                      disabled={!listToResolve.length}
                      onClick={() => updateResolvedStatus()}
                    >
                      <EvaIcon name="save-outline" className="mr-1" />
                      <FormattedMessage id="save" />
                    </Button>
                  </Row>
                }
              </Row>
            </CardHeader>
            <ListPaginatedNotifications
              data={data?.data}
              totalItems={data?.pageInfo[0]?.count}
              renderItem={renderItem}
              onPageChanged={onPageChanged}
              contentStyle={{
                justifyContent: "space-between",
                padding: 0,
              }}
              renderFooter={() => (
                <Button
                  size="Tiny"
                  status="Basic"
                  appearance="ghost"
                  className="flex-between"
                  onClick={onViewAll}
                >
                  <EvaIcon name="eye-outline" className="mr-1" />
                  <FormattedMessage id="view.all" />
                </Button>
              )}
            >
              <Row className="m-0 mb-4">
                <Col breakPoint={{ xs: 2 }} className="pl-4">
                  <TextSpan apparence="label" className="ml-4 pl-4" hint>
                    <FormattedMessage id="scale.level" />
                  </TextSpan>
                </Col>
                <Col breakPoint={{ xs: 4 }}>
                  <TextSpan apparence="label" hint>
                    <FormattedMessage id="message" />
                  </TextSpan>
                </Col>
                <Col breakPoint={{ xs: 2 }}>
                  <TextSpan apparence="label" hint>
                    <FormattedMessage id="datetime" /> (GMT{Number(moment().format("Z").split(":")[0])})
                  </TextSpan>
                </Col>
              </Row>
            </ListPaginatedNotifications>
          </Card>
        </Col>
      </Row>
      <JustifyModal
        isShow={!!itemSelected}
        handleClose={() => setItemSelected(null)}
        handleSave={handleSaveJustify}
      />
      <SpinnerFull isLoading={isLoading} />
    </>
  );
};

const mapStateToProps = (state) => ({
  listNew: state.notification.listNew,
  enterprises: state.enterpriseFilter.enterprises,
});

export default connect(mapStateToProps, undefined)(ListMyNotifications);
