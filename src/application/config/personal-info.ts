export const START_WORKING_YEAR = 2011;

export function getYearsOfExperience(): number {
  return new Date().getFullYear() - START_WORKING_YEAR;
}
