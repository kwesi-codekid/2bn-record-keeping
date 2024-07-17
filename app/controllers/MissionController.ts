import { redirect } from "@remix-run/node";
import type { MissionInterface } from "../utils/types";
import { commitFlashSession, getFlashSession } from "~/flash-session";
import Mission from "~/models/Mission";

export default class MissionController {
  private request: Request;
  private path: string;

  constructor(request: Request) {
    const url = new URL(request.url);
    const path = url.pathname + url.search;

    this.request = request;
    this.path = path;
  }

  /**
   * Retrieve all Mission
   * @param param0 page
   * @param param1 search_term
   * @param param2 limit
   * @returns {missions: MissionInterface, totalPages: number}
   */
  public async getMissions({
    page,
    search_term,
    limit = 10,
  }: {
    page: number;
    search_term?: string;
    limit?: number;
  }): Promise<{ missions: MissionInterface[]; totalPages: number } | any> {
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
      const missions = await Mission.find(searchFilter)
        .skip(skipCount)
        .limit(limit)
        .sort({
          createdAt: "desc",
        })
        .exec();

      const totalMissionsCount = await Mission.countDocuments(
        searchFilter
      ).exec();
      const totalPages = Math.ceil(totalMissionsCount / limit);

      return { missions, totalPages };
    } catch (error) {
      console.log(error);
      session.flash("alert", {
        title: "Error!",
        status: "error",
        message: "Error retrieving missions",
      });

      return redirect(this.path, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    }
  }

  /**
   * Retrieve a single Mission
   * @param id string
   * @returns MissionInterface
   */
  public async getMission({ id }: { id: string }) {
    try {
      const mission = await Mission.findById(id);
      return { mission };
    } catch (error) {
      console.error("Error retrieving mission:", error);
      return {
        status: "error",
        code: 400,
        message: "Error getting mission details",
        errors: [
          {
            field: "name",
            message:
              "A mission with this name already exists. Please choose a different name.",
          },
        ],
      };
    }
  }

  /**
   * Create a new mission
   * @param path string
   * @param name string
   * @param parent string
   * @param description string
   * @returns MissionInterface
   */
  public createMission = async ({
    name,
    description,
    missionType,
    missionLocation,
    startDate,
    endDate,
    status,
    group,
  }: {
    name: string;
    description: string;
    missionType: string;
    missionLocation: string;
    startDate: string;
    endDate: string;
    status: string;
    group: string;
  }) => {
    const session = await getFlashSession(this.request.headers.get("Cookie"));

    try {
      const existingMission = await Mission.findOne({ startDate });

      if (existingMission) {
        session.flash("alert", {
          title: "Error",
          status: "error",
          message: "Mission already exist",
        });

        return redirect(this.path, {
          headers: {
            "Set-Cookie": await commitFlashSession(session),
          },
        });
        // return {
        //   status: "error",
        //   code: 400,
        //   message: "Mission already exists",
        //   errors: [
        //     {
        //       field: "name",
        //       message:
        //         "A mission with this name already exists. Please choose a different name.",
        //     },
        //   ],
        // };
      }

      const mission = await Mission.create({
        name,
        description,
        missionType,
        missionLocation,
        startDate,
        endDate,
        status,
        group,
      });

      if (!mission) {
        // return {
        //   status: "error",
        //   code: 400,
        //   message: "Error adding mission",
        //   errors: [
        //     {
        //       field: "name",
        //       message: "Error adding mission",
        //     },
        //   ],
        // };
        session.flash("alert", {
          title: "Error",
          status: "error",
          message: "Error adding mission",
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
      //   message: "Mission added successfully",
      //   data: mission,
      // };

      session.flash("alert", {
        title: "Success",
        status: "success",
        message: "Mission craeted successfully",
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
      //   message: "Error adding mission",
      // };

      session.flash("alert", {
        title: "Error",
        status: "error",
        message: "Error craeting mission",
      });
      return redirect(this.path, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    }
  };

  /**
   * Update mission
   * @param param0 _id
   * @param param1 name
   * @param param2 parent
   * @param param3 description
   * @returns null
   */
  public updateMission = async ({
    _id,
    name,
    description,
    missionType,
    missionLocation,
    startDate,
    endDate,
    status,
    group,
  }: {
    _id: string;
    name: string;
    description: string;
    missionType: string;
    missionLocation: string;
    startDate: string;
    endDate: string;
    status: string;
    group: string;
  }) => {
    const session = await getFlashSession(this.request.headers.get("Cookie"));

    try {
      const updated = await Mission.findByIdAndUpdate(
        _id,
        {
          name,
          description,
          missionType,
          missionLocation,
          startDate,
          endDate,
          status,
          group,
        },
        { new: true }
      );

      // return {
      //   status: "success",
      //   code: 200,
      //   message: "Mission updated successfully",
      //   data: updated,
      // };
      session.flash("alert", {
        title: "Success",
        status: "success",
        message: "Mission updated successfully",
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
        message: "Error updating mission",
      });
      return redirect(this.path, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
      // return {
      //   status: "error",
      //   code: 400,
      //   message: "Error updating mission",
      // };
    }
  };

  /**
   * Delete Mission
   * @param param0 _id
   * @returns null
   */
  public deleteMission = async ({ _id }: { _id: string }) => {
    const session = await getFlashSession(this.request.headers.get("Cookie"));

    try {
      await Mission.findByIdAndDelete(_id);

      session.flash("alert", {
        title: "Success",
        status: "success",
        message: "Mission Deleted Successfully",
      });
      return redirect(this.path, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });

      // return {
      //   status: "success",
      //   code: 200,
      //   message: "Mission deleted successfully",
      // };
    } catch (error) {
      console.log(error);
      session.flash("alert", {
        title: "Error",
        status: "error",
        message: "Error deleting mission",
      });
      return redirect(this.path, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
      // return {
      //   status: "error",
      //   code: 400,
      //   message: "Error deleting mission",
      // };
    }
  };
}
