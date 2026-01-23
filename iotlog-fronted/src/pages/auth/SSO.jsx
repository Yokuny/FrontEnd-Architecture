import React from 'react'
import { Button } from "@paljs/ui";
import { useMsal } from '@azure/msal-react';
import cryptoJs from "crypto-js";
import { toast } from 'react-toastify';
import { styled } from 'styled-components';
import { loginRequest } from "../../authConfig";
import { SpinnerFull } from '../../components';
import { Microsoft } from '../../components/Icons';

const ButtonStyled = styled(Button)`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`

const _zP_b = (a) => {
  try {
    return cryptoJs.AES.decrypt(
      a,
      process.env.REACT_APP_SSO_KEY
    ).toString(cryptoJs.enc.Utf8);
  } catch {
    return "";
  }
};

export default function SSO(props) {

  const [credentials, setCredentials] = React.useState();
  const [isLoading, setIsLoading] = React.useState(false);

  const { instance } = useMsal();


  React.useEffect(() => {
    if (props.token)
      getData(props.token)

    return () => {
      setCredentials(undefined);
    }
  }, [props.token])

  const getData = (token) => {
    const tokenDecode = _zP_b(token);
    try {
      const { clientId, tenantId } = tokenDecode ? JSON.parse(tokenDecode) : {};
      setCredentials({ clientId, tenantId });
    }
    catch {

    }
  }

  const loginSSO = () => {
    if (instance) {

      const { clientId, tenantId } = credentials || {};
      if (clientId && tenantId) {
        instance.getConfiguration().auth.clientId = `${clientId}`;
        instance.getConfiguration().auth.authority = `https://login.microsoftonline.com/${tenantId}`;
      } else {
        toast.error("SSO no setup yet.");
        return;
      }

      setIsLoading(true);

      instance
        .loginPopup({
          ...loginRequest,
          redirectUri: '/',
        })
        .then((value) => {
          setIsLoading(false);
          if (value?.accessToken)
            props.onLogin({ token: value.accessToken, idToken: value.idToken });
          else
            toast.error("Token SSO not find.");
        })
        .catch((error) => {
          setIsLoading(false);
        });
    } else {
      toast.error("Error instance SSO.");
    }
  }

  return <>
    <ButtonStyled
      disabled={isLoading || (!credentials?.clientId && !credentials?.tenantId)}
      onClick={loginSSO}>
      <Microsoft
        style={{ width: 23, height: 20, marginRight: 5 }}
      />
      Login Microsoft
    </ButtonStyled>
    <SpinnerFull isLoading={isLoading} />
  </>
}
