import { useQuery } from "@apollo/client";
import React from "react";
import { LINKS_QUERY } from "./gql";
import { ListOfLinks } from "./ListOfLinks";


export const Links = () => {
  const [links, setLinks] = React.useState([]);

  useQuery(LINKS_QUERY, {
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
