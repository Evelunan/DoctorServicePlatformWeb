# 后端API路径对照表

## 用户相关接口
```
POST /api/user/login                    - 用户登录
POST /api/user/register                 - 用户注册  
GET  /api/user/getCurrentUser           - 获取当前用户信息
PUT  /api/user/updateUser               - 更新用户信息
```

## 病人相关接口
```
GET    /api/patient/patient/list        - 获取病人列表
POST   /api/patient/patient/add         - 添加病人
DELETE /api/patient/patient/remove/{id} - 移除病人
GET    /api/patient/patient/archive/{id} - 获取病人健康档案
POST   /api/patient/patient/archive/save - 保存病人健康档案
PUT    /api/patient/patient/archive/update - 更新病人健康档案
```

## 后端需要实现的Controller示例

### 1. 病人Controller
```java
@RestController
@RequestMapping("/api/patient/patient")
public class PatientController {
    
    @GetMapping("/list")
    public Result getPatientList(@RequestParam Long doctorId) {
        // 根据医生ID获取病人列表
        List<Patient> patients = patientService.getByDoctorId(doctorId);
        return Result.success(patients);
    }
    
    @PostMapping("/add")
    public Result addPatient(@RequestBody Patient patient) {
        // 添加病人
        boolean success = patientService.add(patient);
        return success ? Result.success() : Result.error("添加失败");
    }
    
    @DeleteMapping("/remove/{id}")
    public Result removePatient(@PathVariable Long id, @RequestParam Long doctorId) {
        // 移除病人（验证权限）
        boolean success = patientService.removeByIdAndDoctorId(id, doctorId);
        return success ? Result.success() : Result.error("移除失败");
    }
    
    @GetMapping("/archive/{id}")
    public Result getPatientArchive(@PathVariable Long id) {
        // 获取病人健康档案
        PatientArchive archive = archiveService.getByPatientId(id);
        return Result.success(archive);
    }
    
    @PostMapping("/archive/save")
    public Result savePatientArchive(@RequestBody PatientArchive archive) {
        // 保存病人健康档案
        boolean success = archiveService.save(archive);
        return success ? Result.success() : Result.error("保存失败");
    }
    
    @PutMapping("/archive/update")
    public Result updatePatientArchive(@RequestBody PatientArchive archive) {
        // 更新病人健康档案
        boolean success = archiveService.update(archive);
        return success ? Result.success() : Result.error("更新失败");
    }
}
```

### 2. 统一返回结果
```java
@Data
public class Result<T> {
    private Integer code;    // 0-成功，其他-失败
    private String message;  // 提示信息
    private T data;         // 数据
    
    public static <T> Result<T> success(T data) {
        Result<T> result = new Result<>();
        result.setCode(0);
        result.setMessage("操作成功");
        result.setData(data);
        return result;
    }
    
    public static <T> Result<T> success() {
        return success(null);
    }
    
    public static <T> Result<T> error(String message) {
        Result<T> result = new Result<>();
        result.setCode(1);
        result.setMessage(message);
        return result;
    }
}
```

## 注意事项

1. **路径格式**：所有API路径都以 `/api` 开头
2. **参数传递**：
   - GET请求使用 `@RequestParam` 接收查询参数
   - POST/PUT请求使用 `@RequestBody` 接收JSON数据
   - DELETE请求可以同时使用路径参数和查询参数
3. **权限验证**：所有需要登录的接口都需要验证token
4. **返回格式**：统一使用 `Result<T>` 格式返回数据 