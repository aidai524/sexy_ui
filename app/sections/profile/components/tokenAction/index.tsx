import { useMemo, useState } from "react";
import styles from "./index.module.css";
import type { Project } from "@/app/type";
import Actions from "./actions";
import ActionList from "./actionList";
import { useUser } from "@/app/store/useUser";

interface Props {
  token: Project;
  isDelay: boolean;
  isOther: boolean;
  prepaidWithdrawDelayTime: number;
}

export default function TokenAction({
  token,
  isDelay,
  isOther,
  prepaidWithdrawDelayTime
}: Props) {
  const [modalShow, setModalShow] = useState(false);
  const { userInfo }: any = useUser();

  // const showAction = useMemo(() => {
  //   if (token.status !== 0) {
  //     return true;
  //   }
  //   if (token.status === 0 && !isDelay && token.account !== userInfo.address) {
  //     return true;
  //   }
  //   if (token.status === 0 && isDelay && token.prePaidAmount !== "0") {
  //     return true;
  //   }

  //   return false;
  // }, [token, isDelay]);

  return (
    <div
      className={styles.main}
      style={{
        position: "relative"
      }}
    >
      {/* {showAction && (
        <div
          onClick={(ev) => {
            ev.stopPropagation();
            ev.nativeEvent.stopImmediatePropagation();
            setModalShow(true);
          }}
          className="button"
        >
          <svg
            width="36"
            height="36"
            viewBox="0 0 36 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle opacity="0.4" cx="18" cy="18" r="18" fill="black" />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M13.75 18C13.75 18.9665 12.9665 19.75 12 19.75C11.0335 19.75 10.25 18.9665 10.25 18C10.25 17.0335 11.0335 16.25 12 16.25C12.9665 16.25 13.75 17.0335 13.75 18ZM19.75 18C19.75 18.9665 18.9665 19.75 18 19.75C17.0335 19.75 16.25 18.9665 16.25 18C16.25 17.0335 17.0335 16.25 18 16.25C18.9665 16.25 19.75 17.0335 19.75 18ZM24 19.75C24.9665 19.75 25.75 18.9665 25.75 18C25.75 17.0335 24.9665 16.25 24 16.25C23.0335 16.25 22.25 17.0335 22.25 18C22.25 18.9665 23.0335 19.75 24 19.75Z"
              fill="#87809A"
            />
          </svg>
        </div>
      )} */}
      <ActionList
        {...{
          token,
          isOther,
          prepaidWithdrawDelayTime
        }}
      />
      {/* <Actions
        {...{
          isOther,
          modalShow,
          setModalShow,
          token,
          prepaidWithdrawDelayTime
        }}
      /> */}
    </div>
  );
}
