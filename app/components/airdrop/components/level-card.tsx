export const Card = (props: any) => {
  const { icon, title, description, footer } = props;

  return (
    <div
      style={{
        width: '100%',
        padding: '9px 6px 10px 14px',
        borderRadius: 14,
        border: '1px dashed rgba(161, 161, 161, 0.60)',
        background: 'rgba(251, 202, 4, 0.20)',
      }}
    >
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 18,
        }}
      >
        <img
          src={icon}
          alt=""
          style={{
            flexShrink: 0,
            width: 38,
            height: 38,
          }}
        />
        <div
          style={{
            flex: 1,
          }}
        >
          <div
            style={{
              color: '#000',
              fontFamily: 'Unbounded',
              fontSize: 16,
              fontStyle: 'normal',
              fontWeight: 700,
              lineHeight: 'normal',
            }}
          >
            {title}
          </div>
          <div
            style={{
              color: '#000',
              fontFamily: 'Unbounded',
              fontSize: 12,
              fontStyle: 'normal',
              fontWeight: 300,
              lineHeight: 'normal',
              marginTop: 2,
            }}
          >
            {description}
          </div>
        </div>
      </div>
      {footer}
    </div>
  );
};

const LevelCard = (props: any) => {
  const { level = 1, onStart, userHasPoints } = props;

  return userHasPoints ? (
    <Card
      {...props}
    />
  ) : (
    <Card
      {...props}
      description={(
        <>
          Starts your FlipN journey from <strong>Lv. {level}</strong>.
        </>
      )}
      footer={(
        <button
          type="button"
          style={{
            color: '#000',
            textAlign: 'center',
            fontFamily: 'Unbounded',
            fontSize: 14,
            fontStyle: 'normal',
            fontWeight: 500,
            lineHeight: 'normal',
            borderRadius: 30,
            border: '1px solid #000',
            background: 'var(--part-bg)',
            width: '100%',
            height: 42,
            marginTop: 14,
          }}
          onClick={onStart}
        >
          Start Now
        </button>
      )}
    />
  );
};

export default LevelCard;
