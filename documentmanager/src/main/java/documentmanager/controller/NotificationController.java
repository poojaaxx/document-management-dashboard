package documentmanager.controller;

import documentmanager.entity.Notification;
import documentmanager.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@CrossOrigin("*")
public class NotificationController {

    private final NotificationService notificationService;

    // Create test notification
    @PostMapping("/test")
    public ResponseEntity<Notification> createTestNotification() {

        return ResponseEntity.ok(
                notificationService.createNotification(
                        "Test notification created successfully",
                        "SUCCESS"
                )
        );
    }

    // Get all notifications
    @GetMapping
    public ResponseEntity<List<Notification>> getAllNotifications() {

        return ResponseEntity.ok(
                notificationService.getAllNotifications()
        );
    }

    // Get unread notification count
    @GetMapping("/unread-count")
    public ResponseEntity<Long> getUnreadCount() {

        return ResponseEntity.ok(
                notificationService.getUnreadCount()
        );
    }

    // SSE stream endpoint
    @GetMapping("/stream")
    public SseEmitter subscribe() {

        return notificationService.subscribe();
    }

    // Mark all notifications as read
    @PutMapping("/read-all")
    public ResponseEntity<String> markAllAsRead() {

        notificationService.markAllAsRead();

        return ResponseEntity.ok(
                "All notifications marked as read"
        );
    }

    // Mark one notification as read
    @PutMapping("/{id}/read")
    public ResponseEntity<Notification> markAsRead(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                notificationService.markAsRead(id)
        );
    }
}