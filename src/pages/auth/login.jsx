import CommonForm from "@/components/common/form";
import { useToast } from "@/components/ui/use-toast";
import { loginFormControls } from "@/config";
import { loginUser } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

const initialState = {
  email: "",
  password: "",
};

function AuthLogin() {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const { toast } = useToast();

  function onSubmit(event) {
    event.preventDefault();

    dispatch(loginUser(formData)).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: data?.payload?.message,
          className: "bg-green-100 text-green-700 border-green-400",
        });
      } else {
        toast({
          title: data?.payload?.message,
          variant: "destructive",
          className: "bg-red-100 text-red-700 border-red-400",
        });
      }
    });
  }

  return (
    <div className="space-y-6 text-center bg-transparent">
      <div>
        <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-white drop-shadow-md">
          Welcome Back
        </h1>
        <p className="mt-2 text-sm lg:text-base text-gray-200 drop-shadow">
          Don’t have an account?{" "}
          <Link
            to="/auth/register"
            className="font-medium text-blue-300 hover:text-blue-200 transition-colors"
          >
            Create one now
          </Link>
        </p>
      </div>
      <div className="mt-6">
        <CommonForm
          formControls={loginFormControls}
          buttonText={"Sign In"}
          formData={formData}
          setFormData={setFormData}
          onSubmit={onSubmit}
          className="space-y-4 bg-transparent"
          inputClassName="bg-gray-100 text-gray-900 placeholder-gray-500 rounded-md p-2 w-full"
          labelClassName="text-white drop-shadow-md font-medium text-lg lg:text-xl" // Removed bg-gradient-to-r from-white to-blue-300
        />
      </div>
      <div>
        <p className="text-xs lg:text-sm text-gray-300 drop-shadow">
          By signing in, you agree to our{" "}
          <a href="#" className="underline text-blue-300 hover:text-blue-200">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="underline text-blue-300 hover:text-blue-200">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
}

export default AuthLogin;