import { RcFile } from "antd/es/upload";

const sliceStr = (str: string, count: number) => {
    return str.length > count ? `${str.slice(0, count)}....${str.slice(str.length - count, str.length)}` : str
}
const capitalizeFirstLetter = (string?: string) => {
    if (string) {
        return string?.charAt(0)?.toUpperCase() + string?.slice(1);
    } else {
        return `_`
    }
}

export const getBase64 = (img: RcFile, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result as string));
    reader.readAsDataURL(img);
};

const randomColor = Math.floor(Math.random() * 16777215).toString(16);
const uiSettings = {
    sliceStr,
    capitalizeFirstLetter,
    randomColor,
}

export default uiSettings