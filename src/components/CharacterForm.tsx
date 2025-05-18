import React, { useEffect, useMemo, useState } from "react";
import FormField from "./common/FormField";
import type { CharacterStatusData, ExplorerData, Skill } from "./types/types";
import {
  CUSTOM_LANGUAGE_KEY,
  GENERAL_SKILL_OPTIONS,
} from "./types/skillOptions";

// 各フィールドのキー名だけを取り出す
type FieldName = keyof CharacterStatusData;

type Props = {
  data: ExplorerData;
  onChange: (data: ExplorerData) => void;
};

const CharacterForm: React.FC<Props> = ({ data, onChange }) => {
  const [formData, setFormData] = useState<ExplorerData>(data);

  // 入力変化を親に通知（副作用として）
  useEffect(() => {
    onChange(formData);
    // onChangeでレンダリングが走ってしまうため依存配列からのぞく
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  // 📌 技能の重複チェック用キー（category:name or name）
  const usedSkillKeys = useMemo(() => {
    return formData.skills.map((s) =>
      s.category ? `${s.category}:${s.name}` : s.name
    );
  }, [formData.skills]);

  function isValidKey(key: string): key is keyof CharacterStatusData {
    return ["str", "dex", "con", "pow", "int", "app", "siz", "edu"].includes(
      key
    );
  }

  const handleProfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ステータス（STRなど）変更時のイベント
  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (!isValidKey(name)) return;
    const key: keyof CharacterStatusData = name;
    const updatedCharData = { ...formData.characterStatusData };
    updatedCharData[key] = value;
    // prevがundefinedでないと断定した処理
    setFormData((prev) => ({
      ...prev!,
      characterStatusData: { ...formData.characterStatusData, [key]: value },
    }));
  };

  // 技能変更時のイベント
  const handleSkillChange = (
    index: number,
    field: keyof Skill,
    value: string | null,
    fieldText?: string
  ) => {
    const updatedSkills = [...formData.skills];
    updatedSkills[index] = {
      ...updatedSkills[index],
      [field]: value,
      nameText: fieldText,
    };
    setFormData({ ...formData, skills: updatedSkills });
  };

  // 技能追加
  const addSkill = () => {
    if (formData.skills.length >= 20) return; // 上限設定
    const newSkill: Skill = { name: "", value: 0 };
    setFormData((prev) => ({
      ...prev,
      skills: [...prev.skills, newSkill],
    }));
  };

  // 技能削除
  const removeSkill = (index: number) => {
    const updatedSkills = [...formData.skills];
    updatedSkills.splice(index, 1);
    setFormData((prev) => ({
      ...prev,
      skills: updatedSkills,
    }));
  };

  const fieldDefinitions: { label: string; name: FieldName; type: string }[] = [
    { label: "STR", name: "str", type: "number" },
    { label: "CON", name: "con", type: "number" },
    { label: "POW", name: "pow", type: "number" },
    { label: "DEX", name: "dex", type: "number" },
    { label: "APP", name: "app", type: "number" },
    { label: "SIZ", name: "siz", type: "number" },
    { label: "INT", name: "int", type: "number" },
    { label: "EDU", name: "edu", type: "number" },
  ];

  return (
    <form>
      {/* 基本ステータス */}
      <h3>プロフィール</h3>
      <p>※名前は全角2~8文字くらいが推奨です</p>
      <FormField
        key={"name"}
        label={"名前"}
        type={"text"}
        name={"name"}
        value={formData.name}
        onChange={handleProfChange}
      />

      <h3>ステータス</h3>
      {fieldDefinitions.map(
        (field) =>
          typeof formData.characterStatusData[field.name] === "string" && (
            <FormField
              key={field.name}
              label={field.label}
              type={field.type}
              name={field.name}
              value={formData.characterStatusData[field.name]}
              onChange={handleStatusChange}
            />
          )
      )}
      <hr />

      {/* 技能入力 */}
      <h3>技能</h3>
      {formData.skills.map((skill, index) => {
        const currentKey = skill.category
          ? `${skill.category}:${skill.name}`
          : skill.name;

        return (
          <div
            key={index}
            style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}
          >
            {/* 技能セレクト */}
            <select
              value={skill.name}
              onChange={(e) => {
                const selected = e.target.value;

                if (selected === CUSTOM_LANGUAGE_KEY) {
                  handleSkillChange(index, "category", "言語");
                  handleSkillChange(index, "name", "");
                } else {
                  handleSkillChange(index, "category", null);
                  handleSkillChange(index, "name", selected);
                }
              }}
            >
              <option value="">技能を選択</option>
              <option value={CUSTOM_LANGUAGE_KEY}>言語（自由入力）</option>
              {GENERAL_SKILL_OPTIONS.map((name) => {
                const disabled =
                  usedSkillKeys.includes(name) && name !== currentKey;
                return (
                  <option key={name} value={name} disabled={disabled}>
                    {name}
                  </option>
                );
              })}
            </select>

            {/* 自由入力欄（言語） */}
            {skill.category === "言語" && (
              <input
                type="text"
                placeholder="例：ラテン語"
                value={skill.name}
                onChange={(e) =>
                  handleSkillChange(index, "name", e.target.value)
                }
              />
            )}

            {/* 値入力 */}
            <input
              type="number"
              placeholder="値"
              value={skill.value}
              onChange={(e) =>
                handleSkillChange(index, "value", e.target.value)
              }
              style={{ width: "4rem" }}
            />

            <button type="button" onClick={() => removeSkill(index)}>
              削除
            </button>
          </div>
        );
      })}

      {formData.skills.length < GENERAL_SKILL_OPTIONS.length && (
        <button type="button" onClick={addSkill}>
          技能を追加
        </button>
      )}
    </form>
  );
};

export default CharacterForm;
