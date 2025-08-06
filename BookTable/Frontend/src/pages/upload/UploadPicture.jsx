import React, { useState } from 'react';
import './UploadPicture.css';
import { useNavigate } from 'react-router-dom';
import config from '../../config';

const UploadPicture = () => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const [uploadedUrl, setUploadedUrl] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setMessage('');
        setUploadedUrl('');
        setIsSuccess(false);
    };

    const handleUpload = async (e) => {
        e.preventDefault();

        if (!file) {
            setMessage('Please select a file.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch(`${config.API_BASE_URL}${config.API_ENDPOINTS.FILE_UPLOAD}`, {
                method: 'POST',
                body: formData,
                headers: {
                    Authorization: localStorage.getItem('satoken') || ''
                }
            });

            const result = await response.json();
            console.log('Upload response:', result);

            if (result.code === 200) {
                setUploadedUrl(result.data.url);
                setMessage('Upload successful!');
                setIsSuccess(true);
            } else {
                setMessage(result.message || 'Upload failed.');
                setIsSuccess(false);
            }
        } catch (error) {
            console.error('Upload error:', error);
            setMessage('Something went wrong!');
            setIsSuccess(false);
        }
    };

    return (
        <div className="upload-container">
            <h2>Upload a Picture</h2>
            <form onSubmit={handleUpload} className="upload-form">
                <input type="file" accept="image/*" onChange={handleFileChange} />
                <button type="submit">Upload</button>
            </form>
            {message && (
                <p className={isSuccess ? 'success-msg' : 'error-msg'}>{message}</p>
            )}
            {uploadedUrl && (
                <div className="preview">
                    <p>Uploaded Image:</p>
                    <img src={uploadedUrl} alt="Uploaded" />
                </div>
            )}
        </div>
    );
};

export default UploadPicture;
