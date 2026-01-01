from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import joblib
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
dt_pipeline = joblib.load("model_bundle/decision_tree.joblib")
lr_pipeline = joblib.load("model_bundle/logistic_regression.joblib")
class StudentData(BaseModel):
    age: float
    gender: str
    course: str
    study_hours: float
    class_attendance: float
    internet_access: str
    sleep_hours: float
    sleep_quality: str
    study_method: str
    facility_rating: str
    exam_difficulty: str
@app.get("/")
def home():
    return {"message": "API is running"}
@app.post("/predict")
def predict(student: StudentData, model: str = "dt"):
    try:
        df = pd.DataFrame([student.dict()])
        if model == "dt":
            pred = dt_pipeline.predict(df)
        elif model == "lr":
            pred = lr_pipeline.predict(df)
        else:
            return {"error": "Invalid model selection. Use 'dt' or 'lr'."}
        prediction = "pass" if pred[0] == 1 else "fail"
        return {"prediction": prediction}

    except Exception as e:
        return {"error": str(e)}
