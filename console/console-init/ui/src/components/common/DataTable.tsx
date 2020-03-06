import React from "react";
import {
  Table,
  TableVariant,
  TableHeader,
  TableBody,
  TableProps
} from "@patternfly/react-table";
import {
  Pagination,
  PaginationProps,
  PaginationVariant
} from "@patternfly/react-core";

import { StyleSheet, css } from "@patternfly/react-styles";

const StyleForTable = StyleSheet.create({
  scroll_overflow: {
    overflowY: "auto",
    paddingBottom: 50
  }
});

export interface IDataTableProps extends TableProps {
  isFoolterPaginationEnabled?: Boolean;
  isHeaderPaginationEnabled?: Boolean;
  paginationVariant: PaginationVariant;
}

export const DataTable: React.FC<IDataTableProps & PaginationProps> = ({
  rows,
  cells,
  onSelect,
  actionResolver,
  sortBy,
  onSort,
  isFoolterPaginationEnabled,
  isHeaderPaginationEnabled,
  perPage,
  page,
  paginationVariant,
  onSetPage,
  onPerPageSelect
}) => {
  const itemCount = rows && rows.length;
  const renderPagination = () => {
    return (
      <Pagination
        itemCount={itemCount}
        perPage={perPage}
        page={page}
        onSetPage={onSetPage}
        variant={paginationVariant || "top"}
        onPerPageSelect={onPerPageSelect}
      />
    );
  };
  return (
    <>
      {isHeaderPaginationEnabled && itemCount > 0 && renderPagination()}
      <div className={css(StyleForTable.scroll_overflow)}>
        <Table
          variant={TableVariant.compact}
          onSelect={onSelect}
          cells={cells}
          rows={rows}
          actionResolver={actionResolver}
          aria-label="Address List"
          canSelectAll={true}
          sortBy={sortBy}
          onSort={onSort}
        >
          <TableHeader id="address-list-table-bodheader" />
          <TableBody />
        </Table>
      </div>
      {isFoolterPaginationEnabled && itemCount > 0 && renderPagination()}
    </>
  );
};
