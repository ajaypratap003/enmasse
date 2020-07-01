/*
 * Copyright 2020, EnMasse authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

import React from "react";
import { Grid, GridItem, Card, CardBody } from "@patternfly/react-core";
import { AdapterList } from "components";

export default {
  title: "AdapterList"
};

const httpAdapter = {
  url: "https://http.bosch-iot-hub.com"
};
const mqttAdapter = {
  tls: true,
  host: "mange.bosh-iot-hub.com",
  port: 8883
};
const amqpAdapter = {
  url: "https://http.bosch-iot-hub.com"
};
const coapAdapter = {
  url: "https://http.bosch-iot-hub.com"
};
const adapters: any = [
  { type: "http", value: httpAdapter },
  { type: "mqtt", value: mqttAdapter },
  { type: "amqp", value: amqpAdapter },
  { type: "coap", value: coapAdapter }
];

export const AdapterListPage = () => (
  <Grid hasGutter>
    <GridItem span={6}>
      <Card>
        <CardBody>
          <AdapterList id="adapter-list" adapters={adapters} />
        </CardBody>
      </Card>
    </GridItem>
  </Grid>
);
