export const useQueryFrame = () => {
  const paramsQuery = new URL(window.location.href).searchParams;

  const paramsIsTrue = (value) => {
    return value === "true" || value === true;
  };
  const token = paramsQuery.get("token");
  const theme = paramsQuery.get("theme");
  const mapType = paramsQuery.get("mapType");
  const idEnterprise = paramsQuery.get("idEnterprise");
  const nauticalChart = paramsIsTrue(paramsQuery.get("nauticalChart"));
  const viewPlatform = paramsIsTrue(paramsQuery.get("viewPlatform"));
  const viewFence = paramsIsTrue(paramsQuery.get("viewFence"));

  return {
    token,
    theme,
    mapType,
    idEnterprise,
    nauticalChart,
    viewPlatform,
    viewFence,
  };
};
