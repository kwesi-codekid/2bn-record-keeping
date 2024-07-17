import {
  Autocomplete,
  AutocompleteItem,
  Avatar,
  Button,
  Input,
  Select,
  SelectItem,
  TableCell,
  TableRow,
  User,
  useDisclosure,
} from "@nextui-org/react";
import { ActionFunction, LoaderFunction, MetaFunction } from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigate,
  useNavigation,
  useSubmit,
} from "@remix-run/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { EyeSlashFilledIcon } from "~/components/icons/EyeFilled";
import { EyeFilledIcon } from "~/components/icons/EyeSlash";
import { PlusIcon } from "~/components/icons/Plus";
import { SearchIcon } from "~/components/icons/Search";
import ConfirmModal from "~/components/modals/ConfirmModal";
import CreateRecordModal from "~/components/modals/CreateRecord";
import DeleteRecordModal from "~/components/modals/DeleteRecord";
import EditModal from "~/components/modals/EditRecord";
import EditRecordModal from "~/components/modals/EditRecord";
import CustomInput from "~/components/ui/inputs/input";
import CustomSelect from "~/components/ui/inputs/select";
import CustomTextarea from "~/components/ui/inputs/textarea";
import CustomTable from "~/components/ui/new-table";
import CompanyController from "~/controllers/CompanyController";
import DepartmentController from "~/controllers/DepartmentController";
import UserController from "~/controllers/UserController";
import { deptTableCols, userTableCols } from "~/data/table-cols";
import { getInitials } from "~/utils/string-manipulation";
import { errorToast, successToast } from "~/utils/toasters";
import { CompanyInterface, UserInterface } from "~/utils/types";

