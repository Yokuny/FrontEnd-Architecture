import RVEForm from "../FillOnBoard/RVE/RVEForm";
import ModalFillForm from "./ModalFillForm";
import ModalFillFormClient from "./ModalFillFormClient";

export default function ModalStrategy(props) {
  const { isRVE, idForm } = props;

  if (idForm === "285d0f73-e403-4546-9c1d-2031c21412b7") {
    return <ModalFillFormClient {...props} />;
  }

  return <>{!!isRVE
    ? <RVEForm key={idForm} {...props} />
    : <ModalFillForm key={idForm} {...props} />}</>;
}
