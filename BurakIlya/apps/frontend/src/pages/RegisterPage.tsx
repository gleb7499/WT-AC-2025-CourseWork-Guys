import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ApiError } from "../lib/api";

const registerSchema = z.object({
  email: z.string().email("Введите корректный email"),
  username: z.string().min(3, "Минимум 3 символа").max(50, "Максимум 50 символов"),
  password: z.string().min(6, "Минимум 6 символов").max(100, "Максимум 100 символов")
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (data: RegisterForm) => {
    setError(null);
    try {
      await registerUser(data.email, data.username, data.password);
      navigate("/");
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Произошла ошибка");
      }
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "50px auto", padding: 24 }}>
      <h1>Регистрация</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div style={{ marginBottom: 16 }}>
          <label>
            Email
            <input
              type="email"
              {...register("email")}
              style={{ display: "block", width: "100%", padding: 8, marginTop: 4 }}
            />
          </label>
          {errors.email && <p style={{ color: "red", fontSize: 14 }}>{errors.email.message}</p>}
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>
            Имя пользователя
            <input
              type="text"
              {...register("username")}
              style={{ display: "block", width: "100%", padding: 8, marginTop: 4 }}
            />
          </label>
          {errors.username && (
            <p style={{ color: "red", fontSize: 14 }}>{errors.username.message}</p>
          )}
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>
            Пароль
            <input
              type="password"
              {...register("password")}
              style={{ display: "block", width: "100%", padding: 8, marginTop: 4 }}
            />
          </label>
          {errors.password && (
            <p style={{ color: "red", fontSize: 14 }}>{errors.password.message}</p>
          )}
        </div>
        {error && (
          <p style={{ color: "red", marginBottom: 16 }}>{error}</p>
        )}
        <button type="submit" disabled={isSubmitting} style={{ padding: "8px 16px" }}>
          {isSubmitting ? "Загрузка..." : "Зарегистрироваться"}
        </button>
        <p style={{ marginTop: 16 }}>
          Уже есть аккаунт? <Link to="/login">Войти</Link>
        </p>
      </form>
    </div>
  );
}
