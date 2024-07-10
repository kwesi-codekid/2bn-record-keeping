import { ReactNode } from "react";

const MiniCard = ({
  icon,
  primaryColor,
  secondaryColor,
  title,
  description,
}: {
  icon: ReactNode;
  primaryColor: string;
  secondaryColor: string;
  title: string;
  description: string;
}) => {
  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 dark:border border-white/5 px-4 py-2 flex items-center gap-3">
      <div
        className={`rounded-full size-10 flex items-center justify-center ${secondaryColor}`}
      >
        <p className={primaryColor}>{icon}</p>
      </div>
      <div className="flex flex-col">
        <p className="text-slate-400 dark:text-slate-100 text-xs font-nunito font-medium">
          {title}
        </p>
        <h4 className="text-slate-700 dark:text-white text-lg font-nunito font-bold">
          {description}
        </h4>
      </div>
    </div>
  );
};

export default MiniCard;
