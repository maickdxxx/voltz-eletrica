type Props = {
  eyebrow?: string;
  title: string;
  text?: string;
  center?: boolean;
  eyebrowPath?: string;
  titlePath?: string;
  textPath?: string;
};

export function SectionHeading({ eyebrow, title, text, center = false, eyebrowPath, titlePath, textPath }: Props) {
  return (
    <div className={`section-heading ${center ? "center" : ""}`}>
      {eyebrow && <span className="eyebrow" data-coruja-path={eyebrowPath}>{eyebrow}</span>}
      <h2 data-coruja-path={titlePath}>{title}</h2>
      {text && <p data-coruja-path={textPath}>{text}</p>}
    </div>
  );
}
