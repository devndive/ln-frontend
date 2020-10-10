/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Links
// ====================================================

export interface Links_links_metadata {
  __typename: "Metadata";
  id: number | null;
  title: string | null;
  description: string | null;
  image: string | null;
  estimatedTimeToRead: number | null;
}

export interface Links_links_tags {
  __typename: "Tag";
  name: string;
}

export interface Links_links {
  __typename: "Link";
  id: number;
  url: string;
  description: string;
  metadata: Links_links_metadata | null;
  tags: Links_links_tags[];
}

export interface Links {
  links: Links_links[] | null;
}

export interface LinksVariables {
  tag?: string | null;
}
