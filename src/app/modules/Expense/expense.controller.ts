import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { ExpenseServices } from "./expense.service";

const createExpense = catchAsync(async (req, res) => {
  const result = await ExpenseServices.createExpense(req);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Expense created successfully",
    data: result,
  });
});

const getExpenses = catchAsync(async (req, res) => {
  const result = await ExpenseServices.getExpenses(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Expenses retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

const getExpenseById = catchAsync(async (req, res) => {
  const result = await ExpenseServices.getExpenseById(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Expense retrieved successfully",
    data: result,
  });
});

const updateExpense = catchAsync(async (req, res) => {
  const result = await ExpenseServices.updateExpense(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Expense updated successfully",
    data: result,
  });
});

const deleteExpense = catchAsync(async (req, res) => {
  await ExpenseServices.deleteExpense(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Expense deleted successfully",
    data: null,
  });
});

const getDashboardData = catchAsync(async (req, res) => {
  const result = await ExpenseServices.getDashboardData(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Dashboard data retrieved successfully",
    data: result,
  });
});

export const ExpenseControllers = {
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  createExpense,
  getDashboardData,
};
