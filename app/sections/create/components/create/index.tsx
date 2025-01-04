"use client";

import { memo, useCallback } from "react";
import Mobile from "./mobile";
import Laptop from "./laptop";
import CreateSuccessModal from "../createSuccessModal";
import { useUserAgent } from "@/app/context/user-agent";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { httpGet } from "@/app/utils";
import { useMessage } from "@/app/context/messageContext";
import { mapDataToProject } from "@/app/utils/mapTo";

export default memo(function Create(props: any) {
  const router = useRouter();
  const { isMobile } = useUserAgent();
  const { showShare } = useMessage();

  const share = useCallback(async () => {
    if (props) {
      const v = await httpGet("/project?token_name=" + props.token.tokenName);
      if (v.code === 0) {
        const data = v.data[0];
        showShare(mapDataToProject(data), true, () => {
          router.push("/detail?id=" + data.id);
        })
      }
    }
  }, [props]);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  return (
    <>
      {isMobile ? (
        <Mobile {...props} setShowSuccessModal={share} />
      ) : (
        <Laptop {...props} setShowSuccessModal={share} />
      )}
      {/* <CreateSuccessModal
        token={props.data}
        show={showSuccessModal}
        onHide={async () => {
          const v = await httpGet(
            "/project?token_name=" + props.token.tokenName
          );
          if (v.code === 0) {
            setShowSuccessModal(false);
            router.push("/detail?id=" + v.data[0].id);
          }
        }}
      /> */}
    </>
  );
});
