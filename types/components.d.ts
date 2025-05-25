interface DialogProps{
    show:boolean,
    heading:string | undefined,
    title:string,
    close:()=>void,
    varient:"success" | "error" | "info"
}
export {
    DialogProps
}