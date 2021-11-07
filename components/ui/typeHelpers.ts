// Source: https://github.com/emotion-js/emotion/blob/master/packages/styled-base/types/helper.d.ts
// A more precise version of just React.ComponentPropsWithRef on its own
export type PropsOf<
  C extends keyof JSX.IntrinsicElements | React.JSXElementConstructor<any>,
  > = JSX.LibraryManagedAttributes<C, React.ComponentPropsWithRef<C>>;

export declare type As<Props = any> = React.ElementType<Props>;

export type AsProp<C extends React.ElementType> = {
  /**
   * An override of the default HTML tag.
   * Can also be another React component.
   */
  as?: C;
  $as?: C;
};

/**
 * Allows for extending a set of props (`ExtendedProps`) by an overriding set of props
 * (`OverrideProps`), ensuring that any duplicates are overridden by the overriding
 * set of props.
 */
export type ExtendableProps<
  ExtendedProps = {},
  OverrideProps = {},
  > = OverrideProps & Omit<ExtendedProps, keyof OverrideProps>;

/**
 * Allows for inheriting the props from the specified element type so that
 * props like children, className & style work, as well as element-specific
 * attributes like aria roles. The component (`C`) must be passed in.
 */
export type InheritableElementProps<
  C extends React.ElementType,
  Props = {},
  > = ExtendableProps<PropsOf<C>, Props>;

export declare type MergeWithAs<
  ComponentProps extends object,
  AsProps extends object,
  AdditionalProps extends object = {},
  AsComponent extends As = As,
  > = RightJoinProps<ComponentProps, AdditionalProps> &
  RightJoinProps<AsProps, AdditionalProps> & {
    as?: AsComponent;
  };

export declare type OmitCommonProps<
  Target,
  OmitAdditionalProps extends keyof any = never,
  > = Omit<Target, 'transition' | 'as' | 'color' | OmitAdditionalProps>;

export declare type RightJoinProps<
  SourceProps extends object = {},
  OverrideProps extends object = {},
  > = OmitCommonProps<SourceProps, keyof OverrideProps> & OverrideProps;

export declare type ComponentWithAs<
  Component extends As,
  Props extends object = {},
  > = {
    <AsComponent extends As>(
      props: MergeWithAs<
        React.ComponentProps<Component>,
        React.ComponentProps<AsComponent>,
        Props,
        AsComponent
      >,
    ): JSX.Element;
  };

/**
 * A more sophisticated version of `InheritableElementProps` where
 * the passed in `as` prop will determine which props can be included
 */
export type PolymorphicComponentProps<
  C extends React.ElementType,
  Props = {},
  > = InheritableElementProps<C, Props & AsProp<C>>;

export interface Component<T extends As, P = {}>
  extends ComponentWithAs<T, {} & P> { }
