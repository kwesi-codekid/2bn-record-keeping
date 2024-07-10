import {
  Dropdown,
  DropdownTrigger,
  Button,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import ChevronDownIcon from "../icons/ChevronDown";

const FilterDropdown = ({
  selected,
  setSelected,
  title,
  options,
}: {
  title: string;
  selected: any;
  setSelected: (selected: any) => void;
  options: { key: number; value: string; display_name: string }[];
}) => {
  return (
    <Dropdown className="w-52">
      <DropdownTrigger className="hidden sm:flex">
        <Button
          endContent={<ChevronDownIcon className="text-sm" />}
          variant="flat"
          className="font-nunito !text-[10px]"
          size="sm"
        >
          {title}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label={`Filter By ${title}`}
        selectionMode="single"
        selectedKeys={selected}
        onSelectionChange={(selected) => {
          setSelected(selected);
        }}
      >
        {options.map((option) => (
          <DropdownItem className="font-nunito text-xs" key={option.key}>
            {option.display_name}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
};

export default FilterDropdown;
