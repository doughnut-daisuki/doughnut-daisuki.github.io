import React from "react";

type Props = {
  label: string;
  name: string;
  value: string | number;
  type: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const FormField: React.FC<Props> = ({ label, type, name, value, onChange }) => {
  return (
    <label style={{ display: "block", marginBottom: "0.5rem" }}>
      {label}:
      <input
        type={type}
        name={name}
        value={value}
        maxLength={10}
        onChange={onChange}
        style={{ marginLeft: "0.5rem" }}
      />
    </label>
  );
};

export default FormField;