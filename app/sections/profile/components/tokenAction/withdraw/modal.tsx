import Modal from "@/app/components/modal";
import TokenClaimCard from '@/app/sections/profile/components/tokenAction/card';
import { SOL } from '@/app/components/trade/buySellPump';
import { useState } from 'react';
import { fail, success } from '@/app/utils/toast';

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
          value: '0.2',
          icon: SOL.tokenUri,
        },
        {
          label: 'Fee',
          value: '0.002',
          icon: SOL.tokenUri,
        },
        {
          label: 'Est. refund',
          value: '0.198',
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

