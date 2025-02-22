import {
  json,
  createCookieSessionStorage,
  redirect,
  type SessionStorage,
} from "@remix-run/node";
import bcrypt from "bcryptjs";
import User from "~/models/User";
import {
  commitFlashSession,
  FlashSessionInterface,
  getFlashSession,
} from "~/flash-session";
import generateOTP from "~/utils/generateOTP";
import sendSMS from "~/utils/sendSMS";
import { UserInterface } from "~/utils/types";
import Mission from "~/models/Mission";
import Group from "~/models/Group";

export default class UserController {
  private request: Request;
  private storage: SessionStorage;
  private path: string;
  /**
   * Initialize a UserController instance
   * @param request This Fetch API interface represents a resource request.
   * @returns this
   */
  constructor(request: Request) {
    const url = new URL(request.url);
    const path = url.pathname + url.search;

    this.request = request;
    this.path = path;

    const secret = process.env.SESSION_SECRET;
    if (!secret) {
      throw new Error("No session secret provided");
    }
    this.storage = createCookieSessionStorage({
      cookie: {
        name: "__user_auth",
        secrets: [secret],
        sameSite: "lax",
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // 30 days
      },
    });
  }

  private async createUserSession(userId: string, redirectTo: string) {
    const session = await this.storage.getSession();
    session.set("userId", userId);
    // store roles and permissions in session and add a method
    // to check if the user has permission to perform an action

    return redirect(redirectTo, {
      headers: {
        "Set-Cookie": await this.storage.commitSession(session),
      },
    });
  }

  private async getUserSession() {
    return this.storage.getSession(this.request.headers.get("Cookie"));
  }

  public async getUserId(
    redirectTo: string = new URL(this.request.url).pathname
  ) {
    const session = await this.getUserSession();
    const userId = session.get("userId");
    if (!userId || typeof userId !== "string") {
      // const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
      // throw redirect(`/login`);
      return null;
    }

    return userId;
  }

  public async checkUser() {
    const userId = await this.getUserId();
    if (!userId) {
      return null;
    }

    return await User.findById(userId).select("-password");
  }

