import { test, expect } from '@playwright/test'


//UI COMPONENTS

//test.describe.configure({mode:'parallel'})


test.beforeEach(async ({ page }) => {
    await page.goto('/')

})


test.describe('Form Layouts page @block', () => {
    test.describe.configure({retries:0})
    test.describe.configure({mode:'serial'})
    test.beforeEach(async ({ page }) => {
        await page.getByText('Forms').click()
        await page.getByText('Form Layouts').click()
    })
    //input fields
    test('input fields', async ({ page },testInfo) => {
        if(testInfo.retry){
            //do something
        }
        const usingTheGridEmailInput = page.locator('nb-card', { hasText: "Using the Grid" }).getByRole('textbox', { name: "Email" })

        await usingTheGridEmailInput.fill('test@test.com') // you can not chain clear after fill
        await usingTheGridEmailInput.clear()
        await usingTheGridEmailInput.pressSequentially('test2@test.com', {/* delay: 500*/ })  // simulate key strokes by pressSequentially and use object lije {delay:300}

        // generic assertion
        const inputValue = await usingTheGridEmailInput.inputValue()
        expect(inputValue).toEqual('test2@test.com')

        //locator assertion

        await expect(usingTheGridEmailInput).toHaveValue('test2@test.com') // toHaveText does not work with inputs

    })
    // Radio Buttons
    test.only('radio buttons', async ({ page }) => {

        const usingTheGridForm = page.locator('nb-card', { hasText: "Using the Grid" })

        //there are two opitons  getByLabel or getByRole

        await usingTheGridForm.getByLabel('Option 2').check({ force: true }) // for radio button we have to use check instead of click
        //this check wont work  without {force:true} object because this input have 'visually-hidden' class

        

        //assertions
        const radioStatus = await usingTheGridForm.getByRole('radio', { name: "Option 1" }).isChecked()

        //visual testing
        await expect(usingTheGridForm).toHaveScreenshot()


        // expect(radioStatus).toBeTruthy() // generic assertion
        // await expect(usingTheGridForm.getByRole('radio', { name: "Option 1" })).toBeChecked()// locator assertion



        // await usingTheGridForm.getByRole('radio', { name: "Option 2" }).check({ force: true })
        // expect(await usingTheGridForm.getByRole('radio', { name: "Option 1" }).isChecked()).toBeFalsy()
        // expect(await usingTheGridForm.getByRole('radio', { name: "Option 2" }).isChecked()).toBeTruthy()


    })

})

test('checkboxes', async ({ page }) => {
    await page.getByText('Modal & Overlays').click()
    await page.getByText('Toastr').click()

    await page.getByRole('checkbox', { name: "Hide on click" }).check({ force: true })//we use force because checkbox is hidden 
    //we can use click() too.
    //but check() method will check the status of checkbox. if the checkbox already checked it will not unselect this checkbox. it will remain selected. 
    //click() command is hust performing click an does not validate the status
    // also we can uncheck with uncheck() method

    await page.getByRole('checkbox', { name: "Prevent arising of duplicate toast" }).uncheck({ force: true })

    // scenerio all checkboxes : we need to take the locator of allcheckboxes and loop trough those checkboxes and check them or uncheck them
    const allBoxes = page.getByRole('checkbox') // we took locator 
    // this constant is not an array. in order to loop we have to convert an array by all() method. 
    //all() method turns a promise so we have to use await before

    for (const box of await allBoxes.all()) {
        await box.uncheck({ force: true })
        expect(await box.isChecked()).toBeFalsy()
    }

})


// Lists and Dropdowns

//list islocated some kind of overlay container and it is located in a completely seperate section in the website.
//even if it is visually presented like they are located next to each other
// when you are locationg the selector of the list and the list itself , very often it can be completely different locators 
// in the test site list selector(opens the list) is in the parent element   ngx-header  child elemet nb-select


test('lists and dropdowns', async ({ page }) => {
    const dropdownMenu = page.locator('ngx-header nb-select')
    await dropdownMenu.click()

    // how to select items from list? recommended way is using getbyRole
    page.getByRole('list') // list can by used when the list has a <ul> tag. list represent parent container for the entire list
    page.getByRole('listitem')// st can by used when the list has a <li> tag
    //listitem will get you all the list items from the list and will represents the array of or list of the list elements

    //When we look put our site  unfortunately  we don’t have <li> tag .we have to use a different	library (locator)	for nb-options 
    //  const optionList =page.getByRole('list').locator('nb-option')

    // bu we choose a more compact approach

    const optionList = page.locator('nb-option-list nb-option')

    // lets make an assertion that our list has all list items in the list we expect by locator assertion

    await expect(optionList).toHaveText(["Light", "Dark", "Cosmic", "Corporate"])


    // assertion for color of  header
    await optionList.filter({ hasText: "Cosmic" }).click()
    const header = page.locator('nb-layout-header')

    await expect(header).toHaveCSS('background-color', 'rgb(50, 50, 89)')

    // assertion for all possible colors 
    const colors = {
        "Light": "rgb(255, 255, 255)",
        "Dark": "rgb(34, 43, 69)",
        "Cosmic": "rgb(50, 50, 89)",
        "Corporate": "rgb(255, 255, 255)"
    }

    await dropdownMenu.click()
    for (const color in colors) {
        await optionList.filter({ hasText: color }).click()
        await expect(header).toHaveCSS('background-color', colors[color])
        if (color != "Corporote")
            await dropdownMenu.click()
    }



})


