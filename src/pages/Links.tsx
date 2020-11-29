import React from "react";

import { useQuery } from "@apollo/client";
import { LINKS_QUERY } from "./gql";
import { ListOfLinks } from "./ListOfLinks";

export const Links = () => {
  const { data, loading } = useQuery(LINKS_QUERY);

  if (loading) {
    return <p>Loading</p>;
  }

  return (
    <div>
      <h1 className="mb-4">Links</h1>

      <ListOfLinks links={data.links} />
    </div>
  );
};
