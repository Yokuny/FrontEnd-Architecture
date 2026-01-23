import * as React from "react";
import styled, { css, useTheme } from "styled-components";
import { EvaIcon } from "@paljs/ui/Icon";
import { Button } from "@paljs/ui/Button";
import Col from "@paljs/ui/Col";
import Row from "@paljs/ui/Row";
import { nanoid } from "nanoid";
import { Card, CardHeader } from "@paljs/ui/Card"
import {
  SpinnerFull,
  ListPaginated,
  TextSpan,
  Fetch,
} from "../../../components";
import SupplierContacts from "../../../components/Fas/SupplierContacts"
import { FormattedMessage, useIntl } from "react-intl";

const ItemRow = styled.div`
  ${({ colorTextTheme, theme }) => css`
    border-left: 6px solid ${theme[colorTextTheme]};
    padding: 1rem;
    display: flex;
    flex-direction: row;
    width: 100%;
    cursor: pointer;
    transition: background-color 0.3s ease, color 0.3s ease;

    &:hover {
      background-color: ${theme.backgroundBasicColor2};
      color: ${theme.colorPrimary500};
    }
  `}
`;

const Suppliers = () => {
  const theme = useTheme();
  const [data, setData] = React.useState();
  const [suppliersList, setSuppliersList] = React.useState();
  const [showSupplierModal, setShowSupplierModal] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState();
  const [selectedSupplier, setSelectedSupplier] = React.useState();
  const [pageQuery, setPageQuery] = React.useState({
    page: 0,
    size: 5
  });

  const intl = useIntl();

  React.useEffect(() => {
    getData();
  }, [])

  const renderItem = ({ item, index }) => {
    return (
      <>
        <ItemRow
          key={nanoid(4)}
          colorTextTheme={"colorInfo400"}
          style={{ paddingTop: 25, paddingBottom: 25 }}>
          <Col
            breakPoint={{ md: 1, xs: 1 }}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <EvaIcon
              name={"people-outline"}
              options={{
                fill: theme.colorInfo400,
                width: 23,
                height: 23,
              }}
            />
          </Col>
          <Col
            style={{
              display: "flex",
              justifyContent: "start",
              alignItems: "center",
            }}
            breakPoint={{ md: 4, xs: 4 }}>
            <TextSpan apparence="s2">
              {item?.razao || "N/A"}
            </TextSpan>
          </Col>
          <Col
            style={{
              display: "flex",
              justifyContent: "end",
              alignItems: "center",
            }}
            breakPoint={{ md: 7, xs: 7 }}>
            <Row between="xs" style={{ width: "100%" }}>
              <Col style={{
                display: "flex",
                justifyContent: "end",
                alignItems: "center",
              }}
                breakPoint={{ md: 10, xs: 10 }}>
                <TextSpan style={{ textAlign: "end" }} apparence="p2" hint>
                  {item?.contacts?.map(contact => (
                    <div>
                      {contact?.email || "N/A"} {contact?.role ? `(${contact?.role === "admin" ? "Admin" : intl.formatMessage({ id: "default" })})`: ''}
                    </div>
                  ))}
                </TextSpan>
              </Col>
              <Col style={
                {
                  display: "flex",
                  justifyContent: "end",
                  alignItems: "center",
                }}
                breakPoint={{ md: 2, xs: 2 }}>
                <Button
                  onClick={() => showSupplierContacts(item, index)}
                  size="Tiny"
                  status="Basic"
                  className="align-items-center"
                >
                  <EvaIcon
                    name={"edit-outline"} />
                </Button>
              </Col>
            </Row >
          </Col >

        </ItemRow >
      </>
    );
  };

  const showSupplierContacts = (item, index) => {
    setSelectedSupplier(item);
    setShowSupplierModal(true);
  }
  const onPageChanged = ({
    currentPage,
    pageLimit,
    text = "",
  }) => {
    if (!currentPage) return;
    setPageQuery({
      text: text,
      page: currentPage - 1,
      size: pageLimit
    });
    getData({
      text: text,
      page: currentPage - 1,
      size: pageLimit
    });
  }

  const onCloseSupplierModal = () => {
    getData();
    setShowSupplierModal(false);
    setSelectedSupplier(null);
  }

  const onCheckSupplier = () => {
    getData()
  }

  const getSuppliersFromData = (data) => {
    const mappedSuppliers = data.data.map(
      (supplierObject) => {
        return {
          razao: supplierObject.razao,
          contacts: supplierObject.contacts,
          supplierConfig: supplierObject.supplierConfig,
          codigoFornecedor: supplierObject.codigoFornecedor,
        }
      })
    return mappedSuppliers;
  }

  const getData = (pageQueryUpdated = {
    text: pageQuery.text,
    page: pageQuery.page,
    size: pageQuery.size
  }) => {
    setIsLoading(true);
    let urlQuery = `size=${pageQueryUpdated.size}&page=${pageQueryUpdated.page}`;
    if (pageQueryUpdated.text)
      urlQuery += `&text=${pageQueryUpdated.text}`
    Fetch.get(`fas/list-suppliers?${urlQuery}`)
      .then(response => {
        setData(response.data ? response.data : []);

        const suppliersList = getSuppliersFromData(response.data)
        setSuppliersList(suppliersList);

        if (selectedSupplier?.contacts) {
          const newSelectedSupplier = suppliersList.find(sup => selectedSupplier?.razao === sup.razao)
          setSelectedSupplier(newSelectedSupplier)
        }

        setIsLoading(false);
      })
      .catch(e => {
        setIsLoading(false);
      })
  }

  return (
    <Row>
      <Col breakPoint={{ xs: 12, md: 12 }}>
        <Card>
          <CardHeader>
            <Row between="xs" middle="xs" className="m-0" style={{ flexWrap: `nowrap` }}>
              <TextSpan apparence="s1" style={{ width: `100%` }}>
                <FormattedMessage id="fas.contacts" />
              </TextSpan>
            </Row>
          </CardHeader>
          <ListPaginated
            data={suppliersList}
            totalItems={data?.pageInfo[0]?.count}
            renderItem={renderItem}
            onPageChanged={onPageChanged}
            contentStyle={{
              justifyContent: "space-between",
              padding: 0,
            }}
            pathUrlSearh="/fas/list-supplier"
          />

        </Card>
        <SpinnerFull isLoading={isLoading} />
        <SupplierContacts
          data={selectedSupplier}
          show={showSupplierModal}
          onSetAdmin={onCheckSupplier}
          onClose={onCloseSupplierModal} />
      </Col>
    </Row>

  )
}

export default Suppliers;
