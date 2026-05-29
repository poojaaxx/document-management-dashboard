package documentmanager.service;

import documentmanager.entity.Document;
import documentmanager.repository.DocumentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UploadService {

    private final DocumentRepository documentRepository;

    private static final String UPLOAD_DIR = "uploads/";

    public Document uploadFile(MultipartFile file) throws IOException {

        // Validate PDF
        if (file.getContentType() == null ||
                !file.getContentType().equals("application/pdf")) {
            throw new RuntimeException("Only PDF files are allowed");
        }

        // Create uploads folder if missing
        Path uploadPath = Paths.get(UPLOAD_DIR);

        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Unique filename
        String uniqueFileName =
                UUID.randomUUID() + "_" + file.getOriginalFilename();

        Path filePath = uploadPath.resolve(uniqueFileName);

        // Save file
        Files.copy(
                file.getInputStream(),
                filePath,
                StandardCopyOption.REPLACE_EXISTING
        );

        // Save metadata
        Document document = Document.builder()
                .fileName(file.getOriginalFilename())
                .fileType(file.getContentType())
                .fileSize(file.getSize())
                .filePath(filePath.toString())
                .status("COMPLETE")
                .uploadDate(LocalDateTime.now())
                .build();

        return documentRepository.save(document);
    }

    // Get all uploaded files
    public List<Document> getAllFiles() {
        return documentRepository.findAll();
    }
}