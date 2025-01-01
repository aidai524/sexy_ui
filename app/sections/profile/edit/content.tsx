import Upload from "@/app/components/upload";
import { useEffect, useMemo, useState } from "react";
import type { ImageUploadItem } from "antd-mobile/es/components/image-uploader";
import useUserInfo from "../../../hooks/useUserInfo";
import styles from "./edit.module.css";
import { success, fail } from "@/app/utils/toast";
import MainBtn from "@/app/components/mainBtn";
import Education from "./education";
import { useAuth } from "@/app/context/auth";

const defaultAvatar = "/img/avatar.png";
const defaultBannerImg = "/img/upload-banner.png";

export default function EditContent({
  inputStyle,
  actionButtonsStyle,
  onSuccess,
  onClose
}: any) {
  const [name, setName] = useState<string>("");
  const [disableNameEdit, setDisableNameEdit] = useState(false);
  const [education, setEducation] = useState<string>("");
  const [avatar, setAvatar] = useState<ImageUploadItem[]>([]);
  const [banner, setBanner] = useState<ImageUploadItem[]>([]);
  const { userInfo } = useAuth();
  const { saveUserInfo } = useUserInfo(userInfo?.address, true);

  const iaInValid = useMemo(() => {
    if (!name || avatar.length === 0) {
      return true;
    }
    return false;
  }, [name, avatar, banner]);

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
      setDisableNameEdit(true);
    }

    if (userInfo?.education) {
      setEducation(userInfo?.education);
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
            disabled={disableNameEdit}
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
            className={styles.inputText}
            placeholder="say something"
            style={inputStyle}
          />
        </div>
        <div className={styles.tip}>*It can be modified only once</div>
      </div>

      <div className={styles.group}>
        <div className={styles.groupTitle}>Highest education</div>
        <div className={styles.groupContent}>
          <Education {...{ inputStyle, setEducation, education }} />
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
          <Upload
            percent={1}
            fileList={avatar}
            setFileList={setAvatar}
            type="avatar"
          />
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
            overflow: "hidden"
          }}
        >
          <Upload
            percent={0.5}
            fileList={banner}
            setFileList={setBanner}
            type="banner"
          />
        </div>
      </div>

      <div className={styles.actionBtns} style={actionButtonsStyle}>
        <div
          onClick={() => {
            onClose();
          }}
          className={styles.cancel + " " + styles.btn + " button"}
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
              } else {
                bannerImg = defaultBannerImg;
              }

              const isSuccess = await saveUserInfo(
                bannerImg,
                icon,
                name,
                education
              );

              if (isSuccess) {
                success("Edit profile success");
                onSuccess();
              } else {
                fail("Edit profile fail");
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
