import React from "react";
import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { LINKS_QUERY } from "./gql";
import { ListOfLinks } from "./ListOfLinks";

export const LinksByTag = () => {
  const { tag } = useParams<{ tag: string }>();
  const [links, setLinks] = React.useState([]);

  useQuery(LINKS_QUERY, {
    variables: {
      tag,
    },
    onCompleted: (data) => {
      setLinks(data.links);
    },
    fetchPolicy: "cache-and-network",
  });

  return (
    <div>
      <h1 className="mb-4">Links</h1>

      <ListOfLinks links={links} />
    </div>
  );
};
