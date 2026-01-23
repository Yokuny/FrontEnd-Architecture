import React from 'react';
import { useLocation } from 'react-router-dom';
import GoogleAnalytics from "react-ga";
import { debbuggerClear, debbuggerDanger, debbuggerInfo } from '../../utilities';
import TrackingService from '../../services/TrackingService';

GoogleAnalytics.initialize(process.env.REACT_APP_GAID || "");

export default function GoogleTracking() {

  const location = useLocation();
  const BASENAME = process.env.REACT_APP_BASENAME || "";

  React.useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      return;
    }
    const interval = setInterval(function () {
      debbuggerClear();
      debbuggerDanger("%cAtividade suspeita! O que você faz por aqui?");
      debbuggerInfo("Suspicious activity! What do you do around here?");
      debbuggerInfo(
        "Você é DEV?! Estamos contratando ... Are you DEV?! we are hiring ..."
      );
      debbuggerInfo(
        "Se alguém te mandou aqui desconfie! If someone sent you here, be suspicious!"
      );
      debbuggerInfo(
        "Sua atividade foi monitorada! Your activity has been monitored"
      );
    }, 1000);

    document.onkeydown = function (e) {
      if (e.keyCode == 123) {
        TrackingService.saveTracking({
          pathfull: "/open-console-developer",
          pathname: "/open-console-developer",
          search: "?key=F12",
        }).then(() => {});
        return false;
      }
      if (e.ctrlKey && e.shiftKey && e.keyCode == "I".charCodeAt(0)) {
        TrackingService.saveTracking({
          pathfull: "/open-console-developer",
          pathname: "/open-console-developer",
          search: "?key=CSI",
        }).then(() => {});
        return false;
      }
      if (e.ctrlKey && e.shiftKey && e.keyCode == "C".charCodeAt(0)) {
        TrackingService.saveTracking({
          pathfull: "/open-console-developer",
          pathname: "/open-console-developer",
          search: "?key=CSC",
        }).then(() => {});
        return false;
      }
      if (e.ctrlKey && e.shiftKey && e.keyCode == "J".charCodeAt(0)) {
        TrackingService.saveTracking({
          pathfull: "/open-console-developer",
          pathname: "/open-console-developer",
          search: "?key=CSJ",
        }).then(() => {});
        return false;
      }
      if (e.ctrlKey && e.keyCode == "U".charCodeAt(0)) {
        TrackingService.saveTracking({
          pathfull: "/open-console-developer",
          pathname: "/open-console-developer",
          search: "?key=CU",
        }).then(() => {});
        return false;
      }
    };
    window.addEventListener(
      "contextmenu",
      function (e) {
        e.preventDefault();
      },
      false
    );
    return () => {
      if (interval) clearInterval(interval);
      window.removeEventListener("contextmenu");
    };
  }, []);

  React.useEffect(() => {
    const nextPage = location.pathname + location.search;
    trackPage(`${BASENAME}${nextPage}`, {
      pathname: location.pathname,
      search: location.search,
    });
  }, [location]);


  const trackPage = (page, details) => {
    if (process.env.NODE_ENV !== "production") {
      return;
    }

    let user;

    try {
      user = JSON.parse(localStorage.getItem("user"));
    } catch {}

    if (
      details?.pathname !== "/" &&
      !details?.pathname?.includes("login") &&
      !details?.pathname?.includes("request-password") &&
      !details?.pathname?.includes("terms") &&
      !details?.pathname?.includes("policy") &&
      !details?.pathname?.includes("new-account") &&
      !details?.pathname?.includes("new-password")
    ) {
      TrackingService.saveTracking({
        pathfull: page,
        pathname: details?.pathname,
        search: details?.search,
      }).then(() => {});
    }

    GoogleAnalytics.set({
      page,
      userName: user?.name,
    });

    GoogleAnalytics.pageview(page);
  };

  return (
    <></>
  )
}