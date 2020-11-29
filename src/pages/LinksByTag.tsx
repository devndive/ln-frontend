import React from "react";
import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { LINKS_QUERY } from "./gql";
import { ListOfLinks } from "./ListOfLinks";

export const LinksByTag = () => {
  const { tag } = useParams<{ tag: string }>();

  const { data: links, loading } = useQuery(LINKS_QUERY, {
    variables: { tag },
  });

  if (loading) {
    return <p>Loading ...</p>;
  }

  return (
    <div>
      <h1 className="mb-4">Links</h1>

      <ListOfLinks links={links.links} />
    </div>
  );
};
