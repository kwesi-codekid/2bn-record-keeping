import {
  AutocompleteItem,
  Button,
  Chip,
  Input,
  TableCell,
  TableRow,
  User,
  useDisclosure,
} from "@nextui-org/react";
import { ActionFunction, LoaderFunction, MetaFunction } from "@remix-run/node";
import {
  useActionData,
  useLoaderData,
  useNavigate,
  useNavigation,
} from "@remix-run/react";
import { useEffect, useState } from "react";
import { EditIcon } from "~/components/icons/Edit";
import { PlusIcon } from "~/components/icons/Plus";
import { SearchIcon } from "~/components/icons/Search";
import CreateRecordModal from "~/components/modals/CreateRecord";
import DeleteRecordModal from "~/components/modals/DeleteRecord";
import EditRecordModal from "~/components/modals/EditRecord";
import CustomComboBox from "~/components/ui/inputs/combobox";
import CustomDatePicker from "~/components/ui/inputs/datepicker";
import CustomInput from "~/components/ui/inputs/input";
import CustomSelect from "~/components/ui/inputs/select";
import CustomTextarea from "~/components/ui/inputs/textarea";
import CustomTable from "~/components/ui/new-table";
import DepartmentController from "~/controllers/DepartmentController";
import UserController from "~/controllers/UserController";
import { roles } from "~/data/select-items";
import { deptTableCols, userTableCols } from "~/data/table-cols";
import { getInitials, getValuesFromSet } from "~/utils/string-manipulation";
import { errorToast, successToast } from "~/utils/toasters";
import { DepartmentInterface, UserInterface } from "~/utils/types";

