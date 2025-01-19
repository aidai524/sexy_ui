import PageHeader from "@/app/components/page-header/mobile";

export default function Header() {
  return (
    <div>
      <PageHeader
        title="Trends"
        theme="light"
        from="trends"
        style={{
          background: "#000"
        }}
      />
    </div>
  );
}
