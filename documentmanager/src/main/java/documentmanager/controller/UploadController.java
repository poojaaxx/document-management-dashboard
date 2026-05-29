package documentmanager.controller;

import documentmanager.entity.Document;
import documentmanager.service.UploadService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
@CrossOrigin("*")
public class UploadController {

    private final UploadService uploadService;

    @PostMapping(
            value = "/upload",
            consumes = {"multipart/form-data"}
    )
    public ResponseEntity<?> uploadFile(
            @RequestParam("file") MultipartFile file
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

    // Get all uploaded documents
    @GetMapping
    public ResponseEntity<List<Document>> getAllFiles() {

        return ResponseEntity.ok(
                uploadService.getAllFiles()
        );
    }
}