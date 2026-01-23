import axios from "axios";
import React from "react";

export const useGetProximity = ({ latitude, longitude }) => {
  const [data, setData] = React.useState();
  const [isLoading, setIsLoading] = React.useState(false);

  React.useLayoutEffect(() => {
    getDataAsync(latitude, longitude);
  }, [latitude, longitude]);

  const getDataAsync = async (latitude, longitude) => {
    if (latitude === undefined || longitude === undefined);
    setIsLoading(true);
    try {
      const { data } = await axios.get(
        `https://nearby-cities.vercel.app/api/search?latitude=${latitude}&longitude=${longitude}`
      );
      setData(data);
    } catch (e) {
    } finally {
      setIsLoading(false);
    }
  };

  return { data, isLoading };
};
