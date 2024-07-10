import { Select, SelectItem, SelectedItems } from "@nextui-org/react";
import { ReactNode } from "react";
import { UserInterface } from "~/utils/types";

const CustomSelect = (props: {
  name: string;
  label: string;
  defaultSelectedKeys?: string[];
  selectedKeys?: string[];
  onChange?: (e: any) => void;
  isRequired?: boolean;
  options: {
    key: string | number;
    value: string;
    display_name: string | number;
  }[];
  onSelectionChange?: (selectedKeys: any) => void;
  isDisabled?: boolean;
  multiple?: boolean;
  renderValue?: (items: any) => ReactNode;
  isMultiline?: boolean;
  description?: string;
  value?: string;
}) => {
  return (
    <Select
      name={props.name}
      label={props.label}
      labelPlacement="outside"
      placeholder=" "
      defaultSelectedKeys={props.defaultSelectedKeys}
      selectedKeys={props.selectedKeys}
      description={props.description}
      onChange={props.onChange}
      isRequired={props.isRequired}
      className="font-nunito text-lg"
      classNames={{
        label:
          "text-sm md:text-base font-medium font-sen text-slate-800 dark:text-slate-100",
        popoverContent: "bg-white dark:bg-slate-900",
      }}
      variant="bordered"
      isDisabled={props.isDisabled}
      selectionMode={props.multiple ? "multiple" : "single"}
      renderValue={props.renderValue}
      isMultiline={props.isMultiline}
      onSelectionChange={props.onSelectionChange}
      value={props.value}
    >
      {props.options.map((option) => (
        <SelectItem
          key={option.key}
          value={option.value}
          className="font-nunito text-xs"
        >
          {option.display_name}
        </SelectItem>
      ))}
    </Select>
  );
};

export default CustomSelect;

/*
"personal_information": {
        "id": 0,
        "maiden_name": "",
        "photo": "https://psgh.org/storage/avatars/0.png",
        "idCardPhoto": null,
        "processPhoto": "https://psgh.societymanager.org/assets/images/users/female/5.jpg"
    },
    "membership_information": {
        
        
        "memberBills": [
            {
                "id": 46052,
                "reg_no": 0,
                "amount": "1020",
                "year": 2024,
                "status": 1,
                "updated_at": "2024-01-15T13:49:53.000000Z",
                "created_at": null
            }
        ],
        "duesReceipts": [
            {
                "id": 23189,
                "reg_no": 0,
                "amount": "1020",
                "bill_year": 2024,
                "transaction_id": "2402293408795564505",
                "payment_instrument": "AgricBank",
                "payment_mode": "Member Dues",
                "bank_code": null,
                "status": "PAID",
                "payment_number": "0541915656",
                "description": "Being Payment of Membership Dues",
                "extras": null,
                "transaction_date": "2024-02-29",
                "created_by": 45,
                "updated_by": null,
                "created_at": "2024-02-29T12:39:31.000000Z",
                "updated_at": "2024-02-29T12:39:31.000000Z"
            }
        ]
    },
    "account_information": {
        "user_account": {
            "id": 797,
            "username": "psgh0",
            "created_at": "2021-01-27T18:06:49.000000Z",
            "updated_at": "2024-05-17T13:33:40.000000Z",
            "email": "sukaissa@gmail.com"
        },
        "send_mail": 1,
        "send_sms": 1
    }
*/
