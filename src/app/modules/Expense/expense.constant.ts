import { NestedFilter } from "../../../interfaces/nestedFiltering";
import { rangeFilteringPrams } from "../../../utils/queryBuilder";

// Fields for basic filtering
export const expenseFilterFields = ["category", "type", "method"];

// Fields for top-level search
export const expenseSearchFields = ["title"];

// Nested filtering config
export const expenseNestedFilters: NestedFilter[] = [
  // { key: "user", searchOption: "search", queryFields: ["name"] },
];

// Range-based filtering config
export const expenseRangeFilter: rangeFilteringPrams[] = [
  {
    field: "date",
    maxQueryKey: "maxDate",
    minQueryKey: "minDate",
    dataType: "date",
  },
  {
    field: "amount",
    maxQueryKey: "maxAmount",
    minQueryKey: "minAmount",
    dataType: "number",
  },
];

// Prisma include configuration
export const expenseInclude = {};
