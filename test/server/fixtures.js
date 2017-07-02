import YAML from 'yamljs';

import { createState } from '../../server/game';

const defaultConfig = YAML.load('./server/themes/classic/config.yml');
const defaultProperties = YAML.load('./server/themes/classic/properties.yml');
const defaultMessages = YAML.load('./server/themes/classic/messages.yml');

export const GAME_FIXTURE = createState(
  defaultProperties,
  defaultConfig
);

export const CONFIG_FIXTURE = {
  ...defaultConfig,
  pollTimeout: 10
};

export const MESSAGES_FIXTURE = {
  ...defaultMessages
};
