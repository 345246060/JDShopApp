# pyapi/main.py
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from services import login_service, get_user_info_service
import uvicorn
from curl_cffi import requests


app = FastAPI()

# 开放跨域给 Electron 前端页面使用
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5231"],  # ⚠️ 如需更安全，可限制为 http://localhost:3000 等
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/login")
async def login(req: Request):
    data = await req.json()
    return login_service(data)

@app.post("/api/userinfo")
async def get_user_info(req: Request):
    data = await req.json()
    return get_user_info_service(data)

@app.get("/test")
async def test():
    return {"message": "This is a test endpoint"}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=5231)