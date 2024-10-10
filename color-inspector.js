// Some color palletes
// ["74d3ae","678d58","a6c48a","f6e7cb","dd9787"]
// ["ff1053","6c6ea0","66c7f4","c1cad6","ffffff"]
// ["161032","faff81","ffc53a","e06d06","b26700"]
// ["b80c09","0b4f6c","01baef","fbfbff","040f16"]
// ["353535","3c6e71","ffffff","d9d9d9","284b63"]

let colors = [
    ["74d3ae","678d58","a6c48a","f6e7cb","dd9787"],
    ["ff1053","6c6ea0","66c7f4","c1cad6","ffffff"],
    ["161032","faff81","ffc53a","e06d06","b26700"],
    ["b80c09","0b4f6c","01baef","fbfbff","040f16"],
    ["353535","3c6e71","ffffff","d9d9d9","284b63"],
]

for(let i = 0; i < colors.length; i++){
    const pallete = colors[i];

    const palleteContainerStyle = 
    `
        width: 100%;
        height: 7rem;
        display: flex;
        justify-content: space-around;
        flex-diraction: row;
    `;

    let div = document.createElement("div");
    div.style = palleteContainerStyle;
    document.body.appendChild(div);

    for(let j = 0; j < pallete.length; j++){

        const width = 100/pallete.length;
        let block = document.createElement("div");
        block.style.width = `${width}%`;
        block.style.height = `4rem`;
        block.style.backgroundColor =`#${pallete[j]}`;

        const text = document.createElement("p");
        text.innerHTML = block.style.backgroundColor;
        block.appendChild(text);

        div.appendChild(block);

    }

}