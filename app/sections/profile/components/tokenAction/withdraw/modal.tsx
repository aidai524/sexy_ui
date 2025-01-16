import Modal from "@/app/components/modal";
import TokenClaimCard from '@/app/sections/profile/components/tokenAction/card';
import { SOL } from '@/app/components/trade/buySellPump';
import { useState } from 'react';
import { fail, success } from '@/app/utils/toast';
import { numberFormatter } from '@/app/utils/common';
import Big from 'big.js';

const WithdrawModal = (props: any) => {
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

export default WithdrawModal;

const Content = (props: any) => {
  const {
    prepaidSolWithdraw,
    onSuccess,
    setIsWithdrawed,
    token,
    prepaidAmount,
    prepaidRealAmount,
  } = props;

  const tokenIcon = token.tokenIcon || token.tokenImg || "/img/token-placeholder.png";

  const [isLoading, setIsLoading] = useState(false);

  const handleWithdraw = async () => {
    setIsLoading(true);
    try {
      const res = await prepaidSolWithdraw();

      if (!res) {
        fail("Refund fail");
      } else {
        success("Refund success");
        setIsWithdrawed(true);
        // fix#REF-9368
        onSuccess?.();
      }
    } catch (e) {
      console.log(e);
      fail("Refund fail");
    }

    setIsLoading(false);
  };

  return (
    <TokenClaimCard
      type="refund"
      title="Refund"
      list={[
        {
          label: 'You flipped',
          value: numberFormatter(prepaidAmount, 4, true, { isShort: true, isShortUppercase: true }),
          icon: SOL.tokenUri,
        },
        {
          label: 'Fee',
          value: numberFormatter(Big(prepaidAmount).minus(prepaidRealAmount), 4, true, { isShort: true, isShortUppercase: true }),
          icon: SOL.tokenUri,
        },
        {
          label: 'Est. refund',
          value: numberFormatter(prepaidRealAmount, 4, true, { isShort: true, isShortUppercase: true }),
          icon: SOL.tokenUri,
        },
      ]}
      tokenIcon={tokenIcon}
      theme="green"
      onSubmit={handleWithdraw}
      loading={isLoading}
      warning={`You will not get ${token.tokenSymbol} at initial price once you refund.`}
    />
  );
};

