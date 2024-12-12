import Upload from "@/app/components/upload";
import { useEffect, useMemo, useState } from "react";
import type { ImageUploadItem } from "antd-mobile/es/components/image-uploader";
import useUserInfo from "../hooks/useUserInfo";
import { useAccount } from "@/app/hooks/useAccount";
import styles from "./edit.module.css";
import { success, fail } from "@/app/utils/toast";
import MainBtn from "@/app/components/mainBtn";
import { Picker } from "antd-mobile";

export default function EditContent({
  inputStyle,
  actionButtonsStyle,
  onSuccess,
  onClose
}: any) {
  const [name, setName] = useState<string>("");
  const [education, setEducation] = useState<string>("");
  const [avatar, setAvatar] = useState<ImageUploadItem[]>([]);
  const [banner, setBanner] = useState<ImageUploadItem[]>([]);

  const { address } = useAccount();
  const { userInfo, saveUserInfo } = useUserInfo(address);

  const iaInValid = useMemo(() => {
    if (!name || avatar.length === 0 || banner.length === 0) {
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
    }

    if (userInfo?.education) {
      setEducation(userInfo?.education)
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
          <span className={styles.require}>*</span>Highest education
        </div>
        <div className={styles.groupContent}>
          <div
            onClick={async () => {
              const value = await Picker.prompt({
                columns: [
                  [
                    { label: 'Kindergarten', value: 'Kindergarten' },
                    { label: 'Elementary School', value: 'Elementary School' },
                    { label: 'Junior High School', value: 'Junior High School' },
                    { label: 'High School', value: 'High School' },
                    { label: 'College Preparatory', value: 'College Preparatory' },
                    { label: "Bachelor's Degree", value: "Bachelor's Degree" },
                    { label: "Master's Degree", value: "Master's Degree" },
                    { label: 'PhD', value: 'PhD' },
                  ],
                ],
                cancelText: 'Cancel',
                confirmText: 'Ok',
                // @ts-ignore
                value: [education]
              })

              console.log('value:', value)
              if (value && value.length > 0) {
                setEducation(value[0] as string)
              } else {
                setEducation('')
              }

            }}
            className={styles.picker}
            style={inputStyle}
          >
            {
              education 
              ? <div className={ styles.pickerValue }>{ education }</div> 
              : <div className={ styles.pickerTitle }>Select</div>
            }
            
            <div>
              <svg width="16" height="10" viewBox="0 0 16 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.0711 1.07107L8 8.14214L0.928932 1.07107" stroke="white" stroke-width="2" />
              </svg>
            </div>
          </div>
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
          <Upload fileList={avatar} setFileList={setAvatar} type="avatar" />
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
          <Upload fileList={banner} setFileList={setBanner} type="banner" />
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

              const isSuccess = await saveUserInfo(bannerImg, icon, name, education);

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
