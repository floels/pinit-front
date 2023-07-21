import { useTranslations } from "next-intl";
import HomePageAuthenticatedClient from "./HomePageAuthenticatedClient";
import { PinSuggestionType } from "./PinSuggestion";
import { getTranslationsObject } from "@/lib/utils/i18n";
import { AccountType } from "@/app/[locale]/page";

type HomePageAuthenticatedServerProps = {
  accounts: AccountType[];
  initialPinSuggestions: PinSuggestionType[];
};

const HomePageAuthenticatedServer = ({
  accounts,
  initialPinSuggestions,
}: HomePageAuthenticatedServerProps) => {
  const translator = useTranslations("HomePageAuthenticated");
  const translations = getTranslationsObject(
    "HomePageAuthenticated",
    translator,
  );

  return (
    <HomePageAuthenticatedClient
      accounts={accounts}
      initialPinSuggestions={initialPinSuggestions}
      labels={translations}
    />
  );
};

export default HomePageAuthenticatedServer;