  public async getUser(): Promise<UserInterface | any> {
    const session = await getFlashSession(this.request.headers.get("Cookie"));

    const userId = await this.getUserId();
    // const session = await this.getUserSession();
    // const userId = session.get("userId");

    if (!userId) {
      session.flash("alert", {
        title: "Unauthorized",
        status: "error",
        message: "You need to login to access this page",
      });
      throw redirect(`/login`, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
      // throw redirect(`/login`);
    }

    try {
      const user = await User.findById(userId).select("-password");

      if (!user) {
        return {
          status: "error",
          code: 400,
          message: "No Account!",
        };
      }

      return user;
    } catch {
      throw this.logout();
    }
  }

  public async checkUserRole(requiredRole = "") {
    const session = await getFlashSession(this.request.headers.get("Cookie"));

    const userId = await this.getUserId();
    if (!userId) {
      return null;
    }

    const user = await User.findById(userId).select("-password");

    if (user?.role !== requiredRole) {
      session.flash("alert", {
        title: "Access Denied!",
        status: "error",
        message: "You do not have access to this page",
      });
      throw redirect(`/${user?.role}`, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    }
    return user;
  }

  public async getUserById(id: string) {
    try {
      const user = await User.findById(id)
        .populate("department")
        .populate("company")
        .select("-password");

      if (!user) {
        return {
          status: "error",
          code: 400,
          message: "No ",
        };
      }

      return user;
    } catch {
      return {
        status: "error",
        code: 400,
        message: "Error fetching user",
      };
    }
  }

  public async loginUser({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) {
    const session = await getFlashSession(this.request.headers.get("Cookie"));

    const user = await User.findOne({
      email,
    });

    if (!user) {
      session.flash("alert", {
        title: "Error!",
        message: "No Account with email!",
        status: "error",
      });
      return redirect(`/login`, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      session.flash("alert", {
        title: "Error",
        message: "Invalid Credentials",
        status: "error",
      });
      return redirect(`/login`, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    }

    return this.createUserSession(user.id, `/${user?.role}`);
  }

  public updateProfile = async ({
    firstName,
    lastName,
    email,
  }: {
    firstName: string;
    lastName: string;
    email: string;
  }) => {
    const userId = await this.getUserId();
    const session = await getFlashSession(this.request.headers.get("Cookie"));

    try {
      const user = await User.findByIdAndUpdate(
        userId,
        {
          firstName,
          lastName,
          email,
        },
        {
          new: true,
        }
      );
      session.flash("alert", {
        title: "Success",
        status: "success",
        message: "Profile Updated Successfully!",
      });
      return redirect(`/user/profile`, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    } catch (error) {
      session.flash("alert", {
        title: "Error",
        status: "error",
        message: "Error Updating Profile!",
      });
      return redirect(`/user/profile`, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    }
  };

  /**
   * Change user password
   * @param currentPassword
   * @param password
   * @returns redirect
   * @throws Error
   *
   * @example
   * ```typescript
   * await changePassword({
   *  currentPassword: "password",
   * password: "newpassword"
   * });
   * ```
   * */
  public changePassword = async ({
    currentPassword,
    password,
  }: {
    currentPassword: string;
    password: string;
  }) => {
    const session = await getFlashSession(this.request.headers.get("Cookie"));
    const userId = await this.getUserId();
    const user = await User.findById(userId);

    if (user) {
      const valid = await bcrypt.compare(currentPassword, user.password);

      if (!valid) {
        session.flash("alert", {
          title: "Error",
          status: "error",
          message: "Incorrect Password!",
        });
        return redirect(`/user/profile`, {
          headers: {
            "Set-Cookie": await commitFlashSession(session),
          },
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      await User.findByIdAndUpdate(user._id, {
        password: hashedPassword,
      });
      session.flash("alert", {
        title: "Password Changed",
        status: "success",
      });
      return redirect(`/user/profile`, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    } else {
      session.flash("alert", {
        title: "User does not exist!",
        status: "error",
      });
      return redirect(`/user/profile`, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    }
  };

  public async logout() {
    const session = await this.getUserSession();

    return redirect("/login", {
      headers: {
        "Set-Cookie": await this.storage.destroySession(session),
      },
    });
  }

  public createUser = async ({
    firstName,
    lastName,
    email,
    role,
    department,
    phone,
    badgeNumber,
    password,
    company,
    dateOfBirth,
    position,
  }: {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    department: string;
    phone: string;
    badgeNumber?: string;
    dateOfBirth: string;
    position: string;
    password: string;
    company: string;
  }) => {
    const session = await getFlashSession(this.request.headers.get("Cookie"));
    console.log({ password });

    try {
      const phoneExist = await User.findOne({ phone });
      const badgeNumberExist = await User.findOne({ badgeNumber });
      const emailExist = await User.findOne({ email });

      const errors = [];

      if (phoneExist) {
        errors.push({
          field: "phone",
          message: "Phone number already in use",
        });
      }

      if (badgeNumberExist) {
        errors.push({
          field: "badgeNumber",
          message: "Staff ID already in use",
        });
      }

      if (emailExist) {
        errors.push({
          field: "email",
          message: "Email already in use",
        });
      }

      if (errors.length > 0) {
        console.log({ errors });

        session.flash("alert", {
          title: "Error",
          status: "error",
          message:
            "User with phone number or staff ID or email already exists.",
        });
        return redirect(this.path, {
          headers: {
            "Set-Cookie": await commitFlashSession(session),
          },
        });

        // return {
        //   status: "error",
        //   code: 400,
        //   message:
        //     "User with phone number or staff ID or email already exists.",
        //   errors,
        // };
      }
      const encryptedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        firstName,
        lastName,
        email,
        role,
        department,
        phone,
        badgeNumber,
        dateOfBirth,
        password: encryptedPassword,
        company,
        position,
      });

      // return {
      //   status: "success",
      //   code: 200,
      //   message: "User created successfully",
      //   data: user,
      // };
      session.flash("alert", {
        title: "Success",
        status: "success",
        message: "User created Successfully!",
      });
      return redirect(this.path, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    } catch (error) {
      console.log(error);

      session.flash("alert", {
        title: "Error",
        status: "error",
        message: "Error Creating User",
      });
      return redirect(this.path, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });

      // return {
      //   status: "error",
      //   code: 400,
      //   message: "Error Creating User",
      //   errors: [
      //     {
      //       field: "error",
      //       message: error.message,
      //     },
      //   ],
      // };
    }
  };

  public getUsers = async ({
    page,
    search_term,
    limit = 10,
  }: {
    page: number;
    search_term: string;
    limit?: number;
  }) => {
    const session = await getFlashSession(this.request.headers.get("Cookie"));

    const skipCount = (page - 1) * limit; // Calculate the number of documents to skip

    const searchFilter = search_term
      ? {
          $or: [
            {
              firstName: {
                $regex: new RegExp(
                  search_term
                    .split(" ")
                    .map((term) => `(?=.*${term})`)
                    .join(""),
                  "i"
                ),
              },
            },
            {
              lastName: {
                $regex: new RegExp(
                  search_term
                    .split(" ")
                    .map((term) => `(?=.*${term})`)
                    .join(""),
                  "i"
                ),
              },
            },
            {
              email: {
                $regex: new RegExp(
                  search_term
                    .split(" ")
                    .map((term) => `(?=.*${term})`)
                    .join(""),
                  "i"
                ),
              },
            },
            {
              phone: {
                $regex: new RegExp(
                  search_term
                    .split(" ")
                    .map((term) => `(?=.*${term})`)
                    .join(""),
                  "i"
                ),
              },
            },
          ],
        }
      : {};

    const totalEmployeeCount = await User.countDocuments({}).exec();
    const totalPages = Math.ceil(totalEmployeeCount / limit);

    try {
      const users = await User.find(searchFilter)
        .populate("department")
        .populate("company")
        .skip(skipCount)
        .limit(limit)
        .sort({
          createdAt: "desc",
        })
        .exec();

      return { users, totalPages };
    } catch (error) {
      console.error("Error retrieving users:", error);
      session.flash("alert", {
        title: "Error",
        status: "error",
        message: "Error retrieving users",
      });
      return redirect(this.path, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    }
  };

  public getUsersByDepartment = async ({
    page,
    search_term,
    limit = 10,
    department,
    role,
  }: {
    page: number;
    search_term: string;
    limit?: number;
    department?: string;
    role?: string;
  }) => {
    const skipCount = (page - 1) * limit; // Calculate the number of documents to skip
    const userController = new UserController(this.request);
    const user = await userController.getUser();

    // Construct the base filter
    const baseFilter: any = {
      _id: { $ne: user._id }, // Exclude the current user
    };
    if (role != "nurse") {
      if (department) baseFilter.department = department;
      if (role) baseFilter.role = role;
    }

    // Construct the search filter
    const searchFilter = search_term
      ? {
          $and: [
            baseFilter,
            {
              $or: [
                {
                  firstName: {
                    $regex: new RegExp(
                      search_term
                        .split(" ")
                        .map((term) => `(?=.*${term})`)
                        .join(""),
                      "i"
                    ),
                  },
                },
                {
                  lastName: {
                    $regex: new RegExp(
                      search_term
                        .split(" ")
                        .map((term) => `(?=.*${term})`)
                        .join(""),
                      "i"
                    ),
                  },
                },
                {
                  email: {
                    $regex: new RegExp(
                      search_term
                        .split(" ")
                        .map((term) => `(?=.*${term})`)
                        .join(""),
                      "i"
                    ),
                  },
                },
                {
                  phone: {
                    $regex: new RegExp(
                      search_term
                        .split(" ")
                        .map((term) => `(?=.*${term})`)
                        .join(""),
                      "i"
                    ),
                  },
                },
              ],
            },
          ],
        }
      : baseFilter;

    try {
      // Apply the search filter when counting the total number of documents
      const totalEmployeeCount = await User.countDocuments(searchFilter).exec();
      const totalPages = Math.ceil(totalEmployeeCount / limit);

      const users = await User.find(searchFilter)
        .skip(skipCount)
        .limit(limit)
        .sort({
          createdAt: "desc",
        })
        .exec();

      return { users, totalPages };
    } catch (error) {
      console.error("Error retrieving users:", error);
      throw error;
    }
  };

  public deleteUser = async ({ userId }: { userId: string }) => {
    const session = await getFlashSession(this.request.headers.get("Cookie"));

    try {
      await User.findByIdAndDelete(userId);
      session.flash("alert", {
        title: "Success",
        status: "success",
        message: "User deleted successfully!",
      });
      return redirect(this.path, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
      // return {
      //   status: "success",
      //   code: 200,
      //   message: "User account deleted successfully",
      // };
    } catch (error) {
      session.flash("alert", {
        title: "Error",
        status: "error",
        message: "Error Deleting User!",
      });
      return redirect(this.path, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });

      // return {
      //   status: "error",
      //   code: 400,
      //   message: "Error Deleting User",
      //   errors: [],
      // };
    }
  };

  public updateUserProfile = async ({
    userId,
    firstName,
    lastName,
    email,
    role,
    department,
    phone,
    badgeNumber,
    dateOfBirth,
    position,
    company,
    password,
  }: {
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    department: string;
    phone: string;
    badgeNumber?: string;
    dateOfBirth: string;
    position: string;
    company: string;
    password: string;
  }) => {
    const session = await getFlashSession(this.request.headers.get("Cookie"));
    console.log({ userId });

    try {
      // Initialize an array to collect validation errors
      const errors = [];

      // Check for unique phone number
      if (phone) {
        const phoneExist = await User.findOne({
          phone: phone,
          _id: { $ne: userId },
        });
        console.log("phone");

        if (phoneExist) {
          errors.push({
            field: "phone",
            message: "Phone number already in use",
          });
        }
      }

      // Check for unique staff ID
      if (badgeNumber) {
        const badgeNumberExist = await User.findOne({
          badgeNumber: badgeNumber,
          _id: { $ne: userId },
        });
        console.log("badge");

        if (badgeNumberExist) {
          errors.push({
            field: "badgeNumber",
            message: "Staff ID already in use",
          });
        }
      }

      // Check for unique email
      if (email) {
        const emailExist = await User.findOne({
          email: email,
          _id: { $ne: userId },
        });
        console.log("email error");

        if (emailExist) {
          errors.push({
            field: "email",
            message: "Email already in use",
          });
        }
      }

      // If there are validation errors, return them
      if (errors.length > 0) {
        session.flash("alert", {
          title: "Error",
          status: "error",
          message:
            "User with phone number or staff ID or email already exists.",
        });
        return redirect(this.path, {
          headers: {
            "Set-Cookie": await commitFlashSession(session),
          },
        });

        // return {
        //   status: "error",
        //   code: 400,
        //   message:
        //     "User with phone number or staff ID or email already exists.",
        //   errors,
        // };
      }

      const updatedUser = await User.findOneAndUpdate(
        { _id: userId },
        {
          firstName,
          lastName,
          email,
          role,
          department,
          phone,
          badgeNumber,
          dateOfBirth,
          position,
          password,
          company,
        },
        {
          new: true, // Return the updated document
          runValidators: true, // Run schema validators
        }
      );

      if (!updatedUser) {
        throw new Error("User not found");
      }

      session.flash("alert", {
        title: "Success",
        status: "success",
        message: "User updated successfully!",
      });
      return redirect(this.path, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });

      // return {
      //   status: "success",
      //   code: 200,
      //   message: "User updated successfully",
      //   data: updatedUser,
      // };
    } catch (error) {
      console.log(error);

      session.flash("alert", {
        title: "Error",
        status: "error",
        message: "Error updating User",
      });
      return redirect(this.path, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });

      // return {
      //   status: "error",
      //   code: 400,
      //   message: "Error updating User",
      // };
    }
  };

  public resetPassword = async ({
    userId,
    path,
    password,
  }: {
    userId: string;
    path: string;
    password: string;
  }) => {
    const session = await getFlashSession(this.request.headers.get("Cookie"));

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      await User.findByIdAndUpdate(userId, {
        password: hashedPassword,
      });
      session.flash("alert", {
        title: "Password Reset",
        status: "success",
      });
      return redirect(path, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    } catch (error) {
      session.flash("alert", {
        title: "Error Resetting Password!",
        status: "error",
      });
      return redirect(path, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    }
  };

  public getMembersNotOnMission = async () => {
    try {
      // Fetch all missions that are ongoing
      const ongoingMissions = await Mission.find({ status: "ongoing" }).exec();

      // Collect all user IDs who are on ongoing missions
      const usersOnMissions = new Set();
      ongoingMissions.forEach(async (mission) => {
        if (mission.group) {
          const group = await Group.findById(mission.group).exec();
          group.members.forEach((member) =>
            usersOnMissions.add(member.toString())
          );
        }
      });

      // Fetch all users who are not on any ongoing mission
      const usersNotOnMissions = await User.find({
        _id: { $nin: Array.from(usersOnMissions) },
      }).exec();

      return { usersNotOnMissions };
    } catch (error) {
      console.error("Error fetching members not on a mission:", error);
      throw error;
    }
  };

  public fetchEligibleUsers = async () => {
    try {
      const fourYearsAgo = new Date();
      fourYearsAgo.setFullYear(fourYearsAgo.getFullYear() - 4);

      const eligibleUsers = await User.find({
        lastPromotionDate: { $lte: fourYearsAgo },
      }).select(["-password"]);

      // Add next role to each eligible user
      const usersWithNextRole = await Promise.all(
        eligibleUsers.map(async (user) => {
          const nextPosition = await this.getNextRole(user.position);
          return {
            ...user.toObject(),
            nextPosition,
          };
        })
      );

      return { eligibleUsers: usersWithNextRole };
    } catch (error) {
      console.error("Error fetching eligible users:", error);
      throw error;
    }
  };

  // Helper function to get next role
  private getNextRole = async (currentRole) => {
    const promotionRoles = [
      "staff",
      "supervisor",
      "manager",
      "general-manager",
      "admin",
    ];

    let currentRoleIndex = promotionRoles.indexOf(currentRole);
    if (currentRoleIndex < promotionRoles.length - 1) {
      return promotionRoles[currentRoleIndex + 1];
    } else {
      return null; // No further promotion available
    }
  };
}
