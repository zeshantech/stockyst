import { atom, useAtom } from "jotai";

import { mails } from "@/app/mail/data";
import { IMail } from "@/types/mail";

type Config = {
  selected: IMail["id"] | null;
};

const configAtom = atom<Config>({
  selected: mails[0].id,
});

export function useMail() {
  return useAtom(configAtom);
}
