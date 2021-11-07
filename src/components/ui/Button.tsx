import clsx from "clsx";
import React, { forwardRef } from "react";
import styled from "styled-components";
import { Component } from "./typeHelpers";

export type ButtonSize = "sm" | "md" | "lg" | "xl";
export type ButtonType = "display" | "regular" | "round";
export type ButtonColor =
  | "blue"
  | "indigo"
  | "green"
  | "red"
  | "yellow"
  | "orange"
  | "cyan"
  | "lavender"
  | "black";
export type ButtonVariation = "fill" | "muted" | "light" | "ghost";

export interface CustomButtonProps {
  size?: ButtonSize;
  kind?: ButtonType;
  color?: ButtonColor;
  variation?: ButtonVariation;
}

type Button = Component<"button", CustomButtonProps>;

const Button = forwardRef(
  (
    {
      size = "lg",
      kind = "display",
      color = "blue",
      variation = "fill",
      ...props
    },
    ref
  ) => {
    const as = Boolean(props.href) ? "a" : "button";

    return React.createElement(ButtonStyles, {
      ...props,
      $size: size,
      $kind: kind,
      $color: color,
      $variation: variation,
      $as: props.as || props.$as || as,
      ref,
      className: clsx({
        [props.className]: Boolean(props.className),
        "ds-button": true,
        [`ds-button-${size}`]: true,
        [`ds-button-${kind}`]: true,
        [`ds-button-${color}`]: true,
        [`ds-button-${variation}`]: true,
      }),
    });
  }
) as Button;

export default Button;

