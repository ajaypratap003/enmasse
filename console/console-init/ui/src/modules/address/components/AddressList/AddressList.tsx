/*
 * Copyright 2020, EnMasse authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

import React from "react";
import { Link } from "react-router-dom";
import {
  Table,
  TableVariant,
  TableHeader,
  TableBody,
  IRowData,
  sortable,
  IExtraData,
  ISortBy
} from "@patternfly/react-table";
import { css } from "@patternfly/react-styles";
import { FormatDistance } from "use-patternfly";
import { useWindowDimensions } from "components";
import { StyleForTable } from "modules/address-space/components";
import {
  AddressStatus,
  AddressErrorMessage,
  TypePlan,
  Messages
} from "modules/address";
import { AddressTypes } from "constants/constants";

export interface IAddress {
  name: string;
  displayName: string;
  namespace: string;
  type: string;
  planLabel: string;
  planValue: string;
  messageIn: number | string;
  messageOut: number | string;
  storedMessages: number | string;
  senders: number | string;
  receivers: number | string;
  partitions: number | null;
  isReady: boolean;
  creationTimestamp: string;
  errorMessages?: string[];
  status?: string;
  selected?: boolean;
  topic?: string | null;
}

interface IAddressListProps {
  rowsData: IAddress[];
  onEdit: (address: IAddress) => void;
  onDelete: (address: IAddress) => void;
  onPurge: (address: IAddress) => void;
  sortBy?: ISortBy;
  onSort?: (_event: any, index: any, direction: any) => void;
  onSelectAddress: (address: IAddress, isSelected: boolean) => void;
  onSelectAllAddress: (addresses: IAddress[], isSelected: boolean) => void;
}

export const AddressList: React.FunctionComponent<IAddressListProps> = ({
  rowsData,
  onEdit,
  onDelete,
  onPurge,
  sortBy,
  onSort,
  onSelectAddress,
  onSelectAllAddress
}) => {
  const { width } = useWindowDimensions();
  const actionResolver = (rowData: IRowData) => {
    const originalData = rowData.originalData as IAddress;
    if (
      originalData.type.trim() === AddressTypes.QUEUE ||
      originalData.type.trim() === AddressTypes.SUBSCRIPTION
    ) {
      return [
        {
          title: "Edit",
          onClick: () => onEdit(originalData)
        },
        {
          title: "Delete",
          onClick: () => onDelete(originalData)
        },
        {
          title: "Purge",
          onClick: () => onPurge(originalData)
        }
      ];
    } else {
      return [
        {
          title: "Edit",
          onClick: () => onEdit(originalData)
        },
        {
          title: "Delete",
          onClick: () => onDelete(originalData)
        }
      ];
    }
  };
  //TODO: Display error after the phase variable is exposed from backend.
  const toTableCells = (row: IAddress) => {
    if (row.isReady) {
      const tableRow: IRowData = {
        selected: row.selected,
        cells: [
          {
            title: <Link to={`addresses/${row.name}`}>{row.displayName}</Link>
          },
          { title: <TypePlan type={row.type} plan={row.planLabel} /> },
          {
            title: <AddressStatus phase={row.status || ""} />
          },
          {
            title: (
              <>
                <FormatDistance date={row.creationTimestamp} /> ago
              </>
            )
          },
          {
            title: (
              <Messages
                count={row.messageIn}
                column="MessageIn"
                isReady={row.isReady}
              />
            )
          },
          {
            title: (
              <Messages
                count={row.messageOut}
                column="MessageOut"
                isReady={row.isReady}
              />
            )
          },
          row.type === "multicast" || row.type === "anycast"
            ? ""
            : row.storedMessages,
          row.senders,
          row.receivers,
          row.type === AddressTypes.QUEUE ? row.partitions : ""
        ],
        originalData: row
      };
      return tableRow;
    } else {
      const tableRow: IRowData = {
        selected: row.selected,
        cells: [
          {
            title: <Link to={`addresses/${row.name}`}>{row.displayName}</Link>
          },
          { title: <TypePlan type={row.type} plan={row.planLabel} /> },
          {
            title: <AddressStatus phase={row.status || ""} />
          },
          {
            title: (
              <>
                <FormatDistance date={row.creationTimestamp} /> ago
              </>
            )
          },
          {
            title: row.errorMessages ? (
              <AddressErrorMessage messages={row.errorMessages} />
            ) : (
              ""
            ),
            props: { colSpan: 6 }
          }
        ],
        originalData: row
      };
      return tableRow;
    }
  };
  const tableRows = rowsData.map(toTableCells);
  const tableColumns = [
    { title: "Address", transforms: [sortable] },
    "Type/Plan",
    "Status",
    { title: "Time created", transforms: [sortable] },
    {
      title:
        width > 769 ? (
          <span style={{ display: "inline-flex" }}>
            Message In/sec
            <br />
            {`(over last 5 min)`}
          </span>
        ) : (
          "Message In/sec"
        ),
      transforms: [sortable]
    },
    {
      title:
        width > 769 ? (
          <span style={{ display: "inline-flex" }}>
            Message Out/sec
            <br />
            {`(over last 5 min)`}
          </span>
        ) : (
          "Message Out/sec"
        ),
      transforms: [sortable]
    },
    { title: "Stored Messages", transforms: [sortable] },
    { title: "Senders", transforms: [sortable] },
    { title: "Receivers", transforms: [sortable] },
    "Partitions"
  ];

  const onSelect = (
    event: React.MouseEvent,
    isSelected: boolean,
    rowIndex: number,
    rowData: IRowData,
    extraData: IExtraData
  ) => {
    let rows;
    if (rowIndex === -1) {
      rows = tableRows.map(row => {
        const data = row;
        data.selected = isSelected;
        return data;
      });
      onSelectAllAddress(
        rows.map(row => row.originalData),
        isSelected
      );
    } else {
      rows = [...tableRows];
      rows[rowIndex].selected = isSelected;
      onSelectAddress(rows[rowIndex].originalData, isSelected);
    }
  };
  return (
    <div className={css(StyleForTable.scroll_overflow)}>
      <Table
        variant={TableVariant.compact}
        onSelect={onSelect}
        cells={tableColumns}
        rows={tableRows}
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
  );
};
