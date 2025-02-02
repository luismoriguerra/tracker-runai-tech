export class ImageService {
    static getImageUrl(filename: string | null): string {
        if (!filename) return '';
        return `/api/image/${filename}`;
    }

    static createLocalImageUrl(file: File): string {
        return URL.createObjectURL(file);
    }

    static cleanupLocalImageUrl(url: string): void {
        URL.revokeObjectURL(url);
    }
} 