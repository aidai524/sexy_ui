export default function Share() {
  return (
    <div style={{
      width: '50px', 
      height: '50px', 
      borderRadius: '50%', 
      backgroundColor: '#9290B14D', 
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="15.7046" cy="3.54547" r="2.54547" stroke="white" stroke-width="2" />
        <circle cx="15.7046" cy="14.4546" r="2.54547" stroke="white" stroke-width="2" />
        <circle cx="4.43179" cy="9.00015" r="3.63638" fill="white" />
        <path d="M13.5229 4.63623L5.15918 8.99989L13.5229 13.3635" stroke="white" stroke-width="2" />
      </svg>

    </div>
  );
}
