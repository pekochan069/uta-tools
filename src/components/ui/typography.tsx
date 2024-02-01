import { splitProps, type Component, type ComponentProps } from "solid-js";

import { cn } from "~/lib/utils";

const H1: Component<ComponentProps<"h1">> = (props) => {
  const [, rest] = splitProps(props, ["class", "children"]);

  return (
    <h1
      class={cn(
        "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
        props.class,
      )}
      {...rest}
    >
      {props.children}
    </h1>
  );
};

const H2: Component<ComponentProps<"h2">> = (props) => {
  const [, rest] = splitProps(props, ["class", "children"]);

  return (
    <h2
      class={cn(
        "mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0",
        props.class,
      )}
      {...rest}
    >
      {props.children}
    </h2>
  );
};

const H3: Component<ComponentProps<"h3">> = (props) => {
  const [, rest] = splitProps(props, ["class", "children"]);

  return (
    <h3
      class={cn(
        "mt-8 scroll-m-20 text-2xl font-semibold tracking-tight",
        props.class,
      )}
      {...rest}
    >
      {props.children}
    </h3>
  );
};

const H4: Component<ComponentProps<"h4">> = (props) => {
  const [, rest] = splitProps(props, ["class", "children"]);

  return (
    <h4
      class={cn(
        "scroll-m-20 text-xl font-semibold tracking-tight",
        props.class,
      )}
      {...rest}
    >
      {props.children}
    </h4>
  );
};

const P: Component<ComponentProps<"p">> = (props) => {
  const [, rest] = splitProps(props, ["class", "children"]);

  return (
    <p
      class={cn("leading-7 [&:not(:first-child)]:mt-6", props.class)}
      {...rest}
    >
      {props.children}
    </p>
  );
};

const BlockQuote: Component<ComponentProps<"blockquote">> = (props) => {
  const [, rest] = splitProps(props, ["class", "children"]);

  return (
    <blockquote
      class={cn("mt-6 border-l-2 pl-6 italic", props.class)}
      {...rest}
    >
      {props.children}
    </blockquote>
  );
};

const TypographyTable: Component<ComponentProps<"table">> = (props) => {
  const [, rest] = splitProps(props, ["class", "children"]);

  return (
    <table class={cn("w-full", props.class)} {...rest}>
      {props.children}
    </table>
  );
};

const TypographyTHead: Component<ComponentProps<"thead">> = (props) => {
  const [, rest] = splitProps(props, ["children"]);

  return <thead {...rest}>{props.children}</thead>;
};

const TypographyTBody: Component<ComponentProps<"tbody">> = (props) => {
  const [, rest] = splitProps(props, ["children"]);

  return <tbody {...rest}>{props.children}</tbody>;
};

const TypographyTR: Component<ComponentProps<"tr">> = (props) => {
  const [, rest] = splitProps(props, ["class", "children"]);

  return (
    <tr class="m-0 border-t p-0 even:bg-muted" {...rest}>
      {props.children}
    </tr>
  );
};

const TypographyTH: Component<ComponentProps<"th">> = (props) => {
  const [, rest] = splitProps(props, ["class", "children"]);

  return (
    <th
      class={cn(
        "border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right",
        props.class,
      )}
      {...rest}
    >
      {props.children}
    </th>
  );
};

const TypographyTD: Component<ComponentProps<"td">> = (props) => {
  const [, rest] = splitProps(props, ["class", "children"]);

  return (
    <td
      class={cn(
        "border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right",
        props.class,
      )}
      {...rest}
    >
      {props.children}
    </td>
  );
};

const List: Component<ComponentProps<"ul">> = (props) => {
  const [, rest] = splitProps(props, ["class", "children"]);

  return (
    <ul class={cn("my-6 ml-6 list-disc [&>li]:mt-2", props.class)} {...rest}>
      {props.children}
    </ul>
  );
};

const InlineCode: Component<ComponentProps<"code">> = (props) => {
  const [, rest] = splitProps(props, ["class", "children"]);

  return (
    <code
      class={cn(
        "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
        props.class,
      )}
      {...rest}
    >
      {props.children}
    </code>
  );
};

const Lead: Component<ComponentProps<"p">> = (props) => {
  const [, rest] = splitProps(props, ["class", "children"]);

  return (
    <p class={cn("text-xl text-muted-foreground", props.class)} {...rest}>
      {props.children}
    </p>
  );
};

const Large: Component<ComponentProps<"div">> = (props) => {
  const [, rest] = splitProps(props, ["class", "children"]);

  return (
    <div class={cn("ext-lg font-semibold", props.class)} {...rest}>
      {props.children}8
    </div>
  );
};

const Small: Component<ComponentProps<"small">> = (props) => {
  const [, rest] = splitProps(props, ["class", "children"]);

  return (
    <small
      class={cn("text-sm font-medium leading-none", props.class)}
      {...rest}
    >
      {props.children}
    </small>
  );
};

const Muted: Component<ComponentProps<"p">> = (props) => {
  const [, rest] = splitProps(props, ["class", "children"]);

  return (
    <p class={cn("text-sm text-muted-foreground", props.class)} {...rest}>
      {props.children}
    </p>
  );
};

const Link: Component<ComponentProps<"a">> = (props) => {
  const [, rest] = splitProps(props, ["class", "children"]);

  return (
    <a
      class={cn(
        "font-semibold text-foreground underline decoration-2 underline-offset-2 transition-colors duration-100 hover:text-muted-foreground",
        props.class,
      )}
      {...rest}
    >
      {props.children}
    </a>
  );
};

export {
  H1,
  H2,
  H3,
  H4,
  P,
  BlockQuote,
  TypographyTable,
  TypographyTHead,
  TypographyTBody,
  TypographyTR,
  TypographyTH,
  TypographyTD,
  List,
  InlineCode,
  Lead,
  Large,
  Small,
  Muted,
  Link,
};
