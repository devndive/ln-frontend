/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateLink
// ====================================================

export interface UpdateLink_updateLink_tags {
  __typename: "Tag";
  name: string;
}

export interface UpdateLink_updateLink {
  __typename: "Link";
  id: number;
  url: string;
  description: string;
  tags: UpdateLink_updateLink_tags[];
}

export interface UpdateLink {
  updateLink: UpdateLink_updateLink | null;
}

export interface UpdateLinkVariables {
  id: number;
  url: string;
  description: string;
  tags?: string[] | null;
}
