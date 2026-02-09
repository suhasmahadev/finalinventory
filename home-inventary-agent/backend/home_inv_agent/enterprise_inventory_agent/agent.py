# backend/agents/agent.py

from google.adk.agents import LlmAgent

from .prompt import ROOT_AGENT_PROMPT
from .tools import (
    create_item,
    add_stock,
    deduct_stock,
    get_total_stock,
    get_total_sold_today,
    get_top_selling,
    get_least_selling,
    get_items_expiring,
    forecast_demand,
    suggest_reorder,
    send_notification,
)

MODEL = "gemini-2.5-flash"

root_agent = LlmAgent(
    name="enterprise_inventory_agent",
    model=MODEL,
    description="AI agent for enterprise inventory management with analytics and forecasting",
    instruction=ROOT_AGENT_PROMPT,
    tools=[
        create_item,
        add_stock,
        deduct_stock,
        get_total_stock,
        get_total_sold_today,
        get_top_selling,
        get_least_selling,
        get_items_expiring,
        forecast_demand,
        suggest_reorder,
        send_notification,
    ],
)
