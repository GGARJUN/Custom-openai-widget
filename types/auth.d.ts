interface LoginFormValueModal {
  email: string;
  password: string;
}

interface LoginFormErrorValueModal {
  email?: string;
  password?: string;
}

interface DialogProps {
  show: boolean;
  close: () => void;
  title: string;
  heading: string;
  variant: "success" | "error";
}

// Only include types needed elsewhere (e.g., for registration or reset)
interface FormValueModal {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

interface FormErrorValueModal {
  firstname?: string;
  lastname?: string;
  email?: string;
  password?: string;
}

interface RegisterRequestPayload {
  emailId: string;
  username: string;
  password: string;
  userAttributes?: {
    email: string;
    name: string;
  };
}

interface ResetFormFieldsModal {
  email: string;
  code: string;
  password: string;
  confirmPassword: string;
}

export {
  LoginFormValueModal,
  LoginFormErrorValueModal,
  DialogProps,
  FormValueModal,
  FormErrorValueModal,
  RegisterRequestPayload,
  ResetFormFieldsModal,
};