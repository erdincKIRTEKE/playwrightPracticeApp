
import { Page, Locator } from "@playwright/test"
import { HelperBase } from "./helperBase"

export class NavigationPage extends HelperBase {


    // readonly formLayoutsMenuItem: Locator
    // readonly datePickerMenuItem: Locator
    // readonly smartTableMenuItem: Locator
    // readonly toastrMenuItem: Locator
    // readonly tooltipMenuItem: Locator


    constructor(page: Page) {

        super(page)
        // this.formLayoutsMenuItem=page.getByText('Form Layouts')
        // this.datePickerMenuItem=page.getByText('Datepicker')
        // this.smartTableMenuItem=page.getByText('Smart Table')
        // this.toastrMenuItem=page.getByText('Toastr')
        // this.tooltipMenuItem=page.getByText('Tooltip')

    }

    async formLayoutsPage() {
        await this.selectGroupMenuItem('Forms')
        await this.page.getByText('Form Layouts').click()
        // await this.formLayoutsMenuItem.click()

        await this.waitForNumberofSeconds(2)
    }

    async datePickerPage() {
        await this.selectGroupMenuItem('Forms')
        await this.page.waitForTimeout(1000)
     await this.page.getByText('Datepicker').click()
        // await this.datePickerMenuItem.click()

    }

    async smartTablePage() {
        await this.selectGroupMenuItem('Tables & Data')
        await this.page.getByText('Smart Table').click()
        this.waitForNumberofSeconds(2)
        // await this.smartTableMenuItem.click()
    }

    async toastrPage() {
        await this.selectGroupMenuItem('Modal & Overlays')
        // await this.toastrMenuItem.click()
        await this.page.getByText('Toastr').click()

    }

    async tooltipPage() {
        await this.selectGroupMenuItem('Modal & Overlays')
       // await this.tooltipMenuItem.click()
       await this.page.getByText('Tooltip').click()
    }

    private async selectGroupMenuItem(groupItemTitle: string) {
        const groupMenuItem = this.page.getByTitle(groupItemTitle)
        const expandedState = await groupMenuItem.getAttribute('aria-expanded')
        if (expandedState === "false")
            await groupMenuItem.click()
    }
}