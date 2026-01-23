import React from "react";
import { useFetch } from "../Fetch/Fetch";
import { UserImage } from "../User/UserImage";

const MachineHeader = ({ idMachine }) => {
  const { data } = useFetch(`/machine/info?id=${idMachine}`);

  return (
    <>
      <UserImage
        size="Large"
        image={data?.image?.url}
        title={data?.enterprise?.name}
        name={data?.name}
      />
    </>
  );
};

export default MachineHeader;
