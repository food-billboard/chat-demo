

export const isObjectId = (str: string) => objectIdReg.test(str)

const objectIdReg = /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i