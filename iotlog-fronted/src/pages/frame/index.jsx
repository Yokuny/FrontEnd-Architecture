import React from 'react';
import MyDashboardFrame from '../dashboard/MyDashboardFrame';

const FrameDashboard = (props) => {

  const [isReady, setIsReady] = React.useState(false);

  React.useLayoutEffect(() => {
    const token = new URL(window.location.href).searchParams.get("token");
    localStorage.setItem("token", token)
    setIsReady(true)
  }, [])

  if (!isReady)
  return (
    <>
    </>
  )

  return (
    <>
    <MyDashboardFrame />
    </>
  )
}

export default FrameDashboard;
