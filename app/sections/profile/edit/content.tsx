import Upload from "@/app/components/upload";
import { useEffect, useMemo, useState } from "react";
import type { ImageUploadItem } from "antd-mobile/es/components/image-uploader";
import useUserInfo from "../hooks/useUserInfo";
import { useAccount } from "@/app/hooks/useAccount";
import styles from "./edit.module.css";
import { success, fail } from "@/app/utils/toast";
import MainBtn from "@/app/components/mainBtn";

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

  const iaInValid = useMemo(() => {
    if (!name || avatar.length ===0 || banner.length === 0) {
      return true
    }
    return false
  }, [name, avatar, banner])

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
        <MainBtn
          isDisabled={iaInValid}
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
                success('Edit profile success')
                onSuccess();
              } else {
                fail('Edit profile fail')
              }
            }
          }}
          
          style={{ flex: 1 }}

        >
          Save
        </MainBtn>
      </div>
    </>
  );
}
