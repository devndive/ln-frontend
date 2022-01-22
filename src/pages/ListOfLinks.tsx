import React from "react";
import ReactMarkdown from "react-markdown";
import { Link } from "../types";
import { Logger } from "../Logger";
import { Link as RouterLink } from "react-router-dom";

import { useDeleteLinkMutation, useUpdateMetadataMutation } from "./hooks";

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
  links: Link[];
}

const ShareButton: React.FC<{ link: Link }> = ({ link }) => {
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
    <button type="button" className="btn btn-outline-primary btn-sm" onClick={handleShare}>
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
      share
    </button>
  );
};

const CopyToClipBoard: React.FC<{ link: Link }> = ({ link }) => {
  const [didCopy, setDidCopy] = React.useState(false);

  const handleCopyToClipboard = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();

    window.navigator.clipboard
      .writeText(link.url)
      .then(() => setDidCopy(true))
      .catch((e) => {
        Logger.error(e);
      });
  };

  if (!window.navigator.clipboard) {
    return null;
  }

  const cssClass = didCopy ? "btn-outline-success" : "btn-outline-primary";

  return (
    <button type="button" className={`btn ${cssClass} btn-sm`} onClick={handleCopyToClipboard}>
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
      )}{" "}
      copy
    </button>
  );
};

export const ListOfLinks = ({ links }: ListOfLinksProps) => {
  const updateMetaDataMutation = useUpdateMetadataMutation();
  const deleteLinkMutation = useDeleteLinkMutation();

  const updateMetadata = (id: number) => {
    updateMetaDataMutation.mutate({ id });
  };

  const deleteLink = (id: number) => {
    deleteLinkMutation.mutate({ id });
  };

  return (
    <>
      {links.map((link: Link) => {
        return (
          <div className="row mb-4 shadow " key={link.id}>
            <div className="col-sm-6 mt-3 mb-3 border-right">
              {link.metadata ? (
                <div className="row">
                  <div className="col-sm-4 col-2">
                    {link.metadata.image && (
                      <img
                        loading="lazy"
                        src={makeUrlSchemaAbsolute(link.metadata.image)}
                        className="card-img-top"
                        alt="Card for article"
                      />
                    )}
                  </div>
                  <div className="col-sm-8 col-10">
                    <h5 className="card-title">{link.metadata.title}</h5>
                    <h6 className="card-subtitle mb-2 text-muted">
                      {humanizeTime(link.metadata.estimatedTimeToRead)}
                    </h6>
                    <p className="card-text">{link.metadata.description}</p>

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
            <div className="col-sm-6 mt-3 mb-3">
              <div className="btn-group float-end" role="group" aria-label="Actions for the current link">
                <a href={link.url} target="_blank" rel="noreferrer" className="btn btn-outline-primary btn-sm">
                  read
                </a>
                <ShareButton link={link} />
                <RouterLink className="btn btn-outline-primary btn-sm" to={`/links/${link.id}/edit`}>
                  edit
                </RouterLink>
                <button className="btn btn-outline-danger btn-sm" onClick={() => deleteLink(link.id)}>
                  delete
                </button>
              </div>
              <p>Notes:</p>
              <ReactMarkdown className="result" children={link.description} />
              <p>
                {link.tags?.map((t) => (
                  <RouterLink to={`/tags/${t.name}`} key={t.name}>
                    <span key={t.name} className="badge bg-dark me-1">
                      {t.name}
                    </span>
                  </RouterLink>
                ))}
              </p>
            </div>
          </div>
        );
      })}
    </>
  );
};
