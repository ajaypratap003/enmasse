const onServerError = (
  error: any,
  history: any,
  dispactAction: any,
  hasServerError: boolean
) => {
  const { graphQLErrors, networkError } = error;
  if (networkError && !graphQLErrors) {
    history && history.push("/server-error");
  } else if (graphQLErrors) {
    hasServerError !== true &&
      dispactAction &&
      dispactAction({ type: "SET_SERVER_ERROR", payload: error });
  }
};

export { onServerError };
