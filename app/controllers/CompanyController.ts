import { redirect } from "@remix-run/node";
import type { CompanyInterface } from "../utils/types";
import { commitFlashSession, getFlashSession } from "~/flash-session";
import Company from "~/models/Company";

export default class CompanyController {
  private request: Request;
  private path: string;

  constructor(request: Request) {
    const url = new URL(request.url);
    const path = url.pathname + url.search;

    this.request = request;
    this.path = path;
  }

  /**
   * Retrieve all Company
   * @param param0 page
   * @param param1 search_term
   * @param param2 limit
   * @returns {companys: CompanyInterface, totalPages: number}
   */
  public async getCompanys({
    page,
    search_term,
    limit = 10,
  }: {
    page: number;
    search_term?: string;
    limit?: number;
  }): Promise<{ companys: CompanyInterface[]; totalPages: number } | any> {
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
      const companys = await Company.find(searchFilter)
        .skip(skipCount)
        .populate("commandingOfficer")
        .populate("companySeargent")
        .populate("platoonCommander")
        .populate("administrationWarranty")
        .limit(limit)
        .sort({
          createdAt: "desc",
        })
        .exec();

      const totalCompanysCount = await Company.countDocuments(
        searchFilter
      ).exec();
      const totalPages = Math.ceil(totalCompanysCount / limit);

      return { companys, totalPages };
    } catch (error) {
      console.log(error);
      session.flash("alert", {
        title: "Error!",
        status: "error",
        message: "Error retrieving companys",
      });

      return redirect(this.path, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    }
  }

  /**
   * Retrieve a single Company
   * @param id string
   * @returns CompanyInterface
   */
  public async getCompany({ id }: { id: string }) {
    try {
      const company = await Company.findById(id);
      return company;
    } catch (error) {
      console.error("Error retrieving company:", error);
      return {
        status: "error",
        code: 400,
        message: "Error getting company details",
        errors: [
          {
            field: "name",
            message:
              "A company with this name already exists. Please choose a different name.",
          },
        ],
      };
    }
  }

  /**
   * Create a new company
   * @param path string
   * @param name string
   * @param parent string
   * @param description string
   * @returns CompanyInterface
   */
  public createCompany = async ({
    name,
    description,
    strength,
    mission,
    vission,
    quote,
    tacticOfficer,
    trainingOfficer,
  }: {
    name: string;
    description: string;
  }) => {
    const session = await getFlashSession(this.request.headers.get("Cookie"));

    try {
      const existingCompany = await Company.findOne({ name });

      if (existingCompany) {
        session.flash("alert", {
          title: "Error",
          status: "error",
          message: "Company already exist",
        });

        return redirect(this.path, {
          headers: {
            "Set-Cookie": await commitFlashSession(session),
          },
        });
        // return {
        //   status: "error",
        //   code: 400,
        //   message: "Company already exists",
        //   errors: [
        //     {
        //       field: "name",
        //       message:
        //         "A company with this name already exists. Please choose a different name.",
        //     },
        //   ],
        // };
      }

      const company = await Company.create({
        name,
        description,
        strength,
        mission,
        vission,
        quote,
        tacticOfficer: tacticOfficer || null,
        trainingOfficer: trainingOfficer || null,
      });

      if (!company) {
        // return {
        //   status: "error",
        //   code: 400,
        //   message: "Error adding company",
        //   errors: [
        //     {
        //       field: "name",
        //       message: "Error adding company",
        //     },
        //   ],
        // };
        session.flash("alert", {
          title: "Error",
          status: "error",
          message: "Error adding company",
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
      //   message: "Company added successfully",
      //   data: company,
      // };

      session.flash("alert", {
        title: "Success",
        status: "success",
        message: "Company craeted successfully",
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
      //   message: "Error adding company",
      // };

      session.flash("alert", {
        title: "Error",
        status: "error",
        message: "Error craeting company",
      });
      return redirect(this.path, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
    }
  };

  /**
   * Update company
   * @param param0 _id
   * @param param1 name
   * @param param2 parent
   * @param param3 description
   * @returns null
   */
  public updateCompany = async ({
    _id,
    name,
    description,
    commandingOfficer,
    companySeargent,
    platoonCommander,
    administrationWarranty,
  }: {
    _id: string;
    name: string;
    description: string;
    commandingOfficer: string;
    companySeargent: string;
    platoonCommander: string;
    administrationWarranty: string;
  }) => {
    const session = await getFlashSession(this.request.headers.get("Cookie"));

    try {
      const updated = await Company.findByIdAndUpdate(
        _id,
        {
          name,
          description,
          commandingOfficer: commandingOfficer || null,
          companySeargent: companySeargent || null,
          platoonCommander: platoonCommander || null,
          administrationWarranty: administrationWarranty || null,
        },
        { new: true }
      );

      // return {
      //   status: "success",
      //   code: 200,
      //   message: "Company updated successfully",
      //   data: updated,
      // };
      session.flash("alert", {
        title: "Success",
        status: "success",
        message: "Company updated successfully",
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
        message: "Error updating company",
      });
      return redirect(this.path, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
      // return {
      //   status: "error",
      //   code: 400,
      //   message: "Error updating company",
      // };
    }
  };

  /**
   * Delete Company
   * @param param0 _id
   * @returns null
   */
  public deleteCompany = async ({ _id }: { _id: string }) => {
    const session = await getFlashSession(this.request.headers.get("Cookie"));

    try {
      await Company.findByIdAndDelete(_id);

      session.flash("alert", {
        title: "Success",
        status: "success",
        message: "Company Deleted Successfully",
      });
      return redirect(this.path, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });

      // return {
      //   status: "success",
      //   code: 200,
      //   message: "Company deleted successfully",
      // };
    } catch (error) {
      console.log(error);
      session.flash("alert", {
        title: "Error",
        status: "error",
        message: "Error deleting company",
      });
      return redirect(this.path, {
        headers: {
          "Set-Cookie": await commitFlashSession(session),
        },
      });
      // return {
      //   status: "error",
      //   code: 400,
      //   message: "Error deleting company",
      // };
    }
  };
}
