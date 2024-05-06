import { test } from "../test-options"
import { PageManager } from "../page-objects /pageManager"
import {faker} from "@faker-js/faker"


// test.beforeEach(async ({ page }) => {
//     await page.goto('/')
// })

test('parametrized methods', async ({ pageManager/* page,formLayoutsPage*/ }) => {
    // const pm= new PageManager(page)
    const randomFullName=faker.person.fullName()
    const randomEmail=`${randomFullName.replace(' ','')}${faker.number.int(1000)}@test.com`
    //await pm.navigateTo().formLayoutsPage()
    // await pm.onFormLayoutsPage().submitUsingTheGridFormWithCridentialsAndSelectOption(process.env.USERNAME, process.env.PASSWORD, 'Option 1')
    // await pm.onFormLayoutsPage().submitInlineFormWithNameEmailAndCheckBox(randomFullName,randomEmail,true)
    await pageManager.onFormLayoutsPage().submitUsingTheGridFormWithCridentialsAndSelectOption(process.env.USERNAME, process.env.PASSWORD, 'Option 1')
    await pageManager.onFormLayoutsPage().submitInlineFormWithNameEmailAndCheckBox(randomFullName,randomEmail,true)
})

