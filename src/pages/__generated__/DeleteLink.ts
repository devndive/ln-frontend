/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteLink
// ====================================================

export interface DeleteLink_removeLink {
  __typename: "Link";
  id: number;
}

export interface DeleteLink {
  removeLink: DeleteLink_removeLink | null;
}

export interface DeleteLinkVariables {
  id: number;
}
