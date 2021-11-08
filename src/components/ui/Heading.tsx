import { useEffect } from "react";
import { applyProps } from "./common";
import IntersectionHelper from "./IntersectionHelper";

interface HeadingProps {
  level?: number;
  poster?: boolean;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  [key: string]: any;
}

const Heading: React.FC<HeadingProps & React.HTMLProps<HTMLHeadingElement>> = ({
  level = 3,
  poster = false,
  as,
  children,
  ...props
}) => {
  useEffect(() => {
    // IntersectionHelper.createObserver();
  }, []);
  const Tag = as ? as : poster ? "h1" : `h${level}`;
  const classes = [
    `ui-heading`,
    `${poster ? `ui-poster-${level}` : `ui-heading-${level}`}`,
  ];
  return (
    <Tag
      {...applyProps(props, { className: classes.join(" ") })}
      //ref={(e: HTMLElement) => observe(e)}
    >
      {children}
    </Tag>
  );
};

export default Heading;
