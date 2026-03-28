FROM python:3.11-slim

USER root

# Install necessary system dependencies for OpenCV and MediaPipe
RUN apt-get update && apt-get install -y \
    wget \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Download the MediaPipe Face Landmarker model
RUN mkdir -p /models && wget -q -O /models/face_landmarker.task https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task

COPY requirements.txt .
RUN python -m pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

# Start FastAPI using python
CMD ["python", "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
