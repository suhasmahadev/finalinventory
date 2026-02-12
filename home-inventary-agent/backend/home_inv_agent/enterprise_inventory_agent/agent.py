# backend/agents/agent.py

from google.adk.agents import LlmAgent

from .prompt import ROOT_AGENT_PROMPT
from .tools import (

    # -----------------------------
    # INVENTORY
    # -----------------------------
    create_item,
    add_stock,
    deduct_stock,
    get_item_stock_summary,
    get_all_items,

    # -----------------------------
    # MOVEMENT
    # -----------------------------
    adjust_stock,
    transfer_stock,

    # -----------------------------
    # BILLING
    # -----------------------------
    create_bill,
    post_bill,


    # -----------------------------
    # ANALYTICS
    # -----------------------------
    get_total_sold_today,
    get_total_revenue_today,
    get_top_selling,
    get_least_selling,
    get_items_expiring,
    get_total_stock_per_item,
    get_dead_stock,
    get_stock_turnover,
    get_daily_sales_history,

    # -----------------------------
    # FORECASTING
    # -----------------------------
    forecast_demand,
    suggest_reorder,

    # -----------------------------
    # NOTIFICATIONS
    # -----------------------------
    send_notification,
)

MODEL = "gemini-2.5-flash"

root_agent = LlmAgent(
    name="enterprise_inventory_agent",
    model=MODEL,
    description=(
        "Enterprise-grade AI inventory agent with multi-warehouse support, "
        "batch-based stock control, billing, analytics, forecasting, "
        "KPI computation, and intelligent alerting."
    ),
    instruction=ROOT_AGENT_PROMPT,
    tools=[

        # INVENTORY
        create_item,
        add_stock,
        deduct_stock,
        get_item_stock_summary,
        get_all_items,

        # MOVEMENT
        adjust_stock,
        transfer_stock,

        # BILLING
        create_bill,
        post_bill,


        # ANALYTICS
        get_total_sold_today,
        get_total_revenue_today,
        get_top_selling,
        get_least_selling,
        get_items_expiring,
        get_total_stock_per_item,
        get_dead_stock,
        get_stock_turnover,
        get_daily_sales_history,

        # FORECASTING
        forecast_demand,
        suggest_reorder,

        # NOTIFICATIONS
        send_notification,
    ],
)
