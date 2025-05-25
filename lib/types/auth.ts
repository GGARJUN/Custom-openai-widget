export interface LoginFormValueModal {
    email: string;
    password: string;
  }
  
  export interface LoginFormErrorValueModal {
    email?: string;
    password?: string;
  }
  
  export interface DialogProps {
    show: boolean;
    close: () => void;
    title: string;
    heading: string;
    variant: "success" | "error" | "warning" | "info";
  }
  
  export interface RegisterFormValueModal {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
  }
  
  export interface RegisterFormErrorValueModal {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }
  
  export interface ForgotPasswordFormValueModal {
    email: string;
  }
  
  export interface ResetPasswordFormValueModal {
    email: string;
    code: string;
    newPassword: string;
    confirmPassword: string;
  }
  
  export interface AuthResponse {
    isSignedIn: boolean;
    user?: {
      email: string;
      name: string;
    };
    error?: string;
  }