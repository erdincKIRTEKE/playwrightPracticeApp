
import { Page, expect } from "@playwright/test"
import { HelperBase } from "./helperBase"

export class DatepickerPage extends HelperBase{
   
  
    constructor(page: Page) {
       super(page)
    }

    async selectCommonDatepickerDateFrommNow(dateFromNow:number){
    
        const calendarInputField = this.page.getByPlaceholder('Form Picker')
        await calendarInputField.click()

        const dateToAssert=await this.selectDateFromCalendar(dateFromNow)
            
        await expect(calendarInputField).toHaveValue(dateToAssert)

    }

    async selectRangeDatePickerDateFromToday(startDateFromToday:number, endDateFromToday:number){

        const calendarInputField = this.page.getByPlaceholder('Range Picker')
        await calendarInputField.click()

        const dateToAssertStart=await this.selectDateFromCalendar(startDateFromToday)
        const dateToAssertEnd=await this.selectDateFromCalendar(endDateFromToday)
        const dateToAssert=`${dateToAssertStart} - ${dateToAssertEnd}`

        await expect(calendarInputField).toHaveValue(dateToAssert)
        
    }

    private async selectDateFromCalendar(dateFromNow:number){
   
    
        // we have to make our test reliable every time so
        let date= new Date()
    
        // what if we set date despite of current month
        // we have to implement the logic to change month at calendar
        date.setDate(date.getDate()+dateFromNow)
    
    
        const expectedDate= date.getDate().toString()
        const expectedMonthShort= date.toLocaleString('En-US',{month:'short'})
        const expectedMonthLong=date.toLocaleDateString('En-US',{month:'long'})
        const expectedYear=date.getFullYear()
        const dateToAssert=`${expectedMonthShort} ${expectedDate}, ${expectedYear}`
       
            // what if we set date despite of current month
        // we have to implement the logic to change month at calendar
        let calendarMonthAndYear= await this.page.locator('nb-calendar-view-mode').textContent()
    
        const expectedMonthAndYear=` ${expectedMonthLong} ${expectedYear} `
       while(!calendarMonthAndYear.includes(expectedMonthAndYear)){
    
        await this.page.locator('nb-calendar-pageable-navigation [data-name="chevron-right"]' ).click()
        calendarMonthAndYear= await this.page.locator('nb-calendar-view-mode').textContent()
       }
        
        await this.page.locator('.day-cell.ng-star-inserted').getByText(expectedDate, { exact: true }).first().click()
        // if we do not use exact playwright will choose all texts starts with 1 like  11.. 12.. 13 14

        await this.waitForNumberofSeconds(2)
        return dateToAssert
    

    }

}