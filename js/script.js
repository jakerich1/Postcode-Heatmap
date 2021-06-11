const labelTog = document.querySelector("#toggle-label")
const londonTog = document.querySelector("#toggle-london")
const londonLabelTog = document.querySelector("#toggle-london-labels")
const outlineTog = document.querySelector("#toggle-outline")
const outlineArea = document.querySelector("#outline-colour")
const colorOutline = document.querySelector("#colour-outline")
const thicknessOutline = document.querySelector("#outline-thickness")
const thicknessRange = document.querySelector("#myRange")
const colorGrad1 = document.querySelector("#colour-grad-1")
const colorGrad2 = document.querySelector("#colour-grad-2")
const colDiv1 = document.querySelector("#colour-div-1")
const colDiv2 = document.querySelector("#colour-div-2")
const colDiv3 = document.querySelector("#colour-div-3")
const colorOcean = document.querySelector("#colour-ocean")
const gradientBox = document.querySelector("#gradient-box")
const postcodeArea = document.querySelector("#postcode-area")
const svgLondon = document.querySelector("#London_inset")
const svgLondonAreas = document.querySelector("#London_areas")
const svgLetters = document.querySelector("#Postcode_letters")
const svgLondonLetters = document.querySelector("#Letters")
const svgOcean = document.querySelector("main")
const svgLondonOcean = document.querySelector("#London_Ocean")
const svgLoughNeagh = document.querySelector("#Lough_Neagh_option_lake")
const svgAllAreas = document.querySelector("#Postcode_areas")
const table = document.querySelector("#table")
const tableBody = document.querySelector("#table-body")
const tableBtn = document.querySelector("#dl-btn")
const testDataBtn = document.querySelector('#test-data')
const exportImageBtn = document.querySelector('.export-container')

let rawPost = []
let postcodeSummary = []

//Postcode factory function
const postcode = (area, amount) => {
    return {
        area: area,
        amount: amount,
        getColor() {

            const maxCount = Math.max.apply(Math, postcodeSummary.map(function (o) {
                return o.amount
            }))
            const percent = this.amount / maxCount
            let colorObj = {}
            if (mapOptions.sequential == true) {
                colorObj = chroma.scale([mapOptions.sequentialValues[0], mapOptions.sequentialValues[1]]).mode(mapOptions.mixMode)
            }else{
                colorObj = chroma.scale([mapOptions.divergentValues[0], mapOptions.divergentValues[1], mapOptions.divergentValues[2]]).mode(mapOptions.mixMode)
            }

            const colorVal = colorObj(percent).hex()
            return colorVal

        }
    }
}

