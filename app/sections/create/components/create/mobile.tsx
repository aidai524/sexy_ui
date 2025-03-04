import Content from "./content";

export default function Create({
  onBeforeCreate,
  ...rest
}: any) {
  return (
    <Content {...{ onBeforeCreate, ...rest }} width="100vw" />
  );
}
