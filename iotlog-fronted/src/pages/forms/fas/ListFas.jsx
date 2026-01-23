// import React from "react";
// import Col from "@paljs/ui/Col";
// import Row from "@paljs/ui/Row";
// import { Card, CardHeader } from "@paljs/ui/Card";
// import Spinner from "@paljs/ui/Spinner";
// import { FormattedMessage } from "react-intl";
// import { Button } from "@paljs/ui/Button";
// import { connect } from "react-redux";
// import { EvaIcon } from "@paljs/ui/Icon";
// import styled, { css, useTheme } from "styled-components";
// import { Link, useNavigate } from "react-router-dom";
// import ContextMenu from "@paljs/ui/ContextMenu";
// import { nanoid } from "nanoid";
// import moment from "moment";
// import {
//   ListAdvancedSearchPaginated,
//   ColCenter,
//   TextSpan,
//   Fetch
// } from "../../../components";
// import StatusFas from "./StatusFas";

// const ItemRow = styled.div`
//   ${({ colorTextTheme, theme }) => css`
//     border-left: 6px solid ${theme[colorTextTheme]};
//     padding: 1rem;
//     display: flex;
//     flex-direction: row;
//     width: 100%;
//     cursor: pointer;
//     transition: background-color 0.3s ease, color 0.3s ease;

//     &:hover {
//       background-color: ${theme.backgroundBasicColor2};
//       color: ${theme.colorPrimary500};
//     }
//   `}
// `;

// const ListFasForm = (props) => {
//   const theme = useTheme();
//   const navigate = useNavigate();

//   const [isExporting, setIsExporting] = React.useState(false);
//   const [isFilterAdvanced, setIsFilterAdvanced] = React.useState(false);
//   const clickShow = (item,) => {
//     navigate(`/filled-fas?id=${item.id}&t=${item.description}`)
//   };

//   const exportFas = () => {
//     setIsExporting(true);
//     Fetch.get("/fas/export-fas-csv")
//       .then((response) => {
//         if (response.data?.exportedFileUrl) {
//           window.open(response.data.exportedFileUrl)
//         }
//       })
//       .finally(() => {
//         setIsExporting(false);
//       })
//   }

//   const renderItem = ({ item, index }) => {

//     let itemsMenu = [];
//     const hasPermissionEdit = props.items?.some((x) => x === "/fill-form-board");
//     //const hasPermissionAdd = props.items?.some((x) => x === "/fas-create-order")

//     return (
//       <>
//         <ItemRow
//           key={nanoid(4)}
//           onClick={() => clickShow(item)}
//           colorTextTheme={"colorPrimary500"}
//           style={{ paddingTop: 27, paddingBottom: 27 }}>
//           <Col
//             breakPoint={{ md: 1 }}
//             style={{
//               display: "flex",
//               justifyContent: "center",
//               alignItems: "center",
//             }}
//           >
//             <EvaIcon
//               name={"file-outline"}
//               options={{
//                 fill: theme.colorPrimary500,
//                 width: 25,
//                 height: 25,
//                 animation: { type: "pulse", infinite: false, hover: true },
//               }}
//             />
//           </Col>
//           <ColCenter breakPoint={{ md: 5 }}>

//             <TextSpan apparence="s2">
//               {item.vessel?.name} / {item.type} /  {item.serviceDate ? moment(item.serviceDate).format("DD MMM YYYY") : "-"}
//             </TextSpan>

//           </ColCenter>
//           <ColCenter breakPoint={{ md: 5 }}>
//             <TextSpan apparence="s2">
//               {item?.orders?.map((x, i) => (
//                 <div className="mb-1">
//                   <StatusFas
//                     styleText={{ fontSize: '0.6rem' }}
//                     key={i} status={x.state} />
//                 </div>
//               ))}
//             </TextSpan>
//           </ColCenter>
//           <ColCenter
//             breakPoint={{ md: 1, xs: 12 }}
//             className="mt-2 mb-2 col-center-middle"
//           >
//             {!!itemsMenu?.length && (
//               <ContextMenu
//                 className="inline-block mr-1 text-start"
//                 placement="left"
//                 items={itemsMenu}
//                 Link={Link}
//               >
//                 <Button size="Tiny" status="Basic">
//                   <EvaIcon name="more-vertical" />
//                 </Button>
//               </ContextMenu>
//             )}
//           </ColCenter>
//         </ItemRow>
//       </>
//     );
//   };

//   return (
//     <>
//       <Row>
//         <Col breakPoint={{ xs: 12, md: 12 }}>
//           <Card>
//             <CardHeader className="flex-between">
//               <FormattedMessage id="service.management" />
//               <Row key={nanoid(4)}>
//                 {props.items.includes('/fas-add-qsms') &&
//                   <>
//                     {isExporting
//                       ? <div style={{ position: "relative", height: 30, width: 50 }}>
//                         <Spinner style={{ backgroundColor: "transparent" }} />
//                       </div>
//                       : <Button size="Tiny"
//                         appearance="ghost"
//                         disabled={isExporting}
//                         status="Basic"
//                         className="flex-between mr-4"
//                         onClick={() => exportFas()}>
//                         <EvaIcon className="mr-1" name="download-outline" />
//                         <FormattedMessage id="export" />
//                       </Button>}
//                   </>}
//                 <Button
//                   size="Tiny"
//                   appearance={isFilterAdvanced ? "ghost" : "filled"}
//                   className="flex-between mr-4"
//                   status={isFilterAdvanced ? "Danger" : "Basic"}
//                   onClick={() => setIsFilterAdvanced((prevState) => !prevState)}
//                 >
//                   <EvaIcon
//                     className="mr-1"
//                     name={isFilterAdvanced ? "close-outline" : "funnel"}
//                   />
//                   <FormattedMessage
//                     id={isFilterAdvanced ? "filter.close" : "filter"}
//                   />
//                 </Button>
//                 <Button size="Tiny" className="flex-between mr-2" onClick={() => navigate(`/new-fas`)}>
//                   <EvaIcon className="mr-1" name="file-add-outline" />
//                   Nova FAS
//                 </Button>

//               </Row>
//             </CardHeader>
//             <ListAdvancedSearchPaginated
//               renderItem={renderItem}
//               contentStyle={{
//                 justifyContent: "space-between",
//                 padding: 0,
//               }}
//               pathUrlSearh="/fas/list/filter-os"
//               filterEnterprise
//               isFilterAdvanced={isFilterAdvanced}
//             />
//           </Card>
//         </Col>
//       </Row>
//     </>
//   );
// };

// const mapStateToProps = (state) => ({
//   items: state.menu.items,
//   enterprises: state.enterpriseFilter.enterprises,
// });

// export default connect(mapStateToProps, undefined)(ListFasForm);
