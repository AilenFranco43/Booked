"use client";
import { useState, useEffect, useCallback } from "react";
import { userRegister } from "@/app/api/callApi";
import { AlertPopup } from "@/components/Alert";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useBoundStore } from "@/store/bound.store";

const RegisterSchema = z
  .object({
    name: z
      .string({ required_error: "Name is required" })
      .min(1, "Name is required"),
    email: z
      .string({ required_error: "Email is required" })
      .email("Invalid email format"),
    password: z
      .string({ required_error: "Password is required" })
      .min(1, "Password is required"),
    confirmPassword: z
      .string({ required_error: "Confirm password is required" })
      .min(1, "Password is required"),
    mobileNumber: z
      .string({ required_error: "Mobile is required" })
      .min(1, "Mobile is required"),
    birthDate: z
      .string({ required_error: "BirthDate is required" })
      .min(1, "BirthDate is required"),
    nationality: z
      .string({ required_error: "Nationality is required" })
      .min(1, "Nationality is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export default function RegisterForm() {
  const router = useRouter();

  const setUser = useBoundStore((state) => state.setUser);

  const [showPassword, setShowPassword] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });

  function handleChangePass1(e) {
    e.preventDefault();
    setPass1(e.target.value);
  }

  const toggleShowPassword = (e) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  };

  function isOverAge(birthDate) {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth() - birthDate.getMonth();

    if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age >= 18;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const fields = Object.fromEntries(new window.FormData(event.target));

    try {
      const data = RegisterSchema.parse(fields);

      const { confirmPassword, ...fieldData } = data;

      const { token, user } = await userRegister(fieldData);

      if (!token) throw new Error("Missing token");

      window.localStorage.setItem("token", token);

      setUser(user);

      router.push("/");
    } catch (e) {
      let errors;

      if (e instanceof z.ZodError) {
        errors = e.errors.map(({ message }) => message).join(" - ");
      } else {
        errors = e.message;
      }

      setAlert({
        show: true,
        message: errors,
        type: "error",
      });

      setTimeout(() => setAlert({ show: false, message: "", type: "" }), 4000);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div
        className="p-4 min-w-[500px] h-[80%] rounded-lg border-[#318F51] border-[.2px] shadow-md flex flex-col items-center gap-6"
        id="formRegister"
      >
        <div className="text-center">
          {alert.show && (
            <AlertPopup message={alert.message} type={alert.type} />
          )}
          <h2 className="font-semibold text-4xl my-2 ml-2 ">Registrarme</h2>
          <p className="text-[#71717A] text-xl font-normal ml-2">
            Crear mi cuenta en Booked
          </p>
        </div>

         <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre completo*
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Nombre y apellido"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#318F51] focus:border-transparent"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                E-mail*
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="ejemplo@email.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#318F51] focus:border-transparent"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña*
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#318F51] focus:border-transparent pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={toggleShowPassword}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmar Contraseña*
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#318F51] focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Número de móvil*
              </label>
              <input
                id="mobileNumber"
                name="mobileNumber"
                type="tel"
                pattern="^\+?[0-9]+$"
                placeholder="+5491111111111"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#318F51] focus:border-transparent"
                required
              />
            </div>

            <div>
              <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Nacimiento*
              </label>
              <input
                id="birthDate"
                name="birthDate"
                type="date"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#318F51] focus:border-transparent"
                required
              />
            </div>

            <div>
              <label htmlFor="nationality" className="block text-sm font-medium text-gray-700 mb-1">
                Nacionalidad*
              </label>
              <input
                id="nationality"
                name="nationality"
                type="text"
                placeholder="Ej: Argentino"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#318F51] focus:border-transparent"
                required
              />
            </div>

            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                className="h-4 w-4 text-[#318F51] focus:ring-[#318F51] border-gray-300 rounded"
                required
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                He leído y acepto los{' '}
                <a href="#" className="text-[#318F51] hover:underline">
                  Términos y condiciones
                </a>{' '}
                de Booked
              </label>
            </div>

            <div>
              <button
                type="submit"
                className="w-full bg-[#318F51] hover:bg-[#2a7a44] text-white font-medium py-2 px-4 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-[#318F51] focus:ring-offset-2"
              >
                Crear cuenta
              </button>
            </div>
          </form>
      </div>
    </div>
  );
}
