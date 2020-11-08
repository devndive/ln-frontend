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
