// import { Router } from "express";
// const router = Router();

import express from "express";
import { userControllers } from "./user.controller";
import auth from "../../middleware/auth";
const router = express.Router();

// app.use("/users", userRoutes);

// routes => controller => service

// get all users
router.get("/", auth(), userControllers?.getAllUsers);

// get single users by id
router.get("/:id", userControllers?.getSingleUser);

// post single user
router.post("/", userControllers?.createUser);

// update user by id
router.put("/:id", userControllers?.updateUser);

// delete single user by id
router.delete("/:id", userControllers?.deleteUser);

export const userRoutes = router;