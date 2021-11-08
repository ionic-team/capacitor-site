import clsx from "clsx";
import Link from "next/link";
import { forwardRef } from "react";
import Config from "../../../config";
import Button from "../../components/ui/Button";
import { ExtendableProps } from "../../components/ui/typeHelpers";

interface CustomPrismicButtonLinkProps {
  data: any;
  arrow?: "ligature" | "unicode";
}

type PrismicButtonLinkProps = ExtendableProps<
  JSX.LibraryManagedAttributes<
    typeof Button,
    React.ComponentProps<typeof Button>
  >,
  CustomPrismicButtonLinkProps
>;

const PrismicButtonLinkWrapper = forwardRef(
  ({ data, arrow, ...props }: PrismicButtonLinkProps, ref) => {
    const { text, spans } = data[0];
    const {
      data: { target, url },
    } = spans[0];

    const sameSite = url.includes(`${Config.BaseUrl}/`);
    const ligature = arrow === "ligature";

    const Core = forwardRef((props: any, ref) => (
      <Button
        {...props}
        ref={ref}
        className={clsx({
          [props.className || ""]: true,
          "prismic-button-link": true,
        })}
        anchor={true}
        target={target}
      >
        {text}{" "}
        {arrow && (
          <span className={ligature ? "inter-arrow" : "soehne-arrow"}>
            {ligature ? "->" : " →"}
          </span>
        )}
      </Button>
    ));

    if (sameSite) {
      const relativeUrl = url.split(`${Config.BaseUrl}/`)[1];

      return (
        <Link passHref href={`/${relativeUrl}`}>
          <Core {...props} ref={ref} />
        </Link>
      );
    } else {
      return <Core {...props} href={url} ref={ref} />;
    }
  }
);

export default PrismicButtonLinkWrapper;
