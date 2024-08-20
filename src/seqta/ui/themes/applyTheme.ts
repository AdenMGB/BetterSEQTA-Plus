import { CustomImage, CustomTheme } from '../../../interface/types/CustomThemes';
import { settingsState } from '../../utils/listeners/SettingsState';
import { applyCustomCSS } from './Themes';


export const applyTheme = async (theme: CustomTheme) => {
  let CustomCSS = '';
  let CustomImages: CustomImage[] = [];

  if (theme?.CustomCSS) CustomCSS = theme.CustomCSS;
  if (theme?.CustomImages) CustomImages = theme.CustomImages;
  if (theme?.forceDark) {
    settingsState.originalDarkMode = settingsState.DarkMode
    settingsState.DarkMode = theme.forceDark
  }

  // Apply custom CSS
  applyCustomCSS(CustomCSS);

  // Apply custom images
  CustomImages.forEach((image) => {
    const imageUrl = URL.createObjectURL(image.blob);
    document.documentElement.style.setProperty('--' + image.variableName, `url(${imageUrl})`);
  });
};
