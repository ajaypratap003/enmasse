/*
 * Copyright 2020, EnMasse authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

import React, { useState } from "react";
import {
  PageSection,
  PageSectionVariants,
  Title,
  GridItem,
  Grid
} from "@patternfly/react-core";
import { GridStylesForTableHeader } from "modules/address/AddressPage";
import { ConnectionLinksContainer } from "modules/connection-detail/containers";
import { useLocation } from "react-router";
import { css } from "@patternfly/react-styles";
import { ConnectionDetailFilter } from "modules/connection-detail/components";
import { ISortBy } from "@patternfly/react-table";
import { Divider } from "@patternfly/react-core/dist/js/experimental";
import { TablePagination } from "components";
interface IConnectionDetailToolbarProps {
  name?: string;
  namespace?: string;
  connectionName?: string;
}
export const ConnectionDetailToolbar: React.FunctionComponent<IConnectionDetailToolbarProps> = ({
  name,
  namespace,
  connectionName
}) => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const [totalLinks, setTotalLinks] = useState<number>(0);
  const page = parseInt(searchParams.get("page") || "", 10) || 0;
  const perPage = parseInt(searchParams.get("perPage") || "", 10) || 10;
  const [filterValue, setFilterValue] = useState<string>("Name");
  const [filterNames, setFilterNames] = useState<Array<string>>([]);
  const [filterAddresses, setFilterAddresses] = useState<Array<string>>([]);
  const [filterRole, setFilterRole] = useState<string>();
  const [sortDropDownValue, setSortDropdownValue] = useState<ISortBy>();

  const renderPagination = (page: number, perPage: number) => {
    return (
      <TablePagination
        itemCount={totalLinks}
        perPage={perPage}
        page={page}
        variant="top"
      />
    );
  };

  return (
    <PageSection variant={PageSectionVariants.light}>
      <Title
        size={"lg"}
        className={css(GridStylesForTableHeader.filter_left_margin)}
      >
        Links for connection - {connectionName}
      </Title>
      <br />
      <Grid>
        <GridItem span={6}>
          <ConnectionDetailFilter
            filterValue={filterValue}
            setFilterValue={setFilterValue}
            filterNames={filterNames}
            setFilterNames={setFilterNames}
            filterAddresses={filterAddresses}
            setFilterAddresses={setFilterAddresses}
            filterRole={filterRole}
            setFilterRole={setFilterRole}
            totalLinks={totalLinks}
            sortValue={sortDropDownValue}
            setSortValue={setSortDropdownValue}
            namespace={namespace || ""}
            connectionName={connectionName || ""}
          />
        </GridItem>
        <GridItem span={6}>{renderPagination(page, perPage)}</GridItem>
      </Grid>
      <Divider />
      <ConnectionLinksContainer
        name={name || ""}
        namespace={namespace || ""}
        connectionName={connectionName || ""}
        page={page}
        perPage={perPage}
        setTotalLinks={setTotalLinks}
        filterNames={filterNames}
        filterAddresses={filterAddresses}
        filterRole={filterRole}
        sortValue={sortDropDownValue}
        setSortValue={setSortDropdownValue}
      />
      {renderPagination(page, perPage)}
    </PageSection>
  );
};
