export const hurrianAnnotationConfigKey = 'hurrianAnnotationPreferences';

export interface HurrianAnnotationConfig {
  highlightUnannotatedFragmentaryForms: boolean;
}

export const defaultHurrianAnnotationConfig: HurrianAnnotationConfig = {
  highlightUnannotatedFragmentaryForms: false,
};

export const hurrianAnnotationConfigKeys = Object.keys(defaultHurrianAnnotationConfig);
