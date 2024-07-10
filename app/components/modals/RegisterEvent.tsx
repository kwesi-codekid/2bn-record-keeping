import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import { Form, useNavigation } from "@remix-run/react";
import axios from "axios";
import { useSWRConfig } from "swr";
import { useEffect, useState } from "react";
import { errorToast, successToast } from "~/utils/toasters";
import { EventRegistrationInterface } from "~/utils/types";

const RegisterEventModal = ({
  isOpen,
  onOpenChange,
  onCloseModal,
  title,
  actionText,
  children,
  size,
  token,
  record,
  fetcherUrl,
}: {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onCloseModal: () => void;
  title: string;
  actionText: string;
  children?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  token: string;
  record: EventRegistrationInterface;
  fetcherUrl?: string;
}) => {
  // state to handle loading
  const { mutate } = useSWRConfig();
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);

  // function to handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setIsLoading(true);

      const registeredStatusResponse = await axios.get(
        `https://psgh.org/api/v1/members/event/${record.event_id}/check-if-registered?reg_no=${record.reg_no}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (
        registeredStatusResponse.data.message === "Event already registered"
      ) {
        errorToast(
          "Notification",
          "You have already registered for this event"
        );
        setIsLoading(false);
        onCloseModal();
        mutate(fetcherUrl);
        return;
      }

      await axios.post(
        `https://psgh.org/api/v1/members/event/${record.event_id}/register`,
        record,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      successToast("Success", "Registered successfully");
    } catch (error) {
      console.error(error);
      errorToast(
        "Error!",
        "An error occurred. Please check your network connectivity and try again."
      );
    } finally {
      setIsLoading(false);
      onCloseModal();
      if (fetcherUrl) {
        mutate(fetcherUrl);
      }
    }
  };

  useEffect(() => {
    if (navigation.state === "idle") {
      onCloseModal();
    }
  }, [navigation, onCloseModal]);

  return (
    <Modal
      size={size}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onClose={onCloseModal}
      backdrop="opaque"
      classNames={{
        base: "rounded-3xl dark:bg-slate-900 border-[1px] dark:border-slate-700/20",
      }}
      motionProps={{
        variants: {
          enter: {
            scale: [1, 0.9],
            opacity: 1,
            transition: {
              duration: 0.3,
              ease: "easeOut",
            },
          },
          exit: {
            scale: [0.9, 1],
            opacity: 0,
            transition: {
              duration: 0.2,
              ease: "easeIn",
            },
          },
        },
      }}
    >
      <ModalContent>
        {(onCloseModal) => (
          <>
            <ModalHeader className="flex flex-col gap-1 font-montserrat font-semibold text-lg text-slate-800 dark:text-white">
              {title}
            </ModalHeader>
            <ModalBody>
              <Form
                method={"POST"}
                id="create-record-form"
                onSubmit={handleSubmit}
              >
                {children}
              </Form>
            </ModalBody>
            <ModalFooter>
              <Button
                color="danger"
                variant="light"
                onPress={onCloseModal}
                className="font-montserrat font-semibold"
              >
                Cancel
              </Button>
              <Button
                color="primary"
                isLoading={isLoading}
                type="submit"
                form="create-record-form"
                className="font-montserrat font-medium"
              >
                {actionText}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default RegisterEventModal;
