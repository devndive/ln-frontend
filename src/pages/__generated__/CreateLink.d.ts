/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateLink
// ====================================================

export interface CreateLink_createLink_metadata {
  __typename: "Metadata";
  id: number;
  title: string;
  description: string;
  image: string | null;
  estimatedTimeToRead: number;
}

export interface CreateLink_createLink_tags {
  __typename: "Tag";
  name: string;
}

export interface CreateLink_createLink {
  __typename: "Link";
  id: number;
  url: string;
  description: string;
  metadata: CreateLink_createLink_metadata | null;
  tags: CreateLink_createLink_tags[];
}

export interface CreateLink {
  createLink: CreateLink_createLink | null;
}

export interface CreateLinkVariables {
  url: string;
  description: string;
  tags?: string[] | null;
}
