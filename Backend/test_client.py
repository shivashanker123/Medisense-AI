import requests
from io import BytesIO
from PIL import Image

try:
    img = Image.new('RGB', (100, 100), color = 'white')
    buf = BytesIO()
    img.save(buf, format='JPEG')
    buf.seek(0)
    
    res = requests.post(
        'http://localhost:5000/upload-report',
        files={'file': ('test.jpg', buf, 'image/jpeg')}
    )
    print("Status:", res.status_code)
    print("Response:", res.text)
except Exception as e:
    print('Error:', e)
