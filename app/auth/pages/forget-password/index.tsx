import { Link, useNavigate } from "react-router-dom";
import bg from "../../../../assets/images/bg.jpeg";
import styles from "./index.module.css";
import { useState } from "react";
import { authServices } from "../../services";
import { ResetFormFieldsModal } from "@type/auth";
import clsx from "clsx";
import { Button } from "primereact/button";
import SWDialog from "../../../../components/common/Dialog";
import { DialogProps } from "@type/components";
import { ProgressSpinner } from "primereact/progressspinner";
import { BlockUI } from "primereact/blockui";
import { Password } from "primereact/password";

export default function ForgetPassword() {
    const [activeIndex, setActiveIndex] = useState<number>(1);
    const navigate = useNavigate();
    const [loader, setLoader] = useState(false)
    const [showDialog, setShowDialog] = useState<DialogProps>({
        close: Function,
        heading: "",
        show: false,
        title: "",
        varient: "success",
    });
    const [fieldsValue, setFieldsValue] = useState<ResetFormFieldsModal>({
        email: "",
        code: "",
        password: "",
        confirmPassword: "",
    });
    const [errorFields, setErrorFields] = useState({
        email: "",
        code: "",
        password: "",
        confirmPassword: "",
    });
    const changeHandler = (e: React.FormEvent<HTMLInputElement>) => {
        let { value, name } = e.currentTarget;
        let _copyFieldsValue = { ...fieldsValue };
        _copyFieldsValue[name as keyof ResetFormFieldsModal] = value;
        setFieldsValue(_copyFieldsValue);
        errorValidation(_copyFieldsValue);
    };
    const errorValidation = (form: ResetFormFieldsModal) => {
        let emailReg = new RegExp(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
        let passwordReg = new RegExp(
            "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"
        );
        let codeReg = new RegExp("^[0-9]*$");
        let _copyErrObj = { ...errorFields };
        Object.keys(form).forEach((ele: string) => {
            let elemValue = form[ele as keyof ResetFormFieldsModal];
            if (ele === "email") {
                emailReg.test(elemValue)
                    ? (_copyErrObj.email = "")
                    : (_copyErrObj.email = "Please enter a valid email id");
            }
            if (activeIndex !== 1) {
                if (ele === "code") {
                    codeReg.test(elemValue) && elemValue.length === 6
                        ? (_copyErrObj.code = "")
                        : (_copyErrObj.code = "Please enter valid code");
                }
                if (ele === "password") {
                    passwordReg.test(elemValue)
                        ? (_copyErrObj.password = "")
                        : (_copyErrObj.password =
                            "Password must be 8-16 characters long and include at least one uppercase letter, one special character, and one number");
                }
                if (ele === "confirmPassword") {
                    elemValue === form.password
                        ? (_copyErrObj.confirmPassword = "")
                        : (_copyErrObj.confirmPassword = "Password Mismatch");
                }
            }
        });
        setErrorFields(_copyErrObj);
        return Object.values(_copyErrObj).filter((ele) => Boolean(ele)).length;
    };
    const triggerVerificationCode = () => {
        let errorFeldsLength = errorValidation(fieldsValue);
        if (errorFeldsLength === 0 && activeIndex === 1) {
            setLoader(true);
            authServices
                .forgotPasswordGetCode({ emailId: fieldsValue.email })
                .then(() => {
                    setActiveIndex(2);
                })
                .catch(() => {
                    setShowDialog((prev) => ({
                        ...prev,
                        show: true,
                        title: "Unable to send verification code, Please try again after sometime",
                        varient: "error"
                    }))
                })
                .finally(() => {
                    setLoader(false)
                })
        } else if (errorFeldsLength === 0) {
            setLoader(true);
            authServices
                .resetPassword({
                    emailId: fieldsValue.email,
                    newPassword: fieldsValue.confirmPassword,
                    confirmationCode: fieldsValue.code,
                })
                .then(() => {
                    setShowDialog((prev) => ({
                        ...prev,
                        show: true,
                        title: "Password resetted successfully, Click ok to login",
                        varient: "success"
                    }))
                })
                .catch((err) => {
                    let message = "Unable to reset password, Please try again after sometime"
                    if(err.response.data && err.response.data._embedded.errors[0].message && err.response.data._embedded.errors[0].message.indexOf('verification code')!==-1){
                        message = "Invalid verification code, Please check."
                    }
                    setShowDialog((prev) => ({
                        ...prev,
                        show: true,
                        title: message,
                        varient: "error"
                    }))
                })
                .finally(() => setLoader(false))
        }
    };
    const closeHanlder = () => {
        let _copyPrev = { ...showDialog };
        _copyPrev.show = false;
        setShowDialog(_copyPrev);
        if (_copyPrev.varient === 'success') navigate('/login')
    }
    return (
        <BlockUI
            blocked={loader}
            fullScreen
            template={
                <ProgressSpinner
                    style={{ width: "50px", height: "50px" }}
                    strokeWidth="8"
                    fill="var(--surface-ground)"
                    animationDuration=".5s"
                />
            }
        >
            <section>
                <SWDialog
                    show={showDialog.show}
                    close={closeHanlder}
                    title={showDialog.title}
                    heading={showDialog.heading}
                    varient={showDialog.varient}
                />
                <div className={styles.mainsection}>
                    <div className={styles.innersection}>
                        <img src={bg} alt="logo img" />
                        <div className={styles.title}>
                            <h2 className="sw-heading-1">Forgot Password?</h2>
                            <p className="sw-description-1">Enter email to reset password.</p>
                        </div>
                        <div className={`${styles.content} sw-form`}>
                            <div className={styles.email}>
                                <h2 className="sw-description-2">Email</h2>
                                <input
                                    name="email"
                                    placeholder="eleanor@mixpixel.com"
                                    value={fieldsValue.email}
                                    onChange={changeHandler}
                                    className={clsx(errorFields.email && "border-red-500 border-2")}
                                ></input>
                                {errorFields.email && (
                                    <small className="text-red-600 font-bold">
                                        {errorFields.email}
                                    </small>
                                )}
                            </div>
                            {activeIndex === 2 && (
                                <>
                                    <div className={styles.email}>
                                        <h2 className="sw-description-2">Verification Code</h2>
                                        <input
                                            name="code"
                                             placeholder="123456"
                                            value={fieldsValue.code}
                                            onChange={changeHandler}
                                            className={clsx(errorFields.code && "border-red-500 border-2")}
                                        ></input>
                                        {errorFields.code && (
                                            <small className="text-red-600 font-bold">
                                                {errorFields.code}
                                            </small>
                                        )}
                                    </div>
                                    <div className={styles.email}>
                                        <h2 className="sw-description-2">Password</h2>
                                        {/* <input
                                            name="password"
                                            value={fieldsValue.password}
                                            onChange={changeHandler}
                                            className={clsx(errorFields.password && "border-red-500 border-2")}
                                        ></input> */}
                                        <Password
                                            value={fieldsValue.password}
                                            name="password"
                                            onChange={changeHandler}
                                            toggleMask
                                            placeholder="Example@123"
                                            className={clsx("input-full-width", {
                                                ["invalid-form-element"]: errorFields.password,
                                            })}
                                            strongRegex="^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"
                                        />
                                        {errorFields.password && (
                                            <small className="text-red-600 font-bold">
                                                {errorFields.password}
                                            </small>
                                        )}
                                    </div>
                                    <div className={styles.email}>
                                        <h2 className="sw-description-2">Confirm Password</h2>
                                        {/* <input
                                            name="confirmPassword"
                                            value={fieldsValue.confirmPassword}
                                            onChange={changeHandler}
                                            className={clsx(errorFields.confirmPassword && "border-red-500 border-2")}
                                        ></input> */}
                                        <Password
                                            value={fieldsValue.confirmPassword}
                                            name="confirmPassword"
                                            onChange={changeHandler}
                                            toggleMask
                                            placeholder="Example@123"
                                            className={clsx("input-full-width", {
                                                ["invalid-form-element"]: errorFields.password,
                                            })}
                                            strongRegex="^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"
                                        />
                                        {errorFields.confirmPassword && (
                                            <small className="text-red-600 font-bold">
                                                {errorFields.confirmPassword}
                                            </small>
                                        )}
                                    </div>
                                </>
                            )}
                            {/* <button
                            className={styles.sendbtn}
                            onClick={triggerVerificationCode}
                        >
                            {activeIndex === 1 ? "Get Verification Code" : "Submit"}
                        </button> */}
                            <Button onClick={triggerVerificationCode} label={activeIndex === 1 ? "Get Verification Code" : "Submit"} />
                            {/* <Link to={'/reset'} className={styles.sendbtn}></Link> */}
                            <Link to={"/login"}>Back to Log In</Link>
                        </div>
                    </div>
                </div>
            </section>
        </BlockUI>
    );
}
