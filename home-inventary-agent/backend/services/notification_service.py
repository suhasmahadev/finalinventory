# backend/services/notification_service.py

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Dict, Optional
from core.config import settings
from twilio.rest import Client


class NotificationService:

    def __init__(self):
        self.smtp_host = settings.SMTP_HOST
        self.smtp_port = settings.SMTP_PORT
        self.smtp_user = settings.SMTP_USER
        self.smtp_password = settings.SMTP_PASSWORD
        self.smtp_from = settings.SMTP_FROM

        self.twilio_sid = settings.TWILIO_ACCOUNT_SID
        self.twilio_token = settings.TWILIO_AUTH_TOKEN
        self.twilio_whatsapp_number = settings.TWILIO_WHATSAPP_NUMBER

    # ---------------------------------------------------
    # SEND ALERT (SMTP PRIMARY, TWILIO WHATSAPP BACKUP)
    # ---------------------------------------------------
    async def send_alert(
        self,
        subject: str,
        message: str,
        to_email: Optional[str] = None,
        to_whatsapp: Optional[str] = None,
    ) -> Dict:

        smtp_success = False
        whatsapp_success = False
        smtp_error = None
        whatsapp_error = None

        # ------------------ SMTP PRIMARY ------------------
        if to_email and self.smtp_host:

            try:
                msg = MIMEMultipart()
                msg["From"] = self.smtp_from
                msg["To"] = to_email
                msg["Subject"] = subject

                msg.attach(MIMEText(message, "plain"))

                with smtplib.SMTP(self.smtp_host, self.smtp_port) as server:
                    server.starttls()
                    server.login(self.smtp_user, self.smtp_password)
                    server.send_message(msg)

                smtp_success = True

            except Exception as e:
                smtp_error = str(e)

        # ------------------ TWILIO WHATSAPP BACKUP ------------------
        if not smtp_success and to_whatsapp and self.twilio_sid:

            try:
                client = Client(self.twilio_sid, self.twilio_token)

                client.messages.create(
                    body=message,
                    from_=f"whatsapp:{self.twilio_whatsapp_number}",
                    to=f"whatsapp:{to_whatsapp}",
                )

                whatsapp_success = True

            except Exception as e:
                whatsapp_error = str(e)

        # ------------------ FINAL RESPONSE ------------------
        return {
            "smtp_success": smtp_success,
            "whatsapp_success": whatsapp_success,
            "smtp_error": smtp_error,
            "whatsapp_error": whatsapp_error,
        }
