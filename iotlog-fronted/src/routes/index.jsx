import React, { useEffect, useState } from "react";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import routesList from "./routes";
import { LayoutBasicNoMenu } from "../layouts/LayoutWrappers";
import Login from "../pages/auth/Login";
import { AuthProvider } from "../components/Contexts/Auth";
import Terms from "../pages/contracts/Terms";
import Policy from "../pages/contracts/Policy";
import RequestPassword from "../pages/auth/RequestPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import NotFound from "../pages/not-found/NotFound";
import FrameDashboard from "../pages/frame";
import FleetFrame from "../pages/fleet/Frame";
import SendCodeUnlock from "../pages/auth/SendCodeUnlock";
import ExternalLogin from "../pages/auth/ExternalLogin";
import ViewFolderPublic from "../pages/register/archive/viewFolderPublic";
import PrintTravel from "../pages/travel/print/PrintTravel";
import PrintOperability from "../pages/travel/print/PrintOperability";
const pathsToVerify = ["/", "/home", "/login"];

export default function RouteMap(props) {
  const [isSigned, setIsSigned] = useState(!!localStorage.getItem("token"));
  const location = useLocation();

  useEffect(() => {
    if (location?.pathname && pathsToVerify.includes(location.pathname)) {
      verifySign();
    }
  }, [location?.pathname]);

  useEffect(() => {
    verifySign();
  }, []);

  const verifySign = () => {
    const token = localStorage.getItem("token");

    if (!!token) {
      setIsSigned(true);
    } else {
      setIsSigned(false);
    }
  };

  return (
    <>
      <AuthProvider>
        <Routes>
          <Route path="/external/auth" element={<ExternalLogin />} />

          <Route path="/login" element={<Login />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/policy" element={<Policy />} />
          <Route path="/request-password" element={<RequestPassword />} />
          <Route path="/new-password" element={<ResetPassword />} />
          <Route path="/code-unlock" element={<SendCodeUnlock />} />
          <Route path="/frame-dashboard" element={<FrameDashboard />} />
          <Route path="/fleet-frame" element={<FleetFrame />} />
          <Route path="/print-operability" element={<PrintOperability />} />
          <Route path="/print-voyage" element={<PrintTravel />} />
          <Route
            path="/public-folder"
            element={
              <LayoutBasicNoMenu>
                <ViewFolderPublic />
              </LayoutBasicNoMenu>
            }
          />
          {isSigned ? (
            routesList.map((route, index) => {
              return (
                <Route
                  key={`${index}${route.path}`}
                  path={route.path}
                  exact={route.exact}
                  element={
                    <route.layout {...props}>
                      <route.component {...props} />
                    </route.layout>
                  }
                />
              );
            })
          ) : (
            <Route path="*" element={<Navigate to="/login" state={{ from: location, keepRememberEmail: true }} replace />} />
          )}

          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </>
  );
}
