export const cleanUpAuthToken = (str: string) => {
  return str.split("&")[1].slice(5);
};
