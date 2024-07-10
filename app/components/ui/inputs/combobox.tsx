import { Autocomplete, AutocompleteProps } from "@nextui-org/react";

const CustomComboBox = (props: AutocompleteProps) => {
  return (
    <Autocomplete
      {...props}
      inputProps={{
        classNames: {
          label:
            "text-sm md:text-base font-medium font-sen text-slate-800 dark:text-slate-100",
          base: "!shadow-none font-nunito",
        },
      }}
    >
      {props.children}
    </Autocomplete>
  );
};

export default CustomComboBox;
