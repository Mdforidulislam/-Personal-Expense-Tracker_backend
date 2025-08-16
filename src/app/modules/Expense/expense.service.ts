import { Request } from "express";
import prisma from "../../../shared/prisma";
import QueryBuilder from "../../../utils/queryBuilder";
import {
  expenseFilterFields,
  expenseInclude,
  expenseNestedFilters,
  expenseRangeFilter,
  expenseSearchFields,
} from "./expense.constant";

import httpStatus from "http-status";
import ApiError from "../../../errors/ApiErrors";
import { Prisma } from "@prisma/client";

// Using Dry priciple Small reusable helper to enforce ownership checks
const assertOwnership = async (id: string, userId: string) => {
  const expense = await prisma.expense.findUnique({ where: { id } });
  if (!expense) {
    throw new ApiError(httpStatus.NOT_FOUND, `Expense not found with this id: ${id}`);
  }
  if (expense.userId !== userId) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "You are not authorized to access this expense");
  }
  return expense;
};

// ✅ Centralized query builder factory
const buildExpenseQuery = (req: Request, userId: string) =>
  new QueryBuilder(req.query, prisma.expense)
    .filter(expenseFilterFields)
    .search(expenseSearchFields)
    .nestedFilter(expenseNestedFilters)
    .sort()
    .paginate()
    .include(expenseInclude)
    .fields()
    .rawFilter({ userId })
    .filterByRange(expenseRangeFilter);

const createExpense = async (req: Request) => {
  return prisma.expense.create({
    data: { ...req.body, userId: req.user.userId },
  });
};

const getExpenses = async (req: Request) => {
  const userId = req.user.userId;
  const queryBuilder = buildExpenseQuery(req, userId);

  const [data, meta] = await Promise.all([
    queryBuilder.execute(),
    queryBuilder.countTotal(),
  ]);

  return { data, meta };
};

const getExpenseById = (id: string) =>
  prisma.expense.findUnique({ where: { id } });

const updateExpense = async (req: Request) => {
  const { id } = req.params;
  const userId = req.user.userId;

  await assertOwnership(id, userId);

  return prisma.expense.update({
    where: { id },
    data: req.body,
  });
};

const deleteExpense = async (req: Request) => {
  const { id } = req.params;
  const userId = req.user.userId;

  await assertOwnership(id, userId);
  await prisma.expense.delete({ where: { id } });
};

const getDashboardData = async (req: Request) => {
  const userId = req.user.userId;
  const queryBuilder = buildExpenseQuery(req, userId);

  const [results, meta] = await Promise.all([
    queryBuilder.execute(),
    queryBuilder.countTotal(),
  ]);

  const totalTransactions = results.length;
  const totalExpenses = results
    .filter((e: any) => e.type === "EXPENSE")
    .reduce((sum: number, e: any) => sum + e.amount, 0);

  // ✅ Monthly breakdown
  const monthlyMap: Record<string, { expenses: number }> = {};
  results.forEach((e: any) => {
    const month = new Date(e.date).toLocaleString("default", { month: "short" });
    if (!monthlyMap[month]) monthlyMap[month] = { expenses: 0 };
    if (e.type === "EXPENSE") monthlyMap[month].expenses += e.amount;
  });

  const monthlyData = Object.entries(monthlyMap).map(([month, { expenses }]) => ({
    month,
    expenses,
  }));

  // ✅ Pie chart (category distribution)
  const categoryMap: Record<string, number> = {};
  results
    .filter((e: any) => e.type === "EXPENSE")
    .forEach((e: any) => {
      categoryMap[e.category] = (categoryMap[e.category] || 0) + e.amount;
    });

  const chart = Object.entries(categoryMap).map(([category, amount]) => ({
    category,
    amount,
    percentage: totalExpenses ? parseFloat(((amount / totalExpenses) * 100).toFixed(2)) : 0,
  }));

  return {
    summary: {
      totalExpenses,
      totalTransactions,
    },
    monthlyData,
    chart,
    meta,
  };
};

export const ExpenseServices = {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  getDashboardData,
};
 