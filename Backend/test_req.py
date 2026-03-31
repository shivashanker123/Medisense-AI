import requests
import base64

img_base64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
img_bytes = base64.b64decode(img_base64)

with open('dummy.png', 'wb') as f:
    f.write(img_bytes)

with open('dummy.png', 'rb') as f:
    res = requests.post(
        'http://localhost:5000/upload-report',
        files={'file': ('dummy.png', f, 'image/png')}
    )
    print("Status:", res.status_code)
    print("Response:", res.text)
