import React from "react";

type Props = {
  label?: string;
  name: string;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  min?: number;
  max?: number;
};

const FormSelectField: React.FC<Props> = ({
  label,
  name,
  value,
  onChange,
  min = 1,
  max = 99,
}) => {
  const options = Array.from({ length: max - min + 1 }, (_, i) =>
    (min + i).toString()
  );
  return (
    <label className="selectbox-status">
      {label && <span style={{ width: "4rem" }}>{label + `：`}</span>}
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="border rounded p-1 w-full mt-1"
        style={{ width: "4rem" }}
      >
        {options.map((val) => (
          <option key={val} value={val}>
            {val}
          </option>
        ))}
      </select>
    </label>
  );
};

export default FormSelectField;
