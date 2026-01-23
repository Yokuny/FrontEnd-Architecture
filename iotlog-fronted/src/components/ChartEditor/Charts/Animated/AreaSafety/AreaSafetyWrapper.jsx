// import React from "react";
// import { CreateSocket } from "../../../../Socket";
// import { LoadingCard } from "../../../../Loading";
// import { Fetch } from "../../../../Fetch";
// import { urlRedirect } from "../../../Utils";

// const AreaSafetyWrapper = (props) => {
//   const { data, height, width } = props;

//   const [areas, setAreas] = React.useState([]);
//   const [newValue, setNewValue] = React.useState();
//   const [isLoading, setIsLoading] = React.useState(false);

//   React.useLayoutEffect(() => {
//     let socket = CreateSocket();

//     if (data?.sensorsCondition?.length && data?.machine?.value)
//       data.sensorsCondition.forEach((x) => {
//         socket.on(
//           `sensorstate_${x?.sensor?.value}_${data?.machine?.value}`,
//           values => setNewValue(values?.length ? values[0] : undefined)
//         );
//       });

//     getData();
//     return () => {
//       socket.disconnect();
//       socket = undefined;
//     };
//   }, []);

//   React.useLayoutEffect(() => {
//     if (newValue) {
//       const updateIndex = areas?.findIndex(
//         (x) =>
//           x.idMachine == newValue.idMachine && x.sensorId == newValue.sensorId
//       );
//       if (updateIndex >= 0) {
//         setAreas([
//           ...areas.slice(0, updateIndex),
//           newValue,
//           ...areas.slice(updateIndex + 1),
//         ]);
//       }
//       else {
//         setAreas([newValue])
//       }
//     }
//   }, [newValue]);

//   const getData = () => {
//     setIsLoading(true);
//     Fetch.get(`/sensorstate/chart/areasafety?idChart=${props.id}`)
//       .then((response) => {
//         setAreas(response.data?.length ? response.data : []);
//         setIsLoading(false);
//       })
//       .catch(() => {
//         setIsLoading(false);
//       });
//   };

//   const onClick = () => {
//     if (props.activeEdit)
//       return;

//     urlRedirect(props.data?.link);
//   }

//   return (
//     <LoadingCard isLoading={isLoading}>
//       <props.component
//         areas={areas}
//         title={data?.title}
//         height={height}
//         width={width}
//         data={data}
//         id={props.id}
//         activeEdit={props.activeEdit}
//         onClick={props.data?.link ? onClick : undefined}
//       />
//     </LoadingCard>
//   );
// };

// export default AreaSafetyWrapper;
