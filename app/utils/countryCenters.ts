// Country centers and aliases: https://github.com/mledoze/countries (ODbL-1.0).
import centers from "./countryCenters.json";
export function getCountryCenter(country: string): number[] | undefined {
  return (centers as Record<string, number[]>)[country.trim().toLowerCase()];
}
