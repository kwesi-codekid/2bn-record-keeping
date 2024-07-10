import { useNavigate } from "@remix-run/react";
import { Fade, Zoom } from "react-awesome-reveal";

import mtnLogo from "~/assets/images/mtn-logo.jpg";
import airtelLogo from "~/assets/images/airteltigo-logo.png";
import mtnAfaLogo from "~/assets/images/mtn-afa.jpg";
import { Button } from "@nextui-org/react";
import type { PackageInterface } from "~/utils/types";

const Packages = ({ packages }: { packages: PackageInterface[] }) => {
  const navigate = useNavigate();

  return (
    <div className="py-20 bg-gradient-to-br dark:bg-none from-blue-400/10 to-indigo-700/20 dark:!bg-slate-950 px-4 md:px-12">
      <div className="max-w-5xl mx-auto">
        <Zoom duration={1500} triggerOnce>
          <h2 className="font-montserrat font-bold text-3xl md:text-5xl lg:text-6xl text-indigo-700 dark:text-indigo-600 text-center mb-16">
            Data Packages
          </h2>
        </Zoom>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto">
        <Fade cascade direction="up" delay={400} duration={1500} triggerOnce>
          {packages.map((pkg, index) => (
            <div
              key={index}
              className="bg-white dark:bg-slate-900 dark:border dark:border-white/10 p-6 rounded-3xl  flex flex-col gap-4 group:"
            >
              <img
                src={pkg.bannerImage}
                alt={pkg.title}
                className="w-full rounded-xl hover:scale-[1.05] cursor-pointer transition-all duration-400 ease-in-out"
                onClick={() => navigate(`/purchase/${pkg._id}`)}
              />
              <h3 className="font-montserrat font-bold text-xl text-indigo-600 dark:text-white">
                {pkg.title}
              </h3>
              <Button
                className="font-montserrat font-semibold px-4 py-2 rounded-xl hover:!bg-indigo-600 hover:text-white"
                variant="flat"
                color="primary"
                onClick={() => {
                  navigate(`/purchase/${pkg._id}`);
                }}
              >
                Buy Now
              </Button>
            </div>
          ))}
        </Fade>
      </div>
    </div>
  );
};

export default Packages;
