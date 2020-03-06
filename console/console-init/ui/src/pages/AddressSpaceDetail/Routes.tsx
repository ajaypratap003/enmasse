import React from "react";
import { Redirect } from "react-router-dom";
import { SwitchWith404, LazyRoute } from "use-patternfly";

const getConnectionsList = () =>
  import("./ConnectionList/ConnectionListWithFilterAndPaginationPage");
const getAddressesList = () =>
  import("./AddressList/AddressesListWithFilterAndPaginationPage");

export const Routes: React.FC<{}> = () => {
  return (
    <SwitchWith404>
      <Redirect path="/" to="/address-spaces" exact={true} />
      <LazyRoute
        path="/address-spaces/:namespace/:name/:type/addresses/"
        getComponent={getAddressesList}
        exact={true}
      />
      <LazyRoute
        path="/address-spaces/:namespace/:name/:type/connections/"
        getComponent={getConnectionsList}
        exact={true}
      />
    </SwitchWith404>
  );
};
