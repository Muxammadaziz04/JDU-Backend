const fs = require('fs')
const path = require('path')
const axios = require('axios')
const PdfDocument = require('pdfkit')

const avatarUrl = 'https://plus.unsplash.com/premium_photo-1688125414822-c1daf8543ffb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80'

const fetchImage = async (src) => {
    const response = await axios.get(src, {
        responseType: 'arraybuffer'
    });

    return response.data;
}

const getProcentColor = (procent) => {
    if (+procent < 40) {
        return '#EDE8B5'
    } else if (+procent < 80 && +procent >= 40) {
        return '#AEDDC3'
    } else if (+procent <= 100 && +procent >= 80) {
        return '#98CDDE'
    } else {
        return '#98CDDE'
    }
}

const skill = ({
    doc,
    name = '',
    procent = '',
    color = '',
    startY = ''
}) => {
    try {
        doc
        .font(path.resolve(__dirname, './Inter-Regular.ttf'))
        .fontSize(9)
        .fillColor('#000')
        .text(name, 60, startY)

    const procentSize = doc.widthOfString(procent + '%')

    doc
        .text(procent + '%', 460 - procentSize, startY)

    startY += 10

    doc
        .rect(60, startY + 8, 400 / 100 * procent, 2)
        .fillColor(color)
        .fill()
        .rect(60 + (400 / 100 * procent), startY + 8, 400 / 100 * (100 - procent), 2)
        .fillColor('#E7E8EA')
        .fill()
    } catch (error) {
        console.log(error);
    }
}

const JapanTest = ({
    doc,
    listening = '0',
    writing = '0',
    reading = '0',
    link = '',
    startY = 0,
    name = ''
}) => {
    try {
        name = name?.split(' ')

        doc
            .font(path.resolve(__dirname, './Inter-Bold.ttf'))
            .fontSize(11)
            .fillColor('#000')
            .text(name?.[0], 68, startY)
            .text(name?.[1], 107, startY)

        doc
            .rect(60, startY + 18 + 4, 400, 1)
            .fillColor('#eee')
            .fill()

        doc
            .rect(100, startY, 1, 15)
            .fill()



        doc
            .roundedRect(62, startY + 18 + 4 + 16 + 2, 31, 20, 10)
            .fillColor(getProcentColor(listening))
            .fill()

        doc
            .font(path.resolve(__dirname, './Inter-Regular.ttf'))
            .fontSize(9)
            .fillColor('#000')
            .text(`${listening}%`, 68, startY + 18 + 4 + 16 + 2 + 4)
            .text('Listening', 98, startY + 18 + 4 + 16 + 2 + 4)

        let textSize = doc.widthOfString('Listening')

        doc
            .roundedRect(60, startY + 18 + 4 + 16, textSize + 46, 24, 100)
            .strokeColor('#000')
            .stroke()

        let listeningSize = textSize + 46

        doc
            .roundedRect(60 + listeningSize + 12, startY + 18 + 4 + 16 + 2, 31, 20, 10)
            .fillColor(getProcentColor(reading))
            .fill()

        doc
            .fontSize(9)
            .fillColor('#000')
            .text(`${reading}%`, 60 + listeningSize + 18, startY + 18 + 4 + 16 + 2 + 4)
            .text('Reading', 60 + listeningSize + 10 + 38, startY + 18 + 4 + 16 + 2 + 4)

        textSize = doc.widthOfString('Reading')

        doc
            .roundedRect(60 + listeningSize + 10, startY + 18 + 4 + 16, textSize + 46, 24, 100)
            .strokeColor('#000')
            .stroke()

        let readingSize = textSize + 46 + listeningSize + 10

        doc
            .roundedRect(60 + readingSize + 12, startY + 18 + 4 + 16 + 2, 31, 20, 10)
            .fillColor(getProcentColor(writing))
            .fill()

        doc
            .fontSize(9)
            .fillColor('#000')
            .text(`${writing}%`, 60 + readingSize + 18, startY + 18 + 4 + 16 + 2 + 4)
            .text('Writing', 60 + readingSize + 10 + 38, startY + 18 + 4 + 16 + 2 + 4)

        textSize = doc.widthOfString('Writing')

        doc
            .roundedRect(60 + readingSize + 10, startY + 18 + 4 + 16, textSize + 46, 24, 100)
            .strokeColor('#000')
            .stroke()



        doc
            .fillColor('#3374F3')
            .text('-> Link to view', 399, startY + 18 + 4 + 22, { link })
    } catch (error) {
        console.log(error);
    }
}

