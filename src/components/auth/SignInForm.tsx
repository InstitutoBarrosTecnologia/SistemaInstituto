import { useState } from "react";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import { useNavigate, } from "react-router";
import { postLoginUserAsync } from "../../services/service/AuthService";
import { useMutation } from "@tanstack/react-query";

export default function SignInForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    userName: ""
  });

  const mutation = useMutation({
    mutationFn: postLoginUserAsync,
    onSuccess: (response) => {
      const { status, data } = response;

      if (status === 200 && data) {
        localStorage.setItem("token", data.accessToken ?? "");
        localStorage.setItem("role", data.roles[0]);
        localStorage.setItem("username", data.userName);

        navigate("/", { replace: true });
      }
    },
    onError: (error) => {
      console.error("Erro ao enviar dados:", error);
    }
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Login
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Entre com seu e-mail e senha para entrar no sistema!
            </p>
          </div>
          <div>
            <form onSubmit={handleLogin}>
              <div className="space-y-6">
                <div>
                  <Label>
                    E-mail <span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    placeholder="info@gmail.com"
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    value={formData.email}
                  />
                </div>
                <div>
                  <Label>
                    Senha <span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Entre com sua senha"
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      value={formData.password}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      )}
                    </span>
                  </div>
                </div>

                <div>
                  <Button className="w-full" size="sm">
                    Logar
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
