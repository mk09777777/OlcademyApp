const path = require('path');
const fs = require('fs');
const { withAndroidManifest, withDangerousMod, AndroidConfig } = require('@expo/config-plugins');

const APP_COMPONENT_FACTORY = 'androidx.core.app.CoreComponentFactory';

const ensureToolsNamespace = (manifest) => {
  if (!manifest.manifest.$) {
    manifest.manifest.$ = {};
  }
  if (!manifest.manifest.$['xmlns:tools']) {
    manifest.manifest.$['xmlns:tools'] = 'http://schemas.android.com/tools';
  }
};

const ensureAppComponentFactory = (application) => {
  if (!application.$) {
    application.$ = {};
  }
  application.$['android:appComponentFactory'] = APP_COMPONENT_FACTORY;

  const replaceValue = application.$['tools:replace'];
  const replaceEntries = (replaceValue ? replaceValue.split(',') : [])
    .map((entry) => entry.trim())
    .filter(Boolean);

  if (!replaceEntries.includes('android:appComponentFactory')) {
    replaceEntries.push('android:appComponentFactory');
  }

  application.$['tools:replace'] = replaceEntries.join(',');
};

const updateManifest = (manifest) => {
  ensureToolsNamespace(manifest);
  const application = AndroidConfig.Manifest.getMainApplication(manifest);
  if (application) {
    ensureAppComponentFactory(application);
  }
};

const withAppComponentFactory = (config) => {
  const withMainManifest = withAndroidManifest(config, (config) => {
    updateManifest(config.modResults);
    return config;
  });

  return withDangerousMod(withMainManifest, [
    'android',
    async (config) => {
      const debugManifestPath = path.join(
        config.modRequest.platformProjectRoot,
        'app',
        'src',
        'debug',
        'AndroidManifest.xml'
      );

      if (!fs.existsSync(debugManifestPath)) {
        return config;
      }

      const debugManifest = await AndroidConfig.Manifest.readAndroidManifestAsync(
        debugManifestPath
      );
      updateManifest(debugManifest);
      await AndroidConfig.Manifest.writeAndroidManifestAsync(
        debugManifestPath,
        debugManifest
      );

      return config;
    },
  ]);
};

module.exports = withAppComponentFactory;
