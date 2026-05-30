package documentmanager.controller;

import documentmanager.entity.Document;
import documentmanager.service.UploadService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import io.swagger.v3.oas.annotations.Parameter;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
@CrossOrigin("*")
public class UploadController {

    private final UploadService uploadService;

    // Upload single file
    @PostMapping(
            value = "/upload",
            consumes = {"multipart/form-data"}
    )
    public ResponseEntity<?> uploadFile(
            @RequestParam("file")
            MultipartFile file
    ) {

        try {

            Document savedFile =
                    uploadService.uploadFile(file);

            return ResponseEntity.ok(savedFile);

        } catch (Exception e) {

            return ResponseEntity.badRequest()
                    .body(e.getMessage());
        }
    }

    // Upload multiple files
    @PostMapping(
            value = "/upload-multiple",
            consumes = {"multipart/form-data"}
    )
    public ResponseEntity<?> uploadMultipleFiles(
            @Parameter(description = "PDF files")
            @RequestParam("files")
            MultipartFile[] files
    ) {

        try {

            return ResponseEntity.ok(
                    uploadService.uploadFiles(files)
            );

        } catch (Exception e) {

            return ResponseEntity.badRequest()
                    .body(e.getMessage());
        }
    }

    // Get all uploaded documents
    @GetMapping
    public ResponseEntity<List<Document>>
    getAllFiles() {

        return ResponseEntity.ok(
                uploadService.getAllFiles()
        );
    }

    // Download file
    @GetMapping("/download/{id}")
    public ResponseEntity<Resource>
    downloadFile(
            @PathVariable Long id
    ) throws Exception {

        Document document =
                uploadService.getFileById(id);

        Path path =
                Paths.get(
                        document.getFilePath()
                ).toAbsolutePath();

        Resource resource =
                new UrlResource(path.toUri());

        if (!resource.exists()) {

            throw new RuntimeException(
                    "File not found: " + path
            );
        }

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" +
                                document.getFileName()
                                + "\""
                )
                .body(resource);
    }

    // Delete file
    @DeleteMapping("/{id}")
    public ResponseEntity<String>
    deleteFile(
            @PathVariable Long id
    ) {

        try {

            uploadService.deleteFile(id);

            return ResponseEntity.ok(
                    "File deleted successfully"
            );

        } catch (Exception e) {

            return ResponseEntity.badRequest()
                    .body(e.getMessage());
        }
    }
}