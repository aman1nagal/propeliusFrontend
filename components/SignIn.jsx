import React from "react";
import { Formik, Form, Field } from "formik";
import { TextField, Button, Snackbar } from "@mui/material";
import * as Yup from "yup";
import Image from "next/image";
import { useLoginMutation } from "../redux/slices/rtkSlices/authSlice";
import { useDispatch } from "react-redux";
import { loginSlice } from "../redux/slices/stateSlices/authSlice";
import Link from "next/link";
import { useRouter } from "next/router";
import Loader from "../components/Loader";
import LoginSvg from "../components/LoginSvg";

const validationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters long")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(
      /[^a-zA-Z0-9]/,
      "Password must contain at least one special character"
    ),
});

const CustomTextField = ({ field, form: { touched, errors }, ...props }) => (
  <TextField
    {...field}
    {...props}
    error={touched[field.name] && Boolean(errors[field.name])}
    helperText={touched[field.name] && errors[field.name]}
    fullWidth
    margin="normal"
    variant="outlined"
  />
);

const SignIn = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [login, { isLoading, error }] = useLoginMutation();
  const [open, setOpen] = React.useState(false);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const result = await login({
        email: values.email,
        password: values.password,
      }).unwrap();

      localStorage.setItem(
        "user",
        JSON.stringify({ ...result.userDetails, token: result.accessToken })
      );
      dispatch(
        loginSlice({ token: result.accessToken, user: result.userDetails })
      );
      router.push("/");
    } catch (error) {
      setOpen(true);
      console.error("Login failed:", error?.data?.message);
    }
  };
  return (
    <div className="bg-blue-50 min-h-screen w-full md:px-8 h-full flex items-center justify-evenly">
      {/* <div className="w-full lg:w-1/2 hidden md:block justify-center  lg:mb-0">
        <LoginSvg />
      </div> */}
      {/* <div className="flex flex-col lg:flex-row items-end justify-end  h-full"> */}
      {/* <div className="absolute z-10 inset-0 flex items-center justify-center p-4 md:p-0"> */}
      <div className="absolute z-10 inset-0 flex items-center justify-center p-4 md:p-0">
        <div className="max-w-md w-full p-6 md:p-8 rounded-3xl shadow-wrapShadow bg-white">
          <div className="flex">
            <div className="w-8/12 md:w-3/4">
              <h2 className="text-base md:text-[20px] text-black mt-1">
                Welcome to Spotify
              </h2>
              <h1 className="text-[40px] md:text-[55px] font-medium text-black">
                Sign in
              </h1>
            </div>
            <div className="w-1/3 md:w-1/4">
              <span className="text-sm text-[#8D8D8D] hover:text-gray-800">
                No Account?{" "}
              </span>
              <h1
                onClick={() => router.push("/signup")}
                className="text-blue-600 text-sm cursor-pointer"
              >
                Sign up
              </h1>
            </div>
          </div>
          <Formik
            initialValues={{
              email: "",
              password: "",
              rememberMe: false,
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({
              values,
              isSubmitting,
              errors,
              touched,
              handleChange,
              handleBlur,
            }) => (
              <Form className="w-full">
                <div className="mb-2 md:mb-4">
                  <Field
                    name="email"
                    label="Email"
                    type="email"
                    component={CustomTextField}
                  />
                </div>
                <div className="mb-2 md:mb-4">
                  <Field
                    name="password"
                    label="Password"
                    type="password"
                    component={CustomTextField}
                  />
                </div>
                <Button
                  loading={isLoading}
                  type="submit"
                  className="w-full text-white font-bold py-4 px-5 rounded-md"
                  disabled={isSubmitting}
                  sx={{
                    backgroundColor: "#6358DC",
                    color: "white",
                    fontWeight: "bold",
                    width: "100%",
                    paddingY: 2,
                    paddingX: 3,
                  }}
                >
                  {isLoading ? <Loader /> : "Login"}
                </Button>
                <p className="mt-4 text-center text-gray-500">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/signup"
                    className="text-blue-500 hover:underline"
                  >
                    Register
                  </Link>
                </p>
              </Form>
            )}
          </Formik>
        </div>
      </div>

      {/* </div> */}
      {/* </div> */}
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={open}
        onClose={() => setOpen(false)}
        message={error?.data?.message}
        autoHideDuration={3000} // Automatically close after 3 seconds
      />
    </div>
  );
};

export default SignIn;
