import { View, Text } from 'react-native'
import React from 'react'
import { useTranslation } from "react-i18next";

const AboutScreen  = () => {
  const { t } = useTranslation();
  return (
    <View>
      <Text>{t("tabs.about")}</Text>
    </View>
  )
}

export default AboutScreen
