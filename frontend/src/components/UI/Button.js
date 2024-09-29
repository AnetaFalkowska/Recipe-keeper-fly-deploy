import classes from "./Button.module.css"

export default function Button({ children, Container="button", textOnly, className, ...props }) {
 
  const baseClass = textOnly ? classes["text-button"] : classes["button"];
  const combinedClass = `${baseClass} ${className || ''}`;

  return <Container {...props} className={combinedClass}>{children}</Container>;
}
