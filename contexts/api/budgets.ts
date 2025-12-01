import { apiRequest } from "./api";

export type Budget = {
  id: number;
  user_id: number;
  budget_date: string;
  label: string;
  total_amount: string;
  created_at: string;
  updated_at: string | null;
};

export async function apiGetBudgets(): Promise<Budget[]> {
  return apiRequest<Budget[]>("/api/budgets", {
    auth: true,
  });
}

export type CreateBudgetRequest = {
  budget_date: string;
  label: string;
  total_amount?: string;
};

export async function apiCreateBudget(
  data: CreateBudgetRequest
): Promise<Budget> {
  return apiRequest<Budget>("/api/budgets", {
    method: "POST",
    body: data,
    auth: true,
  });
}

export async function apiGetBudget(id: number): Promise<Budget> {
  return apiRequest<Budget>(`/api/budgets/${id}`, {
    auth: true,
  });
}

export type UpdateBudgetRequest = Partial<
  Omit<CreateBudgetRequest, "budget_date">
>;

export async function apiUpdateBudget(
  id: number,
  data: UpdateBudgetRequest
): Promise<Budget> {
  return apiRequest<Budget>(`/api/budgets/${id}`, {
    method: "PUT",
    body: data,
    auth: true,
  });
}

export async function apiDeleteBudget(id: number): Promise<void> {
  return apiRequest<void>(`/api/budgets/${id}`, {
    method: "DELETE",
    auth: true,
  });
}
