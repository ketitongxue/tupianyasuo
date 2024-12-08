let originalImage = null;
let compressedImage = null;

document.getElementById('upload').addEventListener('change', handleImageUpload);
document.getElementById('quality').addEventListener('input', handleQualityChange);
document.getElementById('download-btn').addEventListener('click', handleDownload);

async function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    // 显示原始图片
    originalImage = file;
    const originalPreview = document.getElementById('original-preview');
    originalPreview.src = URL.createObjectURL(file);
    document.getElementById('original-size').textContent = `大小: ${(file.size / (1024 * 1024)).toFixed(2)} MB`;

    // 显示控制器和下载按钮
    document.querySelector('.compression-controls').style.display = 'block';
    document.getElementById('download-btn').style.display = 'block';

    // 进行初始压缩
    await compressImage(file, 75);
}

async function compressImage(file, quality) {
    const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        initialQuality: quality / 100
    };

    try {
        compressedImage = await imageCompression(file, options);
        const compressedPreview = document.getElementById('compressed-preview');
        compressedPreview.src = URL.createObjectURL(compressedImage);
        document.getElementById('compressed-size').textContent = 
            `大小: ${(compressedImage.size / (1024 * 1024)).toFixed(2)} MB`;
    } catch (error) {
        console.error('压缩失败:', error);
    }
}

function handleQualityChange(e) {
    const quality = e.target.value;
    document.getElementById('quality-value').textContent = quality + '%';
    if (originalImage) {
        compressImage(originalImage, quality);
    }
}

function handleDownload() {
    if (!compressedImage) return;
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(compressedImage);
    link.download = 'compressed_' + originalImage.name;
    link.click();
} 