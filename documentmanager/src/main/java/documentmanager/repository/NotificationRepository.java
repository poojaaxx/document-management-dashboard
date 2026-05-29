package documentmanager.repository;

import documentmanager.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationRepository
        extends JpaRepository<Notification, Long> {

    long countByIsReadFalse();
}