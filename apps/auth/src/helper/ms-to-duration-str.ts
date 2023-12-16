function lastDigit(years: number) {
  return years % 10;
}

function lastTwoDigits(years: number) {
  return years % 100;
}

export function msToDurationStr(ms: number): string {
  let workExperienceString = '';
  const years = Math.floor(ms / 31_536_000_000);
  const months = Math.floor(ms / 2_629_746_000) - years * 12;

  let yearStr = '';
  const last_two = lastTwoDigits(years);
  if (last_two >= 11 && last_two <= 14) yearStr = 'лет';
  else {
    const last = lastDigit(years);
    if (last == 1) yearStr = 'год';
    else if (last >= 2 && last <= 4) yearStr = 'года';
    else yearStr = 'лет';
  }

  let monthStr = 'месяцев';
  const lastMonthDigit = lastDigit(months);
  if (lastMonthDigit === 2 || lastMonthDigit === 3 || lastMonthDigit === 4) {
    monthStr = 'месяца';
  }

  if (years > 0) {
    workExperienceString += `${years} ${yearStr}`;
  }
  if (months > 0) {
    workExperienceString += ` ${months} ${monthStr}`;
  }
  return workExperienceString;
}
