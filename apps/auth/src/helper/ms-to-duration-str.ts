export function msToDurationStr(ms: number): string {
  let workExperienceString = '';
  const years = Math.floor(ms / 31_536_000_000);
  const months = Math.floor(ms / 2_629_746_000) - years * 12;

  if (years > 0) {
    workExperienceString += `${years} год`;
  }
  if (months > 0) {
    workExperienceString += `${months} месяцев`;
  }
  return workExperienceString;
}
