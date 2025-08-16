import ApiError from "../../../errors/ApiErrors";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { AuthServices } from "./auth.service";
import { authValidation } from "./auth.validation";

const register = catchAsync(async (req, res) => {
  const result = await AuthServices.register(req.body);
  const isok = result ? true : false;
  sendResponse(res, {
    statusCode: isok ? 201 : 400,
    success: isok,
    message: isok ? "You have registered successfully!" : "Registration Failed",
    data: isok ? result : [],
  });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const result = await AuthServices.login({ email, password });
  const isok = result ? true : false;

  sendResponse(res, {
    statusCode: isok ? 200 : 400,
    success: isok,
    message: isok ? "You have logged in successfully" : "Login Failed",
    data: isok ? result : [],
  });
});

const changePassword = catchAsync(async (req, res) => {
  const { email } = (req as any).user;

  const { oldPassword, newPassword } =
    authValidation.changePasswordValidationSchema.parse(req.body);

  console.log(email, oldPassword, newPassword);

  const result = await AuthServices.changePassword(
    email,
    oldPassword,
    newPassword
  );
  const isok = result ? true : false;
  sendResponse(res, {
    statusCode: isok ? 200 : 400,
    success: isok,
    message: isok ? "Password Changed Successfull" : "Password Change Failed",
    data: isok ? result : [],
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.body;
  const result = await AuthServices.refreshToken(refreshToken);
  const isok = result ? true : false;
  sendResponse(res, {
    statusCode: isok ? 200 : 400,
    success: isok,
    message: isok
      ? "Access Token Generated Successfully"
      : "Access Token Generation Failed",
    data: isok ? result : [],
  });
});

const getUserInfo = catchAsync(async (req, res) => {
  const result = await AuthServices.getUserInfo(req);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User Info Fetched Successfully",
    data: result,
  });
});

export const AuthController = {
  register,
  login,
  changePassword,
  refreshToken,
  getUserInfo,
};
