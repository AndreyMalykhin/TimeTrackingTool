import {Alert} from 'react-native';
import i18n from 'react-native-i18n';

export function addGenericError() {
    Alert.alert(i18n.t('common.error'), i18n.t('common.genericError'));
}
