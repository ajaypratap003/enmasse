import React, { useState } from "react";
import {
  Dropdown as DropdownComponent,
  DropdownToggle,
  DropdownItem,
  DropdownSeparator,
  DropdownPosition,
  DropdownDirection,
  KebabToggle,
  DropdownProps
} from "@patternfly/react-core";
import { FilterIcon } from "@patternfly/react-icons";

export interface IDropdownProps extends DropdownProps {
  id: string;
  isFilterIconDisplay?: boolean;
  defaultSelectedItem?: any;
}

export const Dropdown: React.FC<IDropdownProps> = ({
  id,
  isFilterIconDisplay,
  defaultSelectedItem,
  dropdownItems,
  onSelect
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState(defaultSelectedItem);

  const onToggle = () => {
    setIsOpen(!isOpen);
  };

  const onSelectItem = (event: any) => {
    let selectedItem = event && event.target.value;
    setSelectedItem(selectedItem);
    onToggle();

    if (onSelect) {
      onSelect(selectedItem);
    }
  };

  return (
    <DropdownComponent
      onSelect={onSelectItem}
      toggle={
        <DropdownToggle id={id} onToggle={onToggle}>
          {isFilterIconDisplay && <FilterIcon />}
          &nbsp;
          {selectedItem || "Filter"}
        </DropdownToggle>
      }
      isOpen={isOpen}
      autoFocus={false}
      dropdownItems={
        dropdownItems &&
        dropdownItems.map(option => (
          <DropdownItem
            id={`al-filter-dropdown${option.key}`}
            key={option.key}
            value={option.value}
            itemID={option.key}
            component={"button"}
          >
            {option.value}
          </DropdownItem>
        ))
      }
    />
  );
};
