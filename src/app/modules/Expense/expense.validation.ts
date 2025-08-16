import { z } from "zod";

const createExpenseSchema = z.object({
  title: z
    .string()
    .min(3, "Title is required and must be at least 3 characters")
    .max(100, "Title must be at most 100 characters"),
  amount: z
    .number({ invalid_type_error: "Amount must be a number" })
    .positive("Amount must be greater than 0"),
  category: z
    .string()
    .min(1, "Category is required")
    .max(50, "Category must be at most 50 characters"),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
});

const updateExpenseSchema = createExpenseSchema.partial();

export const ExpenseValidations = {
  createExpenseSchema,
  updateExpenseSchema,
};
