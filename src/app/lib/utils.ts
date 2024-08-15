import pica from 'pica'


export function prettyByteSize(bytes: number, separator = ' ', postFix = '') {
    if (bytes) {
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.min(parseInt(Math.floor(Math.log(bytes) / Math.log(1024)).toString(), 10), sizes.length - 1);
        return `${(bytes / (1024 ** i)).toFixed(i ? 1 : 0)}${separator}${sizes[i]}${postFix}`;
    }
    return 'n/a';
}

export function validURL(str: string) {
    const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return pattern.test(str);
}

export async function fetchBlurImage(url: string): Promise<string> {
    const resizedCanvas = document.createElement('canvas')
    resizedCanvas.height = 32
    resizedCanvas.width = 32
    const img = new Image();
    return new Promise((resolve, reject) => {
        img.onload = async () => {
            await pica().resize(img, resizedCanvas);
            resolve(resizedCanvas.toDataURL("image/png"));
        };
        img.onerror = reject;
        img.src = url;
    });
}

export async function getImageSize(maxSize: number, file: File): Promise<{width: number, height: number}> {
    const img = new Image();
    let objectUrl = URL.createObjectURL(file);
    return new Promise((resolve, reject) => {
        img.onload = () => {
            // Natural size is the actual image size regardless of rendering.
            // The 'normal' `width`/`height` are for the **rendered** size.
            let width  = img.width;
            let height = img.height;
            if (width < height) {
                width = maxSize * width / height
                height = maxSize
            } else {
                height = maxSize * height / width
                width = maxSize
            }
            // Resolve promise with the width and height
            resolve({width, height});
        };

        // Reject promise on error
        img.onerror = reject;
        img.src = objectUrl;
    });
}
