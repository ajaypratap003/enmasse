/*
 * Copyright 2020, EnMasse authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

import * as React from "react";
import { useLocation, useHistory } from "react-router";
import { useDocumentTitle, useA11yRouteChange } from "use-patternfly";
import {
  Pagination,
  PageSection,
  PageSectionVariants,
  Grid,
  GridItem
} from "@patternfly/react-core";
import { Divider } from "@patternfly/react-core/dist/js/experimental";
import { ISortBy } from "@patternfly/react-table";
import { useMutation } from "@apollo/react-hooks";
import { AddressSpaceListPage } from "./components/AddressSpaceListPage";
import { AddressSpaceListFilterPage } from "./components/AddressSpaceListFilterPage";
import { DELETE_ADDRESS_SPACE } from "graphql-module/queries";
import { IAddressSpace } from "modules/address-space/components/AddressSpaceList";
import { compareObject } from "utils";
import { useStoreContext, types, MODAL_TYPES } from "context-state-reducer";
import { getHeaderForDeleteDialog, getDetailForDeleteDialog } from "./utils";

export default function AddressSpacePage() {
  const { dispatch } = useStoreContext();
  useDocumentTitle("Address Space List");
  useA11yRouteChange();

  let deleteAddressSpaceErrors: any = [];

  const [filterValue, setFilterValue] = React.useState<string>("Name");
  const [filterNames, setFilterNames] = React.useState<string[]>([]);
  const [onCreationRefetch, setOnCreationRefetch] = React.useState<boolean>(
    false
  );
  const [filterNamespaces, setFilterNamespaces] = React.useState<string[]>([]);
  const [filterType, setFilterType] = React.useState<string | null>(null);
  const [totalAddressSpaces, setTotalAddressSpaces] = React.useState<number>(0);
  const [sortDropDownValue, setSortDropdownValue] = React.useState<ISortBy>();
  const [isCreateWizardOpen, setIsCreateWizardOpen] = React.useState(false);
  const location = useLocation();
  const history = useHistory();
  const searchParams = new URLSearchParams(location.search);
  const page = parseInt(searchParams.get("page") || "", 10) || 1;
  const perPage = parseInt(searchParams.get("perPage") || "", 10) || 10;
  const [selectedAddressSpaces, setSelectedAddressSpaces] = React.useState<
    IAddressSpace[]
  >([]);

  const refetchQueries: string[] = ["all_address_spaces"];
  const [
    setDeleteAddressSpaceQueryVariables
  ] = useMutation(DELETE_ADDRESS_SPACE, {
    refetchQueries,
    awaitRefetchQueries: true
  });

  const setSearchParam = React.useCallback(
    (name: string, value: string) => {
      searchParams.set(name, value.toString());
    },
    [searchParams]
  );

  const handlePageChange = React.useCallback(
    (_: any, newPage: number) => {
      setSearchParam("page", newPage.toString());
      history.push({
        search: searchParams.toString()
      });
    },
    [setSearchParam, history, searchParams]
  );

  const handlePerPageChange = React.useCallback(
    (_: any, newPerPage: number) => {
      setSearchParam("page", "1");
      setSearchParam("perPage", newPerPage.toString());
      history.push({
        search: searchParams.toString()
      });
    },
    [setSearchParam, history, searchParams]
  );

  const renderPagination = (page: number, perPage: number) => {
    return (
      <Pagination
        itemCount={totalAddressSpaces}
        perPage={perPage}
        page={page}
        onSetPage={handlePageChange}
        variant="top"
        onPerPageSelect={handlePerPageChange}
      />
    );
  };

  const deleteAddressSpace = async (
    addressSpace: IAddressSpace,
    index: number
  ) => {
    try {
      const variables = {
        a: {
          name: addressSpace.name,
          namespace: addressSpace.nameSpace
        }
      };
      await setDeleteAddressSpaceQueryVariables({ variables });
    } catch (error) {
      deleteAddressSpaceErrors.push(error);
    }
    /**
     * dispatch action to set server errors after completion all queries
     */
    if (
      selectedAddressSpaces &&
      selectedAddressSpaces.length === index + 1 &&
      deleteAddressSpaceErrors.length > 0
    ) {
      dispatch({
        type: types.SET_SERVER_ERROR,
        payload: { errors: deleteAddressSpaceErrors }
      });
    }
  };

  const onDeleteAll = () => {
    dispatch({
      type: types.SHOW_MODAL,
      modalType: MODAL_TYPES.DELETE_ADDRESS_SPACE,
      modalProps: {
        onConfirm: onConfirmDeleteAll,
        selectedItems: selectedAddressSpaces.map(as => as.name),
        option: "Delete",
        detail: getDetailForDeleteDialog(selectedAddressSpaces),
        header: getHeaderForDeleteDialog(selectedAddressSpaces)
      }
    });
  };

  const onConfirmDeleteAll = async () => {
    if (selectedAddressSpaces && selectedAddressSpaces.length > 0) {
      const data = selectedAddressSpaces;
      await Promise.all(
        data.map((addressSpace, index) =>
          deleteAddressSpace(addressSpace, index)
        )
      );
      setSelectedAddressSpaces([]);
    }
  };
  const onSelectAddressSpace = (data: IAddressSpace, isSelected: boolean) => {
    if (isSelected === true && selectedAddressSpaces.indexOf(data) === -1) {
      setSelectedAddressSpaces(prevState => [...prevState, data]);
    } else if (isSelected === false) {
      setSelectedAddressSpaces(prevState =>
        prevState.filter(
          addressSpace =>
            !compareObject(
              {
                name: addressSpace.name,
                nameSpace: addressSpace.nameSpace
              },
              {
                name: data.name,
                nameSpace: data.nameSpace
              }
            )
        )
      );
    }
  };

  const onSelectAllAddressSpace = (
    dataList: IAddressSpace[],
    isSelected: boolean
  ) => {
    if (isSelected === true) {
      setSelectedAddressSpaces(dataList);
    } else if (isSelected === false) {
      setSelectedAddressSpaces([]);
    }
  };

  const isDeleteAllOptionDisabled = () => {
    if (selectedAddressSpaces && selectedAddressSpaces.length > 0) {
      return false;
    }
    return true;
  };

  return (
    <PageSection variant={PageSectionVariants.light}>
      <Grid>
        <GridItem span={7}>
          <AddressSpaceListFilterPage
            filterValue={filterValue}
            setFilterValue={setFilterValue}
            filterNames={filterNames}
            setFilterNames={setFilterNames}
            filterNamespaces={filterNamespaces}
            setFilterNamespaces={setFilterNamespaces}
            filterType={filterType}
            setFilterType={setFilterType}
            totalAddressSpaces={totalAddressSpaces}
            sortValue={sortDropDownValue}
            setSortValue={setSortDropdownValue}
            onDeleteAll={onDeleteAll}
            isDeleteAllDisabled={isDeleteAllOptionDisabled()}
          />
        </GridItem>
        <GridItem span={5}>
          {totalAddressSpaces > 0 && renderPagination(page, perPage)}
        </GridItem>
      </Grid>
      <Divider />
      <AddressSpaceListPage
        page={page}
        perPage={perPage}
        totalAddressSpaces={totalAddressSpaces}
        setTotalAddressSpaces={setTotalAddressSpaces}
        filter_Names={filterNames}
        filter_NameSpace={filterNamespaces}
        filter_Type={filterType}
        onCreationRefetch={onCreationRefetch}
        setOnCreationRefetch={setOnCreationRefetch}
        sortValue={sortDropDownValue}
        setSortValue={setSortDropdownValue}
        isCreateWizardOpen={isCreateWizardOpen}
        setIsCreateWizardOpen={setIsCreateWizardOpen}
        selectedAddressSpaces={selectedAddressSpaces}
        onSelectAddressSpace={onSelectAddressSpace}
        onSelectAllAddressSpace={onSelectAllAddressSpace}
      />
      {totalAddressSpaces > 0 && renderPagination(page, perPage)}
    </PageSection>
  );
}