//Map controller object
let mapOptions = {
    sequentialValues: ["#FF0000", "#56e681"],
    gradientArray: [],
    divergentValues: ["#0000ff", "#ffffff", "#fc0303"],
    sequential: true,
    mixMode: "hsl",
    darkMode: false,
    validatedAreas: ["CO", "CB", "IP", "NR", "NN", "PE", "LN", "LE", "ST", "DE", "NG", "S", "SK", "CW", "WA", "L", "M", "WN", "BL", "OL", "HD", "HX", "WF", "DN", "HU", "LS", "YO", "HG", "BD", "BB", "PR", "FY", "LA", "DL", "TS", "DH", "SR", "CA", "NE", "TD", "DG", "KA", "ML", "EH", "G", "FK", "PA", "KY", "DD", "PH", "AB", "HS", "IV", "KW", "ZE", "CM", "SS", "RM", "IG", "E", "EN", "SG", "MK", "LU", "AL", "N", "EC", "WC", "SE", "DA", "ME", "CT", "TN", "BR", "SW", "CR", "SM", "KT", "W", "NW", "HA", "UB", "TW", "BN", "RH", "WD", "GU", "HP", "SL", "PO", "SO", "RG", "OX", "CV", "B", "WS", "WV", "DY", "TF", "CH", "LL", "SY", "SA", "LD", "HR", "WR", "GL", "NP", "CF", "SN", "SP", "BS", "BA", "BH", "DT", "TA", "EX", "TQ", "PL", "TR", "JE", "GY", "IM", "BT"],
    setMainLabel: function (checked) {

        if (checked) {

            svgLetters.setAttribute("visibility", "visible")

        } else {

            svgLetters.setAttribute("visibility", "hidden")

        }

    },
    setLondonLabel: function (checked) {

        if (checked) {

            svgLondonLetters.setAttribute("visibility", "visible")

        } else {

            svgLondonLetters.setAttribute("visibility", "hidden")

        }

    },
    toggleLondon: function (checked) {

        if (checked) {

            svgLondon.setAttribute("visibility", "visible")

        } else {

            svgLondon.setAttribute("visibility", "hidden")

        }

    },
    toggleStroke: function (checked) {

        if (checked) {

            outlineArea.style.display = "flex"
            thicknessOutline.style.display = "flex"
            mapOptions.setStroke(thicknessRange.value)

        } else {

            outlineArea.style.display = "none"
            thicknessOutline.style.display = "none"
            mapOptions.setStroke(0)

        }

    },
    setDarkMode: function () {

        if (mapOptions.darkMode) {

            mapOptions.darkMode = false

            //Light mode
            document.querySelector(':root').style.setProperty('--main-bg', '#e5e9f0');
            document.querySelector(':root').style.setProperty('--card-bg', '#ffffff');
            document.querySelector(':root').style.setProperty('--font-col', '#000000');
            document.querySelector(':root').style.setProperty('--shadow-col', 'rgba(0, 0, 0, 0.1)');
            document.querySelector(':root').style.setProperty('--darkmode-svg-col', '#252932');
            document.querySelector('#moon').style.setProperty('display', 'block');
            document.querySelector('#sun').style.setProperty('display', 'none');

        } else {

            mapOptions.darkMode = true

            //dark mode 
            document.querySelector(':root').style.setProperty('--main-bg', '#252932');
            document.querySelector(':root').style.setProperty('--card-bg', '#2e3440');
            document.querySelector(':root').style.setProperty('--font-col', '#d3d7dc');
            document.querySelector(':root').style.setProperty('--shadow-col', '#252932');
            document.querySelector(':root').style.setProperty('--darkmode-svg-col', '#d3d7dc');
            document.querySelector('#moon').style.setProperty('display', 'none');
            document.querySelector('#sun').style.setProperty('display', 'block');

        }

    },
    setMix: function (mode) {

        this.mixMode = mode
        this.render()

    },
    setOcean: function (color) {

        svgOcean.style.backgroundColor = color
        svgLondonOcean.setAttribute("fill", color)
        svgLoughNeagh.setAttribute("fill", color)

    },
    setStroke: function (thickness) {

        childLoop(svgAllAreas.childNodes)
        childLoop(svgLondonAreas.childNodes)

        function childLoop(nodes) {

            for (let i = 0; i < nodes.length; i++) {

                if (nodes[i].nodeName.toLowerCase() == 'path') {

                    nodes[i].setAttribute("stroke-width", (thickness / 2))

                }

            }

        }

        svgLoughNeagh.setAttribute("stroke-width", (thickness / 2))

    },
    setStrokeColor: function () {

        childLoop(svgAllAreas.childNodes)
        childLoop(svgLondonAreas.childNodes)

        function childLoop(nodes) {

            for (let i = 0; i < nodes.length; i++) {

                if (nodes[i].nodeName.toLowerCase() == 'path') {

                    nodes[i].setAttribute("stroke", colorOutline.value)

                }

            }

        }

        svgLoughNeagh.setAttribute("stroke", colorOutline.value)

    },
    handlePostcodes() {
        const countOccurrences = (arr, val) => arr.reduce((a, v) => (v === val ? a + 1 : a), 0)
        rawPost = postcodeArea.value.trim().split("\n")
        postcodeSummary = []

        if (rawPost.length > 0) {

            getPostcodeAreas()
            removeItemAll(rawPost, "")

            //validate areas
            rawPost = rawPost.filter(function (item) {
                return mapOptions.validatedAreas.includes(item)
            })

            let filteredArray = rawPost.filter(function (item, pos) {
                return rawPost.indexOf(item) == pos;
            })

            filteredArray.forEach(element => {
                const entry = postcode(element, countOccurrences(rawPost, element))
                postcodeSummary.push(entry)
            })

            this.render()

        } else {
            postcodeSummary = []
        }

        rawPost = []

        function getPostcodeAreas() {
            for (let i = 0; i < rawPost.length; i++) {
                const element = rawPost[i]
                const regex = /^\D+/g
                const found = element.match(regex)
                if (found != null) {
                    const postArea = found[0].toUpperCase().trim()
                    if (postArea.length < 3) {
                        rawPost[i] = postArea
                    } else {
                        rawPost[i] = ""
                    }
                } else {
                    rawPost[i] = ""
                }
            }
        }

        function removeItemAll(arr, value) {
            var i = 0;
            while (i < arr.length) {
                if (arr[i] === value) {
                    arr.splice(i, 1);
                } else {
                    ++i;
                }
            }
            return arr;
        }
    },
    sortTable: function (sort) {

        if (sort == 1 || sort == 3) {
    
            document.querySelector('#sort0').style.display = "block"
            document.querySelector('#sort2').style.display = "block"
            document.querySelector('#sort1').style.display = "none"
            document.querySelector('#sort3').style.display = "none"
    
        } else {
    
            document.querySelector('#sort0').style.display = "none"
            document.querySelector('#sort2').style.display = "none"
            document.querySelector('#sort1').style.display = "block"
            document.querySelector('#sort3').style.display = "block"
    
        }
    
        function amountAscend(a, b) {
    
            if (a.amount < b.amount) {
                return -1
            }
            if (a.amount > b.amount) {
                return 1
            }
    
            return 0
    
        }
    
        function amountDescend(a, b) {
    
            if (a.amount > b.amount) {
                return -1
            }
            if (a.amount < b.amount) {
                return 1
            }
    
            return 0
    
        }
    
        function areaAscend(a, b) {
    
            if (a.area < b.area) {
                return -1
            }
            if (a.area > b.area) {
                return 1
            }
    
            return 0
    
        }
    
        function areaDescend(a, b) {
    
            if (a.area > b.area) {
                return -1
            }
            if (a.area < b.area) {
                return 1
            }
    
            return 0
    
        }
    
        if (sort == 0) {
    
            postcodeSummary.sort(areaAscend)
    
        } else if (sort == 1) {
    
            postcodeSummary.sort(areaDescend)
    
        } else if (sort == 2) {
    
            postcodeSummary.sort(amountAscend)
    
        } else if (sort == 3) {
    
            postcodeSummary.sort(amountDescend)
    
        }
    
        mapOptions.render()
    
    },
    testData: function () {

        let testData = []

        mapOptions.validatedAreas.forEach(element => {      
            const randomOccurrences = Math.floor(Math.random() * 100) + 1
            for (let i = 0; i < randomOccurrences; i++) {     
                testData.push(element)
            }
        });

        postcodeArea.value = testData.join("\n")
        this.handlePostcodes()

    },
    render: function () {

        renderMap()
        setGradientPreview()
        renderTable(postcodeSummary)

        function setGradientPreview() {

            if (mapOptions.sequential) {
                mapOptions.gradientArray = chroma.scale([mapOptions.sequentialValues[0], mapOptions.sequentialValues[1]]).mode(mapOptions.mixMode).colors(11)
            }else{
                mapOptions.gradientArray = chroma.scale([mapOptions.divergentValues[0], mapOptions.divergentValues[1], mapOptions.divergentValues[2]]).mode(mapOptions.mixMode).colors(11)
            }
 
            let nodes = gradientBox.childNodes
            let x = 0

            for (let i = 0; i < nodes.length; i++) {

                if (nodes[i].nodeName.toLowerCase() == 'div') {

                    nodes[i].style.backgroundColor = mapOptions.gradientArray[x]
                    x++

                }

            }

        }

        function renderTable() {

            tableBody.innerHTML = ""
            if (postcodeSummary.length > 0) {

                table.style.display = "table"
        
            } else {

                table.style.display = "none"
        
            }
            postcodeSummary.forEach(element => {

                const contrast = chroma.contrast(element.getColor(), 'black')
                const textCol = contrast > 4.5 ? "black" : "white"
                let row = document.createElement("tr")
                row.innerHTML = `<td>${element.area}</td><td style="color: ${textCol}; background-color: ${element.getColor()};">${element.amount}</td>`
                tableBody.appendChild(row)

            })
        
        }

        function renderMap() {

            initialPaint()
            postcodeSummary.forEach(element => {
                paintArea(element.area, element.getColor())
            });
        
            function initialPaint() {
        
                const londonArea = Array.prototype.slice.call(svgLondonAreas.children)
                const mainAreas = Array.prototype.slice.call(svgAllAreas.children)
                paint(londonArea)
                paint(mainAreas)
            
                function paint(nodes) {
                    nodes.forEach(element => {
                        let color = mapOptions.sequential ? mapOptions.sequentialValues[0] : mapOptions.divergentValues[0]
                        element.style.fill = color
                    })
                }
            }
        
            function paintArea(areaCode, color) {
        
                const id = `#${areaCode}`
                const londonId = `#${areaCode}_2_`
                const area = document.querySelector(id)
                const londonArea = document.querySelector(londonId)
            
                if (area) {
        
                    area.style.fill = color
        
                }
            
                if (londonArea) {
        
                    londonArea.style.fill = color
                    
                }
            
            }
        
        }

    },
    changeGradType: function () {
        const sequentialInputs = document.querySelector('#sequential')
        const divergentInputs = document.querySelector('#divergent')

        if (this.sequential) {
            divergentInputs.style.display = "none"
            sequentialInputs.style.display = "flex"
        }else{
            divergentInputs.style.display = "flex"
            sequentialInputs.style.display = "none"
        }
    },
    export: function () {
        saveSvgAsPng(document.getElementById("mapsvg"), "HeatMap.png", {scale: 2});
    }
}

