"use client";

import { memo } from "react";
import Mobile from "./mobile";
import Laptop from "./laptop";
import CreateSuccessModal from "../createSuccessModal";
import { useUserAgent } from "@/app/context/user-agent";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { httpGet } from "@/app/utils";

export default memo(function Create(props: any) {
  const router = useRouter();
  const { isMobile } = useUserAgent();

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  return (
    <>
      {isMobile ? (
        <Mobile {...props} setShowSuccessModal={setShowSuccessModal} />
      ) : (
        <Laptop {...props} setShowSuccessModal={setShowSuccessModal} />
      )}
      <CreateSuccessModal
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
      />
    </>
  );
});
