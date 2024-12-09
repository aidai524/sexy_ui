import Upload from "@/app/components/upload";
import { useEffect, useState } from "react";
import type { ImageUploadItem } from "antd-mobile/es/components/image-uploader";
import useUserInfo from "../hooks/useUserInfo";
import { useAccount } from "@/app/hooks/useAccount";
import styles from "./edit.module.css";

export default function EditContent({
  inputStyle,
  actionButtonsStyle,
  onSuccess,
  onClose
}: any) {
  const [name, setName] = useState<string>("");
  const [avatar, setAvatar] = useState<ImageUploadItem[]>([]);
  const [banner, setBanner] = useState<ImageUploadItem[]>([]);

  const { address } = useAccount();
  const { userInfo, saveUserInfo } = useUserInfo(address);

  console.log("avatar:", avatar);

  useEffect(() => {
    if (userInfo?.icon) {
      setAvatar([
        {
          key: userInfo?.icon,
          thumbnailUrl: userInfo?.icon,
          url: userInfo?.icon
        }
      ]);
    }

    if (userInfo?.banner) {
      setBanner([
        {
          key: userInfo?.banner,
          thumbnailUrl: userInfo?.banner,
          url: userInfo?.banner
        }
      ]);
    }

    if (userInfo?.name) {
      setName(userInfo?.name);
    }
  }, [userInfo]);
  return (
    <>
      <div className={styles.group}>
        <div className={styles.groupTitle}>
          <span className={styles.require}>*</span>Username
        </div>
        <div className={styles.groupContent}>
          <input
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
            className={styles.inputText}
            placeholder="say something"
            style={inputStyle}
          />
        </div>
      </div>

      <div className={styles.group}>
        <div className={styles.groupTitle}>
          <span className={styles.require}>*</span>Profile Photo
        </div>
        <div
          className={styles.groupContent}
          style={{ paddingLeft: 15, paddingTop: 10 }}
        >
          <Upload fileList={avatar} setFileList={setAvatar} />
        </div>
      </div>

      <div className={styles.group}>
        <div className={styles.groupTitle}>
          <span className={styles.require}>*</span>Head Banner
        </div>
        <div
          className={styles.groupContent}
          style={{
            paddingLeft: 15,
            paddingTop: 10,
            height: 174,
            overflow: "hidden"
          }}
        >
          <Upload fileList={banner} setFileList={setBanner}>
            {/* <div className={ styles.bannerBgContent }>
              <div className={ styles.bgImg }>
                  <img className={ styles.bgImgPreview } src={ userInfo?.banner } />
              </div>
              <div className={ styles.changeBtn }>Change</div>
          </div> */}
          </Upload>
        </div>
      </div>

      <div className={styles.actionBtns} style={actionButtonsStyle}>
        <div
          onClick={() => {
            onClose();
          }}
          className={styles.cancel + " " + styles.btn}
        >
          Cancel
        </div>
        <div
          onClick={async () => {
            if (name) {
              let icon = "",
                bannerImg = "";
              if (avatar.length) {
                icon = avatar[0].url;
              }

              if (banner.length) {
                bannerImg = banner[0].url;
              }

              const isSuccess = await saveUserInfo(bannerImg, icon, name);

              if (isSuccess) {
                onSuccess();
              }
            }
          }}
          className={styles.save + " " + styles.btn}
        >
          Save
        </div>
      </div>
    </>
  );
}
