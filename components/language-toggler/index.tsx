import { Box, Center, Group, SegmentedControl } from "@mantine/core";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import React from "react";

export function LanguageToggler(): JSX.Element {
  const { locale, locales, route, push, asPath } = useRouter();
  const commonTL = useTranslation("common");

  const data = locales?.map((otherLocale) => ({
    value: otherLocale,
    label: (
      <Center>
        <Box mx={10}>{commonTL.t(`languages.${otherLocale}`)}</Box>
      </Center>
    ),
  }));

  return (
    <Group position="center" mx="auto">
      <SegmentedControl
        value={locale}
        onChange={(val) => push(route, asPath, { locale: val })}
        data={
          data ?? [
            {
              value: "en",
              label: (
                <Center>
                  <Box mx={10}>{commonTL.t("languages.en")}</Box>
                </Center>
              ),
            },
          ]
        }
      />
    </Group>
  );
}
