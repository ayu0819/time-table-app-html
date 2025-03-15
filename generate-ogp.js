const puppeteer = require('puppeteer');
const path = require('path');

async function generateOGP() {
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    try {
        const page = await browser.newPage();
        
        // Set viewport to match OGP image size
        await page.setViewport({
            width: 1200,
            height: 630,
            deviceScaleFactor: 2
        });
        
        // Read and inject the CSS directly
        await page.setContent(`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
                <style>
                    body { 
                        margin: 0; 
                        padding: 20px; 
                        background: #ffffff; 
                        font-family: Arial, sans-serif;
                    }
                    .container { 
                        padding: 40px;
                        width: 1200px;
                        height: 630px;
                        background: #fef6f6;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                    }
                    .title { 
                        font-size: 48px; 
                        margin-bottom: 40px;
                        color: #4a4a4a;
                        text-align: center;
                    }
                    .timetable { 
                        width: 800px;
                        display: flex;
                        flex-direction: column;
                        gap: 15px;
                    }
                    .timetable-item {
                        display: flex;
                        align-items: center;
                        padding: 15px 20px;
                        border-radius: 12px;
                        margin-bottom: 15px;
                    }
                    .time {
                        font-weight: bold;
                        min-width: 140px;
                    }
                    .status {
                        margin-left: 10px;
                        display: flex;
                        align-items: center;
                        gap: 8px;
                    }
                    .timetable-item.present {
                        background-color: #a8e6cf;
                    }
                    .timetable-item.absent {
                        background-color: #ffd3b6;
                    }
                    .timetable-item.present {
                        background-color: #ffaaa5;
                    }
                    .timetable-item.leaving {
                        background-color: #ffbfbc;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1 class="title">Creative Event Schedule</h1>
                    <div class="timetable">
                        <div class="timetable-item absent">
                            <span class="time">10:00 - 10:30</span>
                            <span class="status"><i class="fas fa-times-circle"></i> 不在</span>
                        </div>
                        <div class="timetable-item present">
                            <span class="time">10:30 - 12:00</span>
                            <span class="status"><i class="fas fa-check-circle"></i> 在籍</span>
                        </div>
                        <div class="timetable-item absent">
                            <span class="time">12:00 - 13:00</span>
                            <span class="status"><i class="fas fa-times-circle"></i> 不在</span>
                        </div>
                        <div class="timetable-item present">
                            <span class="time">13:00 - 13:30</span>
                            <span class="status"><i class="fas fa-user-plus"></i> 在籍</span>
                        </div>
                        <div class="timetable-item leaving">
                            <span class="time">13:30</span>
                            <span class="status"><i class="fas fa-sign-out-alt"></i> 撤退準備</span>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `);
        
        // Wait for fonts to load
        await page.waitForFunction(() => document.fonts.ready);
        // Wait for Font Awesome to load
        await page.waitForFunction(() => {
            const icons = document.querySelectorAll('.fas');
            return Array.from(icons).every(icon => {
                const style = window.getComputedStyle(icon);
                return style.fontFamily.includes('Font');
            });
        });
        
        // Additional delay to ensure everything is rendered
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Take screenshot
        await page.screenshot({
            path: 'timetable-og.png',
            type: 'png'
        });
        
        console.log('OGP image generated successfully!');
    } catch (error) {
        console.error('Error during page processing:', error);
        throw error;
    } finally {
        await browser.close();
    }
}

generateOGP().catch(error => {
    console.error('Script error:', error);
    process.exit(1);
});