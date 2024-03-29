import React, { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import ReactMarkdown from "react-markdown";
import { useParams, useNavigate } from "react-router-dom";
import classnames from "classnames";
import { Link } from "../types";
import { Tag } from "../components";
import { useLink, useUpdateLinkMutation } from "./hooks";

export const EditLinkImpl: React.FC<{ link: Link }> = ({ link }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    register,
    watch,
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<{
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

  const [newTag, setNewTag] = React.useState("");
  const { mutate: updateLink, isLoading } = useUpdateLinkMutation();

  const saveChanges = ({ url, notes }: { url: string; notes: string }) => {
    if (id) {
      updateLink({
        id: Number.parseInt(id),
        url,
        description: notes,
        tags: fields.map((f) => {
          return { name: f.name };
        }),
      }, {
        onSuccess: () => {
          navigate("/links");
        }
      });
    }
  };

  const addNewTag = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();

      if (newTag.length > 0) {
        append({ name: newTag });
        setNewTag("");
      }
    }
  };

  useEffect(() => {
    reset({
      url: link.url,
      notes: link.description,
      tags: link.tags.map((t) => {
        return { name: t.name };
      }),
    });
  }, [link]);

  return (
    <form onSubmit={handleSubmit(saveChanges)}>
      <div className="mb-3">
        <label htmlFor="url" className="form-label">
          Url
        </label>
        <input
          type="text"
          id="url"
          {...register("url", { required: true })}
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
            addNewTag(event);
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
            <textarea {...register("notes")} className="form-control" rows={5}></textarea>
          </div>
          <div className="col">
            <label className="form-label">&nbsp;</label>

            <ReactMarkdown
              className="result"
              // @ts-ignore
              children={watch("notes", "")}
              disallowedElements={[]}
            />
          </div>
        </div>
      </div>

      <button type="submit" className="btn btn-primary" disabled={isLoading}>
        { isLoading ? "Saving..." : "Save changes" }
      </button>
    </form>
  );
};

export const EditLink = () => {
  const { id } = useParams();

  if (id === undefined) return null;

  const { isLoading, error, data } = useLink(id);

  if (isLoading) return <p>Loading ...</p>;
  if (error) return <p>Error ...</p>;

  return <div>{data && <EditLinkImpl link={data} />}</div>;
};
