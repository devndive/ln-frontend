import toc from "remark-toc";
import { gql, useMutation } from "@apollo/client";
import React from "react";
import ReactMarkdown from "react-markdown";
import { useHistory, useLocation } from "react-router-dom";
import { CREATE_LINK } from "./gql";
import { useFieldArray, useForm } from "react-hook-form";
import classnames from "classnames";
import { Tag } from "../components";

/*
 * All apps that use sharing do this differently. You have to guess in which field the url
 * could be. Therefor I am testing the strings and try to guess which one could hold the url
 * I want.
 * 
 * Sharing from chrome on android seems to put the url into the text field
 * 
 * Twitter APP on android puts the url in the title field
 */
export function mapFieldsFromShareTarget(params: URLSearchParams)
: {
  title: string,
  text: string,
  url: string
} {
  const returnValue = {
    title: params.get("title") ?? "",
    text: params.get("text") ?? "",
    url: params.get("url") ?? ""
  }

  // No URL was passed, so we try to find one in the other fields
  if (!returnValue.url) {
    if (stringIsValidUrl(returnValue.title)) {
      returnValue.url = returnValue.title;
      returnValue.title = "";
    } else if (stringIsValidUrl(returnValue.text)) {
      returnValue.url = returnValue.text;
      returnValue.text = "";
    }
  }

  return returnValue;
}

function useQueryParams(): {
  title: string,
  text: string,
  url: string
} {
  const params = new URLSearchParams(useLocation().search);
  return mapFieldsFromShareTarget(params);
}

function stringIsValidUrl(stringToTest: string): boolean {
  try {
    new URL(stringToTest);
    return true;
  } catch {
    return false;
  }
}

export function prefillNotes(title: string, text: string): string {
  if (!title && !text) {
    return "";
  }

  if (title && !text) {
    return title;
  }

  if (!title && text) {
    return text;
  }

  return [title, text].join("\n\n");
}

export const CreateLink = () => {
  const [createLinkMutation] = useMutation(CREATE_LINK, {
    update(cache, { data: { createLink } }) {
      cache.modify({
        fields: {
          links() {
            cache.writeFragment({
              data: createLink,
              fragment: gql`
                fragment NewLink on Link {
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
              `,
            });
          },
        },
      });
    },
  });

  const [newTag, setNewTag] = React.useState("");

  const {title, text, url} = useQueryParams();

  const { register, watch, errors, control, handleSubmit } = useForm<{
    url: string;
    notes: string;
    tags: { name: string }[];
  }>({
    defaultValues: {
      url: url,
      notes: prefillNotes(title, text),
      tags: [],
    },
  });

  const { fields, remove, append } = useFieldArray({
    control,
    name: "tags",
  });

  const history = useHistory();

  const addNewTag = () => {
    if (newTag.length > 0) {
      append({ name: newTag });
    }
  };

  const createLink = ({ url, notes }: { url: string; notes: string }) => {
    createLinkMutation({
      variables: {
        url,
        description: notes,
        tags: fields.map((f) => f.name),
      },
    }).then(() => {
      history.replace("/links");
    });
  };

  return (
    <form onSubmit={handleSubmit(createLink)}>
      <div className="mb-3">
        <label htmlFor="url" className="form-label">
          Url
        </label>
        <input
          type="text"
          name="url"
          ref={register({ required: true })}
          className={classnames("form-control", { "is-invalid": errors.url })}
        />
        {errors.url && <div className=" invalid-feedback ">Please provide a url</div>}
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
            if (event.key === "Enter") {
              event.preventDefault();
              addNewTag();
              setNewTag("");
            }
          }}
        />
        {fields.map((t, idx) => (
          <Tag key={t.name} tag={t.name} removeButtonClicked={() => remove(idx)} />
        ))}
      </div>
      <div className="mb-3">
        <div className="row">
          <div className="col">
            <label htmlFor="url" className="form-label">
              Notes
            </label>
            <textarea
              ref={register}
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
              source={watch("notes", "")}
              escapeHtml={false}
              plugins={[toc]}
              disallowedTypes={[]}
            />
          </div>
        </div>
      </div>

      <button type="submit" className="btn btn-primary">
        Save
      </button>
    </form>
  );
};
