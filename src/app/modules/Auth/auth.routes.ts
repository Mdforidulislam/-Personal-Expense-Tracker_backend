import { Router } from "express";
import { AuthController } from "./auth.controller";
import validateRequest from "../../middlewares/validateRequest";
import { authValidation } from "./auth.validation";
import auth from "../../middlewares/auth";

const router = Router();

router.post(
  "/register",
  validateRequest(authValidation.UserRegisterValidationSchema),
  AuthController.register
);
router.post(
  "/login",
  validateRequest(authValidation.UserLoginValidationSchema),
  AuthController.login
);

router.post("/change-password", auth(), AuthController.changePassword);
router.post("/refresh-token", AuthController.refreshToken);
router.get("/get-user-info", auth(), AuthController.getUserInfo);

export const AuthRoutes = router;
