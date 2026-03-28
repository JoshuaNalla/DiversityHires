import os
import io
import pandas as pd
import numpy as np
import cv2
import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the MediaPipe Face Landmarker
base_options = python.BaseOptions(model_asset_path='/models/face_landmarker.task')
options = vision.FaceLandmarkerOptions(
    base_options=base_options,
    output_face_blendshapes=True,
    output_facial_transformation_matrixes=True,
    num_faces=1
)
detector = vision.FaceLandmarker.create_from_options(options)

def extract_mediapipe_metrics(detection_result) -> dict:
    if not detection_result or not detection_result.face_landmarks:
        return {"error": "No face detected in the image."}
    
    # We requested num_faces=1, so take the first detected face
    face_landmarks = detection_result.face_landmarks[0]
    
    # 1. Action Units (AUs) equivalent from blendshapes
    au_intensities = {}
    au_presence = {}
    
    if detection_result.face_blendshapes:
        blendshapes = detection_result.face_blendshapes[0]
        for blendshape in blendshapes:
            # Map mediapipe blendshapes to generic AU format for consistency
            name = blendshape.category_name
            score = blendshape.score
            au_intensities[name] = str(score)
            au_presence[name] = "1" if score > 0.1 else "0"  # Simple threshold for presence
            
    # 2. Head Pose from transformation matrix
    head_pose = {
         "rotation": {"pitch": 0.0, "yaw": 0.0, "roll": 0.0},
         "translation": {"x": 0.0, "y": 0.0, "z": 0.0}
    }
    
    if detection_result.facial_transformation_matrixes and len(detection_result.facial_transformation_matrixes) > 0:
        # Transformation matrix (4x4)
        matrix = detection_result.facial_transformation_matrixes[0]
        # Extract translation (last column)
        tx = float(matrix[0, 3])
        ty = float(matrix[1, 3])
        tz = float(matrix[2, 3])
        
        # Extract rotation (3x3 submatrix) -> Euler angles
        # Use simple approximation from 3x3 rotation matrix for demo
        import math
        sy = math.sqrt(matrix[0,0] * matrix[0,0] +  matrix[1,0] * matrix[1,0])
        singular = sy < 1e-6
        if not singular:
            x = math.atan2(matrix[2,1], matrix[2,2])
            y = math.atan2(-matrix[2,0], sy)
            z = math.atan2(matrix[1,0], matrix[0,0])
        else:
            x = math.atan2(-matrix[1,2], matrix[1,1])
            y = math.atan2(-matrix[2,0], sy)
            z = 0
            
        head_pose = {
            "rotation": {"pitch": math.degrees(x), "yaw": math.degrees(y), "roll": math.degrees(z)},
            "translation": {"x": tx, "y": ty, "z": tz}
        }
    
    # 3. Gaze (approximate by looking at eye centers or returning 0s for MVP)
    gaze = {
        "angle_x": 0.0,
        "angle_y": 0.0
    }
    
    return {
        "success": True,
        "gaze": gaze,
        "head_pose": head_pose,
        "au_intensities": au_intensities,
        "au_presence": au_presence
    }

@app.post("/analyze-frame")
async def analyze_frame(file: UploadFile = File(...)):
    """
    REST endpoint to receive an image frame, run MediaPipe FaceLandmarker, and return JSON metrics.
    """
    content = await file.read()
    
    # decode the image using cv2
    nparr = np.frombuffer(content, np.uint8)
    img_cv2 = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    if img_cv2 is None:
        return {"error": "Failed to decode image as CV2 array."}
        
    # Convert from BGR cv2 to RGB mediapipe image
    img_rgb = cv2.cvtColor(img_cv2, cv2.COLOR_BGR2RGB)
    mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=img_rgb)
    
    # Run MediaPipe face landmarker
    detection_result = detector.detect(mp_image)
    
    # Parse results
    results = extract_mediapipe_metrics(detection_result)
        
    return results

@app.get("/health")
def health_check():
    return {"status": "healthy"}
