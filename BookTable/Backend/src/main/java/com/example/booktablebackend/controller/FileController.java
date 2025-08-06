package com.example.booktablebackend.controller;

import com.example.booktablebackend.component.ResponseDTO;
import com.example.booktablebackend.models.dto.PictureDTO;
import com.example.booktablebackend.services.S3Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/files")
public class FileController {

    @Autowired
    private S3Service s3Service;

    public FileController(S3Service s3Service) {
        this.s3Service = s3Service;
    }

    @PostMapping("/upload")
    public ResponseDTO<PictureDTO> uploadFile(@RequestParam("file") MultipartFile file) throws IOException {
        String key = file.getOriginalFilename();
        s3Service.uploadFile(key, file);
        String fileUrl = s3Service.getFileUrl(key);
        return ResponseDTO.ok(new PictureDTO(fileUrl));
    }

//    @GetMapping("/download/{key}")
//    public ResponseEntity<byte[]> downloadFile(@PathVariable String key) throws IOException {
//        byte[] fileBytes = s3Service.downloadFile(key);
//
//        return ResponseEntity.ok()
//                .contentType(MediaType.APPLICATION_OCTET_STREAM)
//                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + key + "\"")
//                .body(fileBytes);
//    }

    @DeleteMapping("/delete/{key}")
    public ResponseEntity<Void> deleteFile(@PathVariable String key) {
        s3Service.deleteFile(key);
        return ResponseEntity.noContent().build();
    }
}
