import Upload from "@/app/components/upload";
import { useEffect, useMemo, useState } from "react";
import type { ImageUploadItem } from "antd-mobile/es/components/image-uploader";
import useUserInfo from "../../../hooks/useUserInfo";
import styles from "./edit.module.css";
import { success, fail } from "@/app/utils/toast";
import MainBtn from "@/app/components/mainBtn";
import Education from "./education";
import { useAuth } from "@/app/context/auth";
import { useUserAgent } from "@/app/context/user-agent";

const defaultAvatar = "/img/avatar.png";
const defaultBannerImg = "/img/upload-banner.png";

export default function EditContent({ onSuccess, onClose }: any) {
  const [name, setName] = useState<string>("");
  const [disableNameEdit, setDisableNameEdit] = useState(false);
  const [education, setEducation] = useState<string>("");
  const [avatar, setAvatar] = useState<ImageUploadItem[]>([]);
  const [banner, setBanner] = useState<ImageUploadItem[]>([]);
  const { userInfo, updateCurrentUserInfo } = useAuth();
  const { saveUserInfo } = useUserInfo(userInfo?.address, true);
  const { isMobile } = useUserAgent();

  const iaInValid = useMemo(() => {
    // if (!name || avatar.length === 0) {
    //   return true;
    // }
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
          Username
        </div>
        <div className={styles.groupContent} style={{ marginTop: 12 }}>
          <input
            disabled={disableNameEdit}
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
            className={styles.inputText}
            placeholder="say something"
            style={{
              width: isMobile ? "100%" : "calc(100% - 20px)",
              border: isMobile ? "none" : "1px solid rgba(146, 144, 177, 0.60)",
              backgroundColor: isMobile
                ? "rgba(18, 23, 25, 1)"
                : "rgba(146, 144, 177, 0.10)",
              marginLeft: isMobile ? 0 : 10,
              borderRadius: isMobile ? 0 : 8,
              height: isMobile ? 42 : 50
            }}
          />
        </div>
        <div className={styles.tip}>*It can be modified only once</div>
      </div>

      <div className={styles.group} style={{ paddingTop: 8 }}>
        <div className={styles.groupTitle}>
          Profile Photo
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
        <div className={styles.groupTitle}>Highest education</div>
        <div className={styles.groupContent}>
          <Education {...{ setEducation, education }} />
        </div>
      </div>

      <div className={styles.group}>
        <div className={styles.groupTitle} style={{ marginBottom: 10 }}>
          Head Banner
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
            scala={10}
            fileList={banner}
            setFileList={setBanner}
            type="banner"
          />
        </div>
      </div>

      <div
        className={styles.actionBtns}
        style={{
          position: isMobile ? "fixed" : "inherit",
          backgroundColor: isMobile ? "transparent" : "transparent"
        }}
      >
        {isMobile && (
          <div
            onClick={() => {
              onClose();
            }}
            className={styles.cancel + " " + styles.btn + " button"}
          >
            Cancel
          </div>
        )}
        <MainBtn
          isDisabled={iaInValid}
          onClick={async () => {
            let icon = "", bannerImg = "";
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
              name || '',
              education || ''
            );

            if (isSuccess) {
              success("Edit profile success");
              onSuccess();
              updateCurrentUserInfo();
            } else {
              fail("Edit profile fail");
            }

          }}
          style={{ flex: 1, color: "#000" }}
        >
          Save
        </MainBtn>
      </div>
    </>
  );
}
