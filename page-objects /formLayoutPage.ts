
import { Page } from "@playwright/test"
import { HelperBase } from "./helperBase"

export class FormLayoutsPage extends HelperBase {

    constructor(page: Page) {
        super(page)
    }

    /**
     * This method fill out the using the grid form with user details
     * @param email valid email for the test user
     * @param password valid password for the test user
     * @param optionText  Option 1 or Option 2
     */

    async submitUsingTheGridFormWithCridentialsAndSelectOption(email: string, password: string, optionText: string) {
        const usingTheGridForm = this.page.locator('nb-card', { hasText: "Using the Grid" })
        await usingTheGridForm.getByRole('textbox', { name: "Email" }).fill(email)
        await usingTheGridForm.getByRole('textbox', { name: "Password" }).fill(password)
        await usingTheGridForm.getByRole('radio', { name: optionText }).check({ force: true })
        await usingTheGridForm.getByRole('button').click()
    }
    /**
     * This method fill out the inline form with user details
     * @param name- should be first and last name 
     * @param email valid email for the test user
     * @param rememberMe -true or false if user session to be safed
     */
    async submitInlineFormWithNameEmailAndCheckBox(name: string, email: string, rememberMe: boolean) {
        const InlineForm = this.page.locator('nb-card', { hasText: "Inline Form" })
        await InlineForm.getByRole('textbox', { name: "Jane Doe" }).fill(name)
        await InlineForm.getByRole('textbox', { name: "Email" }).fill(email)
        if (rememberMe)
            await InlineForm.getByRole('checkbox').check({ force: true })
        await InlineForm.getByRole('button').click()
       
        await this.waitForNumberofSeconds(2)
    }
}