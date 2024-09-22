import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { loginSlice } from "../redux/slices/stateSlices/authSlice";

const Wrapper = ({ children }) => {
  const dispatch = useDispatch();

  const userIsAuthenticated = useSelector(
    (state) => state.auth.isAuthenticated
  );

  const router = useRouter();

  useEffect(() => {
    const checkAuthentication = () => {
      const storedUserData = JSON.parse(localStorage.getItem("user"));
      if (storedUserData?.token) {
        dispatch(
          loginSlice({
            token: storedUserData?.token,
            id: storedUserData?.id,
            email: storedUserData?.email,
          })
        );
      }
    };

    checkAuthentication();
  }, []);

  useEffect(() => {
    const publicRoutes = ["/signin", "/signup"];
    if (!userIsAuthenticated && !publicRoutes.includes(router.pathname)) {
      router.push("/signin");
    } else if (userIsAuthenticated && publicRoutes.includes(router.pathname)) {
      router.push("/");
    }
  }, [userIsAuthenticated, router.pathname]);

  if (
    !userIsAuthenticated &&
    router.pathname !== "/signin" &&
    router.pathname !== "/signup"
  ) {
    return null;
  }

  if (!userIsAuthenticated) {
    return children;
  }

  return (
    <div className="bg-[#dfdddd] h-screen">
      <div className="mx-auto w-[85%] md:w-[80%]">
        <div className="flex w-full">{children}</div>
      </div>
    </div>
  );
};

export default Wrapper;
