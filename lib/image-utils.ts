import { promises as fs } from 'fs'
import path from 'path'

// Image management utilities for categories
export interface ImageInfo {
    filename: string
    path: string
    url: string
    size: number
    type: string
}

export class CategoryImageManager {
    private static readonly UPLOAD_DIR = path.join(process.cwd(), 'public', 'images', 'categories')
    private static readonly PUBLIC_URL = '/images/categories'

    // Ensure upload directory exists
    static async ensureUploadDir(): Promise<void> {
        try {
            await fs.access(this.UPLOAD_DIR)
        } catch {
            await fs.mkdir(this.UPLOAD_DIR, { recursive: true })
        }
    }

    // Get image info
    static async getImageInfo(filename: string): Promise<ImageInfo | null> {
        try {
            const filePath = path.join(this.UPLOAD_DIR, filename)
            const stats = await fs.stat(filePath)

            return {
                filename,
                path: filePath,
                url: `${this.PUBLIC_URL}/${filename}`,
                size: stats.size,
                type: path.extname(filename).toLowerCase()
            }
        } catch {
            return null
        }
    }

    // List all category images
    static async listImages(): Promise<ImageInfo[]> {
        try {
            await this.ensureUploadDir()
            const files = await fs.readdir(this.UPLOAD_DIR)

            const imageFiles = files.filter(file =>
                /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
            )

            const imageInfos = await Promise.all(
                imageFiles.map(file => this.getImageInfo(file))
            )

            return imageInfos.filter((info): info is ImageInfo => info !== null)
        } catch (error) {
            console.error('Error listing images:', error)
            return []
        }
    }

    // Delete image
    static async deleteImage(filename: string): Promise<boolean> {
        try {
            const filePath = path.join(this.UPLOAD_DIR, filename)
            await fs.unlink(filePath)
            return true
        } catch (error) {
            console.error('Error deleting image:', error)
            return false
        }
    }

    // Validate image file
    static validateImageFile(filename: string): boolean {
        const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
        const ext = path.extname(filename).toLowerCase()
        return allowedExtensions.includes(ext)
    }

    // Generate unique filename
    static generateFilename(originalName: string, categorySlug: string): string {
        const ext = path.extname(originalName).toLowerCase()
        const timestamp = Date.now()
        return `${categorySlug}-${timestamp}${ext}`
    }
}

// Helper function to get category image URL
export function getCategoryImageUrl(imagePath: string): string {
    // If it's already a full URL, return as is
    if (imagePath.startsWith('http')) {
        return imagePath
    }

    // If it's a relative path starting with /, return as is
    if (imagePath.startsWith('/')) {
        return imagePath
    }

    // Otherwise, assume it's a filename and construct the path
    return `/images/categories/${imagePath}`
}

// Helper function to check if image exists
export async function imageExists(imagePath: string): Promise<boolean> {
    try {
        const fullPath = path.join(process.cwd(), 'public', imagePath.replace(/^\//, ''))
        await fs.access(fullPath)
        return true
    } catch {
        return false
    }
} 