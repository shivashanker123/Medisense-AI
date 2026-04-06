import os
import asyncio
from google import genai
from dotenv import load_dotenv
from PIL import Image

load_dotenv(override=True)
api_key = os.getenv("GEMINI_API_KEY")

async def test_async():
    try:
        client = genai.Client(api_key=api_key)
        img = Image.new('RGB', (1, 1), color = 'red')
        response = await client.aio.models.generate_content(
            model='gemini-2.5-flash',
            contents=["What color is this image?", img]
        )
        print("Async Success! Response:", response.text)
    except Exception as e:
        print("Async Failed:", e)

asyncio.run(test_async())
