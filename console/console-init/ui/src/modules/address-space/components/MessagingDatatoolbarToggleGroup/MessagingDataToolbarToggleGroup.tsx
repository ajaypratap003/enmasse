/*
 * Copyright 2020, EnMasse authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

import React from "react";
import {
  SelectOptionObject,
  ToolbarToggleGroup,
  ToolbarGroup,
  ToolbarFilter,
  InputGroup,
  Button,
  ToolbarItem,
  ButtonVariant,
  DropdownPosition,
  Badge
} from "@patternfly/react-core";
import { ISelectOption } from "utils";
import { FilterIcon, SearchIcon } from "@patternfly/react-icons";
import {
  DropdownWithToggle,
  TypeAheadSelect,
  IDropdownOption
} from "components";

export interface IMessagingToolbarToggleGroupProps {
  totalRecords: number;
  filterSelected?: string;
  nameSelected?: string;
  nameInput?: string;
  namespaceSelected?: string;
  namespaceInput?: string;
  nameOptions?: any[];
  namespaceOptions?: any[];
  typeSelected?: string | null;
  statusSelected?: string | null;
  selectedNames: Array<{ value: string; isExact: boolean }>;
  selectedNamespaces: Array<{ value: string; isExact: boolean }>;
  onFilterSelect: (value: string) => void;
  onNameSelect: (e: any, selection: SelectOptionObject) => void;
  onNameClear: () => void;
  onNamespaceSelect: (e: any, selection: SelectOptionObject) => void;
  onNamespaceClear: () => void;
  onTypeSelect: (selection: string) => void;
  onStatusSelect: (selection: string) => void;
  onDeleteAll: () => void;
  onSearch: () => void;
  onDelete: (
    category: string | DataToolbarChipGroup,
    chip: string | DataToolbarChip
  ) => void;
  onChangeNameInput?: (value: string) => Promise<any>;
  onChangeNameSpaceInput?: (value: string) => Promise<any>;
  setNameInput?: (value: string) => void;
  setNameSpaceInput?: (value: string) => void;
}
const MessagingToolbarToggleGroup: React.FunctionComponent<IMessagingToolbarToggleGroupProps> = ({
  totalRecords,
  filterSelected,
  nameSelected,
  nameInput,
  namespaceSelected,
  namespaceInput,
  typeSelected,
  statusSelected,
  selectedNames,
  selectedNamespaces,
  onFilterSelect,
  onNameSelect,
  onNameClear,
  onNamespaceSelect,
  onNamespaceClear,
  onTypeSelect,
  onStatusSelect,
  onSearch,
  onDelete,
  onChangeNameInput,
  onChangeNameSpaceInput,
  setNameInput,
  setNameSpaceInput
}) => {
  const filterMenuItems = [
    { key: "name", value: "Name" },
    { key: "namespace", value: "Namespace" },
    { key: "type", value: "Type" },
    { key: "status", value: "Status" }
  ];

  const typeOptions: ISelectOption[] = [
    { key: "standard", value: "Standard", isDisabled: false },
    { key: "brokered", value: "Brokered", isDisabled: false }
  ];

  const statusOptions: IDropdownOption[] = [
    { key: "active", value: "Active", label: "Active" },
    { key: "configuring", value: "Configuring", label: "Configuring" },
    { key: "pending", value: "Pending", label: "Pending" },
    { key: "failed", value: "Failed", label: "Failed" },
    { key: "terminating", value: "Terminating", label: "Terminating" }
  ];

  const checkIsFilterApplied = () => {
    if (
      (selectedNames && selectedNames.length > 0) ||
      (selectedNamespaces && selectedNamespaces.length > 0) ||
      (typeSelected && typeSelected.trim() !== "") ||
      (statusSelected && statusSelected.trim() !== "")
    ) {
      return true;
    }
    return false;
  };
  const toggleItems = (
    <>
      <ToolbarItem spacer={{ md: "spacerNone" }} data-codemods="true">
        <ToolbarFilter
          chips={selectedNames.map(filter => filter.value)}
          deleteChip={onDelete}
          categoryName="Name"
        >
          {filterSelected && filterSelected.toLowerCase() === "name" && (
            <InputGroup>
              <TypeAheadSelect
                id="al-filter-input-name"
                ariaLabelTypeAhead={"Select name"}
                ariaLabelledBy={"typeahead-select-id"}
                onSelect={onNameSelect}
                onClear={onNameClear}
                selected={nameSelected}
                inputData={nameInput || ""}
                placeholderText={"Select name"}
                onChangeInput={onChangeNameInput}
                setInput={setNameInput}
              />
              <Button
                id="al-filter-search-name"
                variant={ButtonVariant.control}
                aria-label="search button for search name"
                onClick={onSearch}
              >
                <SearchIcon />
              </Button>
            </InputGroup>
          )}
        </ToolbarFilter>
      </ToolbarItem>
      <ToolbarItem spacer={{ md: "spacerNone" }} data-codemods="true">
        <ToolbarFilter
          chips={selectedNamespaces.map(filter => filter.value)}
          deleteChip={onDelete}
          categoryName="Namespace"
        >
          {filterSelected && filterSelected.toLowerCase() === "namespace" && (
            <InputGroup>
              <TypeAheadSelect
                id="al-filter-input-namespace"
                ariaLabelTypeAhead={"Select namespace"}
                ariaLabelledBy={"typeahead-select-id"}
                onSelect={onNamespaceSelect}
                onClear={onNamespaceClear}
                selected={namespaceSelected}
                inputData={namespaceInput || ""}
                placeholderText={"Select namespace"}
                onChangeInput={onChangeNameSpaceInput}
                setInput={setNameSpaceInput}
              />
              <Button
                id="al-filter-search-namespace"
                variant={ButtonVariant.control}
                aria-label="search button for search namespace"
                onClick={onSearch}
              >
                <SearchIcon />
              </Button>
            </InputGroup>
          )}
        </ToolbarFilter>
      </ToolbarItem>
      <ToolbarItem spacer={{ md: "spacerNone" }} data-codemods="true">
        <ToolbarFilter
          chips={typeSelected ? [typeSelected] : []}
          deleteChip={onDelete}
          categoryName="Type"
        >
          {filterSelected && filterSelected.toLowerCase() === "type" && (
            <DropdownWithToggle
              id={"al-filter-dropdown-type"}
              dropdownItemIdPrefix={"al-filter-dropdown-item-type"}
              position={DropdownPosition.left}
              onSelectItem={onTypeSelect}
              dropdownItems={typeOptions}
              value={typeSelected || "Select Type"}
            />
          )}
        </ToolbarFilter>
      </ToolbarItem>
      <ToolbarItem spacer={{ md: "spacerNone" }} data-codemods="true">
        <ToolbarFilter
          chips={statusSelected ? [statusSelected] : []}
          deleteChip={onDelete}
          categoryName="Status"
        >
          {filterSelected && filterSelected.toLowerCase() === "status" && (
            <DropdownWithToggle
              id={"al-filter-dropdown-status"}
              dropdownItemIdPrefix={"al-filter-dropdown-item-status"}
              position={DropdownPosition.left}
              onSelectItem={onStatusSelect}
              dropdownItems={statusOptions}
              value={statusSelected || "Select Status"}
            />
          )}
        </ToolbarFilter>
      </ToolbarItem>
    </>
  );

  const toggleGroupItems = (
    <ToolbarGroup variant="filter-group" data-codemods="true">
      <ToolbarFilter categoryName="Filter">
        <DropdownWithToggle
          id="al-filter-dropdown"
          toggleId={"al-filter-dropdown"}
          position={DropdownPosition.left}
          onSelectItem={onFilterSelect}
          dropdownItems={filterMenuItems}
          value={(filterSelected && filterSelected.trim()) || "Filter"}
          toggleIcon={
            <>
              <FilterIcon />
              &nbsp;
            </>
          }
        />
        {toggleItems}
      </ToolbarFilter>
    </ToolbarGroup>
  );

  return (
    <ToolbarToggleGroup
      toggleIcon={
        <>
          <FilterIcon />
          {checkIsFilterApplied() && (
            <Badge key={1} isRead>
              {totalRecords}
            </Badge>
          )}
        </>
      }
      show={{ xl: "show" }}
    >
      {toggleGroupItems}
    </ToolbarToggleGroup>
  );
};
export { MessagingToolbarToggleGroup };
