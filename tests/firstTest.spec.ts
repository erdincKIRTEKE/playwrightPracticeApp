import { test, expect } from '@playwright/test';
test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.getByText('Forms').click()
  await page.getByText('Form Layouts').click()
})


test('Locator syntax rules', async ({ page }) => {

  // locator accepts two parameter first text second options object   page.locator('',{})

  //by Tag name x
  await page.locator('input').first().click() // we have lots of inputs in this page so how to find a specisific one (id ? )
  // note if we run test like await page.locator('input').click() it finds all off input elements and it causes strict mode violation.
  //if element is not unique we have to use await page.locator('input').first().click() or await page.locator('input').last().click()


  // by ID 
  page.locator('#inputEmail1')// this is how to find element by id  '#...'  

  // by Class value page.locator(.class value)
  page.locator('.shape-rectangle')

  // by attribute  page.locator('[attribute="attribute value"]')
  page.locator('[placeholder="Email"]')

  //by entire class value (full) page.locator('[class="class full value"]')
  page.locator('[class="input-full-width size-medium status-basic shape-rectangle nb-transition"]')

  // combine different selectors(note : do not use space)
  page.locator('input[placeholder="Email"].shape-rectangle')

  //combine attributes
  page.locator('input[placeholder="Email"][nbinput]')

  // by XPath NOT recommended easily break when the page changes
  page.locator('//*[@id="inputEmail1"]')

  // by partial text match
  page.locator(':text("Using")')

  // by exact text match 
  page.locator(':text-is("Using the Grid")')
})

test('User facing locators', async ({ page }) => {
  await page.getByRole('textbox', { name: "Email" }).first().click()
  await page.getByRole('button', { name: "Sign in" }).first().click()

  await page.getByLabel("Email").first().click()

  await page.getByPlaceholder("jane Doe").click()

  await page.getByText('Using the Grid').click()

  // await page.getByTitle('IoT Dashboard').click()

  // not user facing interaction you can add manually test id with an extra attribute 
  // data-testid="SignIn"   testid is reserved by playwright
  //await page.getByTestId("SignIn").click()

})

//Child Elements 
// we have nb-radio child elements in  parent element nb-card
// page.locator('parent child')
test('locating child elements', async ({ page }) => {
  await page.locator('nb-card nb-radio :text-is("Option 1")').click()
  // alternative way chaining locators one by one
  await page.locator('nb-card').locator('nb-radio').locator(':text-is("Option 2")').click()

  // combine user facing locator and regular locator
  await page.locator('nb-card').getByRole('button', { name: "Sign in" }).first().click()

  // selecting by index.it starts 0. (we have lots of nb-card) 
  //NOTE:avoid this type order of elements can be changed in web site
  // also first() and last()  have same stiuation 
  // always try to find more unique elements without using index or the order of the web elements
  await page.locator('nb-card').nth(3).getByRole('button').click()
})

// Parent elements 


test('locating parent elements', async ({ page }) => {

  // in the test site we have unique nb-card-headers. however elements which we want to test are in the sibling element :nb-card-body.

  // So we  have to choose the specific parent element by unique text or locator 
  //First approach :locator options
  // first argument is parent element ,second argument specifies our details for this search (filters the unique one.)

  await page.locator('nb-card', { hasText: "Using the Grid" }).getByRole('textbox', { name: "Email" }).click()

  //or  use  the unique class,id vs to filter by a regular locator 
  await page.locator('nb-card', { has: page.locator("#inputEmail1") }).getByRole('textbox', { name: "Email" }).click()

  //Second Approach
  // we can also use  dedicated filter method instead of second parameter
  // filter is a independent method for playwright.
  //  if you are using user facing locator such as getByRole does not have a filter like that. So first use independent filter method to find the parent element.
  await page.locator('nb-card').filter({ hasText: "Basic Form" }).getByRole('textbox', { name: "Email" }).click()
  await page.locator('nb-card').filter({ has: page.locator('.status-danger') }).getByRole('textbox', { name: "Password" }).click()

  // Also we can chain multiple filters one by one  by using this method
  // for example we first filter nb-cards by checkbox. and after the fist filter we filter by text to find specific parent element
  await page.locator('nb-card').filter({ has: page.locator('nb-checkbox') }).filter({ hasText: "Sign in" }).getByRole('textbox', { name: "Email" }).click()

  //  when you want to go one level up you can use xpath approach (xpath is suitable only in this situation)
  await page.locator(':text-is("Using the Grid")').locator('..').getByRole('textbox', { name: "Email" }).click()
})

