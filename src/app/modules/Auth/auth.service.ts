import { ILoginUser, IUser } from "./auth.interface";
import bcrypt from "bcrypt";

import { createToken, verifyToken } from "./auth.utils";
import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiErrors";

// create user
const register = async (payload: IUser) => {
  // check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (existingUser) {
    throw new ApiError(400, "User already exists with this email");
  }

  if (!payload.password) {
    throw new ApiError(400, "Password is required");
  }

  // Hash the password
  const password = await bcrypt.hash(
    payload.password,
    Number(process.env.SALT_ROUNDS)
  );

  // Update payload with hashed password
  payload.password = password;

  // 1. Create the user
  const result = await prisma.user.create({
    data: {
      name: payload.name,
      email: payload.email,
      password: payload.password,
    },
    select: {
      id: true,
      email: true,
      name: true,
      password: false, // Exclude password from the result
    },
  });

  const JwtPayload = {
    email: result.email,
    userId: result.id,
    role: "user",
  };

  const accessToken = createToken(
    JwtPayload,
    process.env.ACCESS_TOKEN_SECRET as string,
    process.env.ACCESS_TOKEN_EXPIRES_IN as string
  );

  const refreshToken = createToken(
    JwtPayload,
    process.env.REFRESH_TOKEN_SECRET as string,
    process.env.REFRESH_TOKEN_EXPIRES_IN as string
  );

  return {
    user: {
      id: result.id,
      email: result.email,
      name: result.name,
    },
    accessToken,
    refreshToken,
  };
};

const login = async (payload: ILoginUser) => {
  const user = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
    select: {
      id: true,
      email: true,
      name: true,
      password: true,
    },
  });

  if (!user) {
    throw new ApiError(404, "Invalid credentials");
  }

  const isPasswordMatched: boolean = await bcrypt.compare(
    payload.password,
    user?.password!
  );

  if (!isPasswordMatched) {
    throw new ApiError(401, "Invalid credentials");
  }

  const JwtPayload = {
    email: user.email,
    userId: user?.id,
    role: "user",
  };

  //create toke and send to the client
  const accessToken = createToken(
    JwtPayload,
    process.env.ACCESS_TOKEN_SECRET as string,
    process.env.ACCESS_TOKEN_EXPIRES_IN as string
  );

  //refresh token
  const refreshToken = createToken(
    JwtPayload,
    process.env.REFRESH_TOKEN_SECRET as string,
    process.env.REFRESH_TOKEN_EXPIRES_IN as string
  );

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
    accessToken,
    refreshToken,
  };
};

const changePassword = async (
  email: string,
  oldPassword: string,
  newPassword: string
) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new ApiError(400, "User not found with this email");
  }
  if (!user.password) {
    throw new ApiError(400, "Password is required");
  }

  const isPasswordMatched: boolean = await bcrypt.compare(
    oldPassword,
    user?.password!
  );

  if (!isPasswordMatched) {
    throw new ApiError(400, "Invalid credentials password not matched!");
  }

  const hashedPassword = await bcrypt.hash(
    newPassword,
    Number(process.env.SALT_ROUNDS)
  );

  await prisma.user.update({
    where: {
      email,
    },
    data: {
      password: hashedPassword,
    },
  });

  return true;
};

const refreshToken = async (refreshToken: string) => {
  if (!refreshToken) {
    throw new ApiError(401, "Refresh token is required");
  }
  const decoded = verifyToken(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET as string
  );

  if (!decoded) {
    throw new ApiError(401, "Invalid or expired refresh token!");
  }
  console.log(decoded);

  const user = await prisma.user.findUnique({
    where: {
      id: decoded.userId,
    },
  });

  if (!user) {
    throw new ApiError(400, "User not found with this refresh token");
  }

  const JwtPayload = {
    id: user.id,
    email: user.email,
    role: "user",
  };

  //create toke and send to the client
  const accessToken = createToken(
    JwtPayload,
    process.env.ACCESS_TOKEN_SECRET as string,
    process.env.ACCESS_TOKEN_EXPIRES_IN as string
  );

  return { accessToken };
};

const getUserInfo = async (req: any) => {
  const userId = req.user.userId;

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      email: true,
      name: true,
    },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return user;
};

export const AuthServices = {
  register,
  login,
  changePassword,
  refreshToken,
  getUserInfo,
};
