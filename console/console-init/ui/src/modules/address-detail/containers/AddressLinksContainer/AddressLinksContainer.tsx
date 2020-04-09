/*
 * Copyright 2020, EnMasse authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

import React, { useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import { ISortBy } from "@patternfly/react-table";
import { Loading } from "use-patternfly";
import { RETURN_ADDRESS_LINKS } from "graphql-module/queries";
import { IAddressLinksResponse } from "schema/ResponseTypes";
import {
  IAddressLink,
  AddressLinks
} from "modules/address-detail/components/AddressLinks/AddressLinks";
import { getFilteredValue } from "utils";
import { POLL_INTERVAL, FetchPolicy } from "constant";
import { EmptyAddressLinks } from "modules/address-detail/components/EmptyAddressLinks";

interface IAddressLinksListProps {
  page: number;
  perPage: number;
  setAddressLinksTotal: (total: number) => void;
  setSortValue: (value?: ISortBy) => void;
  filterNames: Array<{ value: string; isExact: boolean }>;
  filterContainers: Array<{ value: string; isExact: boolean }>;
  name?: string;
  namespace?: string;
  addressName?: string;
  type?: string;
  sortValue?: ISortBy;
  filterRole?: string;
}
const AddressLinksContainer: React.FunctionComponent<IAddressLinksListProps> = ({
  page,
  perPage,
  setAddressLinksTotal,
  setSortValue,
  filterNames,
  filterContainers,
  name,
  namespace,
  addressName,
  type,
  sortValue,
  filterRole
}) => {
  const [sortBy, setSortBy] = useState<ISortBy>();
  if (sortValue && sortBy !== sortValue) {
    setSortBy(sortValue);
  }
  const { loading, data } = useQuery<IAddressLinksResponse>(
    RETURN_ADDRESS_LINKS(
      page,
      perPage,
      filterNames,
      filterContainers,
      name,
      namespace,
      addressName,
      sortBy,
      filterRole
    ),
    { pollInterval: POLL_INTERVAL, fetchPolicy: FetchPolicy.NETWORK_ONLY }
  );

  if (loading && !data) return <Loading />;

  const { addresses } = data || {
    addresses: { total: 0, addresses: [] }
  };

  if (
    addresses &&
    addresses.addresses.length > 0 &&
    addresses.addresses[0].links.total >= 0
  ) {
    setAddressLinksTotal(addresses.addresses[0].links.total);
  }

  const getAddressLinks = () => {
    return (
      addresses &&
      addresses.addresses.length > 0 &&
      addresses.addresses[0].links.total > 0 &&
      addresses.addresses[0].links
    );
  };

  const getRows = () => {
    let rows: IAddressLink[] = [];
    rows = addresses.addresses[0].links.links.map(link => ({
      role: link.spec.role.toString(),
      containerId: link.spec.connection.spec.containerId,
      name: link.metadata.name,
      deliveryRate: getFilteredValue(
        link.metrics,
        link.spec.role === "sender"
          ? "enmasse_messages_in"
          : "enmasse_messages_out"
      ),
      backlog: getFilteredValue(link.metrics, "enmasse_messages_backlog"),
      connectionName: link.spec.connection.metadata.name,
      addressSpaceName: name,
      addressSpaceNamespace: namespace,
      addressSpaceType: type
    }));

    return rows;
  };

  const onSort = (_event: any, index: any, direction: any) => {
    setSortBy({ index: index, direction: direction });
    setSortValue({ index: index, direction: direction });
  };

  const links = getAddressLinks();

  return (
    <>
      <AddressLinks rows={getRows()} onSort={onSort} sortBy={sortBy} />
      {links && links.total > 0 ? <></> : <EmptyAddressLinks />}
    </>
  );
};

export { AddressLinksContainer };
