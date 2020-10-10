import toc from "remark-toc";
import { gql, useMutation } from "@apollo/client";
import React from "react";
import ReactMarkdown from "react-markdown";
import { useHistory } from "react-router-dom";
import { LINKS_QUERY } from "./gql";

const CREATE_LINK = gql`
  mutation CreateLink($url: String!, $description: String!, $tags: [String!]) {
    createLink(url: $url, description: $description, tags: $tags) {
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

const NOTES_GUIDE = `What are the key ideas?\n
How can I apply this knowledge that I learned?\n
How do these ideas relate to what I already know?`;

export const CreateLink = () => {
  const [createLinkMutation] = useMutation(CREATE_LINK);

  const [url, setUrl] = React.useState("");
  const [notes, setNotes] = React.useState(NOTES_GUIDE);
  const [newTag, setNewTag] = React.useState("");
  const [tags, setTags] = React.useState<string[]>([]);

  const history = useHistory();

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

  const createLink = () => {
    createLinkMutation({
      variables: { url: url, description: notes, tags: tags },
      update: async (cache, { data: newLink }) => {
        const { links }: any = cache.readQuery({ query: LINKS_QUERY });

        cache.writeQuery({
          query: LINKS_QUERY,
          data: {
            links: links.concat([newLink]),
          },
        });
      },
    }).then(() => {
      history.replace("/links");
    });
  };

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

      <button type="submit" className="btn btn-primary" onClick={() => createLink()}>
        Save
      </button>
    </>
  );
};
