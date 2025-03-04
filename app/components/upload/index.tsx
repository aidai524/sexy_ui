import { ImageUploader, ImageUploadItem, ImageUploaderRef } from "antd-mobile";
import "croppie/croppie.css";

import styles from "./upload.module.css";
import { upload } from "@/app/utils";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import CircleLoading from "../icons/loading";
import UploadBox from "./upload-box";
import { fail } from "@/app/utils/toast";
import ImgCopper from "./img-copper";
import { useUserAgent } from "@/app/context/user-agent";

interface Props {
  fileList: ImageUploadItem[];
  setFileList: any;
  children?: React.ReactNode;
  accept?: string;
  type: "avatar" | "banner" | "others" | "token";
  percent?: number;
  scala?: number;
  cropper?: boolean;
}

export const imgReg = /(.+\.(jpg|jpeg|png|gif|bmp|webp|svg|tiff|tif))$/i;
export const svgReg = /(.+\.(svg))$/i;
export const gifReg = /(.+\.(gif))$/i;
export const videoReg = /(.+\.(mp4|webm|mov))$/i;

export const getVideoExt = (url: string) => {
  const match = url.match(videoReg);
  if (match && match[2]) {
    if (match[2] === "mov") return "mp4";
    return match[2].toLowerCase();
  }
  return "mp4";
};

const StyleMaps = {
  avatar: [styles.Avatar, styles.AvatarImg],
  banner: [styles.Banner, styles.Banner],
  token: [styles.Token, styles.TokenImg],
  others: [styles.Others, styles.OthersImg]
};

export function Upload({
  fileList: defaultFileList,
  setFileList: setDefaultFileList,
  accept = "image/*",
  type,
  percent = 1.5,
  scala = 2,
  cropper = false
}: Props, ref: React.Ref<any>) {
  const [isUplaod, setIsUpload] = useState(false);
  const [fileList, setFileList] = useState<any>(defaultFileList || []);
  const input = useRef<ImageUploaderRef>(null);
  const { isMobile } = useUserAgent();

  const uploadImg = useCallback(
    async (file: File) => {
      if (file.size > 10 * 1000 * 1000) {
        fail("File size too large");
        return {
          url: ""
        };
      }

      if (!imgReg.test(file.name) && !videoReg.test(file.name)) {
        fail("File type not supported");
        return {
          url: ""
        };
      }

      let _file: any = file;
      if (cropper && (imgReg.test(file.name) && !svgReg.test(file.name) && !gifReg.test(file.name))) {
        const blob = await ImgCopper({ file, isMobile });
        if (!blob) {
          return {
            url: ""
          };
        }
        _file = blob;
      }

      setIsUpload(true);

      const url = await upload(
        file.name,
        _file,
        imgReg.test(file.name) &&
          !svgReg.test(file.name) &&
          !gifReg.test(file.name),
        percent,
        scala,
        cropper
      );

      let originUrl = url;
      if (cropper) {
        originUrl = await upload(
          file.name,
          file,
          imgReg.test(file.name) &&
            !svgReg.test(file.name) &&
            !gifReg.test(file.name),
          -1,
          scala,
          false
        );
        console.log(originUrl)
      }

      setTimeout(() => {
        setIsUpload(false);
      }, 100);

      if (url) {
        return {
          url,
          originUrl
        };
      }

      return {
        url: ""
      };
    },
    [cropper]
  );

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

  useImperativeHandle(ref, () => ({
    open: onUpload,
  }));

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

      {mergedFiles.length === 0 || mergedFiles[0].url === "" ? (
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
            <div className={styles.videoBox} onClick={onUpload}>
              <video className={styles.imgPreview} playsInline webkit-playsinline style={{ pointerEvents: "none" }} >
                <source
                  src={mergedFiles[0].url + '#t=0.1'}
                  type={"video/" + getVideoExt(mergedFiles[0].url)}
                />
                Your browser does not support the video tag.
              </video>
            </div>
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


export default forwardRef(Upload);