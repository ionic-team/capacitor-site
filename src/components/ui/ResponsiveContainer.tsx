import { applyProps } from "./common";

interface ContainerProps {
  as?: "div" | "article" | "section" | "main";
  [key: string]: any;
}

const ResponsiveContainer: React.FC<ContainerProps> = ({
  as = "div",
  children,
  ...props
}) => {
  const Tag = as;

  return (
    <Tag {...applyProps(props, { className: "ui-container" })}>{children}</Tag>
  );
};

export default ResponsiveContainer;
