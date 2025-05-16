// src/components/FormField.tsx
import React from "react";

type Props = {
  label: string;
  children: React.ReactNode;
  description?: string;
};

const SkillFormField: React.FC<Props> = ({ label, children, description }) => (
  <div style={{ marginBottom: "1rem" }}>
    <label style={{ display: "block", fontWeight: "bold", marginBottom: "0.25rem" }}>
      {label}
    </label>
    {children}
    {description && (
      <div style={{ fontSize: "0.85rem", color: "#666", marginTop: "0.25rem" }}>
        {description}
      </div>
    )}
  </div>
);

export default SkillFormField;
