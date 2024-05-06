import { test } from "@playwright/test"
import { PageManager } from "../page-objects /pageManager"
import {faker} from "@faker-js/faker"


test.beforeEach(async ({ page }) => {
    await page.goto('/')

})

test('navigate to form page @smoke @regression', async ({ page }) => {
    const pm= new PageManager(page)
    await pm.navigateTo().formLayoutsPage()
    await pm.navigateTo().datePickerPage()
    await pm.navigateTo().smartTablePage()
    await pm.navigateTo().toastrPage()
    await pm.navigateTo().tooltipPage()
})

test('parametrized methods @smoke', async ({ page }) => {
    const pm= new PageManager(page)
    const randomFullName=faker.person.fullName()
    const randomEmail=`${randomFullName.replace(' ','')}${faker.number.int(1000)}@test.com`
    await pm.navigateTo().formLayoutsPage()
    await pm.onFormLayoutsPage().submitUsingTheGridFormWithCridentialsAndSelectOption(process.env.USERNAME, process.env.PASSWORD, 'Option 1')
    await page.screenshot({path:'screenshots/formLayoutsPAge.png'})
    const buffer= await page.screenshot()
    console.log(buffer.toString('base64'))
    await pm.onFormLayoutsPage().submitInlineFormWithNameEmailAndCheckBox(randomFullName,randomEmail,true)
    await page.locator('nb-card',{hasText:"Inline form"}).screenshot({path:'screenshots/inlineForm.png'})
    await pm.navigateTo().datePickerPage()
    await pm.onDatePickerPage().selectCommonDatepickerDateFrommNow(10)
    await pm.onDatePickerPage().selectRangeDatePickerDateFromToday(10,20)

})

