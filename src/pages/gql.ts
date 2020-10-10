import { gql } from "@apollo/client";

export const LINKS_QUERY = gql`
  query Links($tag: String) {
    links(tag: $tag) {
      id
      url
      description
      metadata {
        id
        title
        description
        image
        estimatedTimeToRead
      }
      tags {
        name
      }
    }
  }
`;

export const UPDATE_METADATA_MUTATION = gql`
  mutation UpdateMetadata($id: Int!) {
    updateMetadata(id: $id) {
      id
    }
  }
`;

export const DELETE_LINK_MUTATION = gql`
  mutation DeleteLink($id: Int!) {
    removeLink(id: $id) {
      id
    }
  }
`;

export const LINK_QUERY = gql`
  query Link($id: Int!) {
    link(id: $id) {
      id
      url
      description
    }
  }
`;

export const UPDATE_LINK = gql`
  mutation UpdateLink($id: Int!, $url: String!, $description: String!, $tags: [String!]) {
    updateLink(id: $id, url: $url, description: $description, tags: $tags) {
      id
      url
      description
      tags {
        name
      }
    }
  }
`;
