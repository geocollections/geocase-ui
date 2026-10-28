// Country centers and aliases: https://github.com/mledoze/countries (ODbL-1.0).
import centers from "./countryCenters.json";
export function getCountryCenter(country: string): number[] | undefined {
  const aliases: Record<string, string> = {
    "bolivia (plurinational state of)": "bolivia",
    "moldova, republic of": "moldova",
    turkey: "turkiye",
  };
  const name = country.trim().toLowerCase();
  return (centers as Record<string, number[]>)[aliases[name] ?? name];
}
