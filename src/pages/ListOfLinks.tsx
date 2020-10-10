import { useMutation } from "@apollo/client";
import React from "react";
import ReactMarkdown from "react-markdown";
import { Link } from "react-router-dom";
import { UPDATE_METADATA_MUTATION, DELETE_LINK_MUTATION } from "./gql";
import toc from "remark-toc";
import { Links_links } from "./__generated__/Links";

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

interface ListOfLinksProps {
  links: Links_links[];
}

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
    updateMetaDataMutation({ variables: { id } })
      .then(() => {
        console.log("All good");
      })
      .catch((e) => {
        console.log("Error", e);
      });
  };

  const deleteLink = (id: number) => {
    deleteLinkMutation({ variables: { id } })
      .then(() => {
        console.log("Link deleted");
      })
      .catch((e) => {
        console.log("Error", e);
      });
  };

  return (
    <>
      {links.map((link: Links_links, idx) => {
        return (
          <div className="row mb-4 shadow " key={idx}>
            <div className="col-sm-4 mt-3 mb-3 border-right">
              {link.metadata ? (
                <div className="row">
                  <div className="col-md-4">
                    {link.metadata.image && (
                      <img
                        src={link.metadata.image}
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
              <div className="float-right">
                <Link className="btn btn-primary btn-sm mr-1" to={`/links/${link.id}/edit`}>
                  edit
                </Link>
                <button className="btn btn-danger btn-sm" onClick={() => deleteLink(link.id)}>
                  delete
                </button>
              </div>
              <p>Notes:</p>
              <ReactMarkdown
                className="result"
                source={link.description}
                skipHtml={false}
                escapeHtml={false}
                plugins={[toc]}
              />
              <p>
                {link.tags?.map((t) => (
                  <a href={`/tags/${t.name}`} key={t.name}>
                    <span key={t.name} className="badge bg-dark mr-1">
                      {t.name}
                    </span>
                  </a>
                ))}
              </p>
            </div>
          </div>
        );
      })}
    </>
  );
};
