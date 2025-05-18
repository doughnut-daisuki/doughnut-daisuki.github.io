export type Skill = {
  category?: string | null;
  name: string;
  nameText?: string | null;
  value: number;
};

export type CharacterStatusData = {
  str: string;
  dex: string;
  con: string;
  pow: string;
  int: string;
  app: string;
  siz: string;
  edu: string;
};

export type ExplorerData = {
  name: string;
  age: number;
  job: string;
  characterStatusData: CharacterStatusData;
  skills: Skill[];
};
