import { useParams } from "react-router-dom";
import { useLinks } from "./hooks";
import { ListOfLinks } from "./ListOfLinks";

export const LinksByTag = () => {
  const { tag } = useParams<{ tag: string }>();

  const { data: links, isLoading } = useLinks(tag);

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
