const AirdropCard = (props: any) => {
  const { title, children, bg, height = 436, bgHeight = 502 } = props;

  return (
    <div
      style={{
        width: '323px',
        height: height,
        flexShrink: 0,
        borderRadius: 30,
        fontFamily: 'Unbounded',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          background: `url("${bg || '/img/airdrop/bg.svg'}") no-repeat bottom / 323px ${bgHeight}px`,
          padding: '125px 10px 0',
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
