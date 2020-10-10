/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Link
// ====================================================

export interface Link_link {
  __typename: "Link";
  id: number;
  url: string;
  description: string;
}

export interface Link {
  link: Link_link | null;
}

export interface LinkVariables {
  id: number;
}
