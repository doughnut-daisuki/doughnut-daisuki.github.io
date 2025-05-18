import React, { useEffect, useMemo, useState } from "react";
import FormField from "./common/FormField";
import type { CharacterStatusData, ExplorerData, Skill } from "./types/types";
import { GENERAL_SKILL_OPTIONS } from "./types/skillOptions";
import FormSelectField from "./common/FormSelectField";
import ImageUploader from "./ImageUploader";

// 各フィールドのキー名だけを取り出す
type FieldName = keyof CharacterStatusData;

type Props = {
  data: ExplorerData;
  onChange: (data: ExplorerData) => void;
  setImage: (image: HTMLImageElement) => void;
};

const CharacterForm: React.FC<Props> = ({ data, onChange, setImage }) => {
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
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
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
    value: string | null
  ) => {
    const updatedSkills = [...formData.skills];
    updatedSkills[index] = {
      ...updatedSkills[index],
      [field]: value,
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

  const fieldDefinitions: { label: string; name: FieldName }[] = [
    { label: "STR", name: "str" },
    { label: "CON", name: "con" },
    { label: "POW", name: "pow" },
    { label: "DEX", name: "dex" },
    { label: "APP", name: "app" },
    { label: "SIZ", name: "siz" },
    { label: "INT", name: "int" },
    { label: "EDU", name: "edu" },
  ];

  return (
    <form>
      <div className="mainContainer">
        {/* 基本ステータス */}
        <details className="accordion-003">
          <summary>プロフィール</summary>
          <FormField
            key={"name"}
            label={"名前"}
            type={"text"}
            name={"name"}
            value={formData.name}
            onChange={handleProfChange}
          />
          <FormField
            key={"age"}
            label={"年齢"}
            type={"number"}
            name={"age"}
            value={formData.age}
            onChange={handleProfChange}
          />
          <FormField
            key={"job"}
            label={"職業"}
            type={"text"}
            name={"job"}
            value={formData.job}
            onChange={handleProfChange}
          />
        </details>
        <details className="accordion-003">
          <summary>ステータス</summary>
          {fieldDefinitions.map(
            (field) =>
              typeof formData.characterStatusData[field.name] === "string" && (
                <div
                  style={{
                    display: "flex",
                    gap: "0.5rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  <FormSelectField
                    key={field.name}
                    label={field.label}
                    name={field.name}
                    value={Number(formData.characterStatusData[field.name])}
                    onChange={handleStatusChange}
                  />
                </div>
              )
          )}
        </details>

        {/* 技能入力 */}
        <details className="accordion-003">
          <summary>技能</summary>
          {formData.skills.map((skill, index) => {
            const currentKey = skill.category
              ? `${skill.category}:${skill.name}`
              : skill.name;

            return (
              <div
                key={index}
                style={{
                  display: "flex",
                  gap: "0.5rem",
                  marginBottom: "0.5rem",
                }}
              >
                {/* 技能セレクト */}
                <label className="selectbox-status">
                  <select
                    value={skill.name}
                    onChange={(e) => {
                      const selected = e.target.value;
                      handleSkillChange(index, "name", selected);
                    }}
                  >
                    <option value="">技能を選択</option>
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
                </label>

                {/* 自由入力欄（言語） */}
                {(skill.name === "言語" ||
                  skill.name === "芸術" ||
                  skill.name === "製作") && (
                  <input
                    type="text"
                    placeholder="ラテン語・音楽・料理など"
                    onChange={(e) =>
                      handleSkillChange(index, "nameText", e.target.value)
                    }
                  />
                )}

                {/* 値入力 */}
                <FormSelectField
                  key={skill.name}
                  name={skill.name}
                  value={skill.value}
                  onChange={(e) =>
                    handleSkillChange(index, "value", e.target.value)
                  }
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
        </details>

        {/* 立ち絵 */}
        <details className="accordion-003">
          <summary>立ち絵</summary>
          <ImageUploader onImageUpload={setImage} />
        </details>
      </div>
    </form>
  );
};

export default CharacterForm;
