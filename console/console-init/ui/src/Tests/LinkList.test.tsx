/*
 * Copyright 2020, EnMasse authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import {
  ILink,
  ConnectionLinksList
} from "modules/connection-detail/components";

describe("Link List", () => {
  test("it renders a list of links", () => {
    const links: ILink[] = [
      {
        role: "sender",
        name: "foo1",
        address: "queue1",
        deliveries: 1,
        accepted: 0,
        rejected: 2,
        released: 3,
        modified: 4,
        presettled: 5,
        undelivered: 6,
        status: "running"
      },
      {
        role: "receiver",
        name: "foo2",
        address: "queue2",
        deliveries: 7,
        accepted: 14,
        rejected: 8,
        released: 9,
        modified: 0,
        presettled: 11,
        undelivered: 12,
        status: "running"
      }
    ];

    const { getByText } = render(
      <MemoryRouter>
        <ConnectionLinksList rows={links} />
      </MemoryRouter>
    );

    //Testing elements of first row
    const roleNodeOne = getByText(links[0].role);
    const nameNodeOne = getByText(links[0].name);
    const addressNodeOne = getByText(links[0].address);
    const deliveriesNodeOne = getByText(links[0].deliveries.toString());

    expect(roleNodeOne).toBeDefined();
    expect(nameNodeOne).toBeDefined();
    expect(addressNodeOne).toBeDefined();
    expect(deliveriesNodeOne).toBeDefined();

    //Testing elements of second row
    const roleNodeTwo = getByText(links[1].role);
    const nameNodeTwo = getByText(links[1].name);
    const addressNodeTwo = getByText(links[1].address);
    const deliveriesNodeTwo = getByText(links[1].deliveries.toString());

    expect(roleNodeTwo).toBeDefined();
    expect(nameNodeTwo).toBeDefined();
    expect(addressNodeTwo).toBeDefined();
    expect(deliveriesNodeTwo).toBeDefined();
  });
});
