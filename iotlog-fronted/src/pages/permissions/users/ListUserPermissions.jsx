import { Badge, ContextMenu } from "@paljs/ui";
import { Button } from "@paljs/ui/Button";
import { Card, CardHeader } from "@paljs/ui/Card";
import Col from "@paljs/ui/Col";
import { EvaIcon } from "@paljs/ui/Icon";
import Row from "@paljs/ui/Row";
import { useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { connect } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import styled, { useTheme } from "styled-components";
import {
  ColCenter,
  Fetch,
  ItemRow,
  ListPaginated,
  SpinnerFull,
  TextSpan,
  UserImage,
} from "../../../components";
import FilterRoles from "../roles/FilterRoles";

const ContainerRow = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

const getEnterprise = (enterprises) => {
  return enterprises?.length ? enterprises[0]?.id : "";
};

const ListUsersPermissions = (props) => {
  const intl = useIntl();
  const theme = useTheme();
  const navigate = useNavigate();

  const [showFilter, setShowFilter] = useState(false);
  const [isFiltered, setIsFiltered] = useState(false);
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState();
  const [filterData, setFilterData] = useState({
    filteredRole: [],
    filteredType: [],
  });
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (props.isReady) {

      onPageChanged({
        currentPage: grabCurrentPageByUrl(),
        pageLimit: getCurrenteSize(),
        filteredRole: [],
        filteredType: [],
        idEnterpriseFilter: getEnterprise(props.enterprises),
      });
    }
  }, [props.isReady, props.enterprises]);

  function grabCurrentPageByUrl() {
    return Number(searchParams.get("page") || "1");
  }

  function getCurrenteSize() {
    return Number(searchParams.get("size") || "5");
  }

  function grabCurrentSearchParam() {
    return searchParams.get("search") || "";
  }

  const onPageChanged = ({
    currentPage,
    pageLimit,
    text = "",
    filteredRole = [],
    filteredType = [],
    idEnterpriseFilter = "",
  }) => {
    if (!currentPage) return;

    const searchQueryParam = grabCurrentSearchParam();

    let queryParams = [`page=${currentPage - 1}`, `size=${pageLimit}`];

    if (text || searchQueryParam) {
      queryParams.push(`search=${text || searchQueryParam}`);
    }
    if (idEnterpriseFilter) {
      queryParams.push(`idEnterprise=${idEnterpriseFilter}`);
    }

    if (filteredRole?.length) {
      queryParams = [
        ...queryParams,
        ...filteredRole.map((x, i) => `idRole[]=${x}`),
      ];
    }

    if (filteredType?.length) {
      queryParams = [
        ...queryParams,
        ...filteredType.map((x, i) => `idTypeUser[]=${x}`),
      ];
    }

    setIsLoading(true);
    Fetch.get(`/user/enterprise/list?${queryParams?.join("&")}`)
      .then((response) => {
        setData(response.data);
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const onChange = (prop, value) => {
    setFilterData((prevstate) => ({
      ...prevstate,
      [prop]: value,
    }));
  };

  const onClearFilter = () => {
    onPageChanged({
      currentPage: 1,
      pageLimit: 5,
      filteredRole: [],
      filteredType: [],
      idEnterpriseFilter: getEnterprise(props.enterprises),
    });
    setFilterData({
      filteredRole: [],
      filteredType: [],
    });
    setShowFilter(false);
    setIsFiltered(false);
  };

  const onFilter = () => {
    onPageChanged({
      currentPage: 1,
      pageLimit: 5,
      filteredRole: filterData.filteredRole,
      filteredType: filterData.filteredType,
      idEnterpriseFilter: getEnterprise(props.enterprises),
    });
    setIsFiltered(true);
    setShowFilter(false);
  };
  const hasEditPermissions = props.items?.some((x) => x === "/permission-user");
  const hasPermissionUserAdd = props.items?.some((x) => x === "/add-user");
  const hasPermissionUserEdit = props.items?.some((x) => x === "/edit-user");

  const renderItem = ({ item, index }) => {
    const itemsMenu = [];

    const isDisabled = !!item.disabledAt;

    if (hasEditPermissions && item.userEnterprise?.length === 1) {
      itemsMenu.push({
        icon: "shield-outline",
        title: intl.formatMessage({ id: "permissions" }),
        link: { to: `/permission-user?id=${item.userEnterprise[0].id}` },
      });
    } else if (hasEditPermissions) {
      itemsMenu.push({
        icon: "shield-outline",
        title: intl.formatMessage({ id: "permissions" }),
        link: { to: `/list-user-enterprises?id=${item.id}` },
      });
    }

    if (hasPermissionUserEdit) {
      itemsMenu.push({
        icon: "edit-outline",
        title: intl.formatMessage({ id: "edit" }),
        link: { to: `/edit-user?id=${item.id}` },
      });
    }

    if (hasPermissionUserEdit && !item.isOnlyContact) {
      itemsMenu.push({
        icon: "lock-outline",
        title: intl.formatMessage({ id: "new.password" }),
        link: { to: `/update-password-user?id=${item.id}` },
      });
    }

    return (
      <>
        <ItemRow
          colorTextTheme={"colorWarning600"}
          style={{
            flexWrap: "wrap",
            backgroundColor: isDisabled && theme.backgroundBasicColor2,
          }}
        >
          <Col breakPoint={{ md: 5, sm: 4, is: 12 }}>
            <UserImage
              size="Large"
              image={item?.image?.url}
              title={item?.email}
              name={item?.name}
              isDisabled={isDisabled}
            />
          </Col>
          <ColCenter breakPoint={{ md: 3, sm: 3, is: 12, xs: 12 }}>
            <ContainerRow>
              {item?.types?.map((x, i) => (
                <>
                  <Badge
                    key={i}
                    position=""
                    status={isDisabled ? "Basic" : "Info"}
                    className="mr-2 mb-2"
                    style={
                      isDisabled
                        ? { position: "relative", color: theme.textHintColor }
                        : { position: "relative", backgroundColor: x.color }
                    }
                  >
                    {x.description}
                  </Badge>
                </>
              ))}
            </ContainerRow>
          </ColCenter>
          <ColCenter breakPoint={{ md: 3, sm: 3, is: 12, xs: 12 }}>
            <Row className="row-flex-center">
              <EvaIcon
                name={
                  isDisabled
                    ? "person-remove-outline"
                    : item.isOnlyContact
                    ? "person-remove-outline"
                    : "person-outline"
                }
                status={
                  isDisabled
                    ? "Basic"
                    : item.isOnlyContact
                    ? "Warning"
                    : "Success"
                }
                className="mt-1 mr-1"
                options={{ height: 18, width: 16 }}
              />
              <TextSpan
                style={{ marginTop: 2 }}
                apparence="s3"
                hint={isDisabled}
              >
                <FormattedMessage
                  id={
                    isDisabled
                      ? "user.disabled"
                      : item.isOnlyContact
                      ? "just.contact"
                      : "user.system"
                  }
                />
              </TextSpan>
            </Row>
          </ColCenter>
          <ColCenter
            breakPoint={{ md: 1, sm: 2, is: 3, xs: 3 }}
            className="col-center-middle"
          >
            {!!itemsMenu?.length && (
              <ContextMenu
                className="inline-block mr-1 text-start"
                placement="left"
                items={itemsMenu}
                Link={Link}
              >
                <Button size="Tiny" status="Success">
                  <EvaIcon name="more-vertical" />
                </Button>
              </ContextMenu>
            )}
          </ColCenter>
        </ItemRow>
      </>
    );
  };

  return (
    <>
      <Card>
        <CardHeader>
          <Col>
            <Row between>
              <FormattedMessage id="users.permissions" />
              <Row end="xs" middle="xs" style={{ display: "flex" }}>
                <Button
                  size="Tiny"
                  status={isFiltered ? "Info" : "Basic"}
                  className="flex-between mr-4"
                  onClick={() => setShowFilter((prevState) => !prevState)}
                >
                  <EvaIcon
                    name={isFiltered ? "funnel" : "funnel-outline"}
                    className="mr-1"
                  />
                  <FormattedMessage id="filter" />
                </Button>

                {hasPermissionUserAdd && (
                  <Button
                    size="Tiny"
                    status="Success"
                    className="flex-between mr-4"
                    onClick={() => navigate(`/add-user`)}
                  >
                    <EvaIcon name="person-add-outline" className="mr-1" />
                    <FormattedMessage id="add.user" />
                  </Button>
                )}
                {hasEditPermissions && (
                  <Button
                    size="Tiny"
                    status="Primary"
                    className="flex-between mr-3"
                    onClick={() => navigate(`/permission-user`)}
                  >
                    <EvaIcon name="shield-outline" className="mr-1" />
                    <FormattedMessage id="new.permission" />
                  </Button>
                )}
              </Row>
            </Row>
          </Col>
        </CardHeader>
        <ListPaginated
          data={data?.data}
          totalItems={data?.pageInfo[0]?.count}
          renderItem={renderItem}
          onPageChanged={(pageInfo) =>
            onPageChanged({
              ...pageInfo,
              filteredRole: filterData?.filteredRole,
              filteredType: filterData?.filteredType,
              idEnterpriseFilter: getEnterprise(props.enterprises),
            })
          }
          contentStyle={{
            justifyContent: "space-between",
            padding: 0,
          }}
          disableInput={isLoading}
        />
        {showFilter && (
          <FilterRoles
            key={"filter_statistics"}
            onClose={() => setShowFilter(false)}
            show={showFilter}
            onFilter={onFilter}
            breakPointItens={{ md: 3 }}
            onChange={onChange}
            onClearFilter={() => onClearFilter()}
            filterData={filterData}
          />
        )}
        <SpinnerFull isLoading={isLoading} />
      </Card>
    </>
  );
};

const mapStateToProps = (state) => ({
  items: state.menu.items,
  enterprises: state.enterpriseFilter.enterprises,
  isReady: state.enterpriseFilter.isReady,
});

export default connect(mapStateToProps, undefined)(ListUsersPermissions);
