const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "";

export const {{SERVICE_NAME}}Service = {
  async getAll(): Promise<unknown[]> {
    const res = await fetch(`${BASE_URL}/api/{{SERVICE_SLUG}}`);
    if (!res.ok) throw new Error("Failed to fetch {{SERVICE_NAME}}");
    return res.json();
  },

  async getById(id: string): Promise<unknown> {
    const res = await fetch(`${BASE_URL}/api/{{SERVICE_SLUG}}/${id}`);
    if (!res.ok) throw new Error("Failed to fetch {{SERVICE_NAME}} by id");
    return res.json();
  },

  async create(data: unknown): Promise<unknown> {
    const res = await fetch(`${BASE_URL}/api/{{SERVICE_SLUG}}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create {{SERVICE_NAME}}");
    return res.json();
  },
};
