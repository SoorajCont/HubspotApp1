import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import confetti from "canvas-confetti";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const runFireworks = (): void => {
  const duration = 5 * 1000;
  const animationEnd = Date.now() + duration;

  const defaults = {
    startVelocity: 30,
    spread: 360,
    ticks: 60,
    zIndex: 0,
  };

  const randomInRange = (min: number, max: number): number => {
    return Math.random() * (max - min) + min;
  };

  let intervalId: NodeJS.Timeout | undefined;

  intervalId = setInterval(() => {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      clearInterval(intervalId);
      intervalId = undefined; // Clear the reference for potential garbage collection
      return;
    }

    const particleCount = 50 * (timeLeft / duration);

    confetti(
      Object.assign({}, defaults, {
        particleCount,
        origin: {
          x: randomInRange(0.1, 0.3),
          y: Math.random() - 0.2,
        },
      })
    );

    confetti(
      Object.assign({}, defaults, {
        particleCount,
        origin: {
          x: randomInRange(0.7, 0.9),
          y: Math.random() - 0.2,
        },
      })
    );
  }, 250);
};

export function generateSlug(text: string) {
  return text
    .toString()
    .normalize("NFD")
    .trim()
    .replace(/\s+/g, "_")
    .replace(/[^\w\-]+/g, "");
}

export function decodeSlug(slug: string) {
  return slug
    .replace(/_/g, " ") // Replace underscores with spaces
    .replace(/([a-z0-9]+)/gi, (match, word) => {
      // Decode unicode characters (if any)
      return word.normalize("NFC");
    });
}

export function removeId(text: string) {
  const split = text.trim().split(" ");
  return split.slice(0, split.length - 1).join(" ");
}

export const getId = (text: string) => {
  const split = text.trim().split(" ");
  return split[split.length - 1];
};

export function getDateFromObject(date: Date): string {
  // Option 1: Using toLocaleDateString() for user-friendly format
  const userFriendlyDate = date.toLocaleDateString();

  // Option 2: Using separate methods for more control (day, month, year)
  const day = date.getDate();
  const month = date.getMonth() + 1; // Months are 0-indexed, so add 1
  const year = date.getFullYear();
  const customDate = `${year}-${month.toString().padStart(2, "0")}-${day
    .toString()
    .padStart(2, "0")}`;

  return customDate;
}

export const validateTerm = (
  billingFrequency: string,
  term: number
): boolean => {
  if (billingFrequency.toLowerCase() === "annually" && term % 12 !== 0) {
    return false; // Term must be a multiple of 12 for annual billing
  } else if (billingFrequency.toLowerCase() === "monthly" && term % 1 !== 0) {
  }

  switch (billingFrequency.toLowerCase()) {
    case "annually":
      return term % 12 === 0;
    case "monthly":
      return term % 1 === 0;
    case "bi-annually":
      return term % 6 === 0;
    case "quarterly":
      return term % 3 === 0;
    case "every two years":
      return term % 24 === 0;
    case "one-time":
      return term === 0;
    case "every three years":
      return term % 36 === 0;
    case "every four years":
      return term % 48 === 0;
    case "every five years":
      return term % 60 === 0;
    default:
      return true;
  }
};

export function removeFirstAndLastLetter(str: string): string {
  if (str.length < 2) {
    return str;
  }
  return str.slice(1, -1);
}
