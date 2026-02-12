# backend/routers/voice_router.py

from fastapi import APIRouter
from pydantic import BaseModel
from services.voice_service import VoiceService
from home_inv_agent.enterprise_inventory_agent.agent import root_agent

router = APIRouter(prefix="/voice", tags=["Voice"])

voice_service = VoiceService()


class VoiceRequest(BaseModel):
    audio_base64: str
    language: str = "en-US"


@router.post("/")
async def voice_interaction(payload: VoiceRequest):

    # 1️⃣ Speech → Text
    transcript_result = await voice_service.speech_to_text(
        audio_base64=payload.audio_base64,
        language=payload.language
    )

    if not transcript_result["success"]:
        return transcript_result

    transcript = transcript_result["transcript"]

    # 2️⃣ Agent Processing
    agent_response = await root_agent.run(transcript)

    reply_text = agent_response.output_text

    # 3️⃣ Text → Speech
    tts_result = await voice_service.text_to_speech(reply_text)

    if not tts_result["success"]:
        return tts_result

    return {
        "success": True,
        "transcript": transcript,
        "agent_reply": reply_text,
        "audio_base64": tts_result["audio_base64"]
    }
