/*
 * Copyright 2020, EnMasse authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

import * as React from "react";
import {
  ConnectionDetailHeader,
  IConnectionHeaderDetailProps
} from "src/Components/ConnectionDetail/ConnectionDetailHeader";
import {
  PageSection,
  Breadcrumb,
  BreadcrumbItem
} from "@patternfly/react-core";
import { useQuery } from "@apollo/react-hooks";
import { useParams } from "react-router";
import { Loading, useA11yRouteChange, useBreadcrumb, useDocumentTitle } from "use-patternfly";
import { getFilteredValue } from "src/Components/Common/ConnectionListFormatter";
import { IConnectionDetailResponse } from "src/Types/ResponseTypes";
import { Link } from "react-router-dom";
import { RETURN_CONNECTION_DETAIL } from "src/Queries/Queries";
import { ConnectionLinksWithFilterAndPaginationPage } from "./ConnectionLinksWithFilterAndPaginationPage";

const getProductFilteredValue = (object: any[], value: string) => {
  if (object && object != null) {
    const filtered = object.filter(obj => obj.Key === value);
    if (filtered.length > 0) {
      return filtered[0].Value;
    }
  }
  return "-";
};

const getSplitValue = (value: string) => {
  let string1 = value.split(", OS: ");
  let string2 = string1[0].split("JVM:");
  let os, jvm;
  if (string1.length > 1) {
    os = string1[1];
  }
  if (string2.length > 0) {
    jvm = string2[1];
  }
  return { jvm: jvm, os: os };
};

export default function ConnectionDetailPage() {
  const { name, namespace, type, connectionname } = useParams();
  useDocumentTitle("Connection Details");
  const breadcrumb = React.useMemo(
    () => (
      <Breadcrumb>
        <BreadcrumbItem>
          <Link id="cdetail-link-home" to={"/"}>
            Home
          </Link>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <Link
            id="cdetail-link-connections"
            to={`/address-spaces/${namespace}/${name}/${type}/connections`}>
            {name}
          </Link>
        </BreadcrumbItem>
        <BreadcrumbItem isActive={true}>Connection</BreadcrumbItem>
      </Breadcrumb>
    ),
    [name, namespace, type]
  );

  useBreadcrumb(breadcrumb);
  useA11yRouteChange();
  const { loading, error, data } = useQuery<IConnectionDetailResponse>(
    RETURN_CONNECTION_DETAIL(name || "", namespace || "", connectionname || ""),
    { pollInterval: 5000 } 
  );
  if (loading) return <Loading />;
  if (error) {
    console.log(error);
    // return <Loading />;
  }
  const { connections } = data || {
    connections: { Total: 0, Connections: [] }
  };
  const connection = connections.Connections[0];
  // setTotalLinks(connections.Total);
  //Change this logic
  const jvmObject =
    connection.Spec &&connection.Spec.Properties && connection.Spec.Properties.length > 0
      ? getSplitValue(
          getProductFilteredValue(connection.Spec.Properties, "platform")
        )
      : { jvm: "-", os: "-" };

  const connectionDetail: IConnectionHeaderDetailProps = {
    hostname: connection.Spec.Hostname,
    containerId: connection.Spec.ContainerId,
    version: getProductFilteredValue(connection.Spec.Properties, "version"),
    protocol: connection.Spec.Protocol.toUpperCase(),
    encrypted: connection.Spec.Encrypted || false,
    creationTimestamp:connection.ObjectMeta.CreationTimestamp,
    messageIn: getFilteredValue(connection.Metrics, "enmasse_messages_in"),
    messageOut: getFilteredValue(connection.Metrics, "enmasse_messages_out"),
    //Change this logic
    platform: jvmObject && jvmObject.jvm,
    os: jvmObject && jvmObject.os,
    product:
      connection.Spec.Properties && connection.Spec.Properties.length > 0
        ? getProductFilteredValue(connection.Spec.Properties, "product")
        : "-"
  };

  return (
    <>
      <ConnectionDetailHeader {...connectionDetail} />
      <PageSection>
        <ConnectionLinksWithFilterAndPaginationPage
          name={name}
          namespace={namespace}
          connectionname={connectionname}
        />
      </PageSection>
    </>
  );
}
