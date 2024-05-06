import { defineConfig, devices, firefox } from '@playwright/test';
import type { TestOptions } from './test-options';

require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig<TestOptions>({
  timeout: 40000,
  globalTimeout: 60000,
  expect: {
    timeout: 2000,
  },

  retries: 1,
  reporter: [
    ['json',{outputFile:'test-results/jsonReport.json'}],
    ['junit',{outputFile:'test-results/junitReport.junit'}],
    //['allure-playwright']
    ['html']
],//'html', 'json','list'
  
  use: {
    globalsQaURL: 'https://www.globalsqa.com/demo-site/draganddrop/',
    baseURL: process.env.DEV === '1' ? 'http://localhost:4201/'
      : process.env.STAGING === '1' ? 'http://localhost:4202/'
        : 'http://localhost:4200/',
    trace: 'on-first-retry',
    navigationTimeout: 5000,
    video: {
      mode: 'off',
      size: { width: 1920, height: 1080 }
    }
  },

  projects: [
    {
      name: 'dev',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:4201/'
      },
    },
    {
      name: 'staging',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:4202/'
      },

    },

    {
      name: 'chromium',
    },

    {
      name: 'firefox',
      use: {
        browserName: 'firefox'
      },
    },
    {
      name: 'mobile',
      testMatch:'testMobile.spec.ts',
      use: {
        ...devices['iPhone 14 Pro Max'],
        // viewport:{width:400, height:800}
      },
    },


  ],
});