// TOOLTIPS:  you can not find where the tooltip is with directly using inspect . 
// video offers a solution go to sources tab hover over mouse freeze(paused in debugger) the browser by F8 in windows command backslash in mac. worked in chrome Fn F8
//an then go to elements .go to div highligted and go deeper you will see <nb-tooltip> tag 

test('tooltips', async ({ page }) => {
    await page.getByText('Modal & Overlays').click()
    await page.getByText('Tooltip').click()
    const tooltipCard = page.locator('nb-card', { hasText: "Tooltip Placements" })
    await tooltipCard.getByRole('button', { name: "Top" }).hover()

    // page.getByRole('tooltip')// if you have arole tooltip created it works
    const tooltipText = await page.locator('nb-tooltip').textContent()

    //general assertion
    expect(tooltipText).toEqual('This is a tooltip')

    //locator assertion
    await expect(page.locator('nb-tooltip')).toHaveText('This is a tooltip')
})

// DIALOG BOXES 
// there are two types of dialog boxes :
//web dialog boxes: automating this type of dialoog boxes is straight forward Because they are part of the DOM. 
// browse messages :you can not click on inspect element. automating this types are different :

test('dialog boxes', async ({ page }) => {
    await page.getByText('Tables & Data').click()
    await page.getByText('Smart Table').click()

    // playwright auto cancel dialog box after opening.however we want to delete to row.
    //we need to overcome this by accepting dialog box.
    // we have to create a listener 
    page.on('dialog', dialog => {
        expect(dialog.message()).toEqual('Are you sure you want to delete?')
        dialog.accept()
    })


    await page.getByRole('table').locator('tr', { hasText: "mdo@gmail.com" }).locator('.nb-trash').click()
    await expect(page.locator('table tr').first()).not.toHaveText('mdo@gmail.com')

})

test('web dialogboxes', async ({ page }) => {
    await page.getByText('Modal & Overlays').click()
    await page.getByText('Dialog').click()

    const dialogButtonCard = page.locator('nb-card', { hasText: "Open Dialog" })

    await dialogButtonCard.getByRole('button', { name: 'Open Dialog with component' }).click()

    const dialogCard = page.locator('nb-card', { hasText: "This is a title passed to the dialog component" })
    await dialogCard.getByRole('button', { name: "Dismiss Dialog" }).click({ delay: 2000 })
})


// WEB TABlES
/*

the tricky part of workin with web tables is identifying the unique enough element to pick up the certain cell from the table or  the certain row
or how to select the entire colum ? 
<table> 
   <thead><thead>
   <tbody>
      <tr>
         <td>...<td> (table down)
      <tr>
   <tbody>
<table>

*/

