import { useUser } from '@/app/store/useUser';
import { formatLongText } from '@/app/utils/common';

const UserInfoCard = (props: any) => {
  const {} = props;

  const { userInfo } = useUser();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
      }}
    >
      <img
        src={userInfo?.icon || '/img/airdrop/user-avatar.svg'}
        alt=""
        style={{
          width: 50,
          height: 50,
          borderRadius: '50%',
        }}
      />
      <div
        style={{
          color: '#000',
          fontFamily: 'Unbounded',
          fontSize: 16,
          fontWeight: 700,
        }}
      >
        Hi! {formatLongText(userInfo?.address, 4, 4)}
      </div>
    </div>
  );
};

export default UserInfoCard;
