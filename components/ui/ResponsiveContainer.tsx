import styled, { ThemeContext, ThemeProvider } from "styled-components";
import { forwardRef, useContext } from "react";
import clsx from "clsx";
import { Component } from "./typeHelpers";

export interface CustomResponsiveContainerProps {
  gutter?: string;
  width?: string;
}

type ResponsiveContainer = Component<"div", CustomResponsiveContainerProps>;

const ResponsiveContainer = forwardRef(({ gutter, width, ...props }, ref) => {
  const { dsContainer } = useContext(ThemeContext) || {};

  const themeGutter = dsContainer?.gutter;
  const themeWidth = dsContainer?.width;

  //TODO: Split defaults into separate file
  const theme = {
    dsContainer: {
      gutter: gutter || themeGutter || "16px",
      width: width || themeWidth || "70rem",
    },
  };

  return (
    <ThemeProvider theme={theme}>
      <ContainerStyles
        {...props}
        $gutter={theme.dsContainer.gutter}
        $width={theme.dsContainer.width}
        ref={ref}
        className={clsx(props.className, {
          "ui-container": true,
        })}
      />
    </ThemeProvider>
  );
}) as ResponsiveContainer;

interface ContainerStylesProps {
  $gutter: NonNullable<CustomResponsiveContainerProps["gutter"]>;
  $width: NonNullable<CustomResponsiveContainerProps["width"]>;
}

const ContainerStyles = styled.div<ContainerStylesProps>`
  margin-inline-start: auto;
  margin-inline-end: auto;

  ${({ $gutter: gutter, $width: width }: any) =>
    `width: clamp(0px, ${width}, calc(100% - ${gutter} * 2));`}
`;

export default ResponsiveContainer;
