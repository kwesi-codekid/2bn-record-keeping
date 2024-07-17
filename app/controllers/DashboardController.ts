import Company from "~/models/Company";
import Department from "~/models/Department";
import Group from "~/models/Group";
import Mission from "~/models/Mission";
import User from "~/models/User";

export default class DashboardController {
  private request: Request;
  private path: string;

  constructor(request: Request) {
    const url = new URL(request.url);
    const path = url.pathname + url.search;

    this.request = request;
    this.path = path;
  }

  public totals = async () => {
    const totalMissionsCount = await Mission.countDocuments({}).exec();
    const totalUsersCount = await User.countDocuments({}).exec();
    const totalCompaniesCount = await Company.countDocuments({}).exec();
    const totalDepartmentsCount = await Department.countDocuments({}).exec();
    const totalGroupsCount = await Group.countDocuments({}).exec();

    return {
      missionTotal: totalMissionsCount,
      userTotal: totalUsersCount,
      companyTotal: totalCompaniesCount,
      departmentTotal: totalDepartmentsCount,
      groupTotal: totalGroupsCount,
    };
  };
}
