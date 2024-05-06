
// AUTO WAITING

// playwright jas automatic waiting mechanism for certain conditions .
//default timeout max 30 seconds (can be configured)
//check the list https://playwright.dev/docs/actionability



import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page,/*testInfo*/ }) => {
    await page.goto(process.env.URL)
    await page.getByText('Button Triggering AJAX Request').click()
   // testInfo.setTimeout(testInfo.timeout+2000)
})

// test first clicks the button Triggering AJAX.. and waiting the successButton max 30 seconds, successButton appears in 15 seconds
// we can reduce the timeout 10 sec in playwright config.ts by adding timeout:10000 . but this adjustment caused the test to fail."


test('auto waiting', async ({ page }) => {
    const successButton = page.locator('.bg-success')

    //    await successButton.click()

    // this code pass the test because textContent supports autowaiting 
    // const text= await successButton.textContent()

    // this not pass in order to allTextContent does not have autowaiting feature
    // const text=await successButton.allTextContents()
    // expect(text).toEqual('Data loaded with AJAX get request.')

    // we can create additionaş wait for the methods like this
    //which do not have implemented auto wait logic 

    // await successButton.waitFor({state: "attached"})
    // const text=await successButton.allTextContents()
    // expect(text).toContain('Data loaded with AJAX get request.')


    // this test failed without declaring timeout over 15 sec because toHaveText has default 5 sec auto waiting.
    await expect(successButton).toHaveText('Data loaded with AJAX get request.', { timeout: 20000 })


})

test('alternative waits', async ({ page }) => {


    const successButton = page.locator('.bg-success')

    // wait for element

    // await page.waitForSelector('bg-success')

    // wait for particular response 
    //for ex. network request status 304

    // await page.waitForResponse('http://www.uitestingplayground.com/ajaxdata')

   //wait for network calls to be completed(Not recommended)
   // some of API calls is stuck your test will stuck too
   
       await page.waitForLoadState('networkidle')

    const text = await successButton.allTextContents()
    expect(text).toContain('Data loaded with AJAX get request.')

   
})

// TIMEOUTS

// onfiguring time outs 

// Playwright.congfig.ts

  //timeout:10000,
  //globalTimeout:60000,

// assertions for modify time out (default 5s)

/*expect:{
    timeout:20000
} */

// Use:{ …..

// actionTimeout:5000,
// navigationTimeout:5000,

// ……
// }





test.skip('timeouts',async({page})=>{
   // you can override the test timeout 
   test.setTimeout(17000)

   //you can increase the default timeout 3 times by 'slow'


   //test.slow()

    const successButton = page.locator('.bg-success')
 
  //  you can allways override the timeout for the aciton by providing the timeout inside of the command
    await successButton.click({timeout:16000})
})


// assertions for modify   expect time out (default 5s)
/* 
I. add playwright config.ts this object

expect:{
    timeout:20000
} 

II. add new object like this {timeout:20000}  as a second parameter 


*/



