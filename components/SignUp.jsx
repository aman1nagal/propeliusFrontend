import React from "react";
import { Formik, Form, Field } from "formik";
import {
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Alert,
} from "@mui/material";
import * as Yup from "yup";
import Image from "next/image";
import { useRegisterMutation } from "../redux/slices/rtkSlices/authSlice";
import Link from "next/link";
import { Router, useRouter } from "next/router";
import Loader from "../components/Loader";
import { RegistraionSVG } from "../components/RegistraionSVG";

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters long"),
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
  const [register, { isLoading, error }] = useRegisterMutation();

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const result = await register({
        name: values.name,
        email: values.email,
        password: values.password,
      }).unwrap();
      router.push("/signin");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="bg-blue-50 min-h-screen w-full md:px-8 h-full flex items-center justify-evenly">
      <div className="w-full flex justify-between lg:mb-0">
        <div className="flex justify-center items-center  w-full">
          <div className="max-w-md w-full p-6 md:p-8 rounded-3xl shadow-wrapShadow bg-white">
            <div className="flex">
              <div className="w-8/12">
                <h2 className="text-base md:text-[20px] text-black mt-1">
                  Welcome to Spotify
                </h2>
                <h1 className="text-[40px] md:text-[55px] font-medium text-black">
                  Sign up
                </h1>
              </div>
              <div className="w-1/3">
                <span className="text-sm text-[#8D8D8D] hover:text-gray-800">
                  Have an Account?{" "}
                </span>
                <h1
                  onClick={() => router.push("/login")}
                  className="text-blue-500 text-sm cursor-pointer"
                >
                  Sign in
                </h1>
              </div>
            </div>
            <Formik
              initialValues={{
                name: "", // Initialize name
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
                      name="name"
                      label="Name"
                      type="text"
                      component={CustomTextField}
                    />
                  </div>
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
                    {isLoading ? <Loader /> : "Register"}
                  </Button>
                  <p className="mt-4 text-center text-gray-500">
                    Already have an account?{" "}
                    <Link
                      href="/signin"
                      className="text-blue-500 hover:underline"
                    >
                      Login
                    </Link>
                  </p>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
