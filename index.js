//Utils

const crHtml = tag => document.createElement(tag)
const get_node = (node) => document.querySelector(node)
const get_all = (nodes) => document.querySelectorAll(nodes)

function cr_node(tag) {
    return function (props = {}) {
        return function (...children) {
            const el = crHtml(tag)
            setAttr(el, props)
            children.map(child => {
                if (typeof child === 'string') {
                    el.textContent = child
                }
                else {
                    el.append(child)
                }
            })
            return el
        }
    }
}

const setAttr = (node, props) => {
    for (const key in props) {
        if (typeof props[key] === 'function') {
            node[key] = props[key]
        }
        // else if (key.startsWith('data-')) {
        //     const dataKey = key.substring(5).replace(/-./g, (char) => char[1].toUpperCase());
        //     node.dataset[dataKey] = props[key];}
        else {
            node.setAttribute(key, props[key])
        }
    }
    return node
}

function setStyles(element, styles) {
    if (element) {
        Object.assign(element.style, styles);
    } else {
        console.error('Element not found');
    }
}


function set_local_storage(key, value) {
    if (typeof key === 'string' && key) {
        localStorage.setItem(key, JSON.stringify(value));
    } else {
        console.error('Key must be a non-empty string');
    }
}

function get_local_storage(key) {
    if (typeof key === 'string' && key) {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : null;
    } else {
        console.error('Key must be a non-empty string');
        return null;
    }
}



function test_value(fn, ...tests) {
    for (let test of tests) {
        const result = test()
        if (!result.is_valid) {
            alert(result.message)
            return
        }
    }
    fn()
}

function check_min(e) {
    const node = e.target
    return {
        is_valid: Number(node.value) >= Number(node.min) ? true : false,
        message: `Choose Number between ${node.min} and ${node.max}`
    }
}

function check_max(e) {
    const node = e.target
    console.log(node.value)
    //const is_valid = Number(node.value) <= Number(node.max)
    return {
        is_valid: Number(node.value) <= Number(node.max) ? true : false,
        message: `Choose Number between ${node.min} and ${node.max}`
    }
}

function check_unique(e) {
    const node = e.target
    return {
        is_valid: DATA.btns.find(el => el.value === Number(node.value)) ? false : true,
        message: `Tile size alreaddy exists`
    }
}

//---------------------------------------------------------------//


const DATA = {
    image_url: null,
    image_name: null,
    tile_size: 64,
    font_size: 12,
    tilset_backgroung_color: '#fcfcfc',
    tilset_font_color: '#000000',
    grid_line_color: '#f4e04d',
    btns: [
        { value: 32 },
        { value: 64 },
        { value: 96 },
        { value: 128 },
    ]
}

const i = cr_node('i')
const input = cr_node('input')
const div = cr_node('div')
const label = cr_node('label')
const button = cr_node('button')
const p = cr_node('p')
const settings_p = p({ class: 'settings_p' })

// UI 

const settings = div({ class: 'settings' })()


// buttons set tilset background, grid line color, tileset font size, custom tileset size, tileset fotn color --- reset btns switch back to default values
const setting_btns = (local_data) => {
    return get_node('.settings').replaceChildren(
        cr_node('h2')()('Settings',
            button({ onclick: () => settings.classList.toggle('left') })(
                i({ class: "fa-solid fa-xmark" })()
            ),
        ),

        settings_p('Custom tile size'),
        div({ class: 'settings_div_input' })(
            input({
                type: 'number', min: 16, max: 256, step: 1, value: local_data.btns.find(el => el.custom === true)?.value || null,
                onchange: (e) => test_value(() => update_local_storage_prop('btns', [...DATA.btns, { value: Number(e.target.value), custom: true }]), () => check_min(e), () => check_max(e), () => check_unique(e))
            })(),
            button({ onclick: (e) => update_local_storage_prop('btns', DATA.btns) })(
                i({ class: "fa-solid fa-rotate-right" })()
            )
        ),


        settings_p('Tileset font size'),
        div({ class: 'settings_div_input' })(
            input({
                type: 'number', min: 10, max: 24, step: 1, value: local_data?.font_size, onchange: (e) => test_value(() => update_local_storage_prop('font_size', e.target.value), () => check_min(e), () => check_max(e),)
            })(),

            button({ onclick: () => update_local_storage_prop('font_size', DATA.font_size) })(
                i({ class: "fa-solid fa-rotate-right" })()
            )
        ),

        settings_p('Tileset font color'),
        div({ class: 'settings_div_input' })(
            input({ type: 'color', value: local_data?.tilset_font_color, oninput: (e) => update_local_storage_prop('tilset_font_color', e.target.value) })(),

            button({ onclick: (e) => update_local_storage_prop('tilset_font_color', DATA.tilset_font_color) })(
                i({ class: "fa-solid fa-rotate-right" })()
            )
        ),

        settings_p('Grid line color'),
        div({ class: 'settings_div_input' })(
            input({ type: 'color', value: local_data?.grid_line_color, oninput: (e) => update_local_storage_prop('grid_line_color', e.target.value) })(),

            button({ onclick: (e) => update_local_storage_prop('grid_line_color', DATA.grid_line_color) })(
                i({ class: "fa-solid fa-rotate-right" })()
            )
        ),

        settings_p('Tileset background color'),
        div({ class: 'settings_div_input' })(
            input({ type: 'color', value: local_data?.tilset_backgroung_color, oninput: (e) => update_local_storage_prop('tilset_backgroung_color', e.target.value) })(),

            button({ onclick: (e) => update_local_storage_prop('tilset_backgroung_color', DATA.tilset_backgroung_color) })(
                i({ class: "fa-solid fa-rotate-right" })()
            )
        ),

    )
}



