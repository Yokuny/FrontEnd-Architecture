// import { Badge, Button, Col, EvaIcon, Row } from "@paljs/ui";
// import moment from "moment";
// import React from "react";
// import { FormattedMessage } from "react-intl";
// import styled, { css } from "styled-components";
// import Skeleton from "react-loading-skeleton";
// import { Ocean, Tacometer } from "../../../../components/Icons";
// import { Fetch, LabelIcon, TextSpan } from "../../../../components";
// import Proximity from "../../Proximity";
// import { getStatusIcon } from "../../Status/Base";
// import { useFormatDecimal } from "../../../../components/Formatter";
// import { DateDiff } from "../../../../components/Date/DateDiff";

// import "./../../Map/Markers/style.css";

// const ContainerCardInfo = styled.div`
//   ${({ theme }) => css`
//     background-color: ${theme.backgroundBasicColor1};
//     color: ${theme.textBasicColor};
//     border-radius: 4px;
//   `}
// `;

// const PopUpDetailsWind = (props) => {
//   const { machineDetails, theme, intl, position } = props;
//   const { format } = useFormatDecimal();

//   const [details, setDetails] = React.useState();
//   const [isLoading, setIsLoading] = React.useState();

//   React.useLayoutEffect(() => {
//     getDetails();
//   }, []);

//   const getDetails = () => {
//     setIsLoading(true);
//     Fetch.get(`/travel/machine?idMachine=${machineDetails?.machine?.id}`)
//       .then((response) => {
//         setDetails(response.data);
//         setIsLoading(false);
//       })
//       .catch((e) => {
//         setIsLoading(false);
//       });
//   };

//   const getPortCodeName = (port) => {
//     return `${port?.code} - ${port?.description}`;
//   };

//   const getDestinyPreference = (detailsInternal) => {
//     const dataEta =
//       detailsInternal?.travel?.metadata?.eta || detailsInternal?.data?.eta;
//     if (!dataEta || moment(dataEta).isBefore(moment())) return "-";

//     if (detailsInternal?.travel?.portPointDestiny) {
//       return getPortCodeName(detailsInternal?.travel?.portPointDestiny);
//     }

//     if (detailsInternal?.travel?.portPointEnd) {
//       return getPortCodeName(detailsInternal?.travel?.portPointEnd);
//     }

//     if (detailsInternal?.data?.destiny) return detailsInternal?.data?.destiny;

//     return "-";
//   };

//   const getEta = (detailsInternal) => {
//     const dataEta =
//       detailsInternal?.travel?.metadata?.eta || detailsInternal?.data?.eta;
//     if (!dataEta || moment(dataEta).isBefore(moment())) return "-";

//     if (detailsInternal?.travel?.portPointDestiny) {
//       return (
//         <>
//           {moment(dataEta).format("DD MMM")} {moment(dataEta).format("HH:mm")}
//           {" - "}
//           <TextSpan apparence="s1">
//             {detailsInternal?.travel?.portPointDestiny?.code}
//           </TextSpan>
//         </>
//       );
//     }

//     if (detailsInternal?.travel?.portPointEnd) {
//       return (
//         <>
//           {moment(dataEta).format("DD MMM")} {moment(dataEta).format("HH:mm")}
//           {" - "}
//           <TextSpan apparence="s1">
//             {detailsInternal?.travel?.portPointEnd?.code}
//           </TextSpan>
//         </>
//       );
//     }

//     return `${moment(dataEta).format("DD MMM")} ${moment(dataEta).format(
//       "HH:mm"
//     )}`;
//   };

//   const getDeparture = (detailsInternal) => {
//     if (!detailsInternal?.travel?.dateTimeStart) {
//       return " - ";
//     }

//     return (
//       <>
//         {moment(detailsInternal?.travel?.dateTimeStart).format("DD MMM HH:mm")}
//         {" - "}
//         <TextSpan apparence="s1">
//           {detailsInternal?.travel?.portPointStart?.code}
//         </TextSpan>
//       </>
//     );
//   };

//   const statusToShow = getStatusIcon(details?.data?.status, theme);

//   return (
//     <>
//       <ContainerCardInfo className="pt-2 pb-4 col-flex card-shadow">
//         <div className="pl-2 pr-2">
//           <TextSpan apparence="s1">
//             {machineDetails?.machine?.code
//               ? `${machineDetails?.machine?.code} - `
//               : ""}
//             {machineDetails?.machine?.name}
//           </TextSpan>
//           <Row between style={{ margin: 0 }} className="pt-1">
//             {/* <TextSpan apparence="s3">
//               {machineDetails?.machine?.code ?? "-"}
//             </TextSpan> */}

//             {statusToShow?.bgColor && (
//               <Badge
//                 position=""
//                 style={{
//                   position: "inherit",
//                   backgroundColor: statusToShow.bgColor,
//                 }}
//               >
//                 <div
//                   style={{
//                     display: "flex",
//                     flexDirection: "row",
//                     alignItems: "center",
//                   }}
//                 >
//                   {statusToShow.component}
//                 </div>
//               </Badge>
//             )}

//             <TextSpan apparence="c1">
//               {machineDetails?.modelMachine?.description}
//             </TextSpan>
//           </Row>
//         </div>
//         <div className="mt-2">
//           {machineDetails?.machine?.image?.url ? (
//             <img
//               src={machineDetails?.machine?.image?.url}
//               alt={machineDetails?.machine?.name}
//               style={{
//                 objectFit: "cover",
//               }}
//               width={"100%"}
//               height={160}
//             />
//           ) : (
//             <div
//               style={{
//                 width: "100%",
//                 height: 160,
//                 backgroundColor: theme.borderBasicColor5,
//               }}
//             ></div>
//           )}

