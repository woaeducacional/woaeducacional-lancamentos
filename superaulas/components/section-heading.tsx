export function SectionHeading({
  id,
  children,
  description,
}: {
  id: string;
  children: React.ReactNode;
  description: string;
}) {
  return (
    <div className="section-heading">
      <div className="heading-line" />
      <div>
        <h2 id={id}>{children}</h2>
        <p>{description}</p>
      </div>
      <div className="heading-line" />
    </div>
  );
}