//initiate stroke
mapOptions.setStrokeColor()
mapOptions.setStroke(0)
mapOptions.render()

//-----Outline colour event listener
colorOutline.addEventListener('input', function () { mapOptions.setStrokeColor() })
//-----Color inputs for the sequential gradient
colorGrad1.addEventListener('input', function () {
    mapOptions.sequentialValues[0] = colorGrad1.value
    mapOptions.render()
})
colorGrad2.addEventListener('input', function () {
    mapOptions.sequentialValues[1] = colorGrad2.value
    mapOptions.render()
})

//-----Color inputs for the divergent gradient
colDiv1.addEventListener('input', function () {
    mapOptions.divergentValues[0] = colDiv1.value
    mapOptions.render()
})
colDiv2.addEventListener('input', function () {
    mapOptions.divergentValues[1] = colDiv2.value
    mapOptions.render()
})
colDiv3.addEventListener('input', function () {
    mapOptions.divergentValues[2] = colDiv3.value
    mapOptions.render()
})
//-----Ocean event listener
colorOcean.addEventListener('input', function () { mapOptions.setOcean(colorOcean.value) })
//-----Change outline thickness
thicknessRange.addEventListener('input', function () { mapOptions.setStroke(thicknessRange.value) })
//-----Label toggle event listener
labelTog.addEventListener('change', function () { mapOptions.setMainLabel(this.checked) })
//-----London toggle event listener
londonTog.addEventListener('change', function () { mapOptions.toggleLondon(this.checked) })
//-----London label toggle event listener
londonLabelTog.addEventListener('change', function () { mapOptions.setLondonLabel(this.checked) })
//-----Show the outline color option when the toggle is clicked
outlineTog.addEventListener('change', function () { mapOptions.toggleStroke(this.checked) })
//-----Postcode area textarea event listener
postcodeArea.addEventListener('input', function () { mapOptions.handlePostcodes() })
//-----Event handler for dark mode buttons
document.querySelectorAll('.dark-mode').forEach(item => {
    item.addEventListener('click', event => { mapOptions.setDarkMode() })
})
//-----Event handler for table sorting
document.querySelectorAll(".svg-wrap").forEach(item => {
    item.addEventListener('click', () => { mapOptions.sortTable(item.getAttribute("data-sort")) })
})
//-----Event handler for gradient and mix mode buttons styling
const gradSel = document.querySelectorAll(".grad-sel");
for (const button of gradSel) {
    button.addEventListener("click", function () {
        if (button.dataset.mode == 0) {
            mapOptions.sequential = true
        }else{
            mapOptions.sequential = false 
        }
        for (const buttonIn of gradSel) {
            buttonIn.style.background = "none"
            buttonIn.style.color = "#006eff"
        }
        button.style.background = "#006eff"
        button.style.color = "white"
        mapOptions.changeGradType()
        mapOptions.render() 
    });
}
const modeSel = document.querySelectorAll(".mode-sel");
for (const button of modeSel) {
    button.addEventListener("click", function () {
        mapOptions.setMix(button.dataset.mode)
        for (const buttonIn of modeSel) {
            buttonIn.style.background = "none"
            buttonIn.style.color = "#006eff"
        }
        button.style.background = "#006eff"
        button.style.color = "white"
    });
}
//-----Event handler for loading test data
testDataBtn.addEventListener('click', function () { mapOptions.testData() })
//-----Event handler for exporting image
exportImageBtn.addEventListener('click', function () { mapOptions.export() })