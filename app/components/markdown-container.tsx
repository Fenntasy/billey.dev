import classnames from "classnames";
import React, { ClassAttributes, HTMLAttributes } from "react";
import ReactMarkdown from "react-markdown";
import { ReactMarkdownProps } from "react-markdown/src/ast-to-react";
import bash from "react-syntax-highlighter/dist/cjs/languages/prism/bash";
import css from "react-syntax-highlighter/dist/cjs/languages/prism/css";
import diff from "react-syntax-highlighter/dist/cjs/languages/prism/diff";
import ini from "react-syntax-highlighter/dist/cjs/languages/prism/ini";
import javascript from "react-syntax-highlighter/dist/cjs/languages/prism/javascript";
import json from "react-syntax-highlighter/dist/cjs/languages/prism/json";
import jsx from "react-syntax-highlighter/dist/cjs/languages/prism/jsx";
import markdown from "react-syntax-highlighter/dist/cjs/languages/prism/markdown";
import scss from "react-syntax-highlighter/dist/cjs/languages/prism/scss";
import shellSession from "react-syntax-highlighter/dist/cjs/languages/prism/shell-session";
import tsx from "react-syntax-highlighter/dist/cjs/languages/prism/tsx";
import typescript from "react-syntax-highlighter/dist/cjs/languages/prism/typescript";
import SyntaxHighlighter from "react-syntax-highlighter/dist/cjs/prism-light";
import { tomorrow } from "react-syntax-highlighter/dist/cjs/styles/prism";
import rehypeRaw from "rehype-raw";

SyntaxHighlighter.registerLanguage("bash", bash);
SyntaxHighlighter.registerLanguage("cmd", bash);
SyntaxHighlighter.registerLanguage("css", css);
SyntaxHighlighter.registerLanguage("diff", diff);
SyntaxHighlighter.registerLanguage("ini", ini);
SyntaxHighlighter.registerLanguage("javascript", javascript);
SyntaxHighlighter.registerLanguage("js", javascript);
SyntaxHighlighter.registerLanguage("json", json);
SyntaxHighlighter.registerLanguage("jsx", jsx);
SyntaxHighlighter.registerLanguage("html", jsx);
SyntaxHighlighter.registerLanguage("markdown", markdown);
SyntaxHighlighter.registerLanguage("md", markdown);
SyntaxHighlighter.registerLanguage("scss", scss);
SyntaxHighlighter.registerLanguage("shell", shellSession);
SyntaxHighlighter.registerLanguage("sh", shellSession);
SyntaxHighlighter.registerLanguage("typescript", typescript);
SyntaxHighlighter.registerLanguage("ts", typescript);
SyntaxHighlighter.registerLanguage("tsx", tsx);
SyntaxHighlighter.registerLanguage("xml", jsx);

const slugify = (children: React.ReactNode): string => {
  const texts =
    React.Children.map(children, (child) =>
      typeof child === "string"
        ? child
        : React.Children.map(child, (child) =>
          typeof child === "string"
            ? child
            : React.Children.map(child, (child) =>
              typeof child === "string" ? child : "",
            ) ?? [],
        ) ?? [],
    ) ?? [];

  return texts.flat(2).reduce(
    (acc, text) =>
      (acc + text)
        .toLowerCase()
        .replace(/[^a-z]/g, " ")
        .replace(/\s+/g, "-"),
    "",
  );
};

const A: React.FC = ({ children, ...props }) => (
  <a className="text-primary text-fuchsia-500 transition-all duration-300 underline underline-offset-2 decoration-fuchsia-400 hover:decoration-2" {...props}>
    {children}
  </a>
);

const Blockquote: React.FC = ({ children }) => (
  <blockquote className="my-8 bg-gray-50 border border-l-4 border-solid border-light-primary px-8 pt-4 pb-2">
    {children}
  </blockquote>
);

const Code: React.FC<
  ClassAttributes<HTMLElement> &
    HTMLAttributes<HTMLElement> &
    ReactMarkdownProps & { inline?: boolean | undefined }
> = ({ children, inline, className }) => {
  if (inline) {
    return (
      <code
        className={classnames(
          "rounded px-1 text-fuchsia-500 border border-solid border-gray-200 bg-gray-50 text-sm-relative",
          className,
        )}
      >
        {children}
      </code>
    );
  }

  let language = "plaintext";
  if (className) {
    language = className.split("-")[1];
    if (language === "js") {
      language = "javascript";
    }
  }

  return (
    <SyntaxHighlighter style={tomorrow} language={language} PreTag="div">
      {String(children).replace(/\n$/, "")}
    </SyntaxHighlighter>
  );
};

const H1: React.FC = ({ children }) => {
  const id = slugify(children);

  return (
    <h1 className="text-4xl font-bold mb-6" id={id}>
      {children}
    </h1>
  );
};

const H2: React.FC = ({ children }) => {
  const id = slugify(children);

  return (
    <h2 className="text-2xl font-bold mb-4" id={id}>
      {children}
    </h2>
  );
};

const H3: React.FC = ({ children }) => {
  const id = slugify(children);

  return (
    <h3 className="text-xl font-bold mb-3" id={id}>
      {children}
    </h3>
  );
};

const Pre: React.FC = ({ children }) => (
  <pre className="-mx-10">{children}</pre>
);

const components = {
  blockquote: Blockquote,
  code: Code,
  h1: H1,
  h2: H2,
  h3: H3,
};

const MarkdownContainer: React.FC<{ children: string }> = ({ children }) => {
  return (
    <ReactMarkdown
      components={{ ...components, pre: Pre }}
      rehypePlugins={[rehypeRaw]}
    >
      {children}
    </ReactMarkdown>
  );
};

export { MarkdownContainer };