const ButtonStyles = styled.a`
  --height: 2.75rem;
  --c-background: ${({ theme }) => theme.colors.blue["80"]};
  --c-background--hover: ${({ theme }) => theme.colors.blue["70"]};
  --c-background--active: ${({ theme }) => theme.colors.blue["90"]};
  --c-focus: #c2d8ff;
  --c-text: #fff;
  --elevation: ${({ theme }) => theme.shadows["0"]};
  --padding: 13.5px 16px;
  --f-size: ${({ theme }) => theme.fontSizes["14"]};
  --letter-spacing: 0.08em;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: none;
  color: var(--c-text);
  line-height: 100%;
  outline: 1px solid rgba(0, 0, 0, 0);
  box-shadow: var(--elevation);
  white-space: pre;

  //default to large blue display button
  text-transform: uppercase;
  border-radius: 8px;
  padding: var(--padding);
  letter-spacing: var(----letter-spacing);
  background: var(--c-background);
  font-size: var(--f-size);
  height: var(--height);
  font-weight: bold;

  &:focus {
    outline: 1px solid rgba(0, 0, 0, 0);
    box-shadow: 0 0 0 3px var(--c-focus), var(--elevation);
  }
  &:hover {
    background: var(--c-background--hover);
  }
  &:active {
    background: var(--c-background--active);
  }

  transition: box-shadow 0.2s ease-out, background-color 0.2s ease-out;

  //button size
  &.ds-button-sm {
    --height: 1.5rem;
  }
  &.ds-button-md {
    --f-size: ${({ theme }) => theme.fontSizes["13"]};
    --height: 2rem;
  }
  &.ds-button-lg {
    --f-size: ${({ theme }) => theme.fontSizes["14"]};
    --height: 3rem;
  }
  &.ds-button-xl {
    --f-size: ${({ theme }) => theme.fontSizes["16"]};
    --height: 3.5;
  }

  &.ds-button-light {
    &.ds-button-xl,
    &.ds-button-lg {
      --elevation: ${({ theme }) => theme.shadows["3"]};

      &:hover,
      &:focus {
        --elevation: ${({ theme }) => theme.shadows["4"]};
      }
    }

    &.ds-button-md,
    &.ds-button-sm {
      --elevation: ${({ theme }) => theme.shadows["2"]};

      &:hover,
      &:focus {
        --elevation: ${({ theme }) => theme.shadows["3"]};
      }
    }

    &.ds-button-round {
      &:active {
        --elevation: ${({ theme }) => theme.shadows["1"]};
      }
    }
  }

  //button-type
  &.ds-button-display {
    text-transform: uppercase;
    font-weight: bold;

    &.ds-button-sm {
      --f-size: ${({ theme }) => theme.fontSizes["10"]};
      border-radius: ${({ theme }) => theme.radii["6"]};
      --padding: 6px 8px 5px 8px;
      --letter-spacing: 0.08em;
    }
    &.ds-button-md {
      border-radius: ${({ theme }) => theme.radii["8"]};
      --padding: 8px 12px;
      --letter-spacing: 0.08em;
    }
    &.ds-button-lg {
      border-radius: ${({ theme }) => theme.radii["8"]};
      --padding: 13.5px 16px;
      --letter-spacing: 0.08em;
    }
    &.ds-button-xl {
      border-radius: ${({ theme }) => theme.radii["8"]};
      --padding: 18.5px 20px;
      --letter-spacing: 0.12em;
    }
  }
  &.ds-button-regular {
    font-weight: bold;
    text-transform: none;

    &.ds-button-sm {
      --f-size: 11px;
      border-radius: ${({ theme }) => theme.radii["6"]};
      --padding: 5.5px 8px 6px 8px;
      --letter-spacing: -0.02em;
    }
    &.ds-button-md {
      border-radius: ${({ theme }) => theme.radii["8"]};
      --padding: 7.5px 12px 8.5px 12px;
      --letter-spacing: -0.02em;
    }
    &.ds-button-lg {
      border-radius: ${({ theme }) => theme.radii["8"]};
      --padding: 14px 16px;
      --letter-spacing: -0.02em;
    }
    &.ds-button-xl {
      border-radius: ${({ theme }) => theme.radii["8"]};
      --padding: 19px 20px;
      --letter-spacing: 0em;
    }
  }
  &.ds-button-round {
    font-weight: 600;
    border-radius: ${({ theme }) => theme.radii.x};
    text-transform: none;

    &.ds-button-sm {
      --f-size: 11px;
      --padding: 5.5px 8px 6px 8px;
      --letter-spacing: 0em;
    }
    &.ds-button-md {
      --padding: 7.5px 12px 8.5px 12px;
      --letter-spacing: -0.02em;
    }
    &.ds-button-lg {
      --padding: 16px 20px;
      --letter-spacing: -0.02em;
    }
    &.ds-button-xl {
      --padding: 19px 22px;
      --letter-spacing: -0.02em;
    }
  }

  &.ds-button-light:active {
    --c-background--active: #fff;
  }

  //button color
  &.ds-button-blue {
    --c-background: ${({ theme }) => theme.colors.blue["80"]};
    --c-focus: #c2d8ff;
    --c-background--hover: ${({ theme }) => theme.colors.blue["70"]};
    --c-background--active: ${({ theme }) => theme.colors.blue["90"]};

    &.ds-button-muted {
      --c-background: ${({ theme }) => theme.colors.cyan["10"]};
      --c-text: ${({ theme }) => theme.colors.blue["80"]};
      --c-background--hover: ${({ theme }) => theme.colors.cyan["0"]};
      --c-background--active: ${({ theme }) => theme.colors.cyan["20"]};
    }
    &.ds-button-light {
      --c-background: #fff;
      --c-text: ${({ theme }) => theme.colors.blue["80"]};

      &.ds-button-lg,
      &.ds-button-xl {
        --c-background--hover: #fff;
        --c-focus: #c2d8ff;
      }

      &.ds-button-sm,
      &.ds-button-md {
        --c-background--hover: #fff;
        --c-focus: #c2d8ff;
      }
    }
    &.ds-button-ghost {
      --c-background: rgba(0, 0, 0, 0);
      --c-text: ${({ theme }) => theme.colors.blue["80"]};
      --c-background--hover: rgba(0, 0, 0, 0);
      --c-background--active: rgba(0, 0, 0, 0);
    }
  }
  &.ds-button-indigo {
    --c-background: ${({ theme }) => theme.colors.indigo["80"]};
    --c-focus: #dee3ea;
    --c-background--hover: ${({ theme }) => theme.colors.indigo["70"]};
    --c-background--active: ${({ theme }) => theme.colors.indigo["90"]};

    &.ds-button-muted {
      --c-background: ${({ theme }) => theme.colors.carbon["0"]};
      --c-text: ${({ theme }) => theme.colors.indigo["80"]};
      --c-background--hover: ${({ theme }) => theme.colors.indigo["10"]};
      --c-background--active: ${({ theme }) => theme.colors.indigo["30"]};
    }
    &.ds-button-light {
      --c-background: #fff;
      --c-text: ${({ theme }) => theme.colors.indigo["80"]};

      &.ds-button-lg,
      &.ds-button-xl {
        --c-background--hover: #fff;
        --c-focus: #dee3ea;
      }

      &.ds-button-sm,
      &.ds-button-md {
        --c-background--hover: #fff;
        --c-focus: #dee3ea;
      }
    }
    &.ds-button-ghost {
      --c-background: rgba(0, 0, 0, 0);
      --c-text: ${({ theme }) => theme.colors.indigo["80"]};
      --c-background--hover: ${({ theme }) => theme.colors.indigo["0"]};
      --c-background--active: ${({ theme }) => theme.colors.indigo["10"]};
    }
  }
  &.ds-button-green {
    --c-background: ${({ theme }) => theme.colors.green["90"]};
    --c-focus: #cff5dc;
    --c-background--hover: ${({ theme }) => theme.colors.green["80"]};
    --c-background--active: ${({ theme }) => theme.colors.green["100"]};

    &.ds-button-muted {
      --c-background: ${({ theme }) => theme.colors.green["0"]};
      --c-background--hover: ${({ theme }) => theme.colors.green["10"]};
      --c-background--active: ${({ theme }) => theme.colors.green["20"]};
      --c-text: ${({ theme }) => theme.colors.green["100"]};

      &.ds-button-round {
        --c-text: ${({ theme }) => theme.colors.green["90"]};
      }
    }
    &.ds-button-light {
      --c-background: #fff;
      --c-text: ${({ theme }) => theme.colors.green["100"]};

      &.ds-button-lg,
      &.ds-button-xl {
        --c-background--hover: #fff;
        --c-focus: #cff5dc;
      }

      &.ds-button-sm,
      &.ds-button-md {
        --c-background--hover: #fff;
        --c-focus: #cff5dc;
      }
    }
    &.ds-button-ghost {
      --c-background: rgba(0, 0, 0, 0);
      --c-text: ${({ theme }) => theme.colors.green["100"]};
      --c-background--hover: ${({ theme }) => theme.colors.green["0"]};
      --c-background--active: ${({ theme }) => theme.colors.green["10"]};
    }
  }
  &.ds-button-red {
    --c-background: ${({ theme }) => theme.colors.red["80"]};
    --c-focus: #ffdde2;
    --c-background--hover: ${({ theme }) => theme.colors.red["70"]};
    --c-background--active: ${({ theme }) => theme.colors.red["90"]};

    &.ds-button-muted {
      --c-background: ${({ theme }) => theme.colors.red["0"]};
      --c-text: ${({ theme }) => theme.colors.red["90"]};
      --c-background--hover: ${({ theme }) => theme.colors.red["10"]};
      --c-background--active: ${({ theme }) => theme.colors.red["20"]};

      &.ds-button-round {
        --c-text: ${({ theme }) => theme.colors.red["80"]};
      }
    }
    &.ds-button-light {
      --c-background: #fff;
      --c-text: ${({ theme }) => theme.colors.red["90"]};

      &.ds-button-lg,
      &.ds-button-xl {
        --c-background--hover: #fff;
        --c-focus: #ffdde2;
      }

      &.ds-button-sm,
      &.ds-button-md {
        --c-background--hover: #fff;
        --c-focus: #ffdde2;
      }
    }
    &.ds-button-ghost {
      --c-background: rgba(0, 0, 0, 0);
      --c-text: ${({ theme }) => theme.colors.red["90"]};
      --c-background--hover: ${({ theme }) => theme.colors.red["0"]};
      --c-background--active: ${({ theme }) => theme.colors.red["10"]};
    }
  }
  &.ds-button-yellow {
    --c-background: ${({ theme }) => theme.colors.yellow["80"]};
    --c-focus: #fff4d1;
    --c-background--hover: ${({ theme }) => theme.colors.yellow["60"]};
    --c-background--active: ${({ theme }) => theme.colors.yellow["90"]};

    &.ds-button-muted {
      --c-background: ${({ theme }) => theme.colors.yellow["0"]};
      --c-text: ${({ theme }) => theme.colors.yellow["90"]};
      --c-background--hover: ${({ theme }) => theme.colors.yellow["10"]};
      --c-background--active: ${({ theme }) => theme.colors.yellow["20"]};

      &.ds-button-round {
        --c-text: ${({ theme }) => theme.colors.yellow["80"]};
      }
    }
    &.ds-button-light {
      --c-background: #fff;
      --c-text: ${({ theme }) => theme.colors.yellow["90"]};

      &.ds-button-lg,
      &.ds-button-xl {
        --c-background--hover: #fff;
        --c-focus: #fff4d1;
      }

      &.ds-button-sm,
      &.ds-button-md {
        --c-background--hover: #fff;
        --c-focus: #fff4d1;
      }
    }
    &.ds-button-ghost {
      --c-background: rgba(0, 0, 0, 0);
      --c-text: ${({ theme }) => theme.colors.yellow["90"]};
      --c-background--hover: ${({ theme }) => theme.colors.yellow["0"]};
      --c-background--active: ${({ theme }) => theme.colors.yellow["10"]};
    }
  }
  &.ds-button-orange {
    --c-background: ${({ theme }) => theme.colors.orange["70"]};
    --c-focus: #ffdfd1;
    --c-background--hover: ${({ theme }) => theme.colors.orange["70"]};
    --c-background--active: ${({ theme }) => theme.colors.orange["90"]};

    &.ds-button-muted {
      --c-background: ${({ theme }) => theme.colors.orange["0"]};
      --c-text: ${({ theme }) => theme.colors.orange["90"]};
      --c-background--hover: ${({ theme }) => theme.colors.orange["10"]};
      --c-background--active: ${({ theme }) => theme.colors.orange["20"]};

      &.ds-button-round {
        --c-text: ${({ theme }) => theme.colors.orange["80"]};
      }
    }
    &.ds-button-light {
      --c-background: #fff;
      --c-text: ${({ theme }) => theme.colors.orange["90"]};

      &.ds-button-lg,
      &.ds-button-xl {
        --c-background--hover: #fff;
        --c-focus: #ffdfd1;
      }

      &.ds-button-sm,
      &.ds-button-md {
        --c-background--hover: #fff;
        --c-focus: #ffdfd1;
      }
    }
    &.ds-button-ghost {
      --c-background: rgba(0, 0, 0, 0);
      --c-text: ${({ theme }) => theme.colors.orange["90"]};
      --c-background--hover: ${({ theme }) => theme.colors.orange["0"]};
      --c-background--active: ${({ theme }) => theme.colors.orange["10"]};
    }
  }
  &.ds-button-cyan {
    --c-background: ${({ theme }) => theme.colors.cyan["90"]};
    --c-focus: #d3ecff;
    --c-background--hover: ${({ theme }) => theme.colors.cyan["80"]};
    --c-background--active: ${({ theme }) => theme.colors.cyan["100"]};

    &.ds-button-muted {
      --c-background: ${({ theme }) => theme.colors.cyan["0"]};
      --c-text: ${({ theme }) => theme.colors.cyan["100"]};
      --c-background--hover: ${({ theme }) => theme.colors.cyan["10"]};
      --c-background--active: ${({ theme }) => theme.colors.cyan["20"]};

      &.ds-button-round {
        --c-text: ${({ theme }) => theme.colors.cyan["90"]};
      }
    }
    &.ds-button-light {
      --c-background: #fff;
      --c-text: ${({ theme }) => theme.colors.cyan["100"]};

      &.ds-button-lg,
      &.ds-button-xl {
        --c-background--hover: #fff;
        --c-focus: #d3ecff;
      }

      &.ds-button-sm,
      &.ds-button-md {
        --c-background--hover: #fff;
        --c-focus: #d3ecff;
      }
    }
    &.ds-button-ghost {
      --c-background: rgba(0, 0, 0, 0);
      --c-text: ${({ theme }) => theme.colors.cyan["100"]};
      --c-background--hover: ${({ theme }) => theme.colors.cyan["0"]};
      --c-background--active: ${({ theme }) => theme.colors.cyan["10"]};
    }
  }
  &.ds-button-lavender {
    --c-background: ${({ theme }) => theme.colors.lavender["80"]};
    --c-focus: #d0dbff;
    --c-background--hover: ${({ theme }) => theme.colors.lavender["70"]};
    --c-background--active: ${({ theme }) => theme.colors.lavender["90"]};

    &.ds-button-muted {
      --c-background: ${({ theme }) => theme.colors.blue["0"]};
      --c-text: ${({ theme }) => theme.colors.lavender["90"]};
      --c-background--hover: ${({ theme }) => theme.colors.blue["10"]};
      --c-background--active: ${({ theme }) => theme.colors.blue["20"]};

      &.ds-button-round {
        --c-text: ${({ theme }) => theme.colors.lavender["80"]};
      }
    }
    &.ds-button-light {
      --c-background: #fff;
      --c-text: ${({ theme }) => theme.colors.lavender["90"]};

      &.ds-button-lg,
      &.ds-button-xl {
        --c-background--hover: #fff;
        --c-focus: #d0dbff;
      }

      &.ds-button-sm,
      &.ds-button-md {
        --c-background--hover: #fff;
        --c-focus: #d0dbff;
      }
    }
    &.ds-button-ghost {
      --c-background: rgba(0, 0, 0, 0);
      --c-text: ${({ theme }) => theme.colors.lavender["90"]};
      --c-background--hover: ${({ theme }) => theme.colors.blue["0"]};
      --c-background--active: ${({ theme }) => theme.colors.blue["10"]};
    }
  }

  &.ds-button-black {
    --c-background: ${({ theme }) => theme.colors.black};
    --c-focus: #fff;
    --c-background--hover: ${({ theme }) => theme.colors.gray["90"]};
    --c-background--active: ${({ theme }) => theme.colors.gray["100"]};

    &.ds-button-muted {
      --c-background: ${({ theme }) => theme.colors.carbon["0"]};
      --c-text: ${({ theme }) => theme.colors.indigo["80"]};
      --c-background--hover: ${({ theme }) => theme.colors.gray["10"]};
      --c-background--active: ${({ theme }) => theme.colors.gray["30"]};
    }
    &.ds-button-light {
      --c-background: #fff;
      --c-text: ${({ theme }) => theme.colors.gray["80"]};

      &.ds-button-lg,
      &.ds-button-xl {
        --c-background--hover: ${({ theme }) => theme.colors.gray["0"]};
        --c-focus: #dee3ea;
      }

      &.ds-button-sm,
      &.ds-button-md {
        --c-background--hover: ${({ theme }) => theme.colors.gray["0"]};
        --c-focus: #dee3ea;
      }
    }
    &.ds-button-ghost {
      --c-background: rgba(0, 0, 0, 0);
      --c-text: ${({ theme }) => theme.colors.gray["80"]};
      --c-background--hover: ${({ theme }) => theme.colors.gray["0"]};
      --c-background--active: ${({ theme }) => theme.colors.gray["10"]};
    }
  }

  &:disabled {
    cursor: not-allowed;
    --c-background: ${({ theme }) => theme.colors.indigo["20"]};
    --c-text: ${({ theme }) => theme.colors.carbon["20"]};

    &:hover {
      --c-background--hover: ${({ theme }) => theme.colors.indigo["20"]};
      --c-text: ${({ theme }) => theme.colors.carbon["20"]};
      --elevation: none;
    }
  }
`;
