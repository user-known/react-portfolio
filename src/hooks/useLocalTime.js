import { useEffect, useState } from "react";

export function useLocalTime(timeZone = "Asia/Kolkata") {
  const read = () => {
    try {
      return new Intl.DateTimeFormat("en-IN", { hour: "numeric", minute: "2-digit", hour12: true, timeZone })
        .format(new Date())
        .toLowerCase();
    } catch (e) {
      return "";
    }
  };
  const [time, setTime] = useState(read);
  useEffect(() => {
    const id = setInterval(() => setTime(read()), 30000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeZone]);
  return time;
}
