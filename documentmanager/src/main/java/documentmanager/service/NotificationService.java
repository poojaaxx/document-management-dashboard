package documentmanager.service;

import documentmanager.entity.Notification;
import documentmanager.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    private final List<SseEmitter> emitters =
            new ArrayList<>();

    // SSE Subscription
   public SseEmitter subscribe() {

    SseEmitter emitter =
            new SseEmitter(Long.MAX_VALUE);

    emitters.add(emitter);

    try {

        emitter.send(
                SseEmitter.event()
                        .name("CONNECTED")
                        .data("SSE Connected")
        );

    } catch (Exception e) {

        emitter.complete();
    }

    emitter.onCompletion(() ->
            emitters.remove(emitter));

    emitter.onTimeout(() ->
            emitters.remove(emitter));

    return emitter;
}

    // Create notification + push via SSE
    public Notification createNotification(
            String message,
            String type
    ) {

        Notification notification =
                Notification.builder()
                        .message(message)
                        .type(type)
                        .isRead(false)
                        .createdAt(LocalDateTime.now())
                        .build();

        Notification savedNotification =
                notificationRepository.save(notification);

        for (SseEmitter emitter : emitters) {

            try {

                emitter.send(
        SseEmitter.event()
                .name("notification")
                .data(savedNotification)
);

            } catch (Exception e) {

                emitter.complete();

                emitters.remove(emitter);
            }
        }

        return savedNotification;
    }

    // Get all notifications
    public List<Notification> getAllNotifications() {
        return notificationRepository.findAll();
    }

    // Mark one notification as read
    public Notification markAsRead(Long id) {

        Notification notification =
                notificationRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException("Notification not found"));

        notification.setIsRead(true);

        return notificationRepository.save(notification);
    }

    // Mark all notifications as read
    public void markAllAsRead() {

        List<Notification> notifications =
                notificationRepository.findAll();

        for (Notification notification : notifications) {

            notification.setIsRead(true);
        }

        notificationRepository.saveAll(notifications);
    }

    // Get unread notification count
    public long getUnreadCount() {

        return notificationRepository
                .countByIsReadFalse();
    }
}