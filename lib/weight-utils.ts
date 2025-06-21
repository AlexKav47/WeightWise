export interface WeightPreference {
  unit: "lbs" | "stone" | "kg"
}

export function formatWeight(weightInLbs: number, unit: "lbs" | "stone" | "kg"): string {
  if (!weightInLbs || weightInLbs <= 0) return "--"

  switch (unit) {
    case "lbs":
      return `${weightInLbs.toFixed(1)} lbs`
    case "stone":
      const stone = Math.floor(weightInLbs / 14)
      const pounds = Math.round(weightInLbs % 14)
      return `${stone} st ${pounds} lbs`
    case "kg":
      const kg = weightInLbs / 2.20462
      return `${kg.toFixed(1)} kg`
    default:
      return `${weightInLbs.toFixed(1)} lbs`
  }
}

export function getUserWeightPreference(): "lbs" | "stone" | "kg" {
  try {
    const userData = localStorage.getItem("weightoff-user")
    if (userData) {
      const user = JSON.parse(userData)
      return user.weightUnit || "lbs"
    }
  } catch (error) {
    console.error("Error getting weight preference:", error)
  }
  return "lbs"
}

export function convertWeightToUserUnit(weightInLbs: number, targetUnit: "lbs" | "stone" | "kg"): number {
  switch (targetUnit) {
    case "lbs":
      return weightInLbs
    case "stone":
      return weightInLbs // We'll handle stone display in formatWeight
    case "kg":
      return weightInLbs / 2.20462
    default:
      return weightInLbs
  }
}
