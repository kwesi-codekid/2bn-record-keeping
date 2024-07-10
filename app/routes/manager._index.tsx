import { useOutletContext } from "@remix-run/react";
import { useLottie } from "lottie-react";
import moment from "moment";

// lottie
import helloLottie from "~/assets/lotties/hello.json";
import BellRingingIcon from "~/components/icons/BellRinging";
import CalendarIcon from "~/components/icons/Calendar";
import ClockIcon from "~/components/icons/Clock";
import EmailIcon from "~/components/icons/Email";
import IdCardIcon from "~/components/icons/IdCard";
import WalkingIcon from "~/components/icons/Walking";
import { UserInterface } from "~/utils/types";

const ManagerDashboard = () => {
  // user data from outlet context
  const { user } = useOutletContext<{ user: UserInterface }>();

  // // lottie
  // const lottieOptions = {
  //   animationData: helloLottie,
  //   loop: true,
  // };
  // const { View } = useLottie(lottieOptions);

  return (
    <div className="h-full overflow-y-hidden grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* begin:: right-sided cards */}
      <div className="flex flex-col gap-6">
        <div className="rounded-3xl bg-gradient-to-tl from-blue-600 to-indigo-700 p-4 h-max">
          <div className="flex items-start gap-1">
            {/* <div className="w-1/4">{View}</div> */}
            <div className="flex-1 flex flex-col gap-3">
              {/* greeting */}
              <h1 className="font-montserrat font-bold text-2xl text-white">
                Welcome, {user.firstName}
              </h1>

              {/* user info */}
              <div>
                <p className="font-nunito text-white font-medium flex items-center gap-2 text-sm mb-1">
                  <IdCardIcon className="size-5" /> {user.staffId}
                </p>
                <p className="font-nunito text-white font-medium flex items-center gap-2 text-sm">
                  <EmailIcon className="size-5" /> {user.email}
                </p>
              </div>

              {/* date and time */}
              <div className="flex items-center gap-6">
                <p className="font-nunito text-white font-medium flex items-center gap-2 text-sm">
                  <CalendarIcon className="size-5" />{" "}
                  {moment(new Date()).format("DD-MMM-YYYY")}
                </p>
                <p className="font-nunito text-white font-medium flex items-center gap-2 text-sm">
                  <ClockIcon className="size-5" /> 07:34
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-3xl bg-white dark:bg-slate-900 dark:border dark:border-white/10 flex-1 p-4">
          {/* card header */}
          <div className="flex items-center gap-2">
            <div className="rounded-full flex items-center justify-center size-10 bg-blue-500/20">
              <BellRingingIcon className="text-blue-500 size-6" />
            </div>
            <h3 className="font-montserrat font-semibold text-xl text-slate-800 dark:text-white">
              Notifications
            </h3>
          </div>
        </div>
      </div>
      {/* end:: right-sided cards */}

      {/* begin:: tables */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 dark:border dark:border-white/10 h-full md:col-span-2 p-4">
        {/* card header */}
        <div className="flex items-center gap-2">
          <div className="rounded-full flex items-center justify-center size-10 bg-green-400/20">
            <WalkingIcon className="text-green-400 size-5" />
          </div>
          <h3 className="font-montserrat font-semibold text-xl text-slate-800 dark:text-white">
            Recent Clinical Visits
          </h3>
        </div>
      </div>
      {/* end:: tables */}
    </div>
  );
};

export default ManagerDashboard;
