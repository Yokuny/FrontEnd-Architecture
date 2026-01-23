// import React from "react";
// import { CreateSocket } from "../../../Socket";
// import { LoadingCard } from "../../../Loading";
// import { Fetch } from "../../../Fetch";

// const GroupStatusWrapper = (props) => {
//   const { data, height, width } = props;

//   const [machinesStates, setMachinesStates] = React.useState([]);
//   const [newValue, setNewValue] = React.useState();
//   const [isLoading, setIsLoading] = React.useState(false);

//   React.useLayoutEffect(() => {
//     let socket = CreateSocket();

//     if (data?.machines?.length)
//     data.machines.forEach((x) => {
//       socket.on(
//         `laststatemachine_${x?.machine?.value}`,
//         takeData
//       );
//     });

//     getData();
//     return () => {
//       socket.disconnect();
//       socket = undefined;
//     };
//   }, []);

//   React.useLayoutEffect(() => {
//     if (newValue) {
//       setMachinesStates([
//         ...machinesStates.filter(x => x.idMachine != newValue.idMachine),
//         newValue
//       ])
//     }
//   }, [newValue])

//   const takeData = (values) => {
//     setNewValue(values?.length ? values[0] : undefined)
//   }

//   const getData = () => {
//     setIsLoading(true);
//     Fetch.get(`/machinestate/chart/statemachines?idChart=${props.id}`)
//       .then((response) => {
//         if (response.data?.length) {
//           setMachinesStates(response.data);
//         }
//         setIsLoading(false);
//       })
//       .catch(() => {
//         setIsLoading(false);
//       });
//   };

//   return (
//     <LoadingCard isLoading={isLoading}>
//       <props.component
//         machinesStates={machinesStates}
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

// export default GroupStatusWrapper;
