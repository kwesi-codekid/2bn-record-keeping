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
import GroupController from "~/controllers/GroupController";
import UserController from "~/controllers/UserController";
import { deptTableCols, groupTableCols } from "~/data/table-cols";
import { getInitials } from "~/utils/string-manipulation";
import { errorToast, successToast } from "~/utils/toasters";
import {
    CompanyInterface,
    DepartmentInterface,
    GroupInterface,
    UserInterface,
} from "~/utils/types";

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
    const { groups, totalPages, usersNotOnMissions, group } = useLoaderData<{
        groups: GroupInterface[];
        totalPages: number;
        usersNotOnMissions: UserInterface[];
        group: UserInterface[]
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
    groups?.map((group: GroupInterface) => {
        selectOptions.push({
            key: group._id as string,
            value: group._id as string,
            display_name: group.name as string,
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
                        Create Department
                    </Button>
                </div>
            </div>

            <CustomTable
                columns={groupTableCols}
                loadingState={navigation.state === "loading" ? "loading" : "idle"}
                page={1}
                setPage={(page) => {
                    navigate(`?page=${page}`);
                }}
                totalPages={totalPages}
            >
                {groups?.map((group: GroupInterface) => (
                    <TableRow key={group._id}>
                        <TableCell className="text-sm">{group?.name}</TableCell>
                        <TableCell className="text-sm">{group?.inCharge.firstName + " " + group?.inCharge.lastName}</TableCell>
                        <TableCell className="text-sm">{group?.description}</TableCell>
                        <TableCell className="flex items-center">
                            <Button
                                size="sm"
                                color="primary"
                                variant="light"
                                onClick={() => {
                                    setIsEditModalOpened(true)
                                    setSelectedDepartment(group)
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
                                    setSelectedDepartment(group)
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
                modalTitle=" Create Department"
                className=""
            >
                {(onClose) => (
                    <Form method="post" className="flex flex-col gap-4">
                        <CustomInput
                            isRequired={true}
                            label="Group Name"
                            name="name"
                            isInvalid={
                                actionData?.errors?.find((error) => error.field === "name")
                                    ? true
                                    : false
                            }
                        />
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
                            {usersNotOnMissions.map((user: UserInterface) => (
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
                            label="Member"
                            labelPlacement="outside"
                            placeholder=" "
                            variant="bordered"
                            selectionMode="multiple"
                            isRequired
                            isInvalid={
                                actionData?.errors?.find(
                                    (error) => error.field === "members"
                                )
                                    ? true
                                    : false
                            }
                            className="mt-4"
                            name="members"
                            classNames={{
                                label:
                                    "text-sm md:text-base font-medium font-sen text-slate-800 dark:text-slate-100",
                                trigger: " !shadow-none dark:border-slate-700  ",
                                popoverContent:
                                    "bg-white shadow-sm dark:bg-slate-900 border border-white/5  ",
                            }}
                        >
                            {usersNotOnMissions.map((user: UserInterface) => (
                                <SelectItem
                                    textValue={user?.firstName + " " + user?.lastName}
                                    className="mt-4"
                                    key={user._id}
                                >
                                    {user?.firstName + " " + user?.lastName}
                                </SelectItem>
                            ))}
                        </Select>
                        <CustomTextarea
                            isRequired={true}
                            label="Description"
                            name="description"
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
                modalTitle=" Edit Department"
                className=""
            >
                {(onClose) => (
                    <Form method="post" className="flex flex-col gap-4">
                        <CustomInput
                            isRequired={true}
                            label="Group Name"
                            name="name"
                            defaultValue={selectedDepartment.name}
                            isInvalid={
                                actionData?.errors?.find((error) => error.field === "name")
                                    ? true
                                    : false
                            }
                        />
                        <CustomInput
                            isRequired={true}
                            label="InCharge"
                            name="inCharge"
                            defaultValue={selectedDepartment.inCharge.firstName}
                            isInvalid={
                                actionData?.errors?.find((error) => error.field === "inCharge")
                                    ? true
                                    : false
                            }
                        />

                        <Select
                            label="Members"
                            labelPlacement="outside"
                            placeholder=" "
                            variant="bordered"
                            defaultValue={selectedDepartment.members}
                            selectionMode="multiple"
                            isRequired
                            isInvalid={
                                actionData?.errors?.find(
                                    (error) => error.field === "members"
                                )
                                    ? true
                                    : false
                            }
                            className="mt-4"
                            name="members"
                            classNames={{
                                label:
                                    "text-sm md:text-base font-medium font-sen text-slate-800 dark:text-slate-100",
                                trigger: " !shadow-none dark:border-slate-700  ",
                                popoverContent:
                                    "bg-white shadow-sm dark:bg-slate-900 border border-white/5  ",
                            }}
                        >
                            {selectedDepartment.members?.map((user: UserInterface) => (
                                <SelectItem
                                    textValue={user?.firstName}
                                    className="mt-4"
                                    key={user._id}
                                >
                                    {user?.firstName}
                                </SelectItem>
                            ))}
                        </Select>
                        <CustomTextarea
                            isRequired={true}
                            label="Description"
                            name="description"
                            defaultValue={selectedDepartment.description}
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
            <div className="flex justify-end gap-2 mt-10 font-nunito">
                <Button color="danger" onPress={handleEditModalClosed}>
                    Close
                </Button>
                <button className="bg-primary-400 rounded-xl text-white font-nunito px-4">
                    Submit
                </button>
            </div>


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
        </div >
    );
};

export default AdminDepartments;

export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const inCharge = formData.get("inCharge") as string;
    const members = formData.get("members") as string;
    const intent = formData.get("intent") as string;
    const _id = formData.get("id") as string;

    const groupController = new GroupController(request);
    switch (intent) {
        case "create":
            const createDepartment = await groupController.createGroup({
                name,
                description,
                inCharge,
                members,
            });
            return createDepartment;

        case "delete":
            const deleteDepartment = await groupController.deleteGroup({ _id });
            return deleteDepartment;

        case "update":
            const updateDepartment = await groupController.updateGroup({
                _id,
                name,
                description,
                inCharge,
                members,
            })
            return updateDepartment
        default:
            break;
    }

};

export const loader: LoaderFunction = async ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") as string) || 1;
    const search_term = url.searchParams.get("search_term") as string;
    const groupController = new GroupController(request);
    const usersController = new UserController(request);

    const { usersNotOnMissions } = await usersController.getMembersNotOnMission()
    const { groups } = await groupController.getGroups({
        page,
        search_term,
    })
    const { group } = await groupController.getGroup({
        page,
        search_term,
    })


    return { usersNotOnMissions, groups, group }
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
