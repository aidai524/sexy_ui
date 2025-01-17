import Modal from "@/app/components/modal";
import { SOL } from '@/app/components/trade/buySellPump';
import { useState } from 'react';
import { fail, success } from '@/app/utils/toast';
import TokenClaimCard from '@/app/sections/profile/components/tokenAction/card';
import { numberFormatter } from '@/app/utils/common';

const ClaimModal = (props: any) => {
  const { visible, onClose } = props;

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal
      open={visible}
      onClose={handleClose}
      style={{}}
      mainStyle={{
        border: 0
      }}
      maskClose={false}
    >
      <Content {...props} />
    </Modal>
  );
};

export default ClaimModal;

const Content = (props: any) => {
  const {
    token,
    setIsClaimed,
    prepaidTokenWithdraw,
    prepaidAmount,
    tokenAmount,
    onClose,
  } = props;

  const tokenIcon = token.tokenIcon || token.tokenImg || "/img/token-placeholder.png";

  const [isLoading, setIsLoading] = useState(false);

  const handleClaim = async () => {
    setIsLoading(true);
    try {
      const res = await prepaidTokenWithdraw();
      if (!res) {
        fail("Claim fail", { maskStyle: { zIndex: 2000 } });
      } else {
        success("Claim success", { maskStyle: { zIndex: 2000 } });
        setIsClaimed(true);
        onClose?.();
      }
    } catch (e) {
      console.log(e);
      fail("Claim fail", { maskStyle: { zIndex: 2000 } });
    }

    setIsLoading(false);
  };

  return (
    <TokenClaimCard
      type="claim"
      title="Claim"
      list={[
        {
          label: 'You flipped',
          value: numberFormatter(prepaidAmount, 4, true, { isShort: true, isShortUppercase: true }),
          icon: SOL.tokenUri,
        },
        {
          label: 'To be claimed',
          value: numberFormatter(tokenAmount, 2, true, { isShort: true, isShortUppercase: true }),
          icon: tokenIcon,
        },
      ]}
      tokenIcon={tokenIcon}
      theme="green"
      onSubmit={handleClaim}
      loading={isLoading}
    />
  );
};

