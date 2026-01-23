import { deviceDetect, deviceType } from "react-device-detect";
import axios from "axios";

class TrackingService {
  async saveTracking({
    pathfull,
    pathname,
    search = "",
    action = undefined,
    actionData = undefined,
  }) {
    try {
      const data = {
        page: {
          pathfull,
          pathname,
          search,
        },
        date: new Date(),
        idEnterprise: localStorage.getItem("id_enterprise_filter"),
      };
      if (action) data.action = action;
      if (actionData) data.actionData = actionData;
      try {
        const deviceFind = deviceDetect();
        if (deviceFind) {
          data.device = {
            ...deviceFind,
            type: deviceType,
          };
        }
      } catch {}

      const res = await axios.get("https://geolocation-db.com/json/");
      if (res.data) {
        data.location = res.data;
      }

      await axios.post(`${process.env.REACT_APP_URI_BASE}/tracking`, data, {
        headers: {
          token: localStorage.getItem("token"),
        }
      });
    } catch {}
  }
}

export default new TrackingService();
