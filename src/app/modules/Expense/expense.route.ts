import { Router } from "express";
import { ExpenseControllers } from "./expense.controller";
import validateRequest from "../../middlewares/validateRequest";
import { ExpenseValidations } from "./expense.validation";
import auth from "../../middlewares/auth";

const router = Router();

router
  .route("/")
  .post(
    auth(),
    validateRequest(ExpenseValidations.createExpenseSchema),
    ExpenseControllers.createExpense
  )
  .get(auth(), ExpenseControllers.getExpenses);

router.get("/dashboard", auth(), ExpenseControllers.getDashboardData);

router
  .route("/:id")
  .get(auth(), ExpenseControllers.getExpenseById)
  .patch(
    auth(),
    validateRequest(ExpenseValidations.updateExpenseSchema),
    ExpenseControllers.updateExpense
  )
  .delete(auth(), ExpenseControllers.deleteExpense);

export const ExpenseRoutes = router;