const AdminDepartments = () => {
  const [isCreateModalOpened, setIsCreateModalOpened] = useState(false);
  const [isConfirmedModalOpened, setIsConfirmedModalOpened] = useState(false);
  const [isEditModalOpened, setIsEditModalOpened] = useState(false);
  const submit = useSubmit();
  const navigation = useNavigation();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  const handleCreateModalClosed = () => {
    setIsCreateModalOpened(false);
  };
  const handleConfirmModalClosed = () => {
    setIsConfirmedModalOpened(false);
  };
  const handleEditModalClosed = () => {
    setIsEditModalOpened(false);
  };
  const handleVisibility = (event: any) => {
    event.preventDefault();
    setIsVisible(!isVisible);
  };

  // loader data
  const { companys, totalPages, users } = useLoaderData<{
    companys: CompanyInterface[];
    totalPages: number;
    users: UserInterface[];
  }>();

  // action data
  const actionData = useActionData<{
    status: string;
    message: string;
    errors: [{ field: string; message: string }];
  }>();

  // create department modal
  const createRecordDisclosure = useDisclosure();

  // edit department modal
  const editDisclosure = useDisclosure();
  const [selectedUser, setselectedUser] = useState<any>();
  useEffect(() => {
    if (!editDisclosure.isOpen) setselectedUser(null);
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
  companys?.map((department: CompanyInterface) => {
    selectOptions.push({
      key: department._id as string,
      value: department._id as string,
      display_name: department.name as string,
    });
  });

  // select staff data
  const [listIsLoading, setListIsLoading] = useState<boolean>(false);
  const [usersSearchText, setUsersSearchText] = useState<string>("");
  const [usersList, setUsersList] = useState<UserInterface[]>();
  const [selectedManager, setSelectedManager] = useState<any>("");
  const fetchStaff = async (search_term: string) => {
    try {
      setListIsLoading(true);
      const response = await axios.get(
        `/api/users?search_term=${search_term}&role=manager`
      );

      const users = response.data.users;
      setUsersList(users);
    } catch (error) {
      console.log(error);
      errorToast("Error!", "An error occurred. Please try again.");
    } finally {
      setListIsLoading(false);
    }
  };
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchStaff(usersSearchText);
    }, 1000);

    // Cleanup function to clear the timeout when the component unmounts
    return () => clearTimeout(timeoutId);
  }, [usersSearchText]);

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
            onClick={() => {
              setIsCreateModalOpened(true);
            }}
          >
            Create User
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
              {user?.firstName + " " + user?.lastName}
            </TableCell>
            <TableCell className="text-sm">{user?.badgeNumber}</TableCell>
            <TableCell className="text-sm">{user?.email}</TableCell>
            <TableCell className="text-sm">{user?.phone}</TableCell>
            <TableCell className="text-sm">{user?.dateOfBirth}</TableCell>
            <TableCell className="text-sm">{user?.department?.name}</TableCell>
            <TableCell className="text-sm">{user?.role}</TableCell>
            <TableCell className="text-sm">{user?.position}</TableCell>
            <TableCell className="text-sm">{user?.company?.name}</TableCell>
            <TableCell className="flex items-center">
              <Button
                size="sm"
                color="primary"
                variant="light"
                onClick={() => {
                  setIsEditModalOpened(true);
                  setselectedUser(user);
                }}
              >
                edit
              </Button>
              <Button
                size="sm"
                color="danger"
                variant="light"
                onClick={() => {
                  setIsConfirmedModalOpened(true);
                  setselectedUser(user);
                }}
              >
                Delete
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </CustomTable>

     
      <CreateRecordModal
        isOpen={isCreateModalOpened}
        onOpenChange={handleCreateModalClosed}
        modalTitle=" Create User"
        className="dar"
      >
        {(onClose) => (
          <Form method="post" className="flex flex-col gap-4">
            <CustomInput
              isRequired={true}
              label="Badge Number"
              name="badgeNumber"
              isInvalid={
                actionData?.errors?.find((error) => error.field === "badgeNumber")
                  ? true
                  : false
              }
            />
            <div className="flex gap-4">
              <CustomInput
                isRequired={true}
                label="First Name"
                name="firstName"
                isInvalid={
                  actionData?.errors?.find(
                    (error) => error.field === "firstName"
                  )
                    ? true
                    : false
                }
              />
              <CustomInput
                isRequired={true}
                label="Last Name"
                name="lastName"
                isInvalid={
                  actionData?.errors?.find(
                    (error) => error.field === "lastName"
                  )
                    ? true
                    : false
                }
              />
            </div>

            <CustomInput
              isRequired={true}
              label="Email"
              name="email"
              isInvalid={
                actionData?.errors?.find((error) => error.field === "email")
                  ? true
                  : false
              }
            />

            <div className="flex gap-4">
              <CustomInput
                isRequired={true}
                label="Phone"
                name="phone"
                isInvalid={
                  actionData?.errors?.find((error) => error.field === "phone")
                    ? true
                    : false
                }
              />
              <CustomInput
                type="date"
                isRequired={true}
                label="Date of Birth"
                name="dateOfBirth"
                isInvalid={
                  actionData?.errors?.find(
                    (error) => error.field === "dateOfBirth"
                  )
                    ? true
                    : false
                }
              />
            </div>

            <CustomInput
              isRequired={true}
              label="Password"
              type={isVisible ? "text" : "password"}
              name="password"
              isInvalid={
                actionData?.errors?.find((error) => error.field === "password")
                  ? true
                  : false
              }
              endContent={
                <button
                  className="focus:outline-none"
                  onClick={handleVisibility}
                >
                  {isVisible ? (
                    <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                  ) : (
                    <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                  )}
                </button>
              }
            />

            <div className="flex gap-4">
              <CustomInput
                type="text"
                isRequired={true}
                label="Position"
                name="position"
                isInvalid={
                  actionData?.errors?.find(
                    (error) => error.field === "position"
                  )
                    ? true
                    : false
                }
              />

              <Select
                label="Role"
                labelPlacement="outside"
                placeholder=" "
                isRequired
                variant="bordered"
                isInvalid={
                  actionData?.errors?.find((error) => error.field === "role")
                    ? true
                    : false
                }
                className="mt-4"
                name="role"
                classNames={{
                  label:
                    "text-sm md:text-base font-medium font-sen text-slate-800 dark:text-slate-100",
                  trigger: " !shadow-none dark:border-slate-700  ",
                  popoverContent:
                    "bg-white shadow-sm dark:bg-slate-900 border border-white/5  ",
                }}
              >
                {[
                  { key: "admin", value: "admin", display_name: "admin" },
                  { key: "staff", value: "staff", display_name: "staff" },
                ].map((role) => (
                  <SelectItem key={role.key}>{role.display_name}</SelectItem>
                ))}
              </Select>
            </div>

            <div className="flex gap-4">
              <Select
                label="Department"
                labelPlacement="outside"
                placeholder=" "
                variant="bordered"
                isRequired
                isInvalid={
                  actionData?.errors?.find(
                    (error) => error.field === "department"
                  )
                    ? true
                    : false
                }
                className="mt-4"
                name="department"
                classNames={{
                  label:
                    "text-sm md:text-base font-medium font-sen text-slate-800 dark:text-slate-100",
                  trigger: " !shadow-none dark:border-slate-700  ",
                  popoverContent:
                    "bg-white shadow-sm dark:bg-slate-900 border border-white/5  ",
                }}
              >
                {companys.map((company: CompanyInterface) => (
                  <SelectItem
                    textValue={company?.name}
                    className="mt-4"
                    key={company?._id}
                  >
                    {company?.name}
                  </SelectItem>
                ))}
              </Select>
              <Select
                label="Company"
                labelPlacement="outside"
                placeholder=" "
                variant="bordered"
                isRequired
                isInvalid={
                  actionData?.errors?.find((error) => error.field === "company")
                    ? true
                    : false
                }
                className="mt-4"
                name="company"
                classNames={{
                  label:
                    "text-sm md:text-base font-medium font-sen text-slate-800 dark:text-slate-100",
                  trigger: " !shadow-none dark:border-slate-700  ",
                  popoverContent:
                    "bg-white shadow-sm dark:bg-slate-900 border border-white/5  ",
                }}
              >
                {companys.map((company: CompanyInterface) => (
                  <SelectItem
                    textValue={company?.name}
                    className="mt-4"
                    key={company?._id}
                  >
                    {company?.name}
                  </SelectItem>
                ))}
              </Select>
            </div>

            <input name="intent" value="create" type="hidden" />
            <div className="flex justify-end gap-2 mt-6 font-nunito">
              <Button color="danger" onPress={onClose}>
                Close
              </Button>
              <button className="bg-primary-400 rounded-xl text-white font-nunito px-4">
                Submit
              </button>
            </div>
          </Form>
        )}
      </CreateRecordModal>

      <EditModal
        isOpen={isEditModalOpened}
        onOpenChange={handleEditModalClosed}
        modalTitle=" Edit Department"
        className=""
      >
        {(onClose) => (
          <Form method="post" className="flex flex-col gap-4">
            <CustomInput
              isRequired={true}
              label="Staff Id"
              name="badgeNumber"
              defaultValue={selectedUser?.badgeNumber}
              isInvalid={
                actionData?.errors?.find((error) => error.field === "badgeNumber")
                  ? true
                  : false
              }
            />
            <div className="flex gap-4">
              <CustomInput
                isRequired={true}
                label="First Name"
                name="firstName"
                defaultValue={selectedUser?.firstName}
                isInvalid={
                  actionData?.errors?.find(
                    (error) => error.field === "firstName"
                  )
                    ? true
                    : false
                }
              />
              <CustomInput
                isRequired={true}
                label="Last Name"
                name="lastName"
                defaultValue={selectedUser?.lastName}
                isInvalid={
                  actionData?.errors?.find(
                    (error) => error.field === "lastName"
                  )
                    ? true
                    : false
                }
              />
            </div>

            <CustomInput
              isRequired={true}
              label="Email"
              name="email"
              defaultValue={selectedUser?.email}
              isInvalid={
                actionData?.errors?.find((error) => error.field === "email")
                  ? true
                  : false
              }
            />

            <div className="flex gap-4">
              <CustomInput
                isRequired={true}
                label="Phone"
                name="phone"
                defaultValue={selectedUser?.phone}
                isInvalid={
                  actionData?.errors?.find((error) => error.field === "phone")
                    ? true
                    : false
                }
              />
              <CustomInput
                type="date"
                isRequired={true}
                label="Date of Birth"
                name="dateOfBirth"
                defaultValue={selectedUser?.dateOfBirth}
                isInvalid={
                  actionData?.errors?.find(
                    (error) => error.field === "dateOfBirth"
                  )
                    ? true
                    : false
                }
              />
            </div>
                 <CustomInput
                type="password"
                isRequired={true}
                label="Password"
                name="password"
                defaultValue={selectedUser?.password}
                isInvalid={
                  actionData?.errors?.find(
                    (error) => error.field === "dateOfBirth"
                  )
                    ? true
                    : false
                }
              />
            <div className="flex gap-4">
              <CustomInput
                type="text"
                isRequired={true}
                label="Position"
                name="position"
                defaultValue={selectedUser?.position}
                isInvalid={
                  actionData?.errors?.find(
                    (error) => error.field === "position"
                  )
                    ? true
                    : false
                }
              />

              <Select
                label="Role"
                labelPlacement="outside"
                placeholder=" "
                isRequired
                variant="bordered"
                isInvalid={
                  actionData?.errors?.find((error) => error.field === "role")
                    ? true
                    : false
                }
                className="mt-4"
                name="role"
                classNames={{
                  label:
                    "text-sm md:text-base font-medium font-sen text-slate-800 dark:text-slate-100",
                  trigger: " !shadow-none dark:border-slate-700  ",
                  popoverContent:
                    "bg-white shadow-sm dark:bg-slate-900 border border-white/5  ",
                }}
              >
                {[
                  { key: "admin", value: "admin", display_name: "admin" },
                  { key: "staff", value: "staff", display_name: "staff" },
                ].map((role) => (
                  <SelectItem key={role.key}>{role.display_name}</SelectItem>
                ))}
              </Select>
            </div>

            <div className="flex gap-4">
              <Select
                label="Department"
                labelPlacement="outside"
                placeholder=" "
                variant="bordered"
                isRequired
                isInvalid={
                  actionData?.errors?.find(
                    (error) => error.field === "department"
                  )
                    ? true
                    : false
                }
                className="mt-4"
                name="department"
                classNames={{
                  label:
                    "text-sm md:text-base font-medium font-sen text-slate-800 dark:text-slate-100",
                  trigger: " !shadow-none dark:border-slate-700  ",
                  popoverContent:
                    "bg-white shadow-sm dark:bg-slate-900 border border-white/5  ",
                }}
              >
                {companys.map((company: CompanyInterface) => (
                  <SelectItem
                    textValue={company?.name}
                    className="mt-4"
                    key={company?._id}
                  >
                    {company?.name}
                  </SelectItem>
                ))}
              </Select>
              <Select
                label="Company"
                labelPlacement="outside"
                placeholder=" "
                variant="bordered"
                isRequired
                isInvalid={
                  actionData?.errors?.find((error) => error.field === "company")
                    ? true
                    : false
                }
                className="mt-4"
                name="company"
                classNames={{
                  label:
                    "text-sm md:text-base font-medium font-sen text-slate-800 dark:text-slate-100",
                  trigger: " !shadow-none dark:border-slate-700  ",
                  popoverContent:
                    "bg-white shadow-sm dark:bg-slate-900 border border-white/5  ",
                }}
              >
                {companys.map((company: CompanyInterface) => (
                  <SelectItem
                    textValue={company?.name}
                    className="mt-4"
                    key={company?._id}
                  >
                    {company?.name}
                  </SelectItem>
                ))}
              </Select>
            </div>

            <input name="intent" value="update" type="hidden" />
            <input name="id" value={selectedUser._id} type="hidden" />

            <div className="flex justify-end gap-2 mt-6 font-nunito">
              <Button color="danger" onPress={onClose}>
                Close
              </Button>
              <button className="bg-primary-400 rounded-xl text-white font-nunito px-4">
                Submit
              </button>
            </div>
          </Form>
        )}
      </EditModal>

      <ConfirmModal
        className="bg-gray-200 dark:bg-slate-950 border border-white/5"
        content="Are you sure to delete product"
        header="Comfirm Delete"
        isOpen={isConfirmedModalOpened}
        onOpenChange={handleConfirmModalClosed}
      >
        <div className="flex gap-4">
          <Button
            size="sm"
            color="danger"
            className="font-nunito "
            onPress={handleConfirmModalClosed}
          >
            No
          </Button>
          <Button
            size="sm"
            color="primary"
            className="font-nunito"
            onClick={() => {
              if (selectedUser) {
                submit(
                  {
                    intent: "delete",
                    id: selectedUser?._id,
                  },
                  {
                    method: "post",
                  }
                );
              }
            }}
          >
            Yes
          </Button>
        </div>
      </ConfirmModal>

      {/* Delete department */}
      <DeleteRecordModal
        title="Delete Department"
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
          Are you sure to delete this department?
        </p>
      </DeleteRecordModal>
    </div>
  );
};

