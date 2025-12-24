import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api, ApiError } from "../lib/api";
import type { Category } from "../types";

const requestSchema = z.object({
  title: z.string().min(3, "Минимум 3 символа"),
  description: z.string().min(3, "Минимум 3 символа"),
  categoryId: z.string().min(1, "Выберите категорию"),
  locationAddress: z.string().min(3, "Укажите адрес")
});

type RequestForm = z.infer<typeof requestSchema>;

export default function CreateRequestPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<RequestForm>({ resolver: zodResolver(requestSchema) });

  useEffect(() => {
    api.categories.list().then((data) => setCategories(data.items || []));
  }, []);

  const onSubmit = async (data: RequestForm) => {
    setError(null);
    try {
      await api.requests.create(data);
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
    <div style={{ maxWidth: 600, margin: "50px auto", padding: 24 }}>
      <h1>Создать запрос помощи</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div style={{ marginBottom: 16 }}>
          <label>
            Заголовок
            <input
              type="text"
              {...register("title")}
              style={{ display: "block", width: "100%", padding: 8, marginTop: 4 }}
            />
          </label>
          {errors.title && <p style={{ color: "red", fontSize: 14 }}>{errors.title.message}</p>}
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>
            Описание
            <textarea
              {...register("description")}
              rows={4}
              style={{ display: "block", width: "100%", padding: 8, marginTop: 4 }}
            />
          </label>
          {errors.description && (
            <p style={{ color: "red", fontSize: 14 }}>{errors.description.message}</p>
          )}
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>
            Категория
            <select
              {...register("categoryId")}
              style={{ display: "block", width: "100%", padding: 8, marginTop: 4 }}
            >
              <option value="">Выберите категорию</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </label>
          {errors.categoryId && (
            <p style={{ color: "red", fontSize: 14 }}>{errors.categoryId.message}</p>
          )}
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>
            Адрес
            <input
              type="text"
              {...register("locationAddress")}
              style={{ display: "block", width: "100%", padding: 8, marginTop: 4 }}
            />
          </label>
          {errors.locationAddress && (
            <p style={{ color: "red", fontSize: 14 }}>{errors.locationAddress.message}</p>
          )}
        </div>
        {error && <p style={{ color: "red", marginBottom: 16 }}>{error}</p>}
        <button type="submit" disabled={isSubmitting} style={{ padding: "8px 16px" }}>
          {isSubmitting ? "Создание..." : "Создать"}
        </button>
        <button
          type="button"
          onClick={() => navigate("/")}
          style={{ padding: "8px 16px", marginLeft: 8 }}
        >
          Отмена
        </button>
      </form>
    </div>
  );
}
