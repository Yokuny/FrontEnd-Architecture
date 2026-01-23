import React from 'react'
import { Button, EvaIcon } from "@paljs/ui";
import { FormattedMessage, useIntl } from "react-intl";
import { Fetch, SpinnerFull } from '../../../components';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function DisableUser(props) {

  const [isLoading, setIsLoading] = React.useState(false);

  const { idUser } = props;

  const intl = useIntl();
  const navigate = useNavigate();
  
  const onChangeActivityUser = () => {
    setIsLoading(true)
    Fetch.patch(`/user/${props.disable ? 'enable' : 'disable'}?id=${idUser}`)
      .then(response => {
        setIsLoading(false);
        toast.success(intl.formatMessage({ id: props.disable ? "enable.successfull" : "deactivate.successfull" }));
        navigate(-1);
      })
      .catch(e => {
        setIsLoading(false)
      })
  }

  return (<>
    <Button onClick={onChangeActivityUser} size="Small"
      appearance="ghost"
      status={props.disable ? "Success" : "Warning"}
      className="flex-between mr-3"
      style={{ paddingTop: 2, paddingBottom: 2 }}>
      <EvaIcon name={props.disable ? "person-done-outline" : "person-remove-outline"} className="mr-1" />
      <FormattedMessage id={props.disable ? "enable" : "disable"} />
    </Button>
    <SpinnerFull isLoading={isLoading} />
  </>)
}
