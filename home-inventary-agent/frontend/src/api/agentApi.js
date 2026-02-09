export const BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000";

export const AGENT_NAME = "enterprise_inventory_agent";

export async function createAgentSession() {
  const res = await fetch(
    `${BASE_URL}/apps/${AGENT_NAME}/users/user/sessions`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{}",
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }

  const data = await res.json();
  return data.id; // IMPORTANT: ADK returns { id: ... }
}
