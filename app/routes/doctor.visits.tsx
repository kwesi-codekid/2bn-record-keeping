import {
  Autocomplete,
  AutocompleteItem,
  Avatar,
  Button,
  Input,
  TableCell,
  TableRow,
  User,
  select,
  useDisclosure,
} from "@nextui-org/react";
import { ActionFunction, LoaderFunction, MetaFunction } from "@remix-run/node";
import {
  Outlet,
  useActionData,
  useLoaderData,
  useLocation,
  useNavigate,
  useNavigation,
  useOutletContext,
} from "@remix-run/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { EditIcon } from "~/components/icons/Edit";
import { PlusIcon } from "~/components/icons/Plus";
import { SearchIcon } from "~/components/icons/Search";
import ConfirmModal from "~/components/modals/ConfirmModal";
import CreateRecordModal from "~/components/modals/CreateRecord";
import DeleteRecordModal from "~/components/modals/DeleteRecord";
import CustomInput from "~/components/ui/inputs/input";
import CustomSelect from "~/components/ui/inputs/select";
import CustomTextarea from "~/components/ui/inputs/textarea";
import CustomTable from "~/components/ui/new-table";
import DepartmentController from "~/controllers/DepartmentController";
import MedicalRequestController from "~/controllers/MedicalRequestController";
import UserController from "~/controllers/UserController";
import { deptTableCols, userTableCols } from "~/data/table-cols";
import { getInitials } from "~/utils/string-manipulation";
import { errorToast, successToast } from "~/utils/toasters";
import { DepartmentInterface, UserInterface } from "~/utils/types";

const AdminDepartments = () => {
  const navigation = useNavigation();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useOutletContext<{
    user: UserInterface;
  }>();

  // loader data
  const { totalPages, departments } = useLoaderData<{
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
      personalRequestDisclosure.onClose();
      onBehalfRequestDisclosure.onClose();
      successToast("Success!", actionData.message);
      navigate(location.pathname, { replace: true });
    }
  }, [actionData]);

  // requests disclosures
  const personalRequestDisclosure = useDisclosure();
  const onBehalfRequestDisclosure = useDisclosure();

  // delete department modal
  const deleteDisclosure = useDisclosure();
  const [deleteId, setDeleteId] = useState<string>("");
  useEffect(() => {
    if (!deleteDisclosure.isOpen) setDeleteId("");
  }, [deleteDisclosure.onOpenChange]);

  // select staff data
  const [listIsLoading, setListIsLoading] = useState<boolean>(false);
  const [usersSearchText, setUsersSearchText] = useState<string>("");
  const [usersList, setUsersList] = useState<UserInterface[]>();
  const [selectedUser, setSelectedUser] = useState<any>("");
  const fetchStaff = async (search_term: string) => {
    try {
      setListIsLoading(true);
      const response = await axios.get(
        `/api/users?search_term=${search_term}&department=${user.department}`
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
      <Outlet context={{ user }} />
      {/* personal request modal */}
      <CreateRecordModal
        title="New Personal Medical Request"
        isOpen={personalRequestDisclosure.isOpen}
        onCloseModal={personalRequestDisclosure.onClose}
        onOpenChange={personalRequestDisclosure.onOpenChange}
        actionText="Submit Request"
        intent="personal-request"
      >
        <div className="grid grid-cols-1 gap-5 py-8 pt-4">
          <CustomTextarea
            isRequired={true}
            label="Initial Complaints"
            name="initalComplaint"
          />
        </div>
      </CreateRecordModal>

      {/* on behalf request modal */}
      <CreateRecordModal
        title="New Medical Request for Others"
        isOpen={onBehalfRequestDisclosure.isOpen}
        onCloseModal={onBehalfRequestDisclosure.onClose}
        onOpenChange={onBehalfRequestDisclosure.onOpenChange}
        actionText="Submit Request"
        intent="request-for-others"
      >
        <div className="grid grid-cols-1 gap-5 py-8 pt-4">
          <CustomInput
            name="requestedFor"
            hidden={true}
            value={selectedUser}
            label="Requested For"
          />
          <Autocomplete
            name="combobox"
            className="font-nunito"
            variant="bordered"
            isLoading={listIsLoading}
            label="Request For"
            placeholder="Search for staff"
            labelPlacement="outside"
            // scrollRef={scrollerRef}
            onValueChange={setUsersSearchText}
            onSelectionChange={(value) => setSelectedUser(value)}
            items={usersList ? usersList : []}
          >
            {(item: UserInterface) => (
              <AutocompleteItem
                key={item._id}
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
          <CustomTextarea
            isRequired={true}
            label="Initial Complaints"
            name="initalComplaint"
          />
        </div>
      </CreateRecordModal>

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

export default AdminDepartments;

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const formValues = Object.fromEntries(formData.entries());

  const medRequestController = new MedicalRequestController(request);

  if (formValues.intent === "personal-request") {
    const response = await medRequestController.createMedicalRequest({
      initialComplaint: formValues.initalComplaint as string,
      shift: formValues.shift as string,
    });

    return response;
  }

  if (formValues.intent === "request-for-others") {
    const response = await medRequestController.createMedicalRequest({
      initialComplaint: formValues.initalComplaint as string,
      requestedFor: formValues.requestedFor as string,
      shift: formValues.shift as string,
    });

    return response;
  }

  return null;
};

export const loader: LoaderFunction = async ({ request }) => {
  const departmentController = new DepartmentController(request);

  const { departments } = await departmentController.getDepartments({
    page: 1,
    search_term: "",
  });

  return {
    departments,
  };
};

export const meta: MetaFunction = () => {
  return [
    { title: "Clinical Visits | Adamus Med Treatment" },
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
