import { defineConfig, devices, firefox } from '@playwright/test';
import type { TestOptions } from './test-options';

require('dotenv').config();


export default defineConfig<TestOptions>({

  retries: 1,
  reporter: 'html',
  
  use: {
    
    globalsQaURL: 'https://www.globalsqa.com/demo-site/draganddrop/',
    baseURL:'http://localhost:4200/',
  },

  projects: [
    {
      name: 'chromium',
    }
  ],
});
