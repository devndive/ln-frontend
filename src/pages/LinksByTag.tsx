import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useLinks } from "./hooks";
import { ListOfLinks } from "./ListOfLinks";

export const LinksByTag = () => {
  const { tag } = useParams();

  const { data: links, isLoading, refetch } = useLinks(tag, { enabled: false });

  useEffect(() => {
    if (tag) {
      refetch();
    }
  }, [tag]);

  if (isLoading) {
    return <p>Loading ...</p>;
  }

  return (
    <div>
      <h1 className="mb-4">Links</h1>

      {links && <ListOfLinks links={links} />}
    </div>
  );
};
