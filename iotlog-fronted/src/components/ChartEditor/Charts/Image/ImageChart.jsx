import React from "react";
import { ContentChart } from "../../Utils";

export function ImageChart(props) {
  const { urlImage, data, onClick } = props;

  return (
    <ContentChart onClick={onClick} className="card-shadow">
      <img
        src={urlImage}
        width={'100%'}
        height={'100%'}
        alt={data?.machine?.label ?? "Image"}
        style={{ objectFit: "cover", borderRadius: 3 }}
      />
    </ContentChart>
  );
}
