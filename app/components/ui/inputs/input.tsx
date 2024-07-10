import { Input } from "@nextui-org/react";
import { ReactNode } from "react";

const CustomInput = (props: {
  type?: string;
  name: string;
  label: string;
  defaultValue?: string;
  isDisabled?: boolean;
  isRequired?: boolean;
  value?: string | undefined;
  onValueChange?: (value: string) => void;
  isReadonly?: boolean;
  isInvalid?: boolean;
  errorMessage?: string;
  hidden?: boolean;
  endContent?: string | ReactNode;
  className?: string;
}) => {
  return (
    <Input
      type={props.type}
      name={props.name}
      label={props.label}
      placeholder=" "
      labelPlacement="outside"
      variant="bordered"
      className={`!shadow-none ${props.className} font-nunito ${
        props.hidden && "hidden"
      }`}
      classNames={{
        inputWrapper: "!shadow-none dark:border-slate-700",
        base: "focus:!border-blue-600",
        label:
          "text-sm md:text-base font-medium font-sen text-slate-800 dark:text-slate-100",
      }}
      defaultValue={props.defaultValue}
      isDisabled={props.isDisabled}
      isRequired={props.isRequired}
      value={props.value}
      onValueChange={props.onValueChange}
      isReadOnly={props.isReadonly}
      isInvalid={props.isInvalid}
      errorMessage={props.errorMessage}
      endContent={props.endContent}
    />
  );
};

export default CustomInput;
