package documentmanager.service;

import documentmanager.entity.Document;
import documentmanager.repository.DocumentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UploadService {

    private final DocumentRepository documentRepository;

    private final NotificationService notificationService;

    private static final String UPLOAD_DIR =
            "documentmanager/uploads/";

    // Upload single file
    public Document uploadFile(MultipartFile file) throws IOException {

        if (file.getContentType() == null ||
                !file.getContentType().equals("application/pdf")) {

            throw new RuntimeException(
                    "Only PDF files are allowed"
            );
        }

        Path uploadPath = Paths.get(UPLOAD_DIR);

        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String uniqueFileName =
                UUID.randomUUID() + "_" +
                        file.getOriginalFilename();

        Path filePath =
                uploadPath.resolve(uniqueFileName);

        Files.copy(
                file.getInputStream(),
                filePath,
                StandardCopyOption.REPLACE_EXISTING
        );

        Document document = Document.builder()
                .fileName(file.getOriginalFilename())
                .fileType(file.getContentType())
                .fileSize(file.getSize())
                .filePath(filePath.toString())
                .status("COMPLETE")
                .uploadDate(LocalDateTime.now())
                .build();

        Document savedDocument =
                documentRepository.save(document);

        notificationService.createNotification(
                "File uploaded: " +
                        file.getOriginalFilename(),
                "UPLOAD"
        );

        return savedDocument;
    }

    // Upload multiple files
    public List<Document> uploadFiles(
            MultipartFile[] files
    ) throws IOException {

        List<Document> uploadedFiles =
                new ArrayList<>();

        for (MultipartFile file : files) {

            uploadedFiles.add(
                    uploadFile(file)
            );
        }

        if (files.length > 1) {

            notificationService.createNotification(
                    files.length +
                            " files uploaded successfully",
                    "BULK_UPLOAD"
            );
        }

        return uploadedFiles;
    }

    // Get all uploaded files
    public List<Document> getAllFiles() {

        return documentRepository.findAll();
    }

    // Get file by ID
    public Document getFileById(Long id) {

        return documentRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "File not found"
                        ));
    }

    // Delete file by ID
    public void deleteFile(Long id)
            throws IOException {

        Document document =
                documentRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "File not found"
                                ));

        Path filePath =
                Paths.get(document.getFilePath());

        if (Files.exists(filePath)) {

            Files.delete(filePath);
        }

        documentRepository.delete(document);

        notificationService.createNotification(
                "File deleted: " +
                        document.getFileName(),
                "DELETE"
        );
    }
}