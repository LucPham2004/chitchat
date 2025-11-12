
export const timeAgo = (timestamp: string) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

    if(timestamp == '') {
        return '';
    }

    if (diffInSeconds < 60) {
        return `vừa xong`;
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
        return `${diffInMinutes} phút`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
        return `${diffInHours} giờ`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
        return `${diffInDays} ngày`;
    }

    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks} tuần`;
};

export const formatTimeHHmm = (isoString: string, locale = "vi-VN"): string => {
  return new Date(isoString).toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

