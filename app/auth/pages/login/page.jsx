"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "primereact/button";
import { BlockUI } from "primereact/blockui";
import { ProgressSpinner } from "primereact/progressspinner";
import { Toast } from "primereact/toast";
import { toast } from "sonner";
import { authServices } from "@/lib/services/auth";
import { Dialog } from "@/components/ui/dialog";

export default function Login() {
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });
  const [loader, setLoader] = useState(false);
  const [errFields, setErrFields] = useState({});
  const toastRef = useRef(null);
  const router = useRouter();
  const [showDialog, setShowDialog] = useState({
    close: () => { },
    heading: "",
    show: false,
    title: "",
    variant: "success",
  });

  useEffect(() => {
    authServices
      .getAuthenticatUser()
      // .then(() => router.push("/"))
      .catch(() => console.log("No authenticated user"));
  }, [router]);

  const validateForm = (form) => {
    const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordReg = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[#?!@$%^&*-]).{8,}$/;

    const errors = {};

    if (!form.email.trim()) {
      errors.email = "Email is required";
    } else if (!emailReg.test(form.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!form.password.trim()) {
      errors.password = "Password is required";
    } else if (!passwordReg.test(form.password)) {
      errors.password =
        "Password must be at least 8 characters long, including one uppercase letter, one lowercase letter, one number, and one special character";
    }

    setErrFields(errors);
    return Object.keys(errors).length;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
    validateForm({ ...formValues, [name]: value });
  };

  const handleLogin = async () => {
    if (validateForm(formValues) > 0) {
      toast.error("Please fix the form errors");
      return;
    }

    setLoader(true);
    try {
      const res = await authServices.login(formValues);
      const session = await authServices.getAuthenticatUser();
      console.log("session", session);
      console.log("res", res);

      if (res.isSignedIn) {
        const session = await authServices.getAuthenticatUser();
        console.log("User Session:", session);

        // Extract tokens
        const accessToken = session.tokens?.accessToken?.toString();
        const idToken = session.tokens?.idToken?.toString();
        // const refreshToken = session.tokens?.refreshToken?.toString();

        // Store idToken only if it exists
        if (idToken) {
          localStorage.setItem("idToken", idToken);
          console.log("ID Token:", idToken);
        } else {
          console.warn("ID Token is undefined");
        }

        console.log("Access Token:", accessToken);
        // console.log("Refresh Token:", refreshToken);

        toast.success("You have been logged in successfully");
        console.log("You have been logged in successfully");
        router.push("/");
      } else {
        setShowDialog({
          show: true,
          title: "Please activate your account to login",
          heading: "Account Activation Required",
          variant: "error",
          close: closeDialog,
        });
      }
    } catch (error) {
      let title = "Unable to login. Please try again later.";
      if (error.name === "UserAlreadyAuthenticatedException") {
        router.push("/");
        return;
      } else if (error.name === "NotAuthorizedException") {
        title = "Incorrect email or password";
      } else if (error.name === "UserNotFoundException") {
        title = "User does not exist";
      }

      setShowDialog({
        show: true,
        title,
        heading: "Login Error",
        variant: "error",
        close: closeDialog,
      });
      toast.error(title);
    } finally {
      setLoader(false);
    }
  };



  const closeDialog = () => {
    setShowDialog((prev) => ({ ...prev, show: false }));
  };

  return (
    <BlockUI
      blocked={loader}
      template={
        <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-40">
          <ProgressSpinner style={{ width: "50px", height: "50px" }} strokeWidth="8" animationDuration=".5s" />
        </div>
      }
    >
      <div className="bg-[#f5f2f2] flex justify-center pt-14 h-screen bg-[url('/gradient.png')] text-[#1b0b3b] bg-bottom bg-no-repeat bg-[length:100%_300px]">
        <div className="w-full md:w-2/5 px-4 md:px-20">
          <div className="flex flex-col justify-center items-center gap-3">
            <h2 className="font-bold text-2xl mb-4">Log in to your account</h2>
          </div>
          <div className="flex flex-col gap-4 max-w-[413px] mx-auto">
            <div className="relative">
              <p className="relative bg-[#f5f2f2] w-fit mx-auto px-2 text-gray-600 text-xs">
                or
              </p>
              <span className="absolute left-0 top-[70%] w-full h-[1px] bg-[#eae6e7]"></span>
            </div>
            <div className="text-left">
              <label htmlFor="email" className="text-sm font-medium mb-1 block">
                Email
              </label>
              <input
                id="email"
                style={{ padding: "10px", width: "100%", borderRadius: "10px" }}
                placeholder="e.g. eleanor@mixpixel.com"
                value={formValues.email}
                name="email"
                onChange={handleChange}
                className={`w-full border border-[#eae6e7] rounded-[10px] min-h-[52px] px-6 py-3.5 text-base outline-none transition-all duration-300 hover:border-[#7856ff] ${errFields.email ? "border-red-500 border-2" : ""}`}
              />
              {errFields.email && <small className="text-red-600 font-bold text-sm">{errFields.email}</small>}
            </div>
            <div className="text-left">
              <label htmlFor="password" className="text-sm font-medium mb-1 block">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={formValues.password}
                name="password"
                onChange={handleChange}
                placeholder="Example@123"
                className={`w-full border border-[#eae6e7] rounded-lg min-h-[52px] px-6 py-3.5 text-base outline-none transition-all duration-300 hover:border-[#7856ff] ${errFields.password ? "border-red-500 border-2" : ""}`}
              />
              {errFields.password && <small className="text-red-600 font-bold text-sm">{errFields.password}</small>}
            </div>
            <Button
              onClick={handleLogin}
              label="Log In"
              className="text-white mt-2 text-lg bg-[#7856ff] bg-gradient-to-t from-[#7856ff] to-[#9075ff] shadow-[inset_0_-1px_0_#5028c0,inset_0_1px_0_rgba(255,255,255,0.2)] font-medium h-[43px] rounded-[96px] transition-all duration-300 hover:rounded-md border-none outline-none"
              loading={loader}
            />
            <p className="text-sm font-normal leading-relaxed text-[#1b0b3b] text-center mt-2">
              Don't have an account?{" "}
              <Link href="/auth/pages/register" className="text-[#5028c0] no-underline hover:underline transition-all duration-300">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
      <Dialog show={showDialog.show} close={closeDialog} title={showDialog.title} heading={showDialog.heading} variant={showDialog.variant} />
      <Toast ref={toastRef} />
    </BlockUI>
  );
}