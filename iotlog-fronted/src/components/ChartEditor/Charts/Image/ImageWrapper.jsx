import React from "react";
import { LoadingCard } from "../../../Loading";
import { useFetch } from "../../../Fetch/Fetch";
import { urlRedirect } from "../../Utils";

const ImageWrapper = (props) => {
  const { data } = props;

  const { isLoading, data: machine } = useFetch(
    `/machine/cover?id=${data.machine?.value}`
  );

  const onClick = () => {
    if (props.activeEdit)
      return;

    urlRedirect(props.data?.link);
  };

  return (
    <LoadingCard isLoading={isLoading}>
      <props.component
        urlImage={machine?.image?.url}
        data={data}
        id={props.id}
        activeEdit={props.activeEdit}
        onClick={props.data?.link ? onClick : undefined}
      />
    </LoadingCard>
  );
};

export default ImageWrapper;
