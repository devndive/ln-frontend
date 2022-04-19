import React from "react";

type FormGroupProps = {
  children?: React.ReactNode
};

export const FormGroup: React.FC<FormGroupProps> = ({ children }) => {
  return <div className="mb-3">{children}</div>;
};

type ErrorMessageProps = {
  children?: React.ReactNode
};

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ children }) => {
  return (
    <div className="alert alert-danger" role="alert">
      {children}
    </div>
  );
};

interface TagProps {
  tag: string;
  removeButtonClicked: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export const Tag: React.FC<TagProps> = ({ tag, removeButtonClicked }: TagProps) => {
  return (
    <span className="badge bg-info mt-1 me-1">
      <span className="me-1" style={{ verticalAlign: "text-top" }}>
        {tag}
      </span>
      <button
        type="button"
        className="btn-close"
        aria-label="Remove tag"
        onClick={removeButtonClicked}
      ></button>
    </span>
  );
};
