import { gql, useQuery, useMutation } from "@apollo/client";
import React, { useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { useParams, useHistory } from "react-router-dom";
import toc from "remark-toc";

const LINK_QUERY = gql`
  query Link($id: Int!) {
    link(id: $id) {
      id
      url
      description
    }
  }
`;

const UPDATE_LINK = gql`
  mutation UpdateLink($id: Int!, $url: String!, $description: String!, $tags: [String!]) {
    updateLink(id: $id, url: $url, description: $description, tags: $tags) {
      id
      url
      description
      tags {
        name
      }
    }
  }
`;

export const EditLink = () => {
  const { id } = useParams<{ id: string }>();
  const { loading, error, data } = useQuery(LINK_QUERY, {
    variables: { id: Number.parseInt(id) },
  });

  const [updateLink] = useMutation(UPDATE_LINK);

  const [url, setUrl] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [newTag, setNewTag] = React.useState("");
  const [tags, setTags] = React.useState<string[]>([]);

  const history = useHistory();

  useEffect(() => {
    if (data && data.link) {
      setUrl(data.link.url);
      setNotes(data.link.description);
    }
  }, [data]);

  const saveChanges = () => {
    updateLink({
      variables: {
        id: Number.parseInt(id),
        url: url,
        description: notes,
        tags: tags,
      },
    }).then(() => {
      history.replace("/links");
    });
  };

  const addNewTag = () => {
    if (newTag.length > 0) {
      const newTags = tags;
      newTags.push(newTag);
      setTags(newTags);
      setNewTag("");
    }
  };

  const removeTag = (tag: string) => {
    const newTags = [...tags];

    const idx = newTags.indexOf(tag);

    if (idx >= 0) {
      newTags.splice(idx, 1);
    }

    setTags(newTags);
  };

  if (loading) return <p>Loading ...</p>;
  if (error) return <p>Error ...</p>;

  return (
    <>
      <div className="mb-3">
        <label htmlFor="url" className="form-label">
          Url
        </label>
        <input
          type="text"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          name="url"
          id="form"
          className="form-control"
        />
      </div>
      <div className="mb-3">
        <label htmlFor="tags" className="form-label">
          Tags
        </label>
        <input
          type="text"
          value={newTag}
          onChange={(event) => {
            setNewTag(event.target.value);
          }}
          name="newTag"
          id="new-tag"
          className="form-control"
          onKeyPress={(event) => {
            if (event.key === "Enter") addNewTag();
          }}
        />
        {tags.map((t, idx) => (
          <span key={idx}>
            {t} -{" "}
            <button
              onClick={() => {
                removeTag(t);
              }}
            >
              x
            </button>
          </span>
        ))}
      </div>
      <div className="mb-3">
        <div className="row">
          <div className="col">
            <label htmlFor="url" className="form-label">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              name="notes"
              id="notes"
              className="form-control"
              rows={5}
            ></textarea>
          </div>
          <div className="col">
            <label className="form-label">&nbsp;</label>

            <ReactMarkdown
              className="result"
              source={notes}
              skipHtml={false}
              escapeHtml={false}
              plugins={[toc]}
            />
          </div>
        </div>
      </div>

      <button type="submit" className="btn btn-primary" onClick={() => saveChanges()}>
        Save changes
      </button>
    </>
  );
};
