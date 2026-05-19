import { Resend } from "resend";

type SendEmailOptions = {
  to: string;
  subject: string;
  text?: string;
  react?: React.ReactNode;
};

function getEmailConfig() {
  const mode = process.env.EMAIL_MODE ?? "resend";
  const from = process.env.EMAIL_FROM;
  const devTo = process.env.EMAIL_DEV_TO;
  const resendApiKey = process.env.RESEND_API_KEY;

  if (mode !== "log" && mode !== "resend") {
    throw new Error(`Invalid EMAIL_MODE: ${mode}`);
  }

  if (!from) {
    throw new Error("EMAIL_FROM is not set");
  }

  if (mode === "resend" && !resendApiKey) {
    throw new Error("RESEND_API_KEY is not set");
  }

  return { mode, from, devTo, resendApiKey };
}

export async function sendEmail({ to, subject, text, react }: SendEmailOptions): Promise<void> {
  const config = getEmailConfig();
  const resolvedTo = config.devTo ?? to;

  if (config.mode === "log") {
    console.log("📧 Email skipped", {
      from: config.from,
      to: resolvedTo,
      originalTo: to,
      subject,
      text,
    });
    return;
  }

  const resend = new Resend(config.resendApiKey);
  const { error } = await resend.emails.send({
    from: config.from,
    to: resolvedTo,
    subject,
    text,
    react,
  });

  if (error) {
    throw new Error("Failed to send email", { cause: error });
  }
}
