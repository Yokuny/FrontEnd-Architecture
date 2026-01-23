// import React from "react";
// import { CreateSocket } from "../../../Socket";
// import { LoadingCard } from "../../../Loading";
// import { Fetch } from "../../../Fetch";
// import moment from "moment";
// import styled from "styled-components";
// import { Button, EvaIcon } from "@paljs/ui";

// const ContainerButton = styled.div`
//   position: absolute;
//   top: 15px;
//   left: 15px;
//   z-index: 9;
// `;

// const LossWorkShiftWrapper = (props) => {
//   const { data, height, width } = props;

//   const [lossByMachine, setLossByMachine] = React.useState([]);
//   const [newValueProduced, setNewValueProduced] = React.useState();
//   const [newValueLoss, setNewValueLoss] = React.useState();
//   const [isLoading, setIsLoading] = React.useState(false);
//   const [dateFilter, setDateFilter] = React.useState(moment());

//   React.useLayoutEffect(() => {
//     let socket = CreateSocket();

//     if (data?.workShifts?.length) {
//       let dataPuted = [];
//       data.workShifts.forEach((workShifts) => {
//         if (workShifts?.machines?.length)
//           workShifts.machines.forEach((machineItem) => {
//             if (
//               machineItem?.sensorProduction?.value &&
//               !dataPuted.some(
//                 (x) =>
//                   x.idMachine == machineItem?.machine?.value &&
//                   x.idSensor == machineItem?.sensorProduction?.value
//               )
//             ) {
//               socket.on(
//                 `sensorstate_${machineItem?.sensorProduction?.value}_${machineItem?.machine?.value}`,
//                 takeDataProduction
//               );
//               dataPuted.push({
//                 idMachine: machineItem?.machine?.value,
//                 idSensor: machineItem?.sensorProduction?.value,
//               });
//             }
//             if (
//               machineItem?.sensorLoss?.value &&
//               !dataPuted.some(
//                 (x) =>
//                   x.idMachine == machineItem?.machine?.value &&
//                   x.idSensor == machineItem?.sensorLoss?.value
//               )
//             ) {
//               socket.on(
//                 `sensorstate_${machineItem?.sensorLoss?.value}_${machineItem?.machine?.value}`,
//                 takeDataLoss
//               );
//               dataPuted.push({
//                 idMachine: machineItem?.machine?.value,
//                 idSensor: machineItem?.sensorLoss?.value,
//               });
//             }
//           });
//       });
//     }

//     getData(moment());
//     return () => {
//       socket.disconnect();
//       socket = undefined;
//     };
//   }, []);

//   React.useLayoutEffect(() => {
//     if (newValueProduced) {
//       const dateNow = moment();
//       const updateIndex = lossByMachine.findIndex(
//         (x) =>
//         dateNow.isSameOrBefore(
//           moment(`${dateNow.format("YYYY-MM-DD")}T${x.end}:59`)
//         ) &&
//         dateNow.isSameOrAfter(
//           moment(`${dateNow.format("YYYY-MM-DD")}T${x.start}:59`)
//         )
//       );
//       if (updateIndex >= 0) {
//         let dataUpdate = lossByMachine[updateIndex];
//         dataUpdate.produced =
//           dataUpdate.produced + (newValueProduced.signals[0]?.value || 0);
//         setLossByMachine([
//           ...lossByMachine.slice(0, updateIndex),
//           dataUpdate,
//           ...lossByMachine.slice(updateIndex + 1),
//         ]);
//       }
//     }
//   }, [newValueProduced]);

//   React.useLayoutEffect(() => {
//     if (newValueLoss) {
//       const dateNow = moment();
//       const updateIndex = lossByMachine.findIndex(
//         (x) =>
//           dateNow.isSameOrBefore(
//             moment(`${dateNow.format("YYYY-MM-DD")}T${x.end}:59`)
//           ) &&
//           dateNow.isSameOrAfter(
//             moment(`${dateNow.format("YYYY-MM-DD")}T${x.start}:59`)
//           )
//       );
//       if (updateIndex >= 0) {
//         let dataUpdate = lossByMachine[updateIndex];
//         dataUpdate.loss =
//           dataUpdate.loss + (newValueLoss.signals[0]?.value || 0);
//         setLossByMachine([
//           ...lossByMachine.slice(0, updateIndex),
//           dataUpdate,
//           ...lossByMachine.slice(updateIndex + 1),
//         ]);
//       }
//     }
//   }, [newValueLoss]);

//   const takeDataProduction = (values) => {
//     setNewValueProduced(values?.length ? values[0] : undefined);
//   };

//   const takeDataLoss = (values) => {
//     setNewValueLoss(values?.length ? values[0] : undefined);
//   };

//   const getData = (dateAtual) => {
//     setIsLoading(true);
//     Fetch.get(
//       `/sensorstate/chart/workshift/losses?idChart=${
//         props.id
//       }&date=${dateAtual.utc().format("YYYY-MM-DD")}`
//     )
//       .then((response) => {
//         if (response.data?.length) {
//           setLossByMachine(response.data);
//         }
//         setIsLoading(false);
//       })
//       .catch(() => {
//         setIsLoading(false);
//       });
//   };

//   const filterSubtract = () => {
//     setDateFilter(dateFilter.subtract(1, "days"));
//     getData(dateFilter);
//   };

//   const filterAdd = () => {
//     setDateFilter(dateFilter.add(1, "days"));
//     getData(dateFilter);
//   };

//   return (
//     <LoadingCard isLoading={isLoading}>
//       {!props.activeEdit && (
//         <ContainerButton>
//           <Button size="Tiny" status="Basic" onClick={() => filterSubtract()}>
//             <EvaIcon name="arrow-ios-back-outline" />
//           </Button>
//           <Button
//             size="Tiny"
//             status="Basic"
//             className="ml-2"
//             onClick={() => filterAdd()}
//           >
//             <EvaIcon name="arrow-ios-forward-outline" />
//           </Button>
//         </ContainerButton>
//       )}
//       <props.component
//         losses={lossByMachine}
//         dateFilter={dateFilter}
//         title={data?.title}
//         height={height}
//         width={width}
//         data={data}
//         id={props.id}
//         activeEdit={props.activeEdit}
//         isMobile={props.isMobile}
//       />
//     </LoadingCard>
//   );
// };

// export default LossWorkShiftWrapper;
