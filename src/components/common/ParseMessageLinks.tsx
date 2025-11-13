// Hàm này sẽ chuyển nội dung tin nhắn (string) thành một mảng (array)
// chứa các phần tử là string (văn bản thường) hoặc object {type: 'link', url: '...'}
export const ParseMessageLinks = (content: string) => {
    // Regex cơ bản để tìm URL (bắt đầu bằng http/https hoặc www.)
    const urlRegex = /(\b(https?:\/\/\S+)|(www\.\S+))/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = urlRegex.exec(content)) !== null) {
        // 1. Thêm phần văn bản thường trước link
        if (match.index > lastIndex) {
            parts.push({ type: 'text', content: content.substring(lastIndex, match.index) });
        }

        // 2. Thêm link
        const url = match[0];
        // Đảm bảo link có prefix http:// hoặc https://
        const formattedUrl = url.startsWith('http') ? url : `http://${url}`;
        
        parts.push({ type: 'link', url: formattedUrl, display: url });

        lastIndex = urlRegex.lastIndex;
    }

    // 3. Thêm phần văn bản thường cuối cùng (nếu có)
    if (lastIndex < content.length) {
        parts.push({ type: 'text', content: content.substring(lastIndex) });
    }

    return parts;
};