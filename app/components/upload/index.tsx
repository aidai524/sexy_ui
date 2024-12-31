import { ImageUploader, ImageUploadItem, ImageUploaderRef } from "antd-mobile";
import styles from "./upload.module.css";
import { upload } from "@/app/utils";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import CircleLoading from "../icons/loading";
import UploadBox from "./upload-box";

interface Props {
  fileList: ImageUploadItem[];
  setFileList: any;
  children?: React.ReactNode;
  accept?: string;
  type: "avatar" | "banner" | "others" | "token";
  percent?: number;
}

export const imgReg = /(.+\.(jpg|jpeg|png|gif|bmp|webp|svg|tiff|tif))$/i;
export const svgReg = /(.+\.(svg))$/i;
export const videoReg = /(.+\.(mp4))$/i;
const StyleMaps = {
  avatar: [styles.Avatar, styles.AvatarImg],
  banner: [styles.Banner, styles.Banner],
  token: [styles.Token, styles.Token],
  others: [styles.Others, styles.OthersImg]
};

export default function Upload({
  fileList: defaultFileList,
  setFileList: setDefaultFileList,
  accept = "image/*",
  type,
  percent = 1.5
}: Props) {
  const [isUplaod, setIsUpload] = useState(false);
  const [fileList, setFileList] = useState<any>(defaultFileList || []);
  const input = useRef<ImageUploaderRef>(null);

  const uploadImg = useCallback(async (file: File) => {
    setIsUpload(true);
    const url = await upload(
      file.name,
      file,
      imgReg.test(file.name) && !svgReg.test(file.name),
      percent
    );
    setTimeout(() => {
      setIsUpload(false);
    }, 1000);

    if (url) {
      return {
        url
      };
    }

    return {
      url: ""
    };
  }, []);

  useEffect(() => {
    if (fileList.length === 0 && defaultFileList.length > 0)
      setFileList(defaultFileList);
  }, [defaultFileList]);

  const onUpload = () => {
    const nativeInput = input.current?.nativeElement;
    if (nativeInput) {
      nativeInput.click();
      setFileList([]);
    }
  };

  const mergedFiles = useMemo(
    () => (fileList.length ? fileList : defaultFileList),
    [defaultFileList, fileList]
  );

  const fileType = useMemo<"image" | "video" | undefined>(() => {
    if (mergedFiles && mergedFiles.length) {
      const url = mergedFiles[0].url;
      if (imgReg.test(url)) {
        return "image";
      } else if (videoReg.test(url)) {
        return "video";
      }
    }
  }, [mergedFiles]);

  return (
    <div className={styles.Container}>
      <div className={styles.uploadBox}>
        <ImageUploader
          ref={input}
          accept={accept}
          maxCount={1}
          value={fileList}
          onChange={(files) => {
            setDefaultFileList(files);
            setFileList(files);
          }}
          upload={uploadImg}
        />
      </div>

      {mergedFiles.length === 0 ? (
        <UploadBox type={type} onClick={onUpload} />
      ) : (
        <>
          {fileType === "image" && (
            <div
              className={`${StyleMaps[type][0]} ${styles.Center} button`}
              onClick={() => {
                onUpload();
              }}
            >
              <img src={mergedFiles[0].url} className={StyleMaps[type][1]} />
            </div>
          )}
          {fileType === "video" && (
            <video className={styles.imgPreview} controls>
              <source src={mergedFiles[0].url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
        </>
      )}

      {isUplaod && (
        <div
          className={styles.LoadingBox}
          style={{
            borderRadius: type === "avatar" ? "50%" : "8px"
          }}
        >
          <CircleLoading size={26} />
        </div>
      )}
    </div>
  );
}
