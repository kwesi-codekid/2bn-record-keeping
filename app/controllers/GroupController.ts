import { redirect } from "@remix-run/node";
import type { GroupInterface } from "../utils/types";
import { commitFlashSession, getFlashSession } from "~/flash-session";
import Group from "~/models/Group";

export default class GroupController {
  private request: Request;
  private path: string;

  constructor(request: Request) {
    const url = new URL(request.url);
    const path = url.pathname + url.search;

    this.request = request;
    this.path = path;
  }

  /**
   * Retrieve all Group
   * @param param0 page
   * @param param1 search_term
   * @param param2 limit
   * @returns {groups: GroupInterface, totalPages: number}
   */
  public async getGroups({
    page,
    search_term,
    limit = 10,
  }: {
    page: number;
    search_term?: string;
    limit?: number;
  }): Promise<{ groups: GroupInterface[]; totalPages: number } | any> {
    const session = await getFlashSession(this.request.headers.get("Cookie"));

    const skipCount = (page - 1) * limit;

    const searchFilter = search_term
      ? {
          $or: [
            {
              name: {
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
              description: {
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

    try {
      const groups = await Group.find(searchFilter)
        .skip(skipCount)
        .populate("inCharge")
        .limit(limit)
        .sort({
          createdAt: "desc",
        })
        .exec();

      const totalGroupsCount = await Group.countDocuments(searchFilter).exec();
      const totalPages = Math.ceil(totalGroupsCount / limit);

      return { groups, totalPages };
    } catch (error) {
      console.log(error);
      session.flash("alert", {
        title: "Error!",
        status: "error",
        message: "Error retrieving groups",
      });

      return redirect(this.path, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    }
  }

  /**
   * Retrieve a single Group
   * @param id string
   * @returns GroupInterface
   */
  public async getGroup({ id }: { id: string }) {
    try {
      const group = await Group.findById(id)
        .populate("inCharge")
        .populate("memebrs");
      return { group };
    } catch (error) {
      console.error("Error retrieving group:", error);
      return {
        status: "error",
        code: 400,
        message: "Error getting group details",
        errors: [
          {
            field: "name",
            message:
              "A group with this name already exists. Please choose a different name.",
          },
        ],
      };
    }
  }

  /**
   * Create a new group
   * @param path string
   * @param name string
   * @param parent string
   * @param description string
   * @returns GroupInterface
   */
  public createGroup = async ({
    name,
    description,
    inCharge,
    members,
  }: {
    name: string;
    description: string;
    inCharge: string;
    members: string[];
  }) => {
    const session = await getFlashSession(this.request.headers.get("Cookie"));

    try {
      const existingGroup = await Group.findOne({ name });

      if (existingGroup) {
        session.flash("alert", {
          title: "Error",
          status: "error",
          message: "Group already exist",
        });

        return redirect(this.path, {
          headers: {
            "Set-Cookie": await commitFlashSession(session),
          },
        });
        // return {
        //   status: "error",
        //   code: 400,
        //   message: "Group already exists",
        //   errors: [
        //     {
        //       field: "name",
        //       message:
        //         "A group with this name already exists. Please choose a different name.",
        //     },
        //   ],
        // };
      }

      const group = await Group.create({
        name,
        description,
        inCharge: inCharge || null,
        members: members || [],
      });

      if (!group) {
        // return {
        //   status: "error",
        //   code: 400,
        //   message: "Error adding group",
        //   errors: [
        //     {
        //       field: "name",
        //       message: "Error adding group",
        //     },
        //   ],
        // };
        session.flash("alert", {
          title: "Error",
          status: "error",
          message: "Error adding group",
        });

        return redirect(this.path, {
          headers: {
            "Set-Cookie": await commitFlashSession(session),
          },
        });
      }

      // return {
      //   status: "success",
      //   code: 200,
      //   message: "Group added successfully",
      //   data: group,
      // };

      session.flash("alert", {
        title: "Success",
        status: "success",
        message: "Group craeted successfully",
      });

      return redirect(this.path, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    } catch (error) {
      console.log(error);

      // return {
      //   status: "error",
      //   code: 400,
      //   message: "Error adding group",
      // };

      session.flash("alert", {
        title: "Error",
        status: "error",
        message: "Error craeting group",
      });
      return redirect(this.path, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    }
  };

  /**
   * Update group
   * @param param0 _id
   * @param param1 name
   * @param param2 parent
   * @param param3 description
   * @returns null
   */
  public updateGroup = async ({
    _id,
    name,
    description,
    inCharge,
    members,
  }: {
    _id: string;
    name: string;
    description: string;
    inCharge: string;
    members: string;
  }) => {
    const session = await getFlashSession(this.request.headers.get("Cookie"));

    try {
      const updated = await Group.findByIdAndUpdate(
        _id,
        {
          name,
          description,
          inCharge: inCharge || null,
          members: members || null,
        },
        { new: true }
      );

      // return {
      //   status: "success",
      //   code: 200,
      //   message: "Group updated successfully",
      //   data: updated,
      // };
      session.flash("alert", {
        title: "Success",
        status: "success",
        message: "Group updated successfully",
      });
      return redirect(this.path, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    } catch (error) {
      session.flash("alert", {
        title: "Error",
        status: "error",
        message: "Error updating group",
      });
      return redirect(this.path, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
      // return {
      //   status: "error",
      //   code: 400,
      //   message: "Error updating group",
      // };
    }
  };

  /**
   * Delete Group
   * @param param0 _id
   * @returns null
   */
  public deleteGroup = async ({ _id }: { _id: string }) => {
    const session = await getFlashSession(this.request.headers.get("Cookie"));

    try {
      await Group.findByIdAndDelete(_id);

      session.flash("alert", {
        title: "Success",
        status: "success",
        message: "Group Deleted Successfully",
      });
      return redirect(this.path, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });

      // return {
      //   status: "success",
      //   code: 200,
      //   message: "Group deleted successfully",
      // };
    } catch (error) {
      console.log(error);
      session.flash("alert", {
        title: "Error",
        status: "error",
        message: "Error deleting group",
      });
      return redirect(this.path, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
      // return {
      //   status: "error",
      //   code: 400,
      //   message: "Error deleting group",
      // };
    }
  };
}
