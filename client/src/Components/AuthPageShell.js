import { motion } from "framer-motion";
import { APP_TAGLINE, AUTH } from "../utils/branding";

export default function AuthPageShell({ title, subtitle, children, onSubmit }) {
  const Wrapper = onSubmit ? motion.form : motion.div;
  const motionProps = {
    initial: { opacity: 0, y: -40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  return (
    <div className={AUTH.page}>
      <Wrapper
        {...motionProps}
        {...(onSubmit ? { onSubmit } : {})}
        className={AUTH.card}
      >
        <p className={AUTH.eyebrow}>{APP_TAGLINE}</p>
        <h2 className={`${AUTH.title} ${subtitle ? "mb-2" : "mb-6"}`}>{title}</h2>
        {subtitle && <p className={AUTH.subtitle}>{subtitle}</p>}
        {children}
      </Wrapper>
    </div>
  );
}
