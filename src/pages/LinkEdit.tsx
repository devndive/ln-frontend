import React from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useFieldArray, useForm } from "react-hook-form";
import ReactMarkdown from "react-markdown";
import { useParams, useHistory } from "react-router-dom";
import toc from "remark-toc";
import { LINK_QUERY, UPDATE_LINK } from "./gql";
import classnames from 'classnames';

export const EditLink = () => {
  const { id } = useParams<{ id: string }>();
  const { loading, error, data } = useQuery(LINK_QUERY, {
    variables: { id: Number.parseInt(id) },
    onCompleted: (data) => {
      if (data && data.link) {
        setValue("url", data.link.url);
        setValue("notes", data.link.description);
        data.link.tags.forEach((t: any) =>  {
          append({ name: t.name });
        });
      }
    }
  });

  const [updateLink] = useMutation(UPDATE_LINK);
  const { register, getValues, setValue, errors, control, handleSubmit } = useForm();
  const { fields, remove, append } = useFieldArray({
    control, name: "tags"
  })

  const [newTag, setNewTag] = React.useState("");

  const history = useHistory();

  const saveChanges = ({ url, notes }: { url: string, notes: string }) => {
    updateLink({
      variables: {
        id: Number.parseInt(id),
        url,
        description: notes,
        tags: fields.map((f) => f.name),
      },
    }).then(() => {
      history.replace("/links");
    });
  };

  const addNewTag = () => {
    if (newTag.length > 0) {
      append({ name: newTag })
    }
  };

  if (loading) return <p>Loading ...</p>;
  if (error) return <p>Error ...</p>;

  return (
    <form onSubmit={handleSubmit(saveChanges)}>
      <div className="mb-3">
        <label htmlFor="url" className="form-label">
          Url
        </label>
        <input
          type="text"
          name="url"
          id="url"
          ref={register({ required: true })}
            className={classnames("form-control", { "is-invalid": errors.url })}
        />
        {errors.url && <div className=" invalid-feedback ">Please provide a url</div> }
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
            if (event.key === "Enter") { addNewTag(); setNewTag(""); };
          }}
        />
        {fields.map((t, idx) => (
          <span key={t.name}>
            {t.name} -{" "}
            <button onClick={() => { remove(idx); }}>x</button>
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
              name="notes"
              ref={register}
              className="form-control"
              rows={5}
            ></textarea>
          </div>
          <div className="col">
            <label className="form-label">&nbsp;</label>

            <ReactMarkdown
              className="result"
              source={getValues("notes")}
              skipHtml={false}
              escapeHtml={false}
              plugins={[toc]}
            />
          </div>
        </div>
      </div>

      <button type="submit" className="btn btn-primary">
        Save changes
      </button>
    </form>
  );
};
