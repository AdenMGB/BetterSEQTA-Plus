import localforage from 'localforage';
import { CustomTheme } from '../../../interface/types/CustomThemes';
import { applyTheme } from './applyTheme';
import { settingsState } from '../../utils/listeners/SettingsState';


export const enableCurrentTheme = async () => {
  if (settingsState.selectedTheme) {
    const theme = await localforage.getItem(settingsState.selectedTheme) as CustomTheme;
    if (theme) {
      await applyTheme(theme, true);
    }
  }
};