test('web tables', async ({ page }) => {
    await page.getByText('Tables & Data').click()
    await page.getByText('Smart Table').click()

    // how to get row by any text in this row?

    // last lesson we selected table first by getByRole and then used locator for row
    // page.getByRole('table').locator('tr', { hasText: "mdo@gmail.com" })
    // but using getByRole('row') is recommended. and then provide the text value which is unique for this particular row.
    const targetRow = page.getByRole('row', { name: "twitter@outlook.com" })
    await targetRow.locator('.nb-edit').click()
    // when we clicked the pencil  the DOM is changed. the row now shows input fields in edit mode. 
    // if we inspect the row "twitter@outlook.com" text does not exist anymore. it is a property(not text) now.
    // in order to {name:...} option work with text , targetRow will not work after clicking pencil (in edit mode).
    //we can not reuse targetRow.so we have to build a new locator. 

    await page.locator('input-editor').getByPlaceholder('Age').clear() //first we clear
    await page.locator('input-editor').getByPlaceholder('Age').fill('40')

    //also this code is  worked 
    //await page.locator('input-editor').getByRole('textbox',{name:"age"}).fill("19")

    await page.locator('.nb-checkmark').click()

    // how we select the row by id when id and other rows cell value is same? 
    //how we can tell playwright to find the row only by the spesific column in the table? 

    // get the row based on the value in the spesific column

    // first go to second page
    await page.locator('.ng2-smart-pagination-nav').getByText('2').click()
    //these also work
    //await page.locator('ng2-smart-table-pager').getByText('2').click()
    //await page.getByRole('link', { name: '2' }).click();

    //const targetRowById=page.getByRole('row',{name:"11"}) this will not work because there are rows more than one.
    // so we have to filter column index by nth(1)

    const targetRowById = page.getByRole('row', { name: "11" }).filter({ has: page.locator('td').nth(1).getByText('11') })
    //this expression will return us a row that has text  11 in the first column
    await targetRowById.locator('.nb-edit').click()



    await page.locator('input-editor').getByPlaceholder('E-mail').clear() //first we clear
    await page.locator('input-editor').getByPlaceholder('E-mail').fill('test@test.com')
    await page.locator('.nb-checkmark').click()

    await expect(targetRowById.locator('td').nth(5)).toHaveText('test@test.com')

    //test filter of the table
    // how to loop through the table rows and a make a validation from the rows?
    // in the test side we have feature  in the table search certain values.
    //for ex. search by age of 20, output 5 row

    // scenerio test filter of table 
    const ages = ['20', '30', '40', '200']

    for (let age of ages) {
        await page.locator('input-filter').getByPlaceholder('Age').clear()
        await page.locator('input-filter').getByPlaceholder('Age').fill(age) // we search each of the age.

        await page.waitForTimeout(500)
        const ageRows = page.locator('tbody tr')// we find all rows as a result of search.


        // usibg all() will create an array for us of the web lement
        for (let row of await ageRows.all()) {
            const cellValue = await row.locator('td').last().textContent() // read the last table down for each of row

            if (age == '200') {
                expect(await page.getByRole('table').textContent()).toContain('No data found')

            } else {
                expect(cellValue).toEqual(age)// validate did not work. Because playwright is running faster than the the layout. 
                //so we add  harcode(since we can not add dynamic waiting ) wait at 276 after fill to read values that we expected.
                // after adding wait for test failed because there is no row 200 years old .no data found
            }

        }


    }



})


test('datepicker', async ({ page }) => {

    await page.getByText('Forms').click()
    await page.getByText('Datepicker').click()

    const calendarInputField = page.getByPlaceholder('Form Picker')
    await calendarInputField.click()

    // we have to make our test reliable every time so
    let date= new Date()

    // what if we set date despite of current month
    // we have to implement the logic to change month at calendar
    date.setDate(date.getDate()+210)


    const expectedDate= date.getDate().toString()
    const expectedMonthShort= date.toLocaleString('En-US',{month:'short'})
    const expectedMonthLong=date.toLocaleDateString('En-US',{month:'long'})
    const expectedYear=date.getFullYear()
    const dateToAssert=`${expectedMonthShort} ${expectedDate}, ${expectedYear}`
   
        // what if we set date despite of current month
    // we have to implement the logic to change month at calendar
    let calendarMonthAndYear= await page.locator('nb-calendar-view-mode').textContent()

    const expectedMonthAndYear=` ${expectedMonthLong} ${expectedYear} `
   while(!calendarMonthAndYear.includes(expectedMonthAndYear)){

    await page.locator('nb-calendar-pageable-navigation [data-name="chevron-right"]' ).click()
    calendarMonthAndYear= await page.locator('nb-calendar-view-mode').textContent()
   }
    
    await page.locator('[class="day-cell ng-star-inserted"]').getByText(expectedDate, { exact: true }).click()
    // if we do not use exact playwright will choose all texts starts with 1 like  11.. 12.. 13 14

    await expect(calendarInputField).toHaveValue(dateToAssert)


})


test('sliders',async({page})=>{
    
        //first approach : shortcut
    //const tempGauge= page.locator('[tabtitle="Temperature"] ngx-temperature-dragger circle')

    // await tempGauge.evaluate(node=>{
    //     node.setAttribute('cx','232.630')
    //     node.setAttribute('cy','232.630')
    // })

    // await tempGauge.click()


    //second approach simulate the actual mouse movement

    const tempBox= page.locator('[tabtitle="Temperature"] ngx-temperature-dragger')
    //we have to know this entire box is displayed 
    await tempBox.scrollIntoViewIfNeeded()

    // we need to define a bounding box (playwright creates  coordinates which starts  on the top left corner x=0 y=0)
   const box= await tempBox.boundingBox()

   const x= box.x+ box.width/2
   const y= box.y +box.width/2

   //this simulates a click of the left key button on the mouse on these coordinates
   await page.mouse.move(x,y)
  await page.mouse.down()
  // simulate mouse move to right
  await page.mouse.move(x+100,y)
   // simulate mouse move to down
  await page.mouse.move(x+100,y+100)
  // release mouse button
  await page.mouse.up()
 await expect(tempBox).toContainText('30')
   
}) 