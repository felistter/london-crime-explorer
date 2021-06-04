import { group } from "d3";
import { format as dateFormat } from "date-fns";

export const CRIMES_STREER_DATES =
  "https://data.police.uk/api/crimes-street-dates";

export const getStopForceUrl = (force, date) => {
  const formattedDate = dateFormat(date, "yyyy-MM");
  return `https://data.police.uk/api/stops-force?force=${force}&date=${formattedDate}`;
};

export const getCrimeCategoriesUrl = (date) => {
  const formattedDate = dateFormat(date, "yyyy-MM");
  return `https://data.police.uk/api/crime-categories?date=${formattedDate}`;
};

export const createCategoricalMappingFromArray = (arr) => {
  return Object.assign({}, ...arr.map((item) => ({ [item.url]: item.name })));
};

export const getAllCrimesAtLocationUrl = (latitude, longitude, date) => {
  const formattedDate = dateFormat(date, "yyyy-MM");
  return `https://data.police.uk/api/crimes-street/all-crime?lat=${latitude}&lng=${longitude}&date=${formattedDate}`;
};

export const countDataCategories = (crimes) => {
  const counts = group(crimes, (c) => c.category);
  return Array.from(counts, ([name, value]) => ({
    name: name,
    value: 0 || value.length,
  }));
};
