import { redirect } from "@remix-run/node";
import type { DutyInterface } from "../utils/types";
import { commitFlashSession, getFlashSession } from "~/flash-session";
import Duty from "~/models/Duty";

export default class DutyController {
  private request: Request;
  private path: string;

  constructor(request: Request) {
    const url = new URL(request.url);
    const path = url.pathname + url.search;

    this.request = request;
    this.path = path;
  }

  /**
   * Retrieve all Duty
   * @param param0 page
   * @param param1 search_term
   * @param param2 limit
   * @returns {duties: DutyInterface, totalPages: number}
   */
  public async getDuties({
    page,
    search_term,
    limit = 10,
  }: {
    page: number;
    search_term?: string;
    limit?: number;
  }): Promise<{ duties: DutyInterface[]; totalPages: number } | any> {
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
      const duties = await Duty.find(searchFilter)
        .skip(skipCount)
        .limit(limit)
        .sort({
          createdAt: "desc",
        })
        .exec();

      const totalDutiesCount = await Duty.countDocuments(searchFilter).exec();
      const totalPages = Math.ceil(totalDutiesCount / limit);

      return { duties, totalPages };
    } catch (error) {
      console.log(error);
      session.flash("alert", {
        title: "Error!",
        status: "error",
        message: "Error retrieving duties",
      });

      return redirect(this.path, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    }
  }

  /**
   * Retrieve a single Duty
   * @param id string
   * @returns DutyInterface
   */
  public async getDuty({ id }: { id: string }) {
    try {
      const duty = await Duty.findById(id);
      return duty;
    } catch (error) {
      console.error("Error retrieving duty:", error);
      return {
        status: "error",
        code: 400,
        message: "Error getting duty details",
        errors: [
          {
            field: "name",
            message:
              "A duty with this name already exists. Please choose a different name.",
          },
        ],
      };
    }
  }

  /**
   * Create a new duty
   * @param path string
   * @param name string
   * @param parent string
   * @param description string
   * @returns DutyInterface
   */
  public createDuty = async ({
    name,
    description,
    commandingOfficer,
    dutySeargent,
    platoonCommander,
    administrationWarranty,
  }: {
    name: string;
    description: string;
    commandingOfficer: string;
    dutySeargent: string;
    platoonCommander: string;
    administrationWarranty: string;
  }) => {
    const session = await getFlashSession(this.request.headers.get("Cookie"));

    try {
      const existingDuty = await Duty.findOne({ name });

      if (existingDuty) {
        session.flash("alert", {
          title: "Error",
          status: "error",
          message: "Duty already exist",
        });

        return redirect(this.path, {
          headers: {
            "Set-Cookie": await commitFlashSession(session),
          },
        });
        // return {
        //   status: "error",
        //   code: 400,
        //   message: "Duty already exists",
        //   errors: [
        //     {
        //       field: "name",
        //       message:
        //         "A duty with this name already exists. Please choose a different name.",
        //     },
        //   ],
        // };
      }

      const duty = await Duty.create({
        name,
        description,
        commandingOfficer,
        dutySeargent,
        platoonCommander,
        administrationWarranty,
      });

      if (!duty) {
        // return {
        //   status: "error",
        //   code: 400,
        //   message: "Error adding duty",
        //   errors: [
        //     {
        //       field: "name",
        //       message: "Error adding duty",
        //     },
        //   ],
        // };
        session.flash("alert", {
          title: "Error",
          status: "error",
          message: "Error adding duty",
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
      //   message: "Duty added successfully",
      //   data: duty,
      // };

      session.flash("alert", {
        title: "Success",
        status: "success",
        message: "Duty craeted successfully",
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
      //   message: "Error adding duty",
      // };

      session.flash("alert", {
        title: "Error",
        status: "error",
        message: "Error craeting duty",
      });
      return redirect(this.path, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    }
  };

  /**
   * Update duty
   * @param param0 _id
   * @param param1 name
   * @param param2 parent
   * @param param3 description
   * @returns null
   */
  public updateDuty = async ({
    _id,
    name,
    description,
    commandingOfficer,
    dutySeargent,
    platoonCommander,
    administrationWarranty,
  }: {
    _id: string;
    name: string;
    description: string;
    commandingOfficer: string;
    dutySeargent: string;
    platoonCommander: string;
    administrationWarranty: string;
  }) => {
    const session = await getFlashSession(this.request.headers.get("Cookie"));

    try {
      const updated = await Duty.findByIdAndUpdate(
        _id,
        {
          name,
          description,
          commandingOfficer,
          dutySeargent,
          platoonCommander,
          administrationWarranty,
        },
        { new: true }
      );

      // return {
      //   status: "success",
      //   code: 200,
      //   message: "Duty updated successfully",
      //   data: updated,
      // };
      session.flash("alert", {
        title: "Success",
        status: "success",
        message: "Duty updated successfully",
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
        message: "Error updating duty",
      });
      return redirect(this.path, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
      // return {
      //   status: "error",
      //   code: 400,
      //   message: "Error updating duty",
      // };
    }
  };

  /**
   * Delete Duty
   * @param param0 _id
   * @returns null
   */
  public deleteDuty = async ({ _id }: { _id: string }) => {
    const session = await getFlashSession(this.request.headers.get("Cookie"));

    try {
      await Duty.findByIdAndDelete(_id);

      session.flash("alert", {
        title: "Success",
        status: "success",
        message: "Duty Deleted Successfully",
      });
      return redirect(this.path, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });

      // return {
      //   status: "success",
      //   code: 200,
      //   message: "Duty deleted successfully",
      // };
    } catch (error) {
      console.log(error);
      session.flash("alert", {
        title: "Error",
        status: "error",
        message: "Error deleting duty",
      });
      return redirect(this.path, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
      // return {
      //   status: "error",
      //   code: 400,
      //   message: "Error deleting duty",
      // };
    }
  };
}
