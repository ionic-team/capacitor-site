import { applyProps } from "./common";

interface Props {
  level?: number;
  leading?: "body" | "prose" | "none";
}

const Paragraph: React.FC<Props & React.HTMLProps<HTMLParagraphElement>> = ({
  level = 3,
  leading = "body",
  children,
  ...props
}) => {
  const classes = [
    `ui-paragraph`,
    `ui-paragraph-${level}`,
    `ui-paragraph--${leading}`,
  ];
  return (
    <p {...applyProps(props, { className: classes.join(" ") })}>{children}</p>
  );
};

export default Paragraph;
