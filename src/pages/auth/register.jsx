import CommonForm from "@/components/common/form";
import { useToast } from "@/components/ui/use-toast";
import { registerFormControls } from "@/config";
import { registerUser } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const initialState = {
  userName: "",
  email: "",
  password: "",
};

function AuthRegister() {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  function onSubmit(event) {
    event.preventDefault();
    dispatch(registerUser(formData)).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: data?.payload?.message,
        });
        navigate("/auth/login");
      } else {
        toast({
          title: data?.payload?.message,
          variant: "destructive",
        });
      }
    });
  }

  console.log(formData);

  return (
    <div className="mx-auto w-full max-w-md space-y-6 bg-transparent">
      <div className="text-center">
        <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-white drop-shadow-md">
          Create new account
        </h1>
        <p className="mt-2 text-sm lg:text-base text-gray-200 drop-shadow">
          Already have an account{" "}
          <Link
            className="font-medium text-blue-300 hover:text-blue-200 transition-colors"
            to="/auth/login"
          >
            Login
          </Link>
        </p>
      </div>
      <CommonForm
        formControls={registerFormControls}
        buttonText={"Sign Up"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
        className="space-y-4 bg-transparent"
        inputClassName="bg-gray-100 text-gray-900 placeholder-gray-500 rounded-md p-2 w-full"
        labelClassName="text-white drop-shadow-md font-medium text-lg lg:text-xl" // Matching AuthLogin label styling
      />
    </div>
  );
}

export default AuthRegister;