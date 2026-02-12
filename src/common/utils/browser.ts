export const getWindowHost = () => {
  if (typeof window === "undefined") {
    return "";
  }
  return window.location.host;
};
