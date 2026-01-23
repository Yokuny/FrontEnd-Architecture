import React from "react";
import { LoadingCard } from "../../../Loading";
import { urlRedirect } from "../../Utils";
import { Fetch } from "../../../Fetch";
import { useSocket } from "../../../Contexts/SocketContext";

const TravelWrapper = (props) => {
  const { data } = props;

  const [travel, setTravel] = React.useState();
  const [isLoading, setIsLoading] = React.useState(false);

  const socket = useSocket();

  React.useEffect(() => {
    if (!socket || !data?.machine?.value) {
      return;
    }
    socket.emit("join", {
      topic: `newtravel_${data?.machine?.value}`,
    });

    socket.on(`newtravel_${data?.machine?.value}`, takeData);

    return () => {
      socket.emit("leave", {
        topic: `newtravel_${data?.machine?.value}`,
      });
      socket.off(`newtravel_${data?.machine?.value}`, takeData);
    };
  }, [socket, data]);

  React.useEffect(() => {
    if (props?.id) {
      getData(props?.id);
    }
  }, [props?.id]);

  const getData = (id) => {
    setIsLoading(true);
    Fetch.get(`/travel/chart/last?idChart=${id}`)
      .then((response) => {
        response.data && setTravel(response.data);
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const takeData = (values) => {
    if (!!values?.length) {
      setTravel(values[0]);
    }
  };

  const onClick = () => {
    if (props.activeEdit) return;

    urlRedirect(props.data?.link);
  };

  return (
    <LoadingCard key={props.id} isLoading={isLoading}>
      <props.component
        lastTravel={travel}
        title={data?.title}
        data={data}
        id={props.id}
        onClick={props.data?.link ? onClick : undefined}
      />
    </LoadingCard>
  );
};

export default TravelWrapper;
