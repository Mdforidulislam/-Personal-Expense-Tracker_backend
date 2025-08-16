import express from "express";
import { ExpenseRoutes } from "../modules/Expense/expense.route";
import { AuthRoutes } from "../modules/Auth/auth.routes";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/expenses",
    route: ExpenseRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
