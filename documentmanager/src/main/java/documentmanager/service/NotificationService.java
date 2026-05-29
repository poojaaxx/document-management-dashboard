package documentmanager.service;

import documentmanager.entity.Notification;
import documentmanager.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {
    public long getUnreadCount() {

    return notificationRepository
            .countByIsReadFalse();
}
    private final NotificationRepository notificationRepository;
    public Notification markAsRead(Long id) {

    Notification notification =
            notificationRepository.findById(id)
                    .orElseThrow(() ->
                            new RuntimeException("Notification not found"));

    notification.setIsRead(true);

    return notificationRepository.save(notification);
}
    public void markAllAsRead() {

    List<Notification> notifications =
            notificationRepository.findAll();

    for (Notification notification : notifications) {

        notification.setIsRead(true);
    }

    notificationRepository.saveAll(notifications);
}
    // Create notification
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

        return notificationRepository.save(notification);
    }

    // Get all notifications
    public List<Notification> getAllNotifications() {
        return notificationRepository.findAll();
    }
}