const AdminUserManagement = () => {
  const navigation = useNavigation();
  const navigate = useNavigate();

  // loader data
  const { users, totalPages, departments } = useLoaderData<{
    users: UserInterface[];
    totalPages: number;
    departments: DepartmentInterface[];
  }>();

  // action data
  const actionData = useActionData<{
    status: string;
    message: string;
    errors: [{ field: string; message: string }];
  }>();
  useEffect(() => {
    if (actionData?.status === "error") {
      errorToast("Error!", actionData.message);
    }
    if (actionData?.status === "success") {
      deleteDisclosure.onClose();
      createRecordDisclosure.onClose();
      editDisclosure.onClose();
      successToast("Success!", actionData.message);
      navigate(".", { replace: true });
    }
  }, [actionData]);

  // create department modal
  const createRecordDisclosure = useDisclosure();

  // edit user modal
  const editDisclosure = useDisclosure();
  const [selectedUser, setSelectedUser] = useState<UserInterface | null>(null);
  useEffect(() => {
    if (!editDisclosure.isOpen) setSelectedUser(null);
  }, [editDisclosure.onOpenChange]);

  // delete department modal
  const deleteDisclosure = useDisclosure();
  const [deleteId, setDeleteId] = useState<string>("");
  useEffect(() => {
    if (!deleteDisclosure.isOpen) setDeleteId("");
  }, [deleteDisclosure.onOpenChange]);

  // select department data
  let selectOptions: { key: string; value: string; display_name: string }[] =
    [];
  departments?.map((department: DepartmentInterface) => {
    selectOptions.push({
      key: department._id as string,
      value: department._id as string,
      display_name: department.name as string,
    });
  });

  // selected approvals
  const [selectedPermissions, setSelectedPermissions] = useState<string>("");
  useEffect(() => {
    if (!createRecordDisclosure.isOpen) setSelectedPermissions("");
  }, [createRecordDisclosure.onOpenChange]);

  return (
    <div className="h-full flex flex-col gap-2">
      <div className="flex justify-between gap-3 items-center">
        <Input
          isClearable
          placeholder="Search here..."
          size="sm"
          radius="md"
          startContent={<SearchIcon />}
          className="w-full md:w-1/4"
          classNames={{
            inputWrapper: "bg-white dark:bg-slate-700",
          }}
          onValueChange={(value) => {
            const timeoutId = setTimeout(() => {
              navigate(`?search_term=${value}`);
            }, 1500);
            return () => clearTimeout(timeoutId);
          }}
        />
        <div className="flex gap-3">
          <Button
            color="primary"
            size="sm"
            radius="md"
            startContent={<PlusIcon className="size-5" />}
            className="font-montserrat font-semibold"
            onPress={() => createRecordDisclosure.onOpen()}
          >
            New User
          </Button>
        </div>
      </div>

      <CustomTable
        columns={userTableCols}
        loadingState={navigation.state === "loading" ? "loading" : "idle"}
        page={1}
        setPage={(page) => {
          navigate(`?page=${page}`);
        }}
        totalPages={totalPages}
      >
        {users?.map((user: UserInterface) => (
          <TableRow key={user._id}>
            <TableCell className="text-sm">
              <User
                avatarProps={{
                  radius: "sm",
                  className: "dark:bg-slate-700",
                  showFallback: true,
                  name: getInitials(user.firstName + " " + user.lastName),
                  size: "sm",
                }}
                name={
                  <p className="font-semibold text-xs">
                    {user.firstName + " " + user.lastName}
                  </p>
                }
              />
            </TableCell>
            <TableCell>{user.staffId}</TableCell>
            <TableCell>{user.department?.name}</TableCell>
            <TableCell>{user.phone}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell className="capitalize">{user.role}</TableCell>
            <TableCell className="flex items-center">
              <Button size="sm" color="success" variant="light">
                View
              </Button>
              <Button
                size="sm"
                color="primary"
                variant="light"
                onPress={() => {
                  setSelectedUser(user);
                  editDisclosure.onOpen();
                }}
              >
                Edit
              </Button>
              <Button
                size="sm"
                color="danger"
                variant="light"
                onPress={() => {
                  setDeleteId(user._id as string);
                  deleteDisclosure.onOpen();
                }}
              >
                Delete
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </CustomTable>

      {/* Create Department Modal */}
      <CreateRecordModal
        title="Create User Account"
        isOpen={createRecordDisclosure.isOpen}
        onCloseModal={createRecordDisclosure.onClose}
        onOpenChange={createRecordDisclosure.onOpenChange}
        actionText="Save User"
        size="xl"
        intent="create"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 py-8 pt-4">
          <CustomInput isRequired={true} label="First Name" name="firstName" />
          <CustomInput isRequired={true} label="Last Name" name="lastName" />
          <CustomInput
            isRequired={true}
            label="Staff ID"
            name="staffId"
            isInvalid={
              actionData &&
              actionData?.errors?.find((error) => error.field === "staffId")
                ? true
                : false
            }
            errorMessage={
              actionData &&
              actionData?.errors?.find((error) => error.field === "staffId")
                ?.message
            }
          />
          <CustomInput
            label="Email"
            name="email"
            type="email"
            isInvalid={
              actionData &&
              actionData?.errors?.find((error) => error.field === "email")
                ? true
                : false
            }
            errorMessage={
              actionData &&
              actionData?.errors?.find((error) => error.field === "email")
                ?.message
            }
          />
          <CustomInput
            isRequired={true}
            label="Phone Number"
            name="phone"
            isInvalid={
              actionData &&
              actionData?.errors?.find((error) => error.field === "phone")
                ? true
                : false
            }
            errorMessage={
              actionData &&
              actionData?.errors?.find((error) => error.field === "phone")
                ?.message
            }
          />
          <CustomDatePicker name="dateOfBirth" label="Date of Birth" />
          <CustomSelect
            isRequired={true}
            label="Department"
            name="department"
            options={selectOptions}
          />
          <CustomInput name="position" label="Position" />
          <CustomSelect
            isRequired={true}
            label="Role"
            name="role"
            options={roles}
          />
          <CustomInput
            name="permissions"
            label="Permssion Input"
            value={selectedPermissions}
            hidden={true}
          />
          <CustomSelect
            options={[
              {
                key: "approve_request",
                value: "approve_request",
                display_name: "Approvals",
              },
              {
                key: "request_for_others",
                value: "request_for_others",
                display_name: "Request on behalf",
              },
            ]}
            name="permission-select"
            label="Permissions"
            multiple={true}
            onSelectionChange={(keys) =>
              setSelectedPermissions(getValuesFromSet(keys))
            }
            renderValue={(items) => {
              return (
                <div className="flex gap-2">
                  {items.map((item: any) => (
                    <Chip variant="flat" key={item.key}>
                      {item.textValue}
                    </Chip>
                  ))}
                </div>
              );
            }}
          />
        </div>
      </CreateRecordModal>

      {/* edit user Modal */}
      <EditRecordModal
        title="Edit User Account"
        isModalOpen={editDisclosure.isOpen}
        onCloseModal={editDisclosure.onClose}
        size="xl"
        intent="edit-user"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 py-8 pt-4">
          <CustomInput
            label="User ID"
            name="userId"
            value={selectedUser?._id}
            hidden={true}
          />
          <CustomInput
            isRequired={true}
            label="First Name"
            name="firstName"
            defaultValue={selectedUser?.firstName}
          />
          <CustomInput
            isRequired={true}
            label="Last Name"
            name="lastName"
            defaultValue={selectedUser?.lastName}
          />
          <CustomInput
            isRequired={true}
            label="Staff ID"
            name="staffId"
            defaultValue={selectedUser?.staffId}
            isInvalid={
              actionData &&
              actionData?.errors?.find((error) => error.field === "staffId")
                ? true
                : false
            }
            errorMessage={
              actionData &&
              actionData?.errors?.find((error) => error.field === "staffId")
                ?.message
            }
          />
          <CustomInput
            label="Email"
            name="email"
            type="email"
            defaultValue={selectedUser?.email}
            isInvalid={
              actionData &&
              actionData?.errors?.find((error) => error.field === "email")
                ? true
                : false
            }
            errorMessage={
              actionData &&
              actionData?.errors?.find((error) => error.field === "email")
                ?.message
            }
          />
          <CustomInput
            isRequired={true}
            label="Phone Number"
            name="phone"
            defaultValue={selectedUser?.phone}
            isInvalid={
              actionData &&
              actionData?.errors?.find((error) => error.field === "phone")
                ? true
                : false
            }
            errorMessage={
              actionData &&
              actionData?.errors?.find((error) => error.field === "phone")
                ?.message
            }
          />
          <CustomDatePicker
            name="dateOfBirth"
            label="Date of Birth"
            defaultValue={selectedUser?.dateOfBirth}
          />
          <CustomSelect
            isRequired={true}
            label="Department"
            name="department"
            defaultSelectedKeys={[selectedUser?.department?._id as string]}
            options={selectOptions}
          />
          <CustomInput
            name="position"
            label="Position"
            defaultValue={selectedUser?.position}
          />
          <CustomSelect
            isRequired={true}
            label="Role"
            name="role"
            defaultSelectedKeys={[selectedUser?.role as string]}
            options={roles}
          />
          <CustomInput
            hidden={true}
            name="permissions"
            label="Permissions"
            value={JSON.stringify(selectedUser?.permissions)}
          />
          <CustomSelect
            options={[
              {
                key: "approve_request",
                value: "approve_request",
                display_name: "Approvals",
              },
              {
                key: "request_for_others",
                value: "request_for_others",
                display_name: "Request on behalf",
              },
            ]}
            name="permission-select"
            label="Permissions"
            multiple={true}
            defaultSelectedKeys={selectedUser?.permissions}
            onSelectionChange={(keys) => {
              setSelectedUser((prev: any) => ({
                ...prev,
                permissions: JSON.parse(getValuesFromSet(keys)),
              }));
            }}
            renderValue={(items) => {
              return (
                <div className="flex gap-2">
                  {items.map((item: any) => (
                    <Chip variant="flat" key={item.key}>
                      {item.textValue}
                    </Chip>
                  ))}
                </div>
              );
            }}
          />
        </div>
      </EditRecordModal>

      {/* Delete department */}
      <DeleteRecordModal
        title="Delete User Account"
        isModalOpen={deleteDisclosure.isOpen}
        onCloseModal={deleteDisclosure.onClose}
      >
        <CustomInput
          name="_id"
          label="Delete ID"
          value={deleteId}
          hidden={true}
        />
        <p className="font-nunito text-slate-800 dark:text-white">
          Are you sure to delete this user account?
        </p>
      </DeleteRecordModal>
    </div>
  );
};

export default AdminUserManagement;

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const formValues = Object.fromEntries(formData.entries());

  const userController = new UserController(request);

  if (formValues.intent === "create") {
    const response = await userController.createUser({
      firstName: formValues.firstName as string,
      lastName: formValues.lastName as string,
      email: formValues.email as string,
      department: formValues.department as string,
      phone: formValues.phone as string,
      staffId: formValues.staffId as string,
      role: formValues.role as string,
      dateOfBirth: formValues.dateOfBirth as string,
      permissions: JSON.parse(formValues.permissions as string),
      position: formValues.position as string,
    });

    return response;
  }

  if (formValues.intent === "delete") {
    return await userController.deleteUser({
      userId: formValues._id as string,
    });
  }

  if (formValues.intent === "edit-user") {
    return await userController.updateUserProfile({
      userId: formValues.userId as string,
      firstName: formValues.firstName as string,
      lastName: formValues.lastName as string,
      email: formValues.email as string,
      department: formValues.department as string,
      phone: formValues.phone as string,
      staffId: formValues.staffId as string,
      role: formValues.role as string,
      dateOfBirth: formValues.dateOfBirth as string,
      permissions: JSON.parse(formValues.permissions as string),
      position: formValues.position as string,
    });
  }

  return null;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") as string) || 1;
  const search_term = url.searchParams.get("search_term") as string;

  const userController = new UserController(request);
  const departmentController = new DepartmentController(request);

  const { departments } = await departmentController.getDepartments({
    page: 1,
    search_term: "",
  });

  const { users, totalPages } = await userController.getUsers({
    page,
    search_term,
  });

  return {
    users,
    departments,
    totalPages,
  };
};

export const meta: MetaFunction = () => {
  return [
    { title: "Users | Adamus Med Treatment" },
    {
      name: "description",
      content: ".",
    },
    {
      name: "author",
      content: "KwaminaWhyte",
    },
    {
      name: "author",
      content: "Codekid",
    },
    { name: "og:title", content: "Adamus Med Treatment" },
    {
      name: "og:description",
      content: "",
    },
    {
      name: "og:image",
      content:
        "https://res.cloudinary.com/app-deity/image/upload/v1701282976/qfdbysyu0wqeugtcq9wq.jpg",
    },
    { name: "og:url", content: "https://marry-right.vercel.app" },
    {
      name: "keywords",
      content:
        "legal marriages in Ghana, Pastors to bless marriages, Is he/she married?, marriiage under ordinance, cases related to marriages in Ghana, mohammedans, ordinance, traditional, verify my marriage certificate, churches legally certified to bless marriages",
    },
  ];
};
