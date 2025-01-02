const AirdropCard = (props: any) => {
  const { title, children } = props;

  return (
    <div
      style={{
        width: '355px',
        flexShrink: 0,
        border: '1px solid #B68DFF',
        borderRadius: 30,
        fontFamily: 'Unbounded',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <div
        style={{
          width: '100%',
          background: 'url("/img/airdrop/bg.svg") no-repeat top / 355px',
          padding: '155px 10px 0',
          marginTop: -20,
          borderRadius: '30px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            color: '#000',
            fontSize: 16,
            fontStyle: 'normal',
            fontWeight: 700,
            lineHeight: 'normal',
            textAlign: 'center',
          }}
        >
          {title}
        </div>
        {children}
      </div>
    </div>
  );
};

export default AirdropCard;
