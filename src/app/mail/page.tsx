// import { IMail } from "@/components/mail/mail-sidebar";
import { cookies } from "next/headers";
import Image from "next/image";
import { mails } from "./data";
import { Mail } from "@/components/(private)/mail/mail";

export default async function MailPage() {
  const layout = (await cookies()).get("react-resizable-panels:layout:mail");
  const collapsed = (await cookies()).get("react-resizable-panels:collapsed");

  const defaultLayout = layout ? JSON.parse(layout.value) : undefined;
  const defaultCollapsed = collapsed ? JSON.parse(collapsed.value) : undefined;

  return (
    <>
      <div className="md:hidden">
        <Image
          src="/examples/mail-dark.png"
          width={1280}
          height={727}
          alt="IMail"
          className="hidden dark:block"
        />
        <Image
          src="/examples/mail-light.png"
          width={1280}
          height={727}
          alt="IMail"
          className="block dark:hidden"
        />
      </div>
      <div className="hidden flex-col md:flex">
        <Mail
          mails={mails}
          defaultLayout={defaultLayout}
          defaultCollapsed={defaultCollapsed}
          navCollapsedSize={4}
        />
      </div>
    </>
  );
}
