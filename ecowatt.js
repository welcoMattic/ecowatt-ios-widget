let data = await loadData()
let colors = {1: '#02f0c6', 2: '#f2790f', 3: '#e63946'}
if (config.runsInWidget) {
    if (config.widgetFamily === "medium") {
        let widget = await createFourDaysWidget(data)
        await widget.presentMedium()
    } else if (config.widgetFamily === "large") {
        let widget = await createFourDaysWidget(data)
        await widget.presentLarge()
    } else {
        let widget = await createOneDayWidget(data[0])
        await widget.presentSmall()
    }
} else {
    let table = createTable(data)
    await table.present()
}
async function createOneDayWidget(dayData) {
    let widget = new ListWidget()
    widget.backgroundColor = new Color(colors[dayData.dvalue])
    let row1 = widget.addStack()
    row1.setPadding(8, 0, 8, 0)
    row1.layoutVertically()
    row1.centerAlignContent()
    let img = await loadEcoWattLogo()
    let wimage = row1.addImage(img)
    wimage.centerAlignImage()
    wimage.imageSize = new Size(115, 115)
    let row2 = row1.addStack()
    let wvalue = row2.addText(dayData.message)
    row2.setPadding(8, 0, 0, 0)
    wvalue.textColor = Color.white()
    wvalue.font = Font.boldSystemFont(20)
    wvalue.centerAlignText()
    return widget
}
async function createFourDaysWidget(data) {
    let widget = new ListWidget()
    widget.spacing = 5
    widget.backgroundColor = new Color("#1e1c3b")
    let logo = await loadEcoWattLogo()
    // row1 col1
    let row1 = widget.addStack()
    row1.layoutHorizontally()
    let logoStack = row1.addStack()
    logoStack.setPadding(0, 0, 0, 10)
    let imgView = logoStack.addImage(logo)
    imgView.imageSize = new Size(112, 112)
    // row1 col2
    let dataColumn = row1.addStack();
    dataColumn.addSpacer(12);
    dataColumn.layoutVertically();
    dataColumn.centerAlignContent();
    for (let i = 0; i < data.length; i++) {
        let dayData = data[i]
        let date = new Date(Date.parse(dayData.jour))
        date.setHours(0, 0, 0, 0)
        let dateColumn = dataColumn.addStack()
        dateColumn.addSpacer(5)

        let todayDate = new Date()
        todayDate.setHours(0, 0, 0, 0)

        let wdate = dateColumn.addText(todayDate === date ? "Aujourd'hui" : date.toLocaleDateString('fr-FR', {
            weekday: 'long',
            day: '2-digit',
            month: 'short',
        }))
        wdate.font = Font.body()
        wdate.textColor = Color.white()
        let messageColumn = dateColumn.addStack()
        messageColumn.addSpacer(3)
        let wmessage = messageColumn.addText(dayData.message)
        wmessage.font = Font.body()
        wmessage.textColor = new Color(colors[dayData.dvalue])
    }
    return widget
}
function createTable(data) {
    let table = new UITable()
    table.showSeparator = true
    for (item of data) {
        let row = createRow(item)
        table.addRow(row)
    }
    return table
}
function createRow(dayData) {
    let row = new UITableRow()
    row.cellSpacing = 5
    row.height = 64
    let date = new Date(Date.parse(dayData.jour))
    let df = new DateFormatter()
    df.locale = "fr-FR"
    df.useMediumDateStyle()
    let messageCell = row.addText(df.string(date), dayData.message)
    messageCell.titleFont = Font.body()
    return row
}
async function loadData() {
    let request = new Request("https://ecowatt-widget.fr/ecowatt.json")
    let json = await request.loadJSON()
    return json['signals']
}
async function loadEcoWattLogo() {
    let request = new Request("https://ecowatt-widget.fr/ecowatt.png")
    return request.loadImage()
}
