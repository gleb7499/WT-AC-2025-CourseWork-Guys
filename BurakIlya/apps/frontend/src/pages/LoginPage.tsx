import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ApiError } from "../lib/api";

const loginSchema = z.object({
  email: z.string().email("Введите корректный email"),
  password: z.string().min(6, "Минимум 6 символов")
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginForm) => {
    setError(null);
    try {
      await login(data.email, data.password);
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
      <h1>Вход</h1>
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
          {isSubmitting ? "Загрузка..." : "Войти"}
        </button>
        <p style={{ marginTop: 16 }}>
          Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
        </p>
      </form>
    </div>
  );
}
