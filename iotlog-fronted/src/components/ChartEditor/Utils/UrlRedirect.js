const queryParse = (query) =>
  query
    ?.split("?")[1]
    ?.split("&")
    .map((x) => ({ key: x.split("=")[0], value: x.split("=")[1] })) ?? [];

export const urlRedirect = (link) => {
  const value = localStorage.getItem("editingChart");
  if (value === true || value === "true") return;

  if (
    link &&
    link.includes("/my-dashboard") &&
    window.location.pathname.includes("/frame-dashboard")
  ) {
    const idChange = queryParse(link).find((x) => x.key == "id")?.value;
    const idAtual = new URL(window.location.href).searchParams.get("id");
    window.location.href = window.location.href.replace(idAtual, idChange);
    return;
  }

  if (link) {
    window.location.href = `${window.location.origin}${link}`;
  }
};
