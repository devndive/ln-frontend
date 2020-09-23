import { useQuery, useMutation, gql } from "@apollo/client";
import React from "react";
import ReactMarkdown from "react-markdown";
import { Link, useParams } from "react-router-dom";
import toc from "remark-toc";

export const LINKS_QUERY = gql`
  query Links($tag: String) {
    links(tag: $tag) {
      id
      url
      description
      metadata {
        id
        title
        description
        image
        estimatedTimeToRead
      }
      tags {
        name
      }
    }
  }
`;

const UPDATE_METADATA_MUTATION = gql`
  mutation UpdateMetadata($id: Int!) {
    updateMetadata(id: $id) {
      id
    }
  }
`;

const DELETE_LINK_MUTATION = gql`
  mutation DeleteLink($id: Int!) {
    removeLink(id: $id) {
      id
    }
  }
`;

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

  const humanizeTime = (time: number): string => {
    if (time < 0.5) {
      return "less than a minute";
    }
    if (time >= 0.5 && time < 1.5) {
      return "1 minute";
    }

    return `${Math.ceil(time)} minutes`;
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
    <div>
      <h1 className="mb-4">Links</h1>

      {links.map(
        (
          link: {
            id: number;
            url: string;
            description: string;
            metadata: {
              title: string;
              description: string;
              image: string;
              estimatedTimeToRead: number;
            };
            tags: { name: string }[];
          },
          idx
        ) => {
          return (
            <div className="row mb-4 shadow " key={idx}>
              <div className="col-sm-4 mt-3 mb-3 border-right">
                {link.metadata ? (
                  <div className="row">
                    <div className="col-md-4">
                      <img
                        src={link.metadata.image}
                        className="card-img-top"
                        alt="Card for article"
                      />
                    </div>
                    <div className="col-md-8">
                      <h5 className="card-title">{link.metadata.title}</h5>
                      <h6 className="card-subtitle mb-2 text-muted">
                        {humanizeTime(link.metadata.estimatedTimeToRead)}
                      </h6>
                      <p className="card-text">{link.metadata.description}</p>

                      <a
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-primary"
                      >
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
                    <span key={t.name} className="badge bg-dark mr-1">
                      {t.name}
                    </span>
                  ))}
                </p>
              </div>
            </div>
          );
        }
      )}
    </div>
  );
};
