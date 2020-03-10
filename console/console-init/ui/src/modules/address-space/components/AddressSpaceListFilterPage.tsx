/*
 * Copyright 2020, EnMasse authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

import * as React from "react";
import {
  DataToolbarContent,
  DataToolbar,
  DataToolbarItem
} from "@patternfly/react-core/dist/js/experimental";
import {
  AddressSpaceListFilter,
  AddressSpaceListKebab
} from "./AddressSpaceListFilter";
import { ISortBy } from "@patternfly/react-table";
import { SortForMobileView } from "components/common/SortForMobileView";
import useWindowDimensions from "components/common/WindowDimension";
import { useStoreContext, types, MODAL_TYPES } from "context-state-reducer";

interface IAddressSpaceListFilterPageProps {
  filterValue?: string;
  setFilterValue: (value: string) => void;
  filterNames: any[];
  setFilterNames: (value: Array<any>) => void;
  filterNamespaces: any[];
  setFilterNamespaces: (value: Array<any>) => void;
  filterType?: string | null;
  setFilterType: (value: string | null) => void;
  totalAddressSpaces: number;
  sortValue?: ISortBy;
  setSortValue: (value: ISortBy) => void;
  onDeleteAll: () => void;
  isDeleteAllDisabled: boolean;
}
export const AddressSpaceListFilterPage: React.FunctionComponent<IAddressSpaceListFilterPageProps> = ({
  filterValue,
  setFilterValue,
  filterNames,
  setFilterNames,
  filterNamespaces,
  setFilterNamespaces,
  filterType,
  setFilterType,
  totalAddressSpaces,
  sortValue,
  setSortValue,
  onDeleteAll,
  isDeleteAllDisabled
}) => {
  const { width } = useWindowDimensions();
  const { dispatch } = useStoreContext();

  const onClearAllFilters = () => {
    setFilterValue("Name");
    setFilterNamespaces([]);
    setFilterNames([]);
    setFilterType(null);
  };

  const onCreateAddressSpace = () => {
    dispatch({
      type: types.SHOW_MODAL,
      modalType: MODAL_TYPES.CREATE_ADDRESS_SPACE
    });
  };

  const sortMenuItems = [
    { key: "name", value: "Name", index: 1 },
    { key: "creationTimestamp", value: "Time Created", index: 4 }
  ];
  const toolbarItems = (
    <>
      <AddressSpaceListFilter
        filterValue={filterValue}
        setFilterValue={setFilterValue}
        filterNames={filterNames}
        setFilterNames={setFilterNames}
        filterNamespaces={filterNamespaces}
        setFilterNamespaces={setFilterNamespaces}
        filterType={filterType}
        setFilterType={setFilterType}
        totalAddressSpaces={totalAddressSpaces}
      />
      {width < 769 && (
        <SortForMobileView
          sortMenu={sortMenuItems}
          sortValue={sortValue}
          setSortValue={setSortValue}
        />
      )}
      <DataToolbarItem>
        <AddressSpaceListKebab
          createAddressSpaceOnClick={onCreateAddressSpace}
          onDeleteAll={onDeleteAll}
          isDeleteAllDisabled={isDeleteAllDisabled}
        />
      </DataToolbarItem>
    </>
  );
  return (
    <DataToolbar
      id="data-toolbar-with-filter"
      className="pf-m-toggle-group-container"
      collapseListedFiltersBreakpoint="xl"
      clearAllFilters={onClearAllFilters}
    >
      <DataToolbarContent>{toolbarItems}</DataToolbarContent>
    </DataToolbar>
  );
};
