import { Fade, Zoom } from "react-awesome-reveal";
import { whyChooseUs } from "~/data/choose-us";

const ChooseUsSection = () => {
  return (
    <div className="py-20 md:px-12 px-4 lg:px-2">
      <div className="max-w-5xl mx-auto">
        <Zoom duration={1500} triggerOnce>
          <h2 className="font-montserrat font-bold text-3xl md:text-5xl lg:text-6xl text-indigo-600 text-center mb-16">
            Why Choose Us
          </h2>
        </Zoom>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-10 md:gap-x-8 md:gap-y-10 max-w-5xl mx-auto">
        <Fade cascade direction="up" delay={400} duration={1500} triggerOnce>
          {whyChooseUs.map((item, index) => (
            <div
              key={index}
              className="rounded-3xl bg-gradient-to-br from-blue-400/10 to-indigo-700/20 relative px-4 py-5 dark:border dark:border-white/10"
            >
              <div className="rounded-full absolute -top-5 left-4 size-12 bg-indigo-500 flex items-center justify-center">
                {item.icon}
              </div>

              <div className="flex flex-col gap-3 pt-5">
                <h3 className="font-montserrat font-bold text-indigo-600 text-xl">
                  {item.title}
                </h3>
                <p className="font-nunito text-sm text-slate-600 dark:text-slate-100">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </Fade>
      </div>
    </div>
  );
};

export default ChooseUsSection;
