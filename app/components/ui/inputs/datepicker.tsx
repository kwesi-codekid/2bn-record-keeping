import { getLocalTimeZone, parseDate, today } from "@internationalized/date";
import { DatePicker } from "@nextui-org/react";

const CustomDatePicker = (props: {
  label: string;
  defaultValue?: string;
  name: string;
  isRequired?: boolean;
  maxValue?: string | undefined;
  isDisabled?: boolean;
}) => {
  return (
    <DatePicker
      labelPlacement="outside"
      label={
        <span className="text-sm md:text-base font-medium font-sen text-slate-800 dark:text-slate-100">
          {props.label}
        </span>
      }
      showMonthAndYearPickers
      maxValue={(props.maxValue && parseDate(props.maxValue)) || undefined}
      isRequired={props.isRequired}
      name={props.name}
      className="font-nunito"
      variant="bordered"
      defaultValue={
        (props.defaultValue && parseDate(props.defaultValue)) || undefined
      }
      isDisabled={props.isDisabled}
    />
  );
};

export default CustomDatePicker;
