package com.teenup.contest.exception;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Instant;
import java.util.Optional;


//Pham vi trong d
@RestControllerAdvice(basePackages = "com.teenup.contest")
public class ApiExceptionHandler {
    /**
     * Bắt các exception nghiệp vụ tự định nghĩa (extends BaseException).
     */
    @ExceptionHandler(BaseException.class)
    public ResponseEntity<ApiError> handleBase(BaseException ex, HttpServletRequest req) {
        var ec = ex.getErrorCode();

        //Lấy mess EX nếu null thì lấy mes mặc định
        var msg = Optional.ofNullable(ex.getMessage()).orElse(ec.defaultMessage());
        return ResponseEntity.status(ec.status()).body(new ApiError(
                Instant.now(), //Get Date Now
                ec.status().value(),
                ec.code(),
                msg, req.getRequestURI() //path yêu cầu gây lỗi
        ));
    }

    /**
     * Bắt lỗi validate request-body theo Validation trên @RequestBody, @Valid.
     * MethodArgumentNotValidException chứa BindingResult với danh sách field lỗi.
     * EX:
     *      public void createUser(@Valid @RequestBody UserDto dto)
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleValidation(MethodArgumentNotValidException ex, HttpServletRequest req) {
        // Lấy  mã lỗi đã định nghĩa
        var ec = ErrorCode.VALIDATION_FAILED;
        // Lấy Object của các lỗi dữ liệu đầu vào sau đó chỉ lấy mã lỗi đầu để trả ra FE
        String msg = Optional.ofNullable(ex.getBindingResult().getFieldError())
                /*
                    Logic của dùng Map:
                        FieldError fe = ex.getBindingResult().getFieldError();
                        String msg = (fe != null) ? fe.getDefaultMessage() : ec.defaultMessage();
                 */
                .map(FieldError::getDefaultMessage).orElse(ec.defaultMessage());
        return ResponseEntity.status(ec.status()).body(new ApiError(
                Instant.now(), ec.status().value(), ec.code(), msg, req.getRequestURI()));
    }

    /**
     * Bắt lỗi validate kiểu @Validated trên @RequestParam, @PathVariable, hoặc validate ở Service (ConstraintViolation).
     * Khác với MethodArgumentNotValidException (body), cái này thường đến từ tham số “rời rạc”.
     * EX:
            public void getUser(@RequestParam @Min(value = 1, message = "Id must be >= 1") Long id) {
     */
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ApiError> handleConstraint(ConstraintViolationException ex, HttpServletRequest req) {
        var ec = ErrorCode.VALIDATION_FAILED;
        var msg = Optional.ofNullable(ex.getMessage()).orElse(ec.defaultMessage());
        return ResponseEntity.status(ec.status()).body(new ApiError(
                Instant.now(), ec.status().value(), ec.code(), msg, req.getRequestURI()));
    }

    /**
     * Bắt lỗi vi phạm ràng buộc dữ liệu ở DB (unique, FK, not null...) do Spring Data/JPA ném ra.
     * DataIntegrityViolationException thường bọc nguyên nhân sâu hơn (MostSpecificCause).
     */
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiError> handleConflict(DataIntegrityViolationException ex, HttpServletRequest req) {
        var ec = ErrorCode.CONFLICT;
        // Lấy message sâu nhất (SQLException...) nếu có; nếu không có thì dùng default
        var msg = Optional.ofNullable(ex.getMostSpecificCause()).map(Throwable::getMessage).orElse(ec.defaultMessage());
        return ResponseEntity.status(ec.status()).body(new ApiError(
                Instant.now(), ec.status().value(), ec.code(), msg, req.getRequestURI()));
    }

    /**
     * Bắt mọi Exception còn lại (NullPointer, IllegalState, v.v.).
     * Không để lỗi rơi ra ngoài gây 500 mặc định không kiểm soát.
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleOther(Exception ex, HttpServletRequest req) {
        var ec = ErrorCode.INTERNAL_ERROR;
        var msg = Optional.ofNullable(ex.getMessage()).orElse(ec.defaultMessage());
        return ResponseEntity.status(ec.status()).body(new ApiError(
                Instant.now(), ec.status().value(), ec.code(), msg, req.getRequestURI()));
    }
}
