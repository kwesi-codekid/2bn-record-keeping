import {
  Autocomplete,
  AutocompleteItem,
  Avatar,
  Button,
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
import axios from "axios";
import { useEffect, useState } from "react";
import { PlusIcon } from "~/components/icons/plus";
import { SearchIcon } from "~/components/icons/Search";
import CreateRecordModal from "~/components/modals/CreateRecord";
import DeleteRecordModal from "~/components/modals/DeleteRecord";
import EditRecordModal from "~/components/modals/EditRecord";
import CustomInput from "~/components/ui/inputs/input";
import CustomSelect from "~/components/ui/inputs/select";
import CustomTextarea from "~/components/ui/inputs/textarea";
import CustomTable from "~/components/ui/new-table";
import DepartmentController from "~/controllers/DepartmentController";
import { deptTableCols } from "~/data/table-cols";
import { getInitials } from "~/utils/string-manipulation";
import { errorToast, successToast } from "~/utils/toasters";
import { DepartmentInterface, UserInterface } from "~/utils/types";

const AdminDepartments = () => {
  const navigation = useNavigation();
  const navigate = useNavigate();

  // loader data
  const { departments, totalPages } = useLoaderData<{
    departments: any;
    totalPages: number;
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

  // edit department modal
  const editDisclosure = useDisclosure();
  const [selectedDepartment, setSelectedDepartment] =
    useState<DepartmentInterface | null>(null);
  useEffect(() => {
    if (!editDisclosure.isOpen) setSelectedDepartment(null);
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
            onPress={() => createRecordDisclosure.onOpen()}
          >
            Create Department
          </Button>
        </div>
      </div>

      <CustomTable
        columns={deptTableCols}
        loadingState={navigation.state === "loading" ? "loading" : "idle"}
        page={1}
        setPage={(page) => {
          navigate(`?page=${page}`);
        }}
        totalPages={totalPages}
      >
        {departments?.map((department: DepartmentInterface) => (
          <TableRow key={department._id}>
            <TableCell className="text-sm">{department.name}</TableCell>
            <TableCell>
              {department.manager
                ? department.manager?.firstName +
                  " " +
                  department?.manager?.lastName
                : "N/A"}
            </TableCell>
            <TableCell>{department.description}</TableCell>
            <TableCell className="flex items-center">
              <Button size="sm" color="success" variant="light">
                View
              </Button>
              <Button
                size="sm"
                color="primary"
                variant="light"
                onPress={() => {
                  setSelectedDepartment(department);
                  editDisclosure.onOpen();
                }}
              >
                edit
              </Button>
              <Button
                size="sm"
                color="danger"
                variant="light"
                onPress={() => {
                  setDeleteId(department._id as string);
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
        title="Create Department"
        isOpen={createRecordDisclosure.isOpen}
        onCloseModal={createRecordDisclosure.onClose}
        onOpenChange={createRecordDisclosure.onOpenChange}
        actionText="Save Department"
        size="md"
        intent="create"
      >
        <div className="flex flex-col gap-5">
          <CustomInput
            isRequired={true}
            label="Department Name"
            name="name"
            isInvalid={
              actionData?.errors?.find((error) => error.field === "name")
                ? true
                : false
            }
          />
          <CustomTextarea
            isRequired={true}
            label="Description"
            name="description"
          />
          <CustomSelect
            label="Parent Department"
            name="parent"
            options={selectOptions}
          />
        </div>
      </CreateRecordModal>

      {/* edit Department Modal */}
      <EditRecordModal
        title="edit Department"
        isModalOpen={editDisclosure.isOpen}
        onCloseModal={editDisclosure.onClose}
        size="md"
        intent="edit-department"
      >
        <div className="flex flex-col gap-5">
          <CustomInput
            name="_id"
            label="Department ID"
            value={selectedDepartment?._id}
            hidden={true}
          />
          <CustomInput
            isRequired={true}
            label="Department Name"
            name="name"
            defaultValue={selectedDepartment?.name}
            isInvalid={
              actionData?.errors?.find((error) => error.field === "name")
                ? true
                : false
            }
          />
          <CustomTextarea
            isRequired={true}
            label="Description"
            name="description"
            defaultValue={selectedDepartment?.description}
          />
          <CustomSelect
            label="Parent Department"
            name="parent"
            options={selectOptions}
            defaultSelectedKeys={[selectedDepartment?.parent as string]}
          />
          <CustomInput
            name="manager"
            label="Manager"
            value={selectedManager}
            hidden={true}
          />
          <Autocomplete
            name="manager-combobox"
            className="font-nunito"
            inputProps={{
              classNames: {
                label:
                  "text-sm md:text-base font-medium font-sen text-slate-800 dark:text-slate-100",
              },
            }}
            variant="bordered"
            isLoading={listIsLoading}
            label="Assigned Manager"
            placeholder=" "
            labelPlacement="outside"
            onValueChange={setUsersSearchText}
            onSelectionChange={(value) => setSelectedManager(value)}
            items={usersList}
          >
            {(item: UserInterface) => (
              <AutocompleteItem
                key={item._id as string}
                textValue={`${item.firstName} ${item.lastName}`}
              >
                <div className="flex gap-2 items-center">
                  <Avatar
                    alt={`${item.firstName} ${item.lastName}`}
                    className="flex-shrink-0 font-nunito"
                    size="sm"
                    // src={`${item.photo}`}
                    fallback={getInitials(`${item.firstName} ${item.lastName}`)}
                  />
                  <div className="flex flex-col">
                    <span className="text-small font-nunito">
                      {`${item.firstName} ${item.lastName}`}
                    </span>
                    <span className="text-tiny text-default-400 font-nunito">
                      {`${item.email}`}
                    </span>
                  </div>
                </div>
              </AutocompleteItem>
            )}
          </Autocomplete>
        </div>
      </EditRecordModal>

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
  const formData = await request.formData();
  const formValues = Object.fromEntries(formData.entries());

  const departmentController = new DepartmentController(request);

  if (formValues.intent === "create") {
    return await departmentController.createDepartment({
      name: formValues.name as string,
      parent: formValues.parent as string,
      description: formValues.description as string,
    });
  }

  if (formValues.intent === "edit-department") {
    return await departmentController.updateDepartment({
      _id: formValues._id as string,
      name: formValues.name as string,
      parent: formValues.parent as string,
      description: formValues.description as string,
      manager: formValues.manager as string,
      supervisors: [],
    });
  }

  if (formValues.intent === "delete") {
    return await departmentController.deleteDepartment({
      _id: formValues._id as string,
    });
  }

  return null;
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") as string) || 1;
  const search_term = url.searchParams.get("search_term") as string;

  const departmentController = new DepartmentController(request);

  return await departmentController.getDepartments({
    page,
    search_term,
  });
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
