/*
 * Copyright 2020, EnMasse authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

import React from "react";
import { MemoryRouter } from "react-router";
import { DeviceFilter } from "modules/iot-device";
import {
  DeviceListAlert,
  DeviceList,
  IDevice,
  DeviceListToolbar,
  DeviceListFooterToolbar
} from "modules/iot-device";
import { text, boolean } from "@storybook/addon-knobs";
import { action } from "@storybook/addon-actions";
import { getTableCells, getInitialFilter } from "modules/iot-device/utils";
import {
  PageSection,
  Page,
  PageSectionVariants,
  GridItem,
  Grid,
  DropdownItem,
  CardBody,
  Card,
  Divider
} from "@patternfly/react-core";
import { IRowData } from "@patternfly/react-table";

export default {
  title: "Device List Page"
};

const rows: IDevice[] = [
  {
    deviceId: "littlesensor1",
    viaGateway: true,
    enabled: true,
    selected: true,
    lastSeen: "2020-01-20T11:44:28.607Z",
    lastUpdated: "2020-01-20T11:44:28.607Z",
    creationTimeStamp: "2020-01-20T11:44:28.607Z"
  },
  ...new Array(15).fill({
    deviceId: "jboss20",
    type: false,
    enabled: false,
    selected: false,
    lastSeen: "2020-04-20T11:44:28.607Z",
    lastUpdated: "2020-04-29T11:44:28.607Z",
    creationTimeStamp: "2020-04-30T11:44:28.607Z"
  })
];

const actionResolver = (rowData: IRowData) => [
  {
    title: "Delete",
    onClick: () => {}
  },
  {
    title: "Disable",
    onClick: () => {}
  }
];

const kebabItems: React.ReactNode[] = [
  <DropdownItem onClick={action("kebab enable devices")}>Enable</DropdownItem>,
  <DropdownItem onClick={action("kebab disable devices")}>
    Disable
  </DropdownItem>,
  <DropdownItem onClick={action("kebab delete devices")}>Delete</DropdownItem>
];

const bulkSelectItems: React.ReactNode[] = [
  <DropdownItem key="item-1" onClick={action("Deselect all")}>
    Select none (0 items)
  </DropdownItem>,
  <DropdownItem key="item-2" onClick={action("Select all items in the page")}>
    Select page (10 items)
  </DropdownItem>,
  <DropdownItem key="item-3" onClick={action("Select all items")}>
    Select all (100 items)
  </DropdownItem>
];

const Data = (
  <Grid hasGutter>
    <GridItem span={3}>
      <Card>
        <CardBody>
          <DeviceFilter filter={getInitialFilter()} setFilter={() => {}} />
        </CardBody>
      </Card>
    </GridItem>
    <GridItem span={9}>
      <DeviceListAlert
        visible={true}
        variant={"info"}
        isInline={true}
        title={text("Alert title", "Run filter to view your devices")}
        description={text(
          "Alert description",
          "You have a total of 36,300 devices"
        )}
      />
      <br />
      <DeviceListToolbar
        itemCount={100}
        perPage={10}
        page={1}
        kebabItems={kebabItems}
        onSetPage={action("Pagination change page number")}
        onPerPageSelect={action("Pagination change items per page")}
        handleInputDeviceInfo={action("input device info handler clicked")}
        handleJSONUpload={action("json upload handler clicked")}
        isOpen={boolean("is Open", false)}
        onSelect={action("On select handler for bulk select component")}
        onToggle={action("On toggle handler for bulk select component")}
        isChecked={boolean("isChecked", false)}
        items={bulkSelectItems}
        onSelectAllDevices={action("All devices selected")}
        onChange={action("checkbox dropdown changed")}
      />
      <Divider />
      <DeviceList
        deviceRows={rows.map(getTableCells)}
        onSelectDevice={async () => {}}
        actionResolver={actionResolver}
      />
      <DeviceListFooterToolbar itemCount={100} perPage={10} page={1} />
    </GridItem>
  </Grid>
);

export const deviceListPage = () => {
  return (
    <MemoryRouter>
      <Page>
        <PageSection variant={PageSectionVariants.default}>{Data}</PageSection>
      </Page>
    </MemoryRouter>
  );
};
