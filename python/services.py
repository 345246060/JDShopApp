# pyapi/services.py
from typing import Dict

def login_service(data: Dict):
    username = data.get("username")
    password = data.get("password")
    if username == "admin" and password == "123456":
        return {"code": 0, "msg": "登录成功"}
    return {"code": 1, "msg": "用户名或密码错误"}

def get_user_info_service(data: Dict):
    user_id = data.get("user_id")
    return {
        "code": 0,
        "data": {
            "user_id": user_id,
            "nickname": "测试用户",
            "email": "user@example.com"
        }
    }