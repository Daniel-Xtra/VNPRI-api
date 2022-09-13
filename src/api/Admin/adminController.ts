import { BaseController } from "../baseController";
import { AdminService } from "./adminService";
import { IUser } from "../User";

export class AdminController extends BaseController {
  private _adminService = new AdminService();

  /**
   * This function is used for get admin home
   * @param user
   */

  /**
   * This function is used for get all topics
   * @param user
   * @param per_page
   * @param post_next
   * @param post_prev
   */

  public getAllTopics = async (
    user: IUser,
    per_page: number,
    post_next: string,
    post_prev: string
  ) => {
    // responsible for get all topics
    const all_topics = await this._adminService.getAllTopics(
      user,
      per_page,
      post_next,
      post_prev
    );
    return this.sendResponse(all_topics);
  };

  /**
   * This function is used for get all orders
   * @param user
   * @param per_page
   * @param order_next
   * @param order_prev
   */

  public getAllOrders = async (
    user: IUser,
    per_page: number,
    order_next: string,
    order_prev: string
  ) => {
    // responsible for get all orders
    const all_orders = await this._adminService.getAllOrders(
      user,
      per_page,
      order_next,
      order_prev
    );
    return this.sendResponse(all_orders);
  };

  /**
   * This function is used for get all users
   * @param user
   * @param per_page
   * @param post_next
   * @param post_prev
   */

  public getAllUsers = async (
    user: IUser,
    per_page: number,
    post_next: string,
    post_prev: string
  ) => {
    // responsible for get all users
    const all_users = await this._adminService.getAllUsers(
      user,
      per_page,
      post_next,
      post_prev
    );
    return this.sendResponse(all_users);
  };

  /**
   * This function is used for get all coupons
   * @param user
   * @param per_page
   * @param post_next
   * @param post_prev
   */

  public getAllCoupons = async (
    user: IUser,
    per_page: number,
    post_next: string,
    post_prev: string
  ) => {
    // responsible for get all coupons
    const all_coupons = await this._adminService.getAllCoupons(
      user,
      per_page,
      post_next,
      post_prev
    );
    return this.sendResponse(all_coupons);
  };

  /**
   * This function is used for getAllDocsCouns
   * @param user
   */

  public getAllDocsCouns = async (user: IUser) => {
    // responsible for get all docs couns
    const admin_DocNCouns = await this._adminService.getAllDocsCouns(user);
    return this.sendResponse(admin_DocNCouns);
  };

  /**
   * This function is used for get all sessions
   * @param user
   * @param per_page
   * @param sess_next
   * @param sess_prev
   */

  /**
   * This function is used for get all banners
   */

  /**
   * This function is used for search collection
   * @param query
   * @param filter
   * @param user
   * @param per_page
   * @param search_next
   * @param search_prev
   */

  public searchCollection = async (
    query: string,
    filter: string,
    user: IUser,
    per_page: number,
    search_next: string,
    search_prev: string
  ) => {
    // responsible for search user admin
    const results = await this._adminService.searchUserAdmin(
      query,
      filter,
      user,
      per_page,
      search_next,
      search_prev
    );
    return this.sendResponse(results);
  };
}
