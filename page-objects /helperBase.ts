import { Page } from "@playwright/test"

export class HelperBase {

    readonly page: Page

    constructor(page: Page) {
        this.page = page
    }

    /**
     * This is a helper function just for demonstrate 
     * @param timeInSeconds second
     */

    async waitForNumberofSeconds(timeInSeconds: number) {
        //await this.page.waitForTimeout(timeInSeconds * 1000)
    }

}