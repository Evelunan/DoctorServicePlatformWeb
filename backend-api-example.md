# 后端API接口示例

## 1. 登录接口
```
POST /api/user/login
参数: account, password
返回:
{
    "code": 0,
    "message": "操作成功", 
    "data": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGFpbXMiOnsiaWQiOjJ9LCJleHAiOjE3NTI0NTAwNDZ9.o3jjJpzbslh2JbWzZfyjL2b5vwXRgrwHSiC7oAZj8cc"
}
```

## 2. 获取当前用户信息接口
```
GET /api/user/getCurrentUser
Header: token: {token}
返回:
{
    "code": 0,
    "message": "操作成功",
    "data": {
        "id": 2,
        "username": "doctor001",
        "name": "张医生",
        "role": "doctor",
        "phone": "13800000001",
        "email": "doctor@example.com",
        "department": "内科",
        "title": "主任医师"
    }
}
```

## 3. 获取病人列表接口
```
GET /api/user/getElders/{doctorId}
Header: token: {token}
返回:
{
    "code": 0,
    "message": "操作成功",
    "data": [
        {
            "id": 1,
            "name": "张三",
            "gender": 0,
            "birthdate": "1959-03-15",
            "phone": "13800000001",
            "address": "北京市朝阳区"
        }
    ]
}
```

## 4. 后端拦截器示例
```java
@Component
public class TokenInterceptor implements HandlerInterceptor {
    
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        // 登录和注册接口不需要验证token
        String requestURI = request.getRequestURI();
        if (requestURI.contains("/login") || requestURI.contains("/register")) {
            return true;
        }
        
        // 获取token
        String token = request.getHeader("token");
        if (token == null || token.isEmpty()) {
            response.setStatus(401);
            return false;
        }
        
        try {
            // 验证token并解析用户信息
            Claims claims = JwtUtil.parseToken(token);
            Long userId = claims.get("id", Long.class);
            
            // 将用户ID存入request
            request.setAttribute("userId", userId);
            return true;
        } catch (Exception e) {
            response.setStatus(401);
            return false;
        }
    }
}
```

## 5. 获取当前用户的Controller示例
```java
@RestController
@RequestMapping("/api/user")
public class UserController {
    
    @GetMapping("/getCurrentUser")
    public Result getCurrentUser(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        User user = userService.getById(userId);
        return Result.success(user);
    }
}
``` 