/*
 * Copyright 2020, EnMasse authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */

import React from "react";
import {
  AboutModal,
  TextListItem,
  TextContent,
  TextList
} from "@patternfly/react-core";

interface IAboutProps {
  isAboutModalOpen: boolean;
  handleAboutModalToggle: () => void;
}

export const About: React.FunctionComponent<IAboutProps> = ({
  isAboutModalOpen,
  handleAboutModalToggle
}) => {
  const createPropsWithLogoAndBgImages = (productName: string) => {
    var imagePrefix = productName.toLowerCase().split(" ")[0];

    var modalImgProps = {
      brandImageSrc: "",
      brandImageAlt: productName,
      backgroundImageSrc: ""
    };
    try {
      modalImgProps.brandImageSrc = require("assets/images/" +
        imagePrefix +
        "_about_logo.svg");
      modalImgProps.backgroundImageSrc = require("assets/images/" +
        imagePrefix +
        "_about_bg.svg");
    } catch (err) {
      //using default provided background image, when none supplied.
    }

    return modalImgProps;
  };
  let productName = process.env.REACT_APP_NAME;
  let productVersion = process.env.REACT_APP_VERSION;
  if (!productName) {
    productName = "";
    console.log("Product name not set in process.env.REACT_APP_NAME");
  }
  if (!productVersion) {
    productVersion = "";
    console.log("process.env.REACT_APP_VERSION is not set");
  }
  let docs = process.env.REACT_APP_DOCS;
  if (!docs) {
    console.log("process.env.REACT_APP_DOCS is not set");
  }
  let docsElement;
  if (docs) {
    docsElement = (
      <>
        <TextListItem component="dt">Documentation</TextListItem>
        <TextListItem component="dd">
          <a href={process.env.REACT_APP_DOCS}>{process.env.REACT_APP_DOCS}</a>
        </TextListItem>
      </>
    );
  }
  var modalImgProps = createPropsWithLogoAndBgImages(productName);
  return (
    <AboutModal
      isOpen={isAboutModalOpen}
      onClose={handleAboutModalToggle}
      productName={productName}
      {...modalImgProps}
    >
      <TextContent>
        <TextList component="dl">
          <TextListItem component="dt">EnMasse Version</TextListItem>
          <TextListItem component="dd">{productVersion}</TextListItem>
          {docsElement}
        </TextList>
      </TextContent>
    </AboutModal>
  );
};
