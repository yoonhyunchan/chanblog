const IMAGE_API = process.env.NEXT_PUBLIC_IMAGE_API_URL
// Image Upload
export async function uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch(`${IMAGE_API}/images/upload`, {
        method: "POST",
        body: formData,
    });
    if (!response.ok) {
        throw new Error("Image upload failed");
    }
    const data = await response.json();
    if (!data.url) {
        throw new Error("No URL returned from upload");
    }
    return data.url;
}