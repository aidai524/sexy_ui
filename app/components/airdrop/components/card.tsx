const AirdropCard = (props: any) => {
  const {
    title,
    titleStyle,
    children,
    bannerStyle,
    style,
    contentStyle,
  } = props;

  return (
    <div
      style={{
        width: '324px',
        paddingTop: 124,
        flexShrink: 0,
        fontFamily: 'Unbounded',
        overflow: 'hidden',
        position: 'relative',
        ...style,
      }}
    >
      <div
        style={{
          width: 'calc(100% + 1px)',
          height: 174,
          background: 'url("/img/airdrop/card-banner.svg") no-repeat top / 100%',
          position: 'absolute',
          zIndex: 2,
          left: '50%',
          transform: 'translateX(-50%)',
          top: 0,
          ...bannerStyle,
        }}
      />
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          height: '100%',
          background: '#FEF6E6',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          borderRadius: 30,
          border: '1px solid #000',
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          paddingTop: 47,
          ...contentStyle,
        }}
      >
        <div style={titleStyle}>
          {title}
        </div>
        {children}
      </div>
    </div>
  );
};

export default AirdropCard;
