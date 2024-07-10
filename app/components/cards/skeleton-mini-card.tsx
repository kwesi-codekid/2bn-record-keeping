import { Card, Skeleton } from "@nextui-org/react";
import { ReactNode } from "react";

const SkeletonMiniCard = ({
  icon,
  primaryColor,
  secondaryColor,
  title,
  description,
  isLoaded,
}: {
  icon?: ReactNode;
  primaryColor?: string;
  secondaryColor?: string;
  title: string;
  description?: string;
  isLoaded: boolean;
}) => {
  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 dark:border border-white/5 px-3 py-2 flex items-start gap-1">
      <Skeleton isLoaded={isLoaded} className="rounded-full">
        <div
          className={`rounded-full size-10 flex items-center justify-center ${secondaryColor}`}
        >
          <p className={primaryColor}>{icon}</p>
        </div>
      </Skeleton>

      <div className="flex flex-col flex-1">
        <Skeleton
          isLoaded={isLoaded}
          className={`rounded-lg ${!isLoaded && "mb-1"} w-full pl-2`}
        >
          <p className="text-slate-400 dark:text-slate-100 text-xs font-nunito font-medium">
            {title}
          </p>
        </Skeleton>

        <Skeleton
          isLoaded={isLoaded}
          className={`rounded-lg ${!isLoaded ? "w-1/2" : "w-full"} h-5 pl-2`}
        >
          <h4 className="text-slate-700 dark:text-white text-base font-nunito font-bold">
            {description}
          </h4>
        </Skeleton>
      </div>
    </div>
  );
};

export default SkeletonMiniCard;
