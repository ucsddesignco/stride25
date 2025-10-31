import type { ReactElement } from "react";
import "./Button.scss";
import { Link } from "react-router";

interface ButtonProps {
  text: string;
  className?: string;
  onClick?: () => void;
  link?: string;
  icon?: ReactElement;
  disabled?: boolean;
}

const Button = ({
  text,
  className,
  onClick,
  link,
  icon,
  disabled,
}: ButtonProps) => {
  const isExternalLink = link?.startsWith("http");
  return (
    <>
      {link ? (
        <Link
          to={link}
          target={isExternalLink ? "_blank" : "_self"}
          className={`price-button ${className}`}
        >
          {text}
        </Link>
      ) : (
        <button
          onClick={onClick}
          className={`price-button ${className}`}
          disabled={disabled}
        >
          <span>{text}</span>
          {icon && icon}
        </button>
      )}
    </>
  );
};

export default Button;
