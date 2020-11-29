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
    <span className="badge bg-info mt-1 mr-1">
      {tag}{" "}
      <button
        type="button"
        className="btn-close"
        aria-label="Remove tag"
        onClick={removeButtonClicked}
      ></button>
    </span>
  );
};