//           <div style={{ position: "fixed", top: 171 }}>
//             <div style={{ display: "flex", flexDirection: "row" }}>
//               {details?.data?.speed !== undefined && (
//                 <Col className="col-flex-center">
//                   <Tacometer
//                     style={{
//                       height: 20,
//                       width: 25,
//                       fill: "#fff",
//                       color: "#fff",
//                       marginBottom: -2,
//                     }}
//                   />
//                   <TextSpan
//                     apparence="s2"
//                     className="mt-3"
//                     style={{
//                       color: "#fff",
//                       lineHeight: "8px",
//                       whiteSpace: "nowrap",
//                     }}
//                   >
//                     {`${format(details?.data?.speed, 1)} ${
//                       details?.data?.unitySpeed ??
//                       intl.formatMessage({
//                         id: "kn",
//                       })
//                     }`}
//                   </TextSpan>
//                 </Col>
//               )}

//               {details?.data?.draught !== undefined && (
//                 <Col className="col-flex-center">
//                   <Ocean
//                     style={{
//                       height: 20,
//                       width: 20,
//                       fill: "#fff",
//                       marginBottom: -2,
//                     }}
//                   />
//                   <TextSpan
//                     apparence="s2"
//                     className="mt-3"
//                     style={{
//                       color: "#fff",
//                       lineHeight: "8px",
//                       whiteSpace: "nowrap",
//                     }}
//                   >
//                     {`${format(details?.data?.draught, 1)} m`}
//                   </TextSpan>
//                 </Col>
//               )}

//               {details?.data?.course !== undefined && (
//                 <Col className="col-flex-center">
//                   <EvaIcon
//                     name="compass-outline"
//                     options={{
//                       height: 25,
//                       width: 23,
//                       fill: "#fff",
//                     }}
//                   />
//                   <TextSpan
//                     apparence="s2"
//                     className="mt-3"
//                     style={{
//                       color: "#fff",
//                       lineHeight: "8px",
//                       whiteSpace: "nowrap",
//                     }}
//                   >
//                     {`${format(details?.data?.course, 1)} º`}
//                   </TextSpan>
//                 </Col>
//               )}
//             </div>
//           </div>
//         </div>
//         <Col className="mt-3">
//           <Row>
//             <Col breakPoint={{ md: 6, xs: 6 }} className="mb-3">
//               <LabelIcon
//                 iconName="arrow-circle-up-outline"
//                 title={<FormattedMessage id="departure" />}
//               />
//               <TextSpan apparence="s2">
//                 {isLoading ? <Skeleton /> : getDeparture(details)}
//               </TextSpan>
//             </Col>
//             <Col breakPoint={{ md: 6, xs: 6 }} className="mb-3">
//               <LabelIcon iconName="flag-outline" title="ETA" />
//               <TextSpan apparence="s2">
//                 {isLoading ? <Skeleton /> : getEta(details)}
//               </TextSpan>
//             </Col>
//             <Col breakPoint={{ md: 6, xs: 6 }} className="mb-3">
//               <LabelIcon
//                 iconName="cube-outline"
//                 title={<FormattedMessage id="travel" />}
//               />
//               <TextSpan apparence="s2">
//                 {isLoading ? <Skeleton /> : details?.travel?.code || "-"}
//               </TextSpan>
//             </Col>
//             <Col breakPoint={{ md: 6, xs: 6 }} className="mb-3">
//               <LabelIcon
//                 iconName="navigation-2-outline"
//                 title={<FormattedMessage id="destiny.port" />}
//               />
//               <TextSpan apparence="s2">
//                 {isLoading ? <Skeleton /> : getDestinyPreference(details)}
//               </TextSpan>
//             </Col>
//             <Col breakPoint={{ md: 6, xs: 6 }}>
//               <LabelIcon
//                 iconName="pin-outline"
//                 title={<FormattedMessage id="proximity" />}
//               />
//               <TextSpan apparence="s2">
//                 {position?.length ? (
//                   <Proximity
//                     id={machineDetails?.machine?.id}
//                     latitude={position[0]}
//                     longitude={position[1]}
//                     showFlag={true}
//                   />
//                 ) : (
//                   "-"
//                 )}
//               </TextSpan>
//             </Col>
//             <Col breakPoint={{ md: 6, xs: 6 }}>
//               <LabelIcon
//                 iconName="radio-outline"
//                 title={<FormattedMessage id="last.date.acronym" />}
//               />

//               <TextSpan apparence="s2">
//                 {isLoading ? (
//                   <Skeleton />
//                 ) : details?.data?.lastUpdate ? (
//                   <DateDiff dateInitial={details.data.lastUpdate} />
//                 ) : (
//                   "-"
//                 )}
//               </TextSpan>
//             </Col>
//             {window.location.pathname !== "/fleet-frame" && (
//               <Col breakPoint={{ md: 12 }}>
//                 <Row center className="mt-3">
//                   <Button
//                     size="Tiny"
//                     status="Primary"
//                     onClick={(e) => {
//                       e.preventDefault();
//                       props.onOpenDetails();
//                     }}
//                     className="flex-between"
//                     style={{
//                       paddingTop: 3,
//                       paddingBottom: 3,
//                       paddingLeft: 5,
//                       paddingRight: 5,
//                     }}
//                   >
//                     <EvaIcon name="plus-circle-outline" className="mr-1" />
//                     <FormattedMessage id="details" />
//                   </Button>
//                 </Row>
//               </Col>
//             )}
//           </Row>
//         </Col>
//       </ContainerCardInfo>
//     </>
//   );
// };

// export default PopUpDetailsWind;
