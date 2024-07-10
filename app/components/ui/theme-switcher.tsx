import { Button, Switch } from "@nextui-org/react";
import { MoonIcon } from "../icons/Moon";
import { SunIcon } from "../icons/Sun";
import { useTheme } from "next-themes";
import { useState } from "react";

const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();
  const [isLightTheme, setIsLightTheme] = useState(
    theme === "dark" ? false : true
  ); // Initial state based on theme

  return (
    <Button
      isIconOnly
      radius="full"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="dark:text-white text-slate-800 !bg-transparent mr-1"
    >
      {theme === "dark" ? (
        <SunIcon className="size-8" />
      ) : (
        <MoonIcon className="size-8" />
      )}
    </Button>
  );
};

export default ThemeSwitcher;
