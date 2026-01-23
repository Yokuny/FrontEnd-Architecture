import { InputGroup } from "@paljs/ui/Input";
import { useQuery } from "react-query";
import { Fetch } from "../Fetch";

export default function UserInput(props) {
  const { idUser } = props;

  const { data } = useQuery(`contact_enterprise`, () =>
  idUser
    ? Fetch.get(
        `/user/find?id=${idUser}`
      ).then((res) => res.data)
    : new Promise((resolve) => resolve([]))
);

  return (
    <>
      <InputGroup fullWidth>
        <input
          type="text"
          value={data?.name}
          disabled
        />
      </InputGroup>
    </>
  );
}
