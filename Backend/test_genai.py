import os
from google import genai
from dotenv import load_dotenv
from PIL import Image

load_dotenv(override=True)
api_key = os.getenv("GEMINI_API_KEY")

try:
    client = genai.Client(api_key=api_key)
    # create a dummy image
    img = Image.new('RGB', (1, 1), color = 'red')
    response = client.models.generate_content(
        model='gemini-2.5-flash',
        contents=["What color is this image?", img]
    )
    print("Success! Response:", response.text)
except Exception as e:
    print("Failed:", e)