// Reusing locators 
//Lets  make an automated test  fill the basic form and submit 

// test(' Reusing locators ', async({page})=>{
//   await page.locator('nb-card').filter({hasText: "Basic Form"}).getByRole('textbox',{name:"Email"}).fill('test@test.com')
//   await page.locator('nb-card').filter({hasText: "Basic Form"}).getByRole('textbox',{name:"Password"}).fill('Wellcome123')
//   await page.locator('nb-card').filter({hasText: "Basic Form"}).getByRole('button',{name:"Submit"}).click()
// })

// we used the same locator three times. In order to avoid this duplication we can refactor this code by extracting the locator into the constant(basicForm) and replacing the instances


test('Reusing locators', async ({ page }) => {
  const basicForm = page.locator('nb-card').filter({ hasText: "Basic Form" })

  // we can also make anaother level of abstaction by creating new constant using th existing constants
  const emailField = basicForm.getByRole('textbox', { name: "Email" })

  await emailField.fill('test@test.com')
  await basicForm.getByRole('textbox', { name: "Password" }).fill('Wellcome123')
  // await basicForm.getByRole('checkbox',{name:"Check me out"}).click() it did not work with getByrole. why? may be customcheckbox?
  await basicForm.locator('nb-checkbox').click()
  await basicForm.getByRole('button', { name: "Submit" }).click()

  //first Assertion
  await expect(emailField).toHaveValue('test@test.com')

})

// Extracting values 


test('extracting values', async ({ page }) => {
  //single test value
  const basicForm = page.locator('nb-card').filter({ hasText: "Basic Form" })
  const buttonText = await basicForm.locator('button').textContent()
  expect(buttonText).toEqual('Submit')

  // all text values 
 const allRadioButtonsLabels= await page.locator('nb-radio').allTextContents()
 expect(allRadioButtonsLabels).toContain('Option 1')

  // input value
  const emailField=basicForm.getByRole('textbox',{name:"Email"})
  await emailField.fill('test@test.com')

  // if you want to grab a value from web page which is not a text ,which is an input value
  // you have to use method inputValue()
  const emailInputValue= await emailField.inputValue()
  expect(emailInputValue).toEqual('test@test.com')
  

  // attributes
  const placeholderValue= emailField.getAttribute('placeholder')
  expect(placeholderValue).toEqual("Email")

})


//ASSERTIONS

test('assertions',async({page})=>{
  //General Assertions
  const value=5
  expect(value).toEqual(5)

  const basicFormButton = page.locator('nb-card').filter({ hasText: "Basic Form" }).locator('button')
 
  const text=await basicFormButton.textContent()
  expect(text).toEqual('Submit')

  //Locator Assertions 
  // instead of providing exact value inside of expect we will provide a locator
  // now we have more assertions available
  // locator assertions has own timeout. this type of assertion will wait up to five seconds. general assertions has not
  await expect(basicFormButton).toHaveText('Submit')

  //Soft Asssertion 
  // is a kind of assertion when the test can be continiue the execution even if the assertion failed 
  // soft assertion considered not a good practice but still if you want:
  //to continue running test faster certain validation is failed in order to catch other possible validations
  await expect.soft(basicFormButton).toHaveText('Submit')
  await basicFormButton.click()
})

