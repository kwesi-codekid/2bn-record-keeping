import {
  Spinner,
  Table,
  TableBody,
  TableColumn,
  TableHeader,
  TableProps,
} from "@nextui-org/react";
import { ReactNode } from "react";

const CustomTable = ({
  columns,
  children,
  tableProps,
  loading,
  asyncList,
}: {
  columns: {
    title: string;
    allowSort?: boolean;
  }[];
  tableProps?: TableProps;
  children?: ReactNode | any;
  loading?: boolean;
  asyncList?: any;
}) => {
  return (
    <Table
      aria-label="data table"
      {...tableProps}
      sortDescriptor={asyncList.sortDescriptor}
      onSortChange={asyncList.sort}
    >
      <TableHeader>
        {columns.map((column, index: number) => (
          <TableColumn
            key={index}
            className="font-montserrat"
            allowsSorting={column.allowSort}
          >
            {column.title}
          </TableColumn>
        ))}
      </TableHeader>

      <TableBody
        items={asyncList.items}
        isLoading={loading}
        loadingContent={<Spinner label="Loading..." />}
      >
        {children}
      </TableBody>
    </Table>
  );
};

export default CustomTable;
