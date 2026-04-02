export type TimeTab = "Weekly" | "Monthly" | "Quarterly" | "Yearly" | "All Time" |"Custom Range";

export type DateRange = {
  from: string;
  to: string;
};

const startOfDay = (value: Date) => {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
};

const endOfDay = (value: Date) => {
  const date = new Date(value);
  date.setHours(23, 59, 59, 999);
  return date;
};

export const formatDateForInput = (value: Date) => {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const getTimeTabLabel = (tab: TimeTab, now = new Date()) => {
  if (tab === "All Time") {
    return "All records";
  }

  if (tab === "Weekly") {
    const end = formatDateForInput(now).split("-").reverse().join("-");
    return `Last 7 days till ${end}`;
  }

  if (tab === "Monthly") {
    return now.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
  }

  if (tab === "Quarterly") {
    return `Q${Math.floor(now.getMonth() / 3) + 1} ${now.getFullYear()}`;
  }

  return String(now.getFullYear());
};

export const isDateInRange = (dateStr: string, range: TimeTab, now = new Date()) => {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) {
    return false;
  }

  const today = endOfDay(now);
  const recordDate = startOfDay(date);

  switch (range) {
    case "Weekly": {
      const weekStart = startOfDay(new Date(now));
      weekStart.setDate(weekStart.getDate() - 6);
      return recordDate >= weekStart && recordDate <= today;
    }
    case "Monthly":
      return recordDate.getMonth() === today.getMonth() && recordDate.getFullYear() === today.getFullYear();
    case "Quarterly":
      return (
        Math.floor(recordDate.getMonth() / 3) === Math.floor(today.getMonth() / 3) &&
        recordDate.getFullYear() === today.getFullYear()
      );
    case "Yearly":
      return recordDate.getFullYear() === today.getFullYear();
    default:
      return true;
  }
};

export const isDateWithinCustomRange = (dateStr: string, customRange: DateRange) => {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) {
    return false;
  }

  const recordDate = startOfDay(date);
  const fromDate = customRange.from ? startOfDay(new Date(customRange.from)) : null;
  const toDate = customRange.to ? endOfDay(new Date(customRange.to)) : null;

  if (fromDate && recordDate < fromDate) {
    return false;
  }

  if (toDate && recordDate > toDate) {
    return false;
  }

  return true;
};
