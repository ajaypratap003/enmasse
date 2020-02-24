/*
 * Copyright 2020, EnMasse authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

import * as React from "react";
import { AddressSpaceNavigation } from "components/AddressSpace/AddressSpaceNavigation";
import {
  useA11yRouteChange,
  useDocumentTitle,
  SwitchWith404,
  LazyRoute,
  Loading,
  useBreadcrumb
} from "use-patternfly";
import {
  PageSection,
  PageSectionVariants,
  Breadcrumb,
  BreadcrumbItem
} from "@patternfly/react-core";
import { Redirect, useParams, Link } from "react-router-dom";
import {
  IAddressSpaceHeaderProps,
  AddressSpaceHeader
} from "components/AddressSpace/AddressSpaceHeader";
import { useQuery, useApolloClient } from "@apollo/react-hooks";
import { StyleSheet, css } from "@patternfly/react-styles";
import { useHistory } from "react-router";
import {
  DOWNLOAD_CERTIFICATE,
  DELETE_ADDRESS_SPACE,
  RETURN_ADDRESS_SPACE_DETAIL
} from "queries";
import { DialoguePrompt } from "components/common/DialoguePrompt";
import { POLL_INTERVAL } from "constants/constants";
import { useMutationQuery } from "hooks";

const styles = StyleSheet.create({
  no_bottom_padding: {
    paddingBottom: 0
  }
});
const getConnectionsList = () =>
  import("./ConnectionList/ConnectionListWithFilterAndPaginationPage");
const getAddressesList = () =>
  import("./AddressList/AddressesListWithFilterAndPaginationPage");

interface IAddressSpaceDetailResponse {
  addressSpaces: {
    addressSpaces: Array<{
      metadata: {
        namespace: string;
        name: string;
        creationTimestamp: string;
      };
      spec: {
        type: string;
        plan: {
          spec: {
            displayName: string;
          };
        };
      };
      status: {
        isReady: boolean;
        messages: Array<string>;
      };
    }>;
  };
}
export interface IObjectMeta_v1_Input {
  name: string;
  namespace: string;
}
const breadcrumb = (
  <Breadcrumb>
    <BreadcrumbItem>
      <Link to={"/"}>Home</Link>
    </BreadcrumbItem>
    <BreadcrumbItem isActive={true}>Address Space</BreadcrumbItem>
  </Breadcrumb>
);
export default function AddressSpaceDetailPage() {
  const { name, namespace, subList } = useParams();
  useA11yRouteChange();
  useBreadcrumb(breadcrumb);
  useDocumentTitle("Address Space Detail");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const history = useHistory();

  const { loading, error, data } = useQuery<IAddressSpaceDetailResponse>(
    RETURN_ADDRESS_SPACE_DETAIL(name, namespace),
    { pollInterval: POLL_INTERVAL }
  );
  const client = useApolloClient();

  const resetFormState = (data: any) => {
    if (data) {
      setIsDeleteModalOpen(!isDeleteModalOpen);
      history.push("/");
    }
  };
  const [setDeleteAddressSpaceQueryVariables] = useMutationQuery(
    DELETE_ADDRESS_SPACE,
    resetFormState
  );

  if (loading) return <Loading />;

  const { addressSpaces } = data || {
    addressSpaces: { total: 0, addressSpaces: [] }
  };

  if (!addressSpaces || addressSpaces.addressSpaces.length <= 0) {
    return <Loading />;
  }

  //Download the certificate function
  const downloadCertificate = async (data: IObjectMeta_v1_Input) => {
    const dataToDownload = await client.query({
      query: DOWNLOAD_CERTIFICATE,
      variables: {
        as: {
          name: data.name,
          namespace: data.namespace
        }
      }
    });
    if (dataToDownload.errors) {
      console.log("Error while download", dataToDownload.errors);
    }
    const url = window.URL.createObjectURL(
      new Blob([dataToDownload.data.messagingCertificateChain])
    );
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${name}.crt`);
    document.body.appendChild(link);
    link.click();
    if (link.parentNode) link.parentNode.removeChild(link);
  };
  const handleCancelDelete = () => {
    setIsDeleteModalOpen(!isDeleteModalOpen);
  };

  /**
   * delete address space
   * @param data
   */
  const deleteAddressSpace = (data: IObjectMeta_v1_Input) => {
    const variables = {
      a: {
        name: data.name,
        namespace: data.namespace
      }
    };
    setDeleteAddressSpaceQueryVariables(variables);
  };
  const handleDelete = () => {
    deleteAddressSpace({
      name: addressSpaceDetails.name,
      namespace: addressSpaceDetails.namespace
    });
  };

  const metadata =
    addressSpaces &&
    addressSpaces.addressSpaces[0] &&
    addressSpaces.addressSpaces[0].metadata;
  const addressSpaceDetails: IAddressSpaceHeaderProps = {
    name: metadata && metadata.name,
    namespace: metadata && metadata.namespace,
    createdOn: metadata && metadata.creationTimestamp,
    type:
      addressSpaces &&
      addressSpaces.addressSpaces[0] &&
      addressSpaces.addressSpaces[0].spec &&
      addressSpaces.addressSpaces[0].spec.type,
    onDownload: data => {
      downloadCertificate(data);
    },
    onDelete: data => {
      setIsDeleteModalOpen(!isDeleteModalOpen);
    }
  };

  return (
    <>
      <PageSection
        variant={PageSectionVariants.light}
        className={css(styles.no_bottom_padding)}
      >
        <AddressSpaceHeader {...addressSpaceDetails} />
        <AddressSpaceNavigation
          activeItem={subList || "addresses"}
        ></AddressSpaceNavigation>
        {isDeleteModalOpen && (
          <DialoguePrompt
            option="Delete"
            detail={`Are you sure you want to delete this addressspace: ${addressSpaceDetails.name} ?`}
            names={[addressSpaceDetails.name]}
            header="Delete this Address Space ?"
            handleCancelDialogue={handleCancelDelete}
            handleConfirmDialogue={handleDelete}
          />
        )}
      </PageSection>
      <PageSection>
        <SwitchWith404>
          <Redirect path="/" to="/address-spaces" exact={true} />
          <LazyRoute
            path="/address-spaces/:namespace/:name/:type/addresses/"
            getComponent={getAddressesList}
            exact={true}
          />
          <LazyRoute
            path="/address-spaces/:namespace/:name/:type/connections/"
            getComponent={getConnectionsList}
            exact={true}
          />
        </SwitchWith404>
      </PageSection>
    </>
  );
}
