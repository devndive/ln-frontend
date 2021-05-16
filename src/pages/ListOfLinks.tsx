import { useMutation } from "@apollo/client";
import React from "react";
import ReactMarkdown from "react-markdown";
import { Link } from "react-router-dom";
import { UPDATE_METADATA_MUTATION, DELETE_LINK_MUTATION } from "./gql";
import toc from "remark-toc";
import { Links_links } from "./__generated__/Links";
import { Logger } from "../Logger";

const humanizeTime = (time: number | null): string => {
  if (time === null) {
    return "";
  }

  if (time < 0.5) {
    return "less than a minute";
  }
  if (time >= 0.5 && time < 1.5) {
    return "1 minute";
  }

  return `${Math.ceil(time)} minutes`;
};

const makeUrlSchemaAbsolute = (url: string): string => {
  if (url.startsWith("http://")) {
    return url.replace("http://", "//");
  }

  return url;
};

interface ListOfLinksProps {
  links: Links_links[];
}

const ShareButton: React.FC<{ link: Links_links }> = ({ link }) => {
  if (!window.navigator.share) {
    return <CopyToClipBoard link={link} />;
  }

  const handleShare = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();

    window.navigator.share({
      url: link.url,
      title: link.metadata?.title,
      text: link.metadata?.description,
    });
  };

  return (
    <button type="button" className="btn btn-secondary ms-1" onClick={handleShare}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        className="bi bi-share"
        viewBox="0 0 16 16"
      >
        <path d="M13.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5zm-8.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm11 5.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z" />
      </svg>{" "}
      Share
    </button>
  );
};

const CopyToClipBoard: React.FC<{ link: Links_links }> = ({ link }) => {
  const [didCopy, setDidCopy] = React.useState(false);

  const handleCopyToClipboard = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();

    window.navigator.clipboard.writeText(link.url)
      .then(() => setDidCopy(true))
      .catch(e => { Logger.error(e) })
  };

  if (!window.navigator.clipboard) {
    return null;
  }

  const cssClass = didCopy ? "btn-outline-success": "btn-outline-secondary";

  return (
    <button type="button" className={`btn ${cssClass} ms-1`} onClick={handleCopyToClipboard}>
      {!didCopy && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-clipboard"
          viewBox="0 0 16 16"
        >
          <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z" />
          <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z" />
        </svg>
      )}

      {didCopy && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-clipboard-check"
          viewBox="0 0 16 16"
        >
          <path
            fillRule="evenodd"
            d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0z"
          />
          <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z" />
          <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z" />
        </svg>
      )}
      {" "}
      Copy
    </button>
  );
};

export const ListOfLinks = ({ links }: ListOfLinksProps) => {
  const [updateMetaDataMutation] = useMutation(UPDATE_METADATA_MUTATION);
  const [deleteLinkMutation] = useMutation(DELETE_LINK_MUTATION, {
    update: (cache, { data: { removeLink } }) => {
      cache.modify({
        fields: {
          links(existingLinks, { readField }) {
            return existingLinks.filter(
              (l: any) => readField("id", l) !== readField("id", removeLink)
            );
          },
        },
      });
    },
  });

  const updateMetadata = (id: number) => {
    updateMetaDataMutation({ variables: { id } }).catch((e) => {
      Logger.error("Error", e);
    });
  };

  const deleteLink = (id: number) => {
    deleteLinkMutation({ variables: { id } }).catch((e) => {
      Logger.error("Error", e);
    });
  };

  return (
    <>
      {links.map((link: Links_links) => {
        return (
          <div className="row mb-4 shadow " key={link.id}>
            <div className="col-sm-4 mt-3 mb-3 border-right">
              {link.metadata ? (
                <div className="row">
                  <div className="col-md-4">
                    {link.metadata.image && (
                      <img
                        loading="lazy"
                        src={makeUrlSchemaAbsolute(link.metadata.image)}
                        className="card-img-top"
                        alt="Card for article"
                      />
                    )}
                  </div>
                  <div className="col-md-8">
                    <h5 className="card-title">{link.metadata.title}</h5>
                    <h6 className="card-subtitle mb-2 text-muted">
                      {humanizeTime(link.metadata.estimatedTimeToRead)}
                    </h6>
                    <p className="card-text">{link.metadata.description}</p>

                    <a href={link.url} target="_blank" rel="noreferrer" className="btn btn-primary">
                      Go read
                    </a>

                    <ShareButton link={link} />
                  </div>
                </div>
              ) : (
                <div>
                  <p>No metadata</p>
                  <button className="btn btn-primary" onClick={() => updateMetadata(link.id)}>
                    Update metadata
                  </button>
                  <a href={link.url} target="_blank" rel="noreferrer">
                    Check URL
                  </a>
                </div>
              )}
            </div>
            <div className="col-sm-8 mt-3 mb-3">
              <div className="float-end">
                <Link className="btn btn-primary btn-sm me-1" to={`/links/${link.id}/edit`}>
                  edit
                </Link>
                <button className="btn btn-danger btn-sm" onClick={() => deleteLink(link.id)}>
                  delete
                </button>
              </div>
              <p>Notes:</p>
              <ReactMarkdown
                className="result"
                children={link.description}
                plugins={[toc]}
              />
              <p>
                {link.tags?.map((t) => (
                  <Link to={`/tags/${t.name}`} key={t.name}>
                    <span key={t.name} className="badge bg-dark me-1">
                      {t.name}
                    </span>
                  </Link>
                ))}
              </p>
            </div>
          </div>
        );
      })}
    </>
  );
};
