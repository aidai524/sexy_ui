import AirdropCard from '../components/card';
import { useRouter } from 'next/navigation';
import { useContext, useEffect } from 'react';
import { AirdropContext } from '@/app/components/airdrop/context';
import InviteCard, { Card } from '@/app/components/airdrop/components/invite-card';

const AirdropMore = (props: any) => {
  const { onClose } = props;

  const { getUserData } = useContext(AirdropContext);

  const router = useRouter();

  const handleCreate = () => {
    router.push('/create');
    onClose?.();
  };

  useEffect(() => {
    getUserData?.();
  }, []);

  return (
    <AirdropCard
      title="Want to earn more?"
      titleStyle={{
        color: '#000',
        fontFamily: 'Unbounded',
        fontSize: 16,
        fontStyle: 'normal',
        fontWeight: 700,
        lineHeight: 'normal',
        textTransform: 'capitalize',
        marginTop: 8,
      }}
    >
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 15,
          padding: '16px 20px 29px',
        }}
      >
        <Card
          title="Create a new token"
          btn="Create"
          onClick={handleCreate}
          borderColor="#FFA8DC"
          bg="radial-gradient(74.25% 66.17% at 63.1% 125%, rgba(255, 60, 96, 0.80) 0%, rgba(255, 246, 246, 0.80) 100%)"
        >
          <span style={{ color: '#000', fontWeight: 600 }}>30%</span> integral amplification for the first creation
        </Card>
        <InviteCard
          onReferAfter={() => {
            onClose?.();
          }}
        />
      </div>
    </AirdropCard>
  );
};

export default AirdropMore;
