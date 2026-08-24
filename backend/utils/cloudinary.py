import os
import io
from fastapi import UploadFile, HTTPException

ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp"}
ALLOWED_VIDEO_TYPES = {"video/mp4", "video/webm"}
MAX_FILE_SIZE_MB = 20


async def upload_file_to_cloudinary(file: UploadFile, folder: str = "instamakaan/properties") -> dict:
    """
    Upload an UploadFile to Cloudinary and return:
    { "url": str, "public_id": str, "type": str }
    """
    import cloudinary
    import cloudinary.uploader

    cloudinary_url = os.getenv("CLOUDINARY_URL", "")
    if not cloudinary_url:
        raise HTTPException(
            status_code=500,
            detail="CLOUDINARY_URL is not set. Please add it to your environment variables."
        )

    cloudinary.config(cloudinary_url=cloudinary_url)

    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE_MB * 1024 * 1024:
        raise HTTPException(status_code=400, detail=f"File exceeds {MAX_FILE_SIZE_MB}MB limit")

    is_video = file.content_type.startswith("video/")
    resource_type = "video" if is_video else "image"

    try:
        upload_params = {
            "folder": folder,
            "resource_type": resource_type,
        }
        if not is_video:
            upload_params.update({
                "format": "webp",
                "quality": "auto:good",
            })

        result = cloudinary.uploader.upload(
            io.BytesIO(contents),
            **upload_params
        )
        return {
            "url": result.get("secure_url") or result.get("url"),
            "public_id": result.get("public_id"),
            "type": file.content_type
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Cloudinary upload failed: {str(e)}"
        )
