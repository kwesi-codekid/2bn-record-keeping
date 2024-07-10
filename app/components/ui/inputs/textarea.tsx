import { Textarea } from "@nextui-org/react";

const CustomTextarea = (props: {
  name: string;
  label: string;
  defaultValue?: string;
  value?: string;
  isDisabled?: boolean;
  isRequired?: boolean;
  onValueChange?: (value: string) => void;
  description?: string | number;
}) => {
  return (
    <Textarea
      name={props.name}
      label={props.label}
      placeholder=" "
      labelPlacement="outside"
      variant="bordered"
      className={`!shadow-none font-nunito`}
      classNames={{
        label:
          "text-sm md:text-base font-medium font-sen text-slate-800 dark:text-slate-100",
        input: "vertical-scrollbar",
      }}
      defaultValue={props.defaultValue}
      value={props.value}
      isDisabled={props.isDisabled}
      isRequired={props.isRequired}
      onValueChange={props.onValueChange}
      description={props.description}
    />
  );
};

export default CustomTextarea;
