import { Button, CardFooter, Checkbox, Col, EvaIcon, Row } from "@paljs/ui";
import React from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import styled from "styled-components";
import { Fetch, LabelIcon, Modal, TextSpan } from "../../../components";
import { SkeletonThemed } from "../../../components/Skeleton";

const ContentScrolled = styled.div`
  width: 100%;
  height: calc(50vh - 5px);
`;

const FilterRoles = (props) => {
  const { filterData, onChange } = props;
  const [isFetching, setIsFetching] = React.useState(false);
  const [listRole, setListRoles] = React.useState([]);
  const [listTypes, setListTypes] = React.useState([]);

  React.useLayoutEffect(() => {
    if (props.isReady) {
      getRole(props.enterprises?.length ? props.enterprises[0].id : "");
    }
  }, [props.isReady, props.enterprises]);

  const getRole = async (idEnterprise) => {
    setIsFetching(true);

    try {
      const responseRoles = await Fetch.get("/role/list/all");
      if (responseRoles.data?.length) {
        setListRoles(responseRoles.data ?? []);
      }
    } catch {
      setIsFetching(false);
      return;
    }

    try {
      const responseTypes = await Fetch.get(
        `/typeuser/list/all${
          idEnterprise ? `?idEnterprise=${idEnterprise}` : ""
        }`
      );
      if (responseTypes.data?.length) {
        setListTypes(responseTypes.data ?? []);
      }
    } catch {}
    setIsFetching(false);
  };

  const onChangeItem = (id) => {
    const toUpdate = filterData?.filteredRole?.some((x) => x === id)
      ? filterData?.filteredRole.filter((x) => x !== id)
      : [...(filterData?.filteredRole || []), id];
    onChange("filteredRole", toUpdate);
  };

  const onChangeItemUserType = (id) => {
    const toUpdate = filterData?.filteredType?.some((x) => x === id)
      ? filterData?.filteredType.filter((x) => x !== id)
      : [...(filterData?.filteredType || []), id];
    onChange("filteredType", toUpdate);
  };

  const onSearch = () => {
    props.onFilter({
      filteredRole: filterData?.filteredRole,
    });
  };

  const onClearSearch = () => {
    props.onClearFilter();
  };

  const isFiltered = !!filterData?.filteredRole?.length || !!filterData?.filteredType?.length;

  return (
    <>
      <Modal
        title="filter"
        onClose={props.onClose}
        show={props.show}
        styleContent={{ maxHeight: "calc(50vh - 10px)" }}
        size="Medium"
        renderFooter={() => (
          <CardFooter>
            <Row end={!isFiltered && true} between={isFiltered && true}>
              {isFiltered && (
                <Button
                  size="Small"
                  status="Danger"
                  appearance="ghost"
                  onClick={onClearSearch}
                  style={{ lineHeight: 0.6 }}
                  disabled={isFetching}
                  className="mr-3 flex-between"
                >
                  <EvaIcon name="close-circle" className="mr-1" />
                  <FormattedMessage id="clear.filter" />
                </Button>
              )}
              <Button
                size="Small"
                status="Success"
                onClick={onSearch}
                style={{ lineHeight: 0.6 }}
                disabled={isFetching}
                className="mr-1 flex-between"
              >
                <EvaIcon name="funnel" className="mr-1" />
                <FormattedMessage id="filter" />
              </Button>
            </Row>
          </CardFooter>
        )}
      >
        <ContentScrolled>
          <LabelIcon
            iconName="funnel-outline"
            title={<FormattedMessage id="filter.by.role" />}
          />
          <Row className="mb-4 mr-4">
            {isFetching ? (
              <div className="ml-4" style={{ width: "100%" }}>
                <Row>
                  <Col breakPoint={{ md: 6 }} className="mb-4">
                    <SkeletonThemed width={"100%"} />
                  </Col>
                  <Col breakPoint={{ md: 6 }} className="mb-4">
                    <SkeletonThemed width={"100%"} />
                  </Col>
                  <Col breakPoint={{ md: 6 }} className="mb-4">
                    <SkeletonThemed width={"100%"} />
                  </Col>
                  <Col breakPoint={{ md: 6 }} className="mb-4">
                    <SkeletonThemed width={"100%"} />
                  </Col>
                </Row>
              </div>
            ) : (
              <>
                {listRole?.map((role) => (
                  <Col
                    breakPoint={{ md: 6, sm: 6, is: 6, xs: 9 }}
                    className="mt-3"
                    key={role.id}
                  >
                    <Checkbox
                      checked={filterData?.filteredRole.some(
                        (x) => x === role.id
                      )}
                      onChange={(e) => onChangeItem(role.id)}
                    >
                      <TextSpan apparence="s2" style={{ lineHeight: "1.1rem" }}>
                        {role.description}
                      </TextSpan>
                    </Checkbox>
                  </Col>
                ))}
              </>
            )}
          </Row>
          <LabelIcon
            iconName="funnel-outline"
            title={<FormattedMessage id="filter.by.type" />}
          />
          <Row className="mb-4 mr-4">
            {isFetching ? (
              <div className="ml-4" style={{ width: "100%" }}>
                <Row>
                  <Col breakPoint={{ md: 6 }} className="mb-4">
                    <SkeletonThemed width={"100%"} />
                  </Col>
                  <Col breakPoint={{ md: 6 }} className="mb-4">
                    <SkeletonThemed width={"100%"} />
                  </Col>
                  <Col breakPoint={{ md: 6 }} className="mb-4">
                    <SkeletonThemed width={"100%"} />
                  </Col>
                  <Col breakPoint={{ md: 6 }} className="mb-4">
                    <SkeletonThemed width={"100%"} />
                  </Col>
                </Row>
              </div>
            ) : (
              <>
                {listTypes?.map((typeUser) => (
                  <Col
                    breakPoint={{ md: 6, sm: 6, is: 6, xs: 9 }}
                    className="mt-3"
                    key={typeUser.id}
                  >
                    <Checkbox
                      checked={filterData?.filteredType.some(
                        (x) => x === typeUser.id
                      )}
                      onChange={(e) => onChangeItemUserType(typeUser.id)}
                    >
                      <TextSpan apparence="s2" style={{ lineHeight: "1.1rem" }}>
                        {typeUser.description}
                      </TextSpan>
                    </Checkbox>
                  </Col>
                ))}
              </>
            )}
          </Row>
        </ContentScrolled>
      </Modal>
    </>
  );
};

const mapStateToProps = (state) => ({
  enterprises: state.enterpriseFilter.enterprises,
  isReady: state.enterpriseFilter.isReady,
});

export default connect(mapStateToProps, undefined)(FilterRoles);
