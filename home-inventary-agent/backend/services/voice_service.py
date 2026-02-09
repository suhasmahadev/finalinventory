# backend/services/voice_service.py

import base64
import asyncio
from typing import Dict
from google.cloud import speech_v1p1beta1 as speech
from google.cloud import texttospeech


class VoiceService:

    def __init__(self):
        self.speech_client = speech.SpeechClient()
        self.tts_client = texttospeech.TextToSpeechClient()

    # ---------------------------------------------------
    # SPEECH TO TEXT
    # ---------------------------------------------------
    async def speech_to_text(
        self,
        audio_base64: str,
        language: str = "en-US",
        sample_rate: int = 16000,
    ) -> Dict:

        try:
            audio_bytes = base64.b64decode(audio_base64)

            audio = speech.RecognitionAudio(content=audio_bytes)

            config = speech.RecognitionConfig(
                encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
                sample_rate_hertz=sample_rate,
                language_code=language,
            )

            # Run blocking SDK call in thread
            response = await asyncio.to_thread(
                self.speech_client.recognize,
                config,
                audio
            )

            transcript = ""
            confidence = 0.0

            for result in response.results:
                transcript += result.alternatives[0].transcript
                confidence = result.alternatives[0].confidence

            return {
                "success": True,
                "transcript": transcript.strip(),
                "confidence": confidence
            }

        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }

    # ---------------------------------------------------
    # TEXT TO SPEECH
    # ---------------------------------------------------
    async def text_to_speech(
        self,
        text: str,
        language: str = "en-US",
    ) -> Dict:

        try:
            synthesis_input = texttospeech.SynthesisInput(text=text)

            voice = texttospeech.VoiceSelectionParams(
                language_code=language,
                ssml_gender=texttospeech.SsmlVoiceGender.NEUTRAL,
            )

            audio_config = texttospeech.AudioConfig(
                audio_encoding=texttospeech.AudioEncoding.MP3
            )

            # Run blocking SDK call in thread
            response = await asyncio.to_thread(
                self.tts_client.synthesize_speech,
                input=synthesis_input,
                voice=voice,
                audio_config=audio_config
            )

            audio_base64 = base64.b64encode(
                response.audio_content
            ).decode("utf-8")

            return {
                "success": True,
                "audio_base64": audio_base64
            }

        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