export default AdminDepartments;

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()
  const firstName = formData.get("firstName") as string
  const lastName = formData.get("lastName") as string
  const badgeNumber = formData.get("badgeNumber") as string
  const email = formData.get("email") as string
  const phone = formData.get("phone") as string
  const dateOfBirth = formData.get("dateOfBirth") as string
  const password = formData.get("password") as string
  const role = formData.get("role") as string
  const position = formData.get("position") as string
  const department = formData.get("department") as string
  const company = formData.get("company") as string
  const intent = formData.get("intent") as string
  const id = formData.get("id") as string
  console.log(id);
  


  const userController = new UserController(request);
  switch (intent) {
    case "create":
      const createUser = await userController.createUser({
        firstName,
        lastName,
        email,
        role,
        department,
        phone,
        badgeNumber,
        dateOfBirth,
        position,
        company,
        password,
      });
      return createUser;

    case "delete":
      const deleteUser = await userController.deleteUser({ userId: id });
      return deleteUser;

    case "update":
      const updateUser = await userController.updateUserProfile({
        userId:id,
        firstName,
        lastName,
        email,
        role,
        department,
        phone,
        badgeNumber,
        dateOfBirth,
        position,
        company,
        password,
      });
      return updateUser;

    default:
      break;
  }

};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") as string) || 1;
  const search_term = url.searchParams.get("search_term") as string;
  const usersController = new UserController(request);
  const companyController = new CompanyController(request);

  const { users } = await usersController.getUsers({
    page,
    search_term,
  });
  const { companys } = await companyController.getCompanys({
    page,
    search_term,
  });

  return { users, companys };
};

export const meta: MetaFunction = () => {
  return [
    { title: "Departments | Adamus Med Treatment" },
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
