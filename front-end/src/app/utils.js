const timeDifference = (current, previous) => {
  const milliSecondsPerMinute = 60 * 1000;
  const milliSecondsPerHour = milliSecondsPerMinute * 60;
  const milliSecondsPerDay = milliSecondsPerHour * 24;
  const milliSecondsPerMonth = milliSecondsPerDay * 30;
  const milliSecondsPerYear = milliSecondsPerMonth * 365;

  const elapsed = current - previous;

  if (elapsed > milliSecondsPerHour / 3) {
    switch (true) {
      case elapsed < milliSecondsPerHour:
        return `${Math.round(elapsed / milliSecondsPerMinute)} min ago`;
      case elapsed < milliSecondsPerDay:
        return `${Math.round(elapsed / milliSecondsPerHour)} h ago`;
      case elapsed < milliSecondsPerMonth:
        return `${Math.round(elapsed / milliSecondsPerDay)} days ago`;
      case elapsed < milliSecondsPerYear:
        return `${Math.round(elapsed / milliSecondsPerMonth)} mo ago`;
      case elapsed > milliSecondsPerYear:
        return `${Math.round(elapsed / milliSecondsPerYear)} years ago`;
      default:
        return '';
    }
  }

  return false;
}

export const timeDifferenceForDate = date => {
  const now = Date.now();
  const updated = new Date(date).getTime();
  return timeDifference(now, updated);
}