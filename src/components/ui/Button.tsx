import { applyProps } from "./common";

interface ButtonProps {
  buttonSize?: "sm" | "md" | "lg" | "xl";
  kind?: "display" | "regular" | "round";
  color?:
    | "blue"
    | "indigo"
    | "green"
    | "red"
    | "yellow"
    | "orange"
    | "cyan"
    | "lavender";
  variation?: "fill" | "muted" | "light" | "ghost";
  anchor?: boolean;
}
const Button: React.FC<ButtonProps & React.HTMLProps<HTMLButtonElement>> = ({
  buttonSize = "lg",
  kind = "display",
  color = "blue",
  variation = "fill",
  anchor = false,
  children,
  ...props
}) => {
  const Tag = anchor ? "a" : "button";

  let classes = [
    "ui-button",
    `ui-button-${buttonSize}`,
    `ui-button-${kind}`,
    `ui-button-${color}`,
    `ui-button-${variation}`,
  ];

  return (
    <Tag
      tabindex={anchor ? "0" : undefined}
      {...applyProps(props, { className: classes.join(" ") })}
    >
      {children}
    </Tag>
  );
};

export default Button;
