export const calculateDamageBonus = (str: number, siz: number) => {
  if (str + siz > 56) return "3D6";
  if (str + siz > 40) return "2D6";
  if (str + siz > 32) return "1D6";
  if (str + siz > 24) return "1D4";
  if (str + siz > 16) return "0";
  if (str + siz > 12) return "-1d4";
  if (str + siz > 2) return "-1d6";
  return "0";
};

/**
 * 文字列のバイト数を返却
 * @param str
 * @returns 
 */
export const getStringByteCount = (str: string) => {
  return new Blob([str]).size;
};