const menu = () => div({ class: 'menu' })(
    button({ onclick: () => get_node('.settings').classList.toggle('left') })(
        i({ class: "fa-solid fa-gear" })(),

    ),
    button({ class: 'upload_button' })(
        label({ for: 'upload' })(
            i({ class: "fa-solid fa-upload" })()
        )
    ),
    input({ id: 'upload', type: 'file', accept: ".png, .jpg, .jpeg", onchange: (e) => uploadImage(e) })(),
    ...menu_tile_size_btns()

)


function menu_tile_size_btns() {
    const data = get_local_storage('data')
    return btns = data.btns.map(el => {
        const set_props = el.value === data.tile_size ? { class: 'active', disabled: true } : null

        return button({
            value: el.value, ...set_props,
            onclick: (e) => update_local_storage_prop('tile_size', el.value)
        })(el.value)
    }
    )
}



//init

function init() {
    const local_data = get_local_storage('data') ? get_local_storage('data') : set_local_storage('data', DATA) || DATA
    document.body.replaceChildren(
        settings,
        menu(),
        div({ id: 'tileset_view' })()
    )
    setting_btns(local_data)

    if (local_data.image_url === null) return
    preview_image(local_data)
}

init()



// Helpers
function update_local_storage_prop(key, value) {
    const local_data = get_local_storage('data')
    const updated_data = { ...local_data, [key]: value }
    set_local_storage('data', updated_data)
    init()
}

function uploadImage(e) {
    const MAX_FILE_SIZE = 5 * 1024 * 1024
    const file = e.target.files[0];
    const local_data = get_local_storage('data')

    if (file.size > MAX_FILE_SIZE) {
        alert('File is too large. Please select a file smaller than 5MB.');
        return;
    }

    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function () {
            localStorage.setItem('data', JSON.stringify({ ...local_data, image_url: reader.result, image_name: file.name }));
            init()
        }
        reader.readAsDataURL(file);
    } else {
        alert('Please select a valid image file.');
    }
}

function preview_image(data) {
    const img = new Image()
    img.src = data.image_url

    img.onload = () => {
        const size = Math.min(img.width, img.height)
        if (size < data.tile_size) {
            update_local_storage_prop('tile_size', size)
            return
        }
        const tileset_div = get_node('#tileset_view')
        tileset_div.innerHTML = ''
        //const div = cr_node('div')
        const width = img.width - (img.width % data.tile_size)
        const height = img.height - (img.height % data.tile_size)
        const cols = Math.floor(width / data.tile_size)
        const rows = Math.floor(height / data.tile_size)
        const grid = Array.from({ length: cols }, (_, i) => {
            return div({ class: 'col' })(
                ...Array.from(
                    { length: rows }, (_, j) => {
                        const cell = div({
                            class: "cell",
                            width: width / cols,
                            height: height / rows,
                            // tiles start with zero - if 1 is prefered change (i) with (i+1)
                        })(Math.floor((j * cols) + (i)))
                        setStyles(cell, {
                            border: `1px solid ${data.grid_line_color}`
                        })
                        return cell
                    }
                )
            )
        });

        setStyles(tileset_div, {
            maxWidth: `${width}px`,
            aspectRatio: width / height,
            backgroundImage: `url(${data.image_url})`,
            fontSize: `${data.font_size}px`,
            color: data.tilset_font_color,
            backgroundColor: data.tilset_backgroung_color,
        })
        tileset_div.append(...grid)
    }
}