import express from "express";
import { adminAuthorize } from "../../middleware";

import { controllerHandler } from "../../shared/controllerHandler";
import { AdminController } from "./adminController";

const router = express.Router();
const call = controllerHandler;
const Admin = new AdminController();

// router.use(adminAuthorize);

router.get(
  "/manage-users",
  [adminAuthorize],
  call(Admin.getAllUsers, (req, _res, _next) => [
    req.user,
    req.query.per_page,
    req.query.post_next,
    req.query.post_prev,
  ])
);
router.get(
  "/manage-coupons",
  [adminAuthorize],
  call(Admin.getAllCoupons, (req, _res, _next) => [
    req.user,
    req.query.per_page,
    req.query.post_next,
    req.query.post_prev,
  ])
);

router.get(
  "/manage-topics",
  [adminAuthorize],
  call(Admin.getAllTopics, (req, _res, _next) => [
    req.user,
    req.query.per_page,
    req.query.post_next,
    req.query.post_prev,
  ])
);

router.get(
  "/manage-orders",
  [adminAuthorize],
  call(Admin.getAllOrders, (req, _res, _next) => [
    req.user,
    req.query.per_page,
    req.query.order_next,
    req.query.order_prev,
  ])
);

router.get(
  "/manage-docs-couns",
  [adminAuthorize],
  call(Admin.getAllDocsCouns, (req, _res, _next) => [req.user])
);

router.get(
  "/search",
  [adminAuthorize],
  call(Admin.searchCollection, (req, _res, _next) => [
    req.query.q,
    req.query.f,
    req.user,
    req.query.per_page,
    req.query.search_next,
    req.query.search_prev,
  ])
);

export const AdminRouter = router;
