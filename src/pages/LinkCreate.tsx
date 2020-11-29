import toc from "remark-toc";
import { useMutation } from "@apollo/client";
import React from "react";
import ReactMarkdown from "react-markdown";
import { useHistory } from "react-router-dom";
import { CREATE_LINK } from "./gql";
import { useFieldArray, useForm } from "react-hook-form";
import classnames from 'classnames';
import { Tag } from "../components";

const NOTES_GUIDE = `What are the key ideas?\n
How can I apply this knowledge that I learned?\n
How do these ideas relate to what I already know?`;

export const CreateLink = () => {
  const [createLinkMutation] = useMutation(CREATE_LINK);
  const [newTag, setNewTag] = React.useState("");

  const { register, watch, errors, control, handleSubmit } = useForm<{
    url: string;
    notes: string;
    tags: { name: string }[];
  }>({
    defaultValues: {
      url: "",
      notes: "",
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
