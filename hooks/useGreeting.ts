import { useMemo } from "react";

type GreetingPeriod = "morning" | "afternoon" | "evening" | "night";

type GreetingResult = {
  period: GreetingPeriod;
  greeting: string;
};

function getGreetingByHour(hour: number): GreetingResult {
  if (hour >= 5 && hour < 12) {
    return { period: "morning", greeting: "Good morning" };
  }
  if (hour >= 12 && hour < 17) {
    return { period: "afternoon", greeting: "Good afternoon" };
  }
  if (hour >= 17 && hour < 22) {
    return { period: "evening", greeting: "Good evening" };
  }
  return { period: "night", greeting: "Good night" };
}

export function useGreeting(): GreetingResult {
  return useMemo(() => {
    const now = new Date();
    const hour = now.getHours();
    return getGreetingByHour(hour);
  }, []);
}
