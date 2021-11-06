import { ListOfLinks } from "./ListOfLinks";
import { useLinks } from "./hooks";

export const Links = () => {
  const { isLoading, data: links } = useLinks();

  return (
    <div>
      <h1 className="mb-4">Links</h1>

      {isLoading && <div>Loading ...</div>}
      {links && <ListOfLinks links={links} />}
    </div>
  );
};
