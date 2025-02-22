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
import DutyController from "~/controllers/DutyController";
import UserController from "~/controllers/UserController";
import { deptTableCols, dutyTableCols } from "~/data/table-cols";
import { getInitials } from "~/utils/string-manipulation";
import { errorToast, successToast } from "~/utils/toasters";
import { CompanyInterface, DepartmentInterface, DutyInterface, UserInterface } from "~/utils/types";

const AdminDepartments = () => {
  const [isCreateModalOpened, setIsCreateModalOpened] = useState(false);
  const [isConfirmedModalOpened, setIsConfirmedModalOpened] = useState(false);
  const [isEditModalOpened, setIsEditModalOpened] = useState(false);
  const submit = useSubmit();
  const navigation = useNavigation();
  const navigate = useNavigate();
  const handleCreateModalClosed = () => {
    setIsCreateModalOpened(false);
  };
  const handleConfirmModalClosed = () => {
    setIsConfirmedModalOpened(false);
  };
  const handleEditModalClosed = () => {
    setIsEditModalOpened(false);
  };

  // loader data
  const { duties, totalPages, users } = useLoaderData<{
    duties: DutyInterface[];
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
  const [selectedDepartment, setSelectedDepartment] = useState<any>();
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
    duties?.map((department: DutyController) => {
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
            Create Duty
          </Button>
        </div>
      </div>

      <CustomTable
        columns={dutyTableCols}
        loadingState={navigation.state === "loading" ? "loading" : "idle"}
        page={1}
        setPage={(page) => {
          navigate(`?page=${page}`);
        }}
        totalPages={totalPages}
      >
        {duties?.map((duty: DutyInterface) => (
          <TableRow key={duty?._id}>
            <TableCell className="text-sm">{duty?.inCharge?.firstName + "" + duty?.inCharge?.lastName}</TableCell>
            <TableCell className="text-sm">{duty?.officer?.firstName + "" + duty?.officer?.lastName}</TableCell>
            <TableCell className="text-sm">{duty?.dutyType}</TableCell>
            <TableCell className="text-sm">{duty?.dutyLocation}</TableCell>
            <TableCell className="text-sm">{duty?.startTime}</TableCell>
            <TableCell className="text-sm">{duty?.endTime}</TableCell>
            <TableCell className="text-sm">{duty?.status}</TableCell>
            <TableCell>{duty?.notes}</TableCell>
            <TableCell className="flex items-center">
              <Button
                size="sm"
                color="primary"
                variant="light"
                onClick={() => {
                  setIsEditModalOpened(true)
                  setSelectedDepartment(duty)
                }}
              >
                edit
              </Button>
              <Button
                size="sm"
                color="danger"
                variant="light"
                onClick={() => {
                  setIsConfirmedModalOpened(true)
                  setSelectedDepartment(duty)
                }}
              >
                Delete
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </CustomTable>

      {/* Create Department Modal */}
      {/* export interface CompanyInterface {
       name:string
       logo: string
       commandingOfficer: UserInterface,
       companySeargent:UserInterface,
       platoonCommander: UserInterface,
       administrationWarranty: UserInterface,
       descriptio:string
      createdAt?: Date;
      updatedAt?: Date;
    } */}
      <CreateRecordModal
        isOpen={isCreateModalOpened}
        onOpenChange={handleCreateModalClosed}
        modalTitle=" Create Duty"
        className="dark:bg-slate-900"
      >
        {(onClose) => (
          <Form method="post" className="flex flex-col gap-4">
            <Select
              label="InCharge"
              labelPlacement="outside"
              placeholder=" "
              variant="bordered"
              isRequired
              isInvalid={
                actionData?.errors?.find(
                  (error) => error.field === "inCharge"
                )
                  ? true
                  : false
              }
              className="mt-4"
              name="inCharge"
              classNames={{
                label:
                  "text-sm md:text-base font-medium font-sen text-slate-800 dark:text-slate-100",
                trigger: " !shadow-none dark:border-slate-700  ",
                popoverContent:
                  "bg-white shadow-sm dark:bg-slate-900 border border-white/5  ",
              }}
            >
              {users.map((user: UserInterface) => (
                <SelectItem
                  textValue={user?.firstName + " " + user?.lastName}
                  className="mt-4"
                  key={user._id}
                >
                  {user?.firstName + " " + user?.lastName}
                </SelectItem>
              ))}
            </Select>

            <div className="flex gap-4">
              <Select
                label="Officer"
                labelPlacement="outside"
                placeholder=" "
                variant="bordered"
                isRequired
                isInvalid={
                  actionData?.errors?.find(
                    (error) => error.field === "officer"
                  )
                    ? true
                    : false
                }
                className="mt-4"
                name="officer"
                classNames={{
                  label:
                    "text-sm md:text-base font-medium font-sen text-slate-800 dark:text-slate-100",
                  trigger: " !shadow-none dark:border-slate-700  ",
                  popoverContent:
                    "bg-white shadow-sm dark:bg-slate-900 border border-white/5  ",
                }}
              >
                {users.map((user: UserInterface) => (
                  <SelectItem
                    textValue={user?.firstName + " " + user?.lastName}
                    className="mt-4"
                    key={user._id}
                  >
                    {user?.firstName + " " + user?.lastName}
                  </SelectItem>
                ))}
              </Select>

              <Select
                label="Duty Type"
                labelPlacement="outside"
                placeholder=" "
                isRequired
                variant="bordered"
                isInvalid={
                  actionData?.errors?.find((error) => error.field === "dutyType")
                    ? true
                    : false
                }
                className="mt-4"
                name="dutyType"
                classNames={{
                  label:
                    "text-sm md:text-base font-medium font-sen text-slate-800 dark:text-slate-100",
                  trigger: " !shadow-none dark:border-slate-700  ",
                  popoverContent:
                    "bg-white shadow-sm dark:bg-slate-900 border border-white/5  ",
                }}
              >
                {[
                  { key: "patrol", value: "patrol", display_name: "patrol" },
                  { key: "traffic", value: "traffic", display_name: "traffic" },
                  { key: "investigation", value: "investigation", display_name: "investigation" },
                  { key: "community service", value: "community service", display_name: "community service" },
                  { key: "administrative", value: "administrative", display_name: "administrative" },
                ].map((role) => (
                  <SelectItem key={role.key}>{role.display_name}</SelectItem>
                ))}
              </Select>
            </div>

            <CustomInput
              isRequired={true}
              label="Duty Location"
              name="dutyLocation"
              isInvalid={
                actionData?.errors?.find((error) => error.field === "dutyLocation")
                  ? true
                  : false
              }
            />
            <div className="flex gap-4">
              <CustomInput
                isRequired={true}
                label="Start Time"
                name="startTime"
                type="time"
                isInvalid={
                  actionData?.errors?.find((error) => error.field === "startTime")
                    ? true
                    : false
                }
              />
              <CustomInput
                isRequired={true}
                label="End Time"
                name="endTime"
                type="time"
                isInvalid={
                  actionData?.errors?.find((error) => error.field === "endTime")
                    ? true
                    : false
                }
              />
            </div>
            <Select
              label="Status"
              labelPlacement="outside"
              placeholder=" "
              isRequired
              variant="bordered"
              isInvalid={
                actionData?.errors?.find((error) => error.field === "status")
                  ? true
                  : false
              }
              className="mt-4"
              name="status"
              classNames={{
                label:
                  "text-sm md:text-base font-medium font-sen text-slate-800 dark:text-slate-100",
                trigger: " !shadow-none dark:border-slate-700  ",
                popoverContent:
                  "bg-white shadow-sm dark:bg-slate-900 border border-white/5  ",
              }}
            >
              {[
                { key: "scheduled", value: "scheduled", display_name: "scheduled" },
                { key: "sngoing", value: "sngoing", display_name: "sngoing" },
                { key: "sompleted", value: "sompleted", display_name: "sompleted" },
                { key: "sancelled", value: "sancelled", display_name: "sancelled" },
              ].map((role) => (
                <SelectItem key={role.key}>{role.display_name}</SelectItem>
              ))}
            </Select>

            <CustomTextarea
              isRequired={true}
              label="Note"
              name="notes"
            />

            <input name="intent" value="create" type="hidden" />

            <div className="flex justify-end gap-2 mt-10 font-nunito">
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
        modalTitle=" Edit Duty"
        className="dark:bg-slate-900"
      >
        {(onClose) => (
          <Form method="post" className="flex flex-col gap-4">
            <Select
              label="InCharge"
              labelPlacement="outside"
              placeholder=" "
              variant="bordered"
              defaultValue={selectedDepartment?.inCharge}
              isRequired
              isInvalid={
                actionData?.errors?.find(
                  (error) => error.field === "inCharge"
                )
                  ? true
                  : false
              }
              className="mt-4"
              name="inCharge"
              classNames={{
                label:
                  "text-sm md:text-base font-medium font-sen text-slate-800 dark:text-slate-100",
                trigger: " !shadow-none dark:border-slate-700  ",
                popoverContent:
                  "bg-white shadow-sm dark:bg-slate-900 border border-white/5  ",
              }}
            >
              {users.map((user: UserInterface) => (
                <SelectItem
                  textValue={user?.firstName + " " + user?.lastName}
                  className="mt-4"
                  key={user._id}
                >
                  {user?.firstName + " " + user?.lastName}
                </SelectItem>
              ))}
            </Select>

            <div className="flex gap-4">
              <Select
                label="Officer"
                labelPlacement="outside"
                placeholder=" "
                variant="bordered"
                defaultValue={selectedDepartment?.officer}
                isRequired
                isInvalid={
                  actionData?.errors?.find(
                    (error) => error.field === "officer"
                  )
                    ? true
                    : false
                }
                className="mt-4"
                name="officer"
                classNames={{
                  label:
                    "text-sm md:text-base font-medium font-sen text-slate-800 dark:text-slate-100",
                  trigger: " !shadow-none dark:border-slate-700  ",
                  popoverContent:
                    "bg-white shadow-sm dark:bg-slate-900 border border-white/5  ",
                }}
              >
                {users.map((user: UserInterface) => (
                  <SelectItem
                    textValue={user?.firstName + " " + user?.lastName}
                    className="mt-4"
                    key={user._id}
                  >
                    {user?.firstName + " " + user?.lastName}
                  </SelectItem>
                ))}
              </Select>

              <Select
                label="Duty Type"
                labelPlacement="outside"
                defaultValue={selectedDepartment?.dutyType}
                placeholder=" "
                isRequired
                variant="bordered"
                isInvalid={
                  actionData?.errors?.find((error) => error.field === "dutyType")
                    ? true
                    : false
                }
                className="mt-4"
                name="dutyType"
                classNames={{
                  label:
                    "text-sm md:text-base font-medium font-sen text-slate-800 dark:text-slate-100",
                  trigger: " !shadow-none dark:border-slate-700  ",
                  popoverContent:
                    "bg-white shadow-sm dark:bg-slate-900 border border-white/5  ",
                }}
              >
                {[
                  { key: "patrol", value: "patrol", display_name: "patrol" },
                  { key: "traffic", value: "traffic", display_name: "traffic" },
                  { key: "investigation", value: "investigation", display_name: "investigation" },
                  { key: "community service", value: "community service", display_name: "community service" },
                  { key: "administrative", value: "administrative", display_name: "administrative" },
                ].map((role) => (
                  <SelectItem key={role.key}>{role.display_name}</SelectItem>
                ))}
              </Select>
            </div>

            <CustomInput
              isRequired={true}
              label="Duty Location"
              name="dutyLocation"
              defaultValue={selectedDepartment?.dutyLocation}
              isInvalid={
                actionData?.errors?.find((error) => error.field === "dutyLocation")
                  ? true
                  : false
              }
            />
            <div className="flex gap-4">
              <CustomInput
                isRequired={true}
                defaultValue={selectedDepartment?.startTime}
                label="Start Time"
                name="startTime"
                type="time"
                isInvalid={
                  actionData?.errors?.find((error) => error.field === "startTime")
                    ? true
                    : false
                }
              />
              <CustomInput
                isRequired={true}
                defaultValue={selectedDepartment?.endTime}
                label="End Time"
                name="endTime"
                type="time"
                isInvalid={
                  actionData?.errors?.find((error) => error.field === "endTime")
                    ? true
                    : false
                }
              />
            </div>
            <Select
              label="Status"
              labelPlacement="outside"
              placeholder=" "
              isRequired
              variant="bordered"
              defaultValue={selectedDepartment?.status}
              isInvalid={
                actionData?.errors?.find((error) => error.field === "status")
                  ? true
                  : false
              }
              className="mt-4"
              name="status"
              classNames={{
                label:
                  "text-sm md:text-base font-medium font-sen text-slate-800 dark:text-slate-100",
                trigger: " !shadow-none dark:border-slate-700  ",
                popoverContent:
                  "bg-white shadow-sm dark:bg-slate-900 border border-white/5  ",
              }}
            >
              {[
                { key: "scheduled", value: "scheduled", display_name: "scheduled" },
                { key: "sngoing", value: "sngoing", display_name: "sngoing" },
                { key: "sompleted", value: "sompleted", display_name: "sompleted" },
                { key: "sancelled", value: "sancelled", display_name: "sancelled" },
              ].map((role) => (
                <SelectItem key={role.key}>{role.display_name}</SelectItem>
              ))}
            </Select>

            <CustomTextarea
              isRequired={true}
              label="Note"
              name="notes"
              defaultValue={selectedDepartment?.notes}
            />

            <input name="intent" value="update" type="hidden" />
            <input name="id" value={selectedDepartment._id} type="hidden" />

            <div className="flex justify-end gap-2 mt-10 font-nunito">
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
        className="bg-gray-200 dark:bg-slate-900 border border-white/5"
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
              if (selectedDepartment) {
                submit(
                  {
                    intent: "delete",
                    id: selectedDepartment?._id,
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
  const officer = formData.get("officer") as string
  const inCharge = formData.get("inCharge") as string
  const dutyType = formData.get("dutyType") as string
  const dutyLocation = formData.get("dutyLocation") as string
  const startTime = formData.get("startTime") as string
  const endTime = formData.get("endTime") as string
  const status = formData.get("status") as string
  const notes = formData.get("notes") as string
  const intent = formData.get("intent") as string
  const _id = formData.get("id") as string
 


  const dutyController = new DutyController(request);
  switch (intent) {
    case "create":
      const createDuty = await dutyController.createDuty({
        inCharge,
        officer,
        dutyType,
        dutyLocation,
        startTime,
        endTime,
        status,
        notes,
      })
      return createDuty

    case "delete":
      const deleteDuty = await dutyController.deleteDuty({ _id })
      return deleteDuty

    case "update":
      const updateDuty = await dutyController.updateDuty({
        _id,
        inCharge,
        officer,
        dutyType,
        dutyLocation,
        startTime,
        endTime,
        status,
        notes,
      })
      return updateDuty
    default:
      break;
  }

  return null;
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") as string) || 1;
  const search_term = url.searchParams.get("search_term") as string;
  const dutyController = new DutyController(request);
  const usersController = new UserController(request)

  const { users } = await usersController.getUsers({
    page,
    search_term
  })
  const { duties } = await dutyController.getDuties({
    page,
    search_term,
  })



  return { users, duties }
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