const createCv = async ({
    avatarUrl = '',
    fullName = '',
    id = '',
    courseNumber = '',
    email = '',
    bio = '',
    japanLanguageTest = [],
    itQualification = {},
    universityPercentage = {},
    res
}) => {
    try {
        if (!res) return
        const doc = new PdfDocument({ size: 'A4' })
        doc.page.margins.bottom = 20
        let avatar = null
        if (avatarUrl) {
            avatar = await fetchImage(avatarUrl)
        }
        doc.fontSize(24)

        const paddingFromTop = 32
        const fullNameHeigth = doc.heightOfString(fullName, { width: 400.28, lineBreak: true })
        const headerHeight = paddingFromTop + fullNameHeigth + 9 + 19 + 10 + 12 + 20


        // HEADER
        doc
            .rect(0, 0, 595.28, headerHeight)
            .fillOpacity(0.1)
            .fillColor('#5627DC')
            .fill()
            .fillOpacity(1)

        doc
            .font(path.resolve(__dirname, './Inter-Bold.ttf'))
            .fontSize(24)
            .fillColor('#111E35')
            .text(fullName, 100, paddingFromTop + 5)

        doc
            .font(path.resolve(__dirname, './Inter-Regular.ttf'))
            .fontSize(9)
            .fillColor('#1381E6')
            .text(`ID: ${id}`, 108, paddingFromTop + fullNameHeigth + 13)

        const idWidth = doc.widthOfString(`ID: ${id}`)
        const idRectWidth = idWidth + 16
        doc
            .roundedRect(100, paddingFromTop + fullNameHeigth + 9, idRectWidth, 19, 10)
            .strokeColor('#1381E6')
            .stroke()


        doc
            .fillColor('#74828F')
            .text(`${courseNumber} year`, 100 + idRectWidth + 5 + 8, paddingFromTop + fullNameHeigth + 13)

        const courseNumberWidth = doc.widthOfString(`${courseNumber} year`)
        doc
            .roundedRect(100 + idRectWidth + 5, paddingFromTop + fullNameHeigth + 9, courseNumberWidth + 16, 19, 10)
            .strokeColor('#74828F')
            .stroke()

        doc
            .font(path.resolve(__dirname, './Inter-Medium.ttf'))
            .fillColor('#5627DC')
            .text(email, 100, paddingFromTop + fullNameHeigth + 9 + 19 + 10)


        //BIO
        doc.fontSize(9)
        doc.lineGap(2)
        const paddingfromTopToAbout = 30
        const bioHeight = doc.heightOfString(bio, { width: 400 })
        const aboutMeHeight = bio ? headerHeight + paddingfromTopToAbout + 12 + 10 + bioHeight : headerHeight

        if (bio) {
            doc
                .font(path.resolve(__dirname, './Inter-Bold.ttf'))
                .fontSize(11)
                .fillColor('#000')
                .text('About me', 60, headerHeight + paddingfromTopToAbout)

            doc
                .font(path.resolve(__dirname, './Inter-Regular.ttf'))
                .fontSize(9)
                .lineGap(2)
                .fillColor('#475569')
                .text(bio, 60, headerHeight + paddingfromTopToAbout + 12 + 10)
        }




        // Japan Language
        let heightJapanLanguage = aboutMeHeight

        if (japanLanguageTest?.some(test => test?.sertificate)) {
            heightJapanLanguage += 40

            if (heightJapanLanguage + 11 + 29 + 50 > 806) {
                if (avatarUrl && avatar) {
                    doc
                        .circle(32 + 29, 33 + 29, 29)
                        .clip()
                        .image(avatar, 32, 33, { cover: [58, 58], align: 'center', valign: 'center' })
                        .roundedRect(32, 33, 58, 58, 29)
                        .lineWidth(4)
                        .strokeColor('white')
                        .stroke()
                        .restore()
                }
                doc.addPage()
                heightJapanLanguage = 40
            }

            doc
                .font(path.resolve(__dirname, './Inter-Bold.ttf'))
                .fontSize(11)
                .fillColor('#000')
                .text('Japan Language Test', 60, heightJapanLanguage)

            heightJapanLanguage += 13

            japanLanguageTest?.forEach(test => {

                if (test.sertificate) {
                    if (heightJapanLanguage + 29 + 50 > 806) {
                        if (avatarUrl && avatar) {
                            doc
                                .circle(32 + 29, 33 + 29, 29)
                                .clip()
                                .image(avatar, 32, 33, { cover: [58, 58], align: 'center', valign: 'center' })
                                .roundedRect(32, 33, 58, 58, 29)
                                .lineWidth(4)
                                .strokeColor('white')
                                .stroke()
                                .restore()
                        }
                        doc.addPage()
                        heightJapanLanguage = 40
                    }
                    JapanTest({
                        doc,
                        listening: test.listening,
                        reading: test.reading,
                        writing: test.writing,
                        startY: heightJapanLanguage + 29,
                        name: test.name,
                        link: test.sertificate
                    })

                    heightJapanLanguage += 29 + 50
                }
            })

        }

        // IT qualification

        let itQualificationHeight = heightJapanLanguage

        if (itQualification?.description || itQualification?.skills?.lenght > 0) {
            itQualificationHeight += 40

            if (itQualificationHeight + 11 > 806) {
                if (avatarUrl && avatar) {
                    doc
                        .circle(32 + 29, 33 + 29, 29)
                        .clip()
                        .image(avatar, 32, 33, { cover: [58, 58], align: 'center', valign: 'center' })
                        .roundedRect(32, 33, 58, 58, 29)
                        .lineWidth(4)
                        .strokeColor('white')
                        .stroke()
                        .restore()
                }
                doc.addPage()
                itQualificationHeight = 40
            }

            doc
                .font(path.resolve(__dirname, './Inter-Bold.ttf'))
                .fontSize(11)
                .fillColor('#000')
                .text('IT qualification', 60, itQualificationHeight)

            itQualificationHeight += 13

            itQualification?.skills?.forEach(sk => {
                itQualificationHeight += 20
                if (itQualificationHeight + 19 > 806) {
                    if (avatarUrl && avatar) {
                        doc
                            .circle(32 + 29, 33 + 29, 29)
                            .clip()
                            .image(avatar, 32, 33, { cover: [58, 58], align: 'center', valign: 'center' })
                            .roundedRect(32, 33, 58, 58, 29)
                            .lineWidth(4)
                            .strokeColor('white')
                            .stroke()
                            .restore()
                    }
                    doc.addPage()
                    itQualificationHeight = 40
                }
                skill({
                    doc,
                    name: sk?.skill?.name,
                    procent: sk?.procent,
                    color: sk?.skill?.color,
                    startY: itQualificationHeight
                })

                itQualificationHeight += 19
            })

            if (itQualification?.description) {
                const textHeight = doc.heightOfString(itQualification?.description, { width: 376 })
                if (itQualificationHeight + 29 + 20 + textHeight > 806) {
                    if (avatarUrl && avatar) {
                        doc
                            .circle(32 + 29, 33 + 29, 29)
                            .clip()
                            .image(avatar, 32, 33, { cover: [58, 58], align: 'center', valign: 'center' })
                            .roundedRect(32, 33, 58, 58, 29)
                            .lineWidth(4)
                            .strokeColor('white')
                            .stroke()
                            .restore()
                    }
                    doc.addPage()
                    itQualificationHeight = 40
                }
                doc
                    .roundedRect(60, itQualificationHeight + 29, 400, textHeight + 20, 6)
                    .fillColor('#F5F5F5')
                    .fill()

                doc
                    .fillColor('#475569')
                    .text(itQualification?.description, 70, itQualificationHeight + 39, { width: 376 })

                itQualificationHeight += 29 + 20 + textHeight
            }

        }

        // Credit Acquisition Status

        let CreditHeight = 40 + itQualificationHeight
        if (CreditHeight + 11 + 20 + 19 > 806) {
            if (avatarUrl && avatar) {
                doc
                    .circle(32 + 29, 33 + 29, 29)
                    .clip()
                    .image(avatar, 32, 33, { cover: [58, 58], align: 'center', valign: 'center' })
                    .roundedRect(32, 33, 58, 58, 29)
                    .lineWidth(4)
                    .strokeColor('white')
                    .stroke()
                    .restore()
            }
            doc.addPage()
            CreditHeight = 40
        }

        doc
            .font(path.resolve(__dirname, './Inter-Bold.ttf'))
            .fontSize(11)
            .fillColor('#000')
            .text('Credit Acquisition Status', 60, CreditHeight)

        CreditHeight += 11

        CreditHeight += 20
        if (CreditHeight + 19 > 806) {
            if (avatarUrl && avatar) {
                doc
                    .circle(32 + 29, 33 + 29, 29)
                    .clip()
                    .image(avatar, 32, 33, { cover: [58, 58], align: 'center', valign: 'center' })
                    .roundedRect(32, 33, 58, 58, 29)
                    .lineWidth(4)
                    .strokeColor('white')
                    .stroke()
                    .restore()
            }
            doc.addPage()
            CreditHeight = 40
        }
        skill({
            doc,
            name: 'Attendee',
            procent: universityPercentage?.Attendee,
            color: '#000',
            startY: CreditHeight
        })

        CreditHeight += 40
        if (CreditHeight + 19 > 806) {
            if (avatarUrl && avatar) {
                doc
                    .circle(32 + 29, 33 + 29, 29)
                    .clip()
                    .image(avatar, 32, 33, { cover: [58, 58], align: 'center', valign: 'center' })
                    .roundedRect(32, 33, 58, 58, 29)
                    .lineWidth(4)
                    .strokeColor('white')
                    .stroke()
                    .restore()
            }
            doc.addPage()
            CreditHeight = 40
        }
        skill({
            doc,
            name: 'ItCourse',
            procent: universityPercentage?.ItCourse,
            color: '#000',
            startY: CreditHeight
        })

        CreditHeight += 40
        if (CreditHeight + 19 > 806) {
            if (avatarUrl && avatar) {
                doc
                    .circle(32 + 29, 33 + 29, 29)
                    .clip()
                    .image(avatar, 32, 33, { cover: [58, 58], align: 'center', valign: 'center' })
                    .roundedRect(32, 33, 58, 58, 29)
                    .lineWidth(4)
                    .strokeColor('white')
                    .stroke()
                    .restore()
            }
            doc.addPage()
            CreditHeight = 40
        }
        skill({
            doc,
            name: 'JapanLanguage',
            procent: universityPercentage?.JapanLanguage,
            color: '#000',
            startY: CreditHeight
        })

        CreditHeight += 40
        if (CreditHeight + 19 > 806) {
            if (avatarUrl && avatar) {
                doc
                    .circle(32 + 29, 33 + 29, 29)
                    .clip()
                    .image(avatar, 32, 33, { cover: [58, 58], align: 'center', valign: 'center' })
                    .roundedRect(32, 33, 58, 58, 29)
                    .lineWidth(4)
                    .strokeColor('white')
                    .stroke()
                    .restore()
            }
            doc.addPage()
            CreditHeight = 40
        }
        skill({
            doc,
            name: 'SannoUniversity',
            procent: universityPercentage?.SannoUniversity,
            color: '#000',
            startY: CreditHeight
        })

        CreditHeight += 40
        if (CreditHeight + 19 > 806) {
            if (avatarUrl && avatar) {
                doc
                    .circle(32 + 29, 33 + 29, 29)
                    .clip()
                    .image(avatar, 32, 33, { cover: [58, 58], align: 'center', valign: 'center' })
                    .roundedRect(32, 33, 58, 58, 29)
                    .lineWidth(4)
                    .strokeColor('white')
                    .stroke()
                    .restore()
            }
            doc.addPage()
            CreditHeight = 40
        }
        skill({
            doc,
            name: 'UzSWLUniversity',
            procent: universityPercentage?.UzSWLUniversity,
            color: '#000',
            startY: CreditHeight
        })


        CreditHeight += 40
        if (CreditHeight + 19 > 806) {
            if (avatarUrl && avatar) {
                doc
                    .circle(32 + 29, 33 + 29, 29)
                    .clip()
                    .image(avatar, 32, 33, { cover: [58, 58], align: 'center', valign: 'center' })
                    .roundedRect(32, 33, 58, 58, 29)
                    .lineWidth(4)
                    .strokeColor('white')
                    .stroke()
                    .restore()
            }
            doc.addPage()
            CreditHeight = 40
        }
        skill({
            doc,
            name: 'CoWork',
            procent: universityPercentage?.CoWork,
            color: '#000',
            startY: CreditHeight
        })

        CreditHeight += 40
        if (CreditHeight + 19 > 806) {
            if (avatarUrl && avatar) {
                doc
                    .circle(32 + 29, 33 + 29, 29)
                    .clip()
                    .image(avatar, 32, 33, { cover: [58, 58], align: 'center', valign: 'center' })
                    .roundedRect(32, 33, 58, 58, 29)
                    .lineWidth(4)
                    .strokeColor('white')
                    .stroke()
                    .restore()
            }
            doc.addPage()
            CreditHeight = 40
        }
        skill({
            doc,
            name: 'All',
            procent: universityPercentage?.AllMarks,
            color: '#5627DC',
            startY: CreditHeight
        })
        doc.pipe(res)
        doc.end()
    } catch (error) {
        console.log(error);
    }
}

module.exports = createCv