import React from "react";

export const FormGroup: React.FC = ({ children }) => {
  return <div className="mb-3">{children}</div>;
};

export const ErrorMessage: React.FC = ({ children }) => {
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